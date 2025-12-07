import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(url, key)

try:
    res = supabase.table("token_usage_logs").select("*").limit(1).execute()
    print("Table 'token_usage_logs' exists.")
except Exception as e:
    print("Table 'token_usage_logs' does NOT exist or is not accessible.")
    print(e)
