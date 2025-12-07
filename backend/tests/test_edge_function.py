import os
import json
import requests
from dotenv import load_dotenv

# 1. Load Config
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
# Prefer Anon Key for client simulation, fallback to Service Key
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("❌ Error: Missing SUPABASE_URL or API Keys in .env")
    print("Please ensure SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY is set.")
    exit(1)

if not SUPABASE_KEY.startswith("eyJ"):
    print(f"⚠️  Warning: The used key ('{SUPABASE_KEY[:10]}...') does not look like a valid JWT.")
    print("   Supabase keys usually start with 'eyJ'. Check Project Settings > API.")

# 2. Define the Endpoint
FUNCTION_URL = f"{SUPABASE_URL}/functions/v1/analyze-risk"

# 3. Define Test Data (Bucharest Sector 1 coordinates - Inside the polygon)
# Sector 1 Polygon: ((26.0 44.5, 26.1 44.5, 26.1 44.4, 26.0 44.4, 26.0 44.5))
# We use 44.42 lat (inside 44.4-44.5) and 26.05 long (inside 26.0-26.1)
payload = {
    "symptom_description": "I have been coughing a lot and feeling dizzy when I go outside for a run.",
    "user_lat": 44.42, 
    "user_long": 26.05
}

print(f"Testing Edge Function at: {FUNCTION_URL}")
print(f"Payload: {json.dumps(payload, indent=2)}")

# 4. Make Request
try:
    response = requests.post(
        FUNCTION_URL,
        json=payload,
        headers={
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
    )
    
    # 5. Output Result
    if response.status_code == 200:
        print("\n✅ Success! Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"\n❌ Error {response.status_code}:")
        print(response.text)

except Exception as e:
    print(f"\n❌ Request Failed: {e}")
