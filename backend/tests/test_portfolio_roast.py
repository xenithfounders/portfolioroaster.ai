"""Backend API tests for PortfolioRoast.ai"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://razorpay-checkout-11.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

# Load backend .env for key id comparison
RAZORPAY_KEY_ID_EXPECTED = "rzp_test_SgrF0X45w9a9zM"


def _unique_email(tag="auto"):
    return f"TEST_{tag}_{uuid.uuid4().hex[:8]}_{int(time.time())}@test.com"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert "message" in data


# ---------- Eligibility ----------
def test_eligibility_new_email(session):
    email = _unique_email("elig")
    r = session.post(f"{API}/roast/eligibility", json={"email": email})
    assert r.status_code == 200
    data = r.json()
    assert data["free_roast_available"] is True
    assert data["email"] == email.lower()


# ---------- Payment: create order ----------
def test_create_order_success(session):
    email = _unique_email("order")
    r = session.post(f"{API}/payment/create-order", json={"email": email})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["order_id"].startswith("order_")
    assert data["amount"] == 2900
    assert data["currency"] == "INR"
    assert data["key_id"] == RAZORPAY_KEY_ID_EXPECTED


# ---------- Payment verify: invalid sig ----------
def test_verify_invalid_signature(session):
    email = _unique_email("verify")
    # Create order first so one exists
    r = session.post(f"{API}/payment/create-order", json={"email": email})
    assert r.status_code == 200
    order_id = r.json()["order_id"]

    r2 = session.post(
        f"{API}/payment/verify",
        json={
            "razorpay_order_id": order_id,
            "razorpay_payment_id": "pay_fakepayment123",
            "razorpay_signature": "obviously_wrong_signature",
            "email": email,
        },
    )
    assert r2.status_code == 400, r2.text
    data = r2.json()
    assert "signature" in (data.get("detail", "").lower() + data.get("message", "").lower() + str(data).lower())


# ---------- Roast generate: validation ----------
def test_generate_no_url_no_text(session):
    email = _unique_email("novalid")
    r = session.post(f"{API}/roast/generate", json={"email": email})
    assert r.status_code == 400


def test_generate_short_text(session):
    email = _unique_email("short")
    r = session.post(f"{API}/roast/generate", json={"email": email, "portfolio_text": "too short"})
    assert r.status_code == 400


# ---------- Free roast full flow ----------
@pytest.fixture(scope="module")
def free_roast_email():
    return _unique_email("free")


@pytest.fixture(scope="module")
def free_roast_result(session, free_roast_email):
    portfolio_text = (
        "I'm a full stack developer with 3 years of experience building React and Node.js applications. "
        "Projects: 1) TodoList clone 2) Weather app using OpenWeather API 3) A portfolio site built in Next.js. "
        "Skills: JavaScript, React, Redux, Node, Express, MongoDB, HTML, CSS, Tailwind. "
        "I am passionate about clean code and love learning new things every day."
    )
    r = session.post(
        f"{API}/roast/generate",
        json={"email": free_roast_email, "portfolio_text": portfolio_text},
        timeout=120,
    )
    assert r.status_code == 200, f"Free roast failed: {r.status_code} {r.text}"
    return r.json()


def test_free_roast_structure(free_roast_result):
    d = free_roast_result
    assert isinstance(d["score"], int)
    assert 1 <= d["score"] <= 10
    assert isinstance(d["callouts"], list) and len(d["callouts"]) == 5
    assert isinstance(d["fixes"], list) and len(d["fixes"]) == 5
    assert isinstance(d["one_liner"], str) and len(d["one_liner"].strip()) > 0
    assert d["is_paid"] is False
    assert "id" in d and len(d["id"]) > 0


def test_get_roast_by_id(session, free_roast_result):
    rid = free_roast_result["id"]
    r = session.get(f"{API}/roast/{rid}")
    assert r.status_code == 200
    d = r.json()
    assert d["id"] == rid
    assert d["score"] == free_roast_result["score"]
    assert len(d["callouts"]) == 5


def test_get_roast_404(session):
    r = session.get(f"{API}/roast/nonexistent_{uuid.uuid4().hex}")
    assert r.status_code == 404


def test_eligibility_after_free_used(session, free_roast_email, free_roast_result):
    r = session.post(f"{API}/roast/eligibility", json={"email": free_roast_email})
    assert r.status_code == 200
    assert r.json()["free_roast_available"] is False


def test_second_roast_requires_payment(session, free_roast_email, free_roast_result):
    portfolio_text = (
        "Second attempt to roast. Same developer trying again without payment to see what happens now. "
        "Adding enough text to pass min length requirements for the backend."
    )
    r = session.post(
        f"{API}/roast/generate",
        json={"email": free_roast_email, "portfolio_text": portfolio_text},
    )
    assert r.status_code == 402, r.text
    detail = r.json().get("detail", "")
    assert "payment" in detail.lower() or "free roast" in detail.lower()


# ---------- Invalid URL but valid text ----------
def test_invalid_url_with_valid_text(session):
    email = _unique_email("badurl")
    r = session.post(
        f"{API}/roast/generate",
        json={
            "email": email,
            "portfolio_url": "https://this-domain-definitely-does-not-exist-xyzzy-12345.test",
            "portfolio_text": (
                "Fallback notes from user when URL scrape fails. Built some React and Python projects. "
                "Need enough characters here to pass the 40 char minimum easily."
            ),
        },
        timeout=120,
    )
    assert r.status_code == 200, f"Expected 200 even with bad URL. Got {r.status_code}: {r.text}"
    d = r.json()
    assert len(d["callouts"]) == 5
    assert len(d["fixes"]) == 5
