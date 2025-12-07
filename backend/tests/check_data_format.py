import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(url, key)

try:
    res = supabase.table("air_quality").select("*").limit(1).execute()
    if res.data:
        print("Boundary Data Type:", type(res.data[0]['boundary']))
        print("Boundary Value:", res.data[0]['boundary'])
    else:
        print("No data found.")
except Exception as e:
    print(f"Error: {e}")
