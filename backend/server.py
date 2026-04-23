import os
import re
import uuid
import json
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

import razorpay
import requests as http_requests
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------- Config ----------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]
RAZORPAY_KEY_ID = os.environ["RAZORPAY_KEY_ID"]
RAZORPAY_KEY_SECRET = os.environ["RAZORPAY_KEY_SECRET"]

ROAST_PRICE_PAISE = 2900  # ₹29

# ---------- Clients ----------
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ---------- App ----------
app = FastAPI(title="PortfolioRoast.ai API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
class EligibilityRequest(BaseModel):
    email: EmailStr


class EligibilityResponse(BaseModel):
    email: EmailStr
    free_roast_available: bool
    message: str


class CreateOrderRequest(BaseModel):
    email: EmailStr


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    email: EmailStr


class VerifyPaymentResponse(BaseModel):
    verified: bool
    payment_id: str


class GenerateRoastRequest(BaseModel):
    email: EmailStr
    portfolio_url: Optional[str] = None
    portfolio_text: Optional[str] = None
    payment_id: Optional[str] = None  # required if paid roast


class RoastResult(BaseModel):
    id: str
    email: EmailStr
    portfolio_url: Optional[str] = None
    score: int
    callouts: List[str]
    fixes: List[str]
    one_liner: str
    is_paid: bool
    created_at: str


# ---------- Helpers ----------
def _scrape_url(url: str, max_chars: int = 8000) -> str:
    """Very simple URL fetch — pull visible text."""
    try:
        resp = http_requests.get(
            url,
            timeout=12,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; PortfolioRoastBot/1.0)"
            },
        )
        html = resp.text
        # strip scripts/styles
        html = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.IGNORECASE)
        html = re.sub(r"<style[\s\S]*?</style>", " ", html, flags=re.IGNORECASE)
        # keep title
        title_m = re.search(r"<title[^>]*>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
        title = title_m.group(1).strip() if title_m else ""
        # strip remaining tags
        text = re.sub(r"<[^>]+>", " ", html)
        text = re.sub(r"\s+", " ", text).strip()
        result = f"TITLE: {title}\n\nCONTENT:\n{text}"
        return result[:max_chars]
    except Exception as e:
        logger.warning(f"scrape failed for {url}: {e}")
        return f"(Failed to scrape URL: {url}. Error: {e})"


ROAST_SYSTEM_PROMPT = """You are a brutally honest senior engineer who has interviewed at FAANG companies for 10+ years. You have zero patience for generic portfolios. You review developer portfolios and give harsh, specific, actionable feedback. You call out specific things you see - not generic advice. You use dry humor. You are not cruel but you are direct. You speak like a tired Staff Engineer who has seen 10,000 resumes.

You MUST respond with ONLY valid JSON (no markdown fences, no prose) matching this exact schema:
{
  "score": <integer 1-10>,
  "callouts": [<exactly 5 strings, each a specific brutal callout about what's weak or missing>],
  "fixes": [<exactly 5 strings, each a specific, named, concrete fix>],
  "one_liner": "<one savage single-sentence verdict>"
}

Rules:
- Be SPECIFIC. Reference actual things you saw (project names, tech stack, phrasing used, missing items).
- NO generic advice like "add more projects". Say exactly what's wrong and exactly what to add.
- Dry humor is welcome. Do not be cruel, but do not sugarcoat.
- Score calibration: 1-3 = disaster, 4-5 = mediocre, 6-7 = decent, 8-9 = strong, 10 = never give 10.
- Return ONLY the JSON. No additional text."""


async def _call_gemini_roast(portfolio_content: str, portfolio_url: Optional[str]) -> dict:
    session_id = f"roast-{uuid.uuid4()}"
    chat = (
        LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=ROAST_SYSTEM_PROMPT,
        )
        .with_model("gemini", "gemini-2.5-pro")
    )

    user_text = f"""Roast this developer portfolio. Return ONLY the JSON schema I specified.

PORTFOLIO URL: {portfolio_url or "(no URL provided, only pasted text)"}

PORTFOLIO CONTENT:
{portfolio_content}
"""
    resp = await chat.send_message(UserMessage(text=user_text))
    # Parse JSON robustly
    raw = resp.strip()
    # strip code fences if model added them
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?", "", raw).strip()
        if raw.endswith("```"):
            raw = raw[:-3].strip()
    # find first { ... last }
    first = raw.find("{")
    last = raw.rfind("}")
    if first != -1 and last != -1:
        raw = raw[first : last + 1]
    try:
        data = json.loads(raw)
    except Exception as e:
        logger.error(f"Failed to parse roast JSON: {e} | raw: {resp[:500]}")
        raise HTTPException(status_code=502, detail="AI returned malformed JSON. Please retry.")

    # Validate shape
    score = int(data.get("score", 5))
    score = max(1, min(10, score))
    callouts = data.get("callouts") or []
    fixes = data.get("fixes") or []
    one_liner = str(data.get("one_liner") or "").strip() or "Ship something real."
    # Ensure 5 each
    callouts = [str(c) for c in callouts][:5]
    fixes = [str(f) for f in fixes][:5]
    while len(callouts) < 5:
        callouts.append("Not enough info to judge further. Add more content.")
    while len(fixes) < 5:
        fixes.append("Write READMEs. Explain WHY, not just WHAT.")
    return {
        "score": score,
        "callouts": callouts,
        "fixes": fixes,
        "one_liner": one_liner,
    }


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "PortfolioRoast.ai is alive. Try POST /api/roast/eligibility"}


