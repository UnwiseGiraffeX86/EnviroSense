import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: Missing API keys")
    exit(1)

supabase = create_client(url, key)

try:
    # Check Air Quality
    aq_res = supabase.table("air_quality").select("id", count="exact").execute()
    print(f"Air Quality Rows: {aq_res.count}")

    # Check Knowledge Base
    kb_res = supabase.table("knowledge_base").select("id", count="exact").execute()
    print(f"Knowledge Base Rows: {kb_res.count}")

except Exception as e:
    print(f"Error checking DB: {e}")
