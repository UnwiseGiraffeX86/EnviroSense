import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(url, key)

try:
    res = supabase.table("token_usage_logs").insert({
        "source": "test_script",
        "model": "test-model",
        "total_tokens": 1
    }).execute()
    print("Successfully inserted log.")
except Exception as e:
    print(f"Failed to insert: {e}")