@api_router.post("/roast/eligibility", response_model=EligibilityResponse)
async def check_eligibility(payload: EligibilityRequest):
    email = payload.email.lower()
    record = await db.emails.find_one({"email": email}, {"_id": 0})
    if not record:
        return EligibilityResponse(
            email=email,
            free_roast_available=True,
            message="First roast is free. Brace yourself.",
        )
    free_available = not bool(record.get("used_free_roast"))
    return EligibilityResponse(
        email=email,
        free_roast_available=free_available,
        message=(
            "First roast is free. Brace yourself."
            if free_available
            else "Free roast used. Pay ₹29 for another round of pain."
        ),
    )


@api_router.post("/payment/create-order", response_model=CreateOrderResponse)
async def create_order(payload: CreateOrderRequest):
    email = payload.email.lower()
    receipt = f"roast_{uuid.uuid4().hex[:20]}"  # <=40 chars
    try:
        order = razorpay_client.order.create(
            {
                "amount": ROAST_PRICE_PAISE,
                "currency": "INR",
                "receipt": receipt,
                "payment_capture": 1,
                "notes": {"email": email, "product": "portfolio_roast"},
            }
        )
    except Exception as e:
        logger.exception("Razorpay order creation failed")
        raise HTTPException(status_code=502, detail=f"Razorpay order creation failed: {e}")

    await db.payments.insert_one(
        {
            "order_id": order["id"],
            "email": email,
            "amount": ROAST_PRICE_PAISE,
            "currency": "INR",
            "status": "created",
            "receipt": receipt,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return CreateOrderResponse(
        order_id=order["id"],
        amount=ROAST_PRICE_PAISE,
        currency="INR",
        key_id=RAZORPAY_KEY_ID,
    )


@api_router.post("/payment/verify", response_model=VerifyPaymentResponse)
async def verify_payment(payload: VerifyPaymentRequest):
    params_dict = {
        "razorpay_order_id": payload.razorpay_order_id,
        "razorpay_payment_id": payload.razorpay_payment_id,
        "razorpay_signature": payload.razorpay_signature,
    }
    try:
        razorpay_client.utility.verify_payment_signature(params_dict)
    except razorpay.errors.SignatureVerificationError:
        await db.payments.update_one(
            {"order_id": payload.razorpay_order_id},
            {"$set": {"status": "signature_failed"}},
        )
        raise HTTPException(status_code=400, detail="Invalid payment signature.")
    except Exception as e:
        logger.exception("Signature verification failed unexpectedly")
        raise HTTPException(status_code=500, detail=f"Verification error: {e}")

    await db.payments.update_one(
        {"order_id": payload.razorpay_order_id},
        {
            "$set": {
                "status": "paid",
                "payment_id": payload.razorpay_payment_id,
                "signature": payload.razorpay_signature,
                "email": payload.email.lower(),
                "paid_at": datetime.now(timezone.utc).isoformat(),
                "roast_consumed": False,
            }
        },
        upsert=True,
    )
    return VerifyPaymentResponse(verified=True, payment_id=payload.razorpay_payment_id)


@api_router.post("/roast/generate", response_model=RoastResult)
async def generate_roast(payload: GenerateRoastRequest):
    email = payload.email.lower()
    if not payload.portfolio_url and not payload.portfolio_text:
        raise HTTPException(status_code=400, detail="Provide a portfolio_url or portfolio_text.")

    # Check eligibility
    email_record = await db.emails.find_one({"email": email}, {"_id": 0})
    has_used_free = bool(email_record and email_record.get("used_free_roast"))

    is_paid = False
    if has_used_free:
        if not payload.payment_id:
            raise HTTPException(
                status_code=402,
                detail="Free roast already used. Payment required.",
            )
        # Verify the payment exists, is paid, and not yet consumed.
        pay = await db.payments.find_one(
            {"payment_id": payload.payment_id, "email": email, "status": "paid"},
            {"_id": 0},
        )
        if not pay:
            raise HTTPException(status_code=402, detail="Payment not found or not verified.")
        if pay.get("roast_consumed"):
            raise HTTPException(status_code=402, detail="This payment has already been used.")
        is_paid = True

    # Build portfolio content
    if payload.portfolio_url:
        scraped = _scrape_url(payload.portfolio_url)
        content = scraped
        if payload.portfolio_text:
            content += f"\n\nEXTRA NOTES FROM USER:\n{payload.portfolio_text}"
    else:
        content = payload.portfolio_text or ""

    if len(content.strip()) < 40:
        raise HTTPException(
            status_code=400,
            detail="Portfolio content is too thin to roast. Paste more or provide a valid URL.",
        )

    # Call AI
    roast = await _call_gemini_roast(content, payload.portfolio_url)

    roast_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": roast_id,
        "email": email,
        "portfolio_url": payload.portfolio_url,
        "score": roast["score"],
        "callouts": roast["callouts"],
        "fixes": roast["fixes"],
        "one_liner": roast["one_liner"],
        "is_paid": is_paid,
        "created_at": now_iso,
    }
    await db.roasts.insert_one(doc)

    # Update email usage
    if not has_used_free:
        await db.emails.update_one(
            {"email": email},
            {
                "$set": {
                    "email": email,
                    "used_free_roast": True,
                    "first_roast_at": now_iso,
                }
            },
            upsert=True,
        )
    else:
        # consume payment
        await db.payments.update_one(
            {"payment_id": payload.payment_id},
            {"$set": {"roast_consumed": True, "consumed_at": now_iso, "roast_id": roast_id}},
        )

    return RoastResult(**doc)


@api_router.get("/roast/{roast_id}", response_model=RoastResult)
async def get_roast(roast_id: str):
    doc = await db.roasts.find_one({"id": roast_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Roast not found.")
    return RoastResult(**doc)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()
