import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(url, key)

try:
    # Fetch the last 5 logs
    res = supabase.table("token_usage_logs") \
        .select("*") \
        .order("timestamp", desc=True) \
        .limit(5) \
        .execute()
    
    print(f"Found {len(res.data)} logs:")
    for log in res.data:
        print(f"[{log['timestamp']}] Source: {log['source']} | Model: {log['model']} | Total Tokens: {log['total_tokens']}")

except Exception as e:
    print(f"Error fetching logs: {e}")
