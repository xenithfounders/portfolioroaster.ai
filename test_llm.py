import openai

client = openai.OpenAI(
    api_key="sk-emergent-9E36f5992F798679e7",
    base_url="https://api.preview.emergentagent.com/v1"
)

resp = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {"role": "system", "content": "Respond with valid JSON only."},
        {"role": "user", "content": "Return this exact JSON: {\"test\": \"works\"}"}
    ],
    max_tokens=50,
    timeout=30
)
print("Type:", type(resp))
print("Response:", resp)
