from supabase import create_client
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path('/home/stefan/Desktop/BESTEM/.env')
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

try:
    res = supabase.table("air_quality").select("*").limit(1).execute()
    if res.data:
        print(res.data[0].keys())
    else:
        print("No data in air_quality, cannot infer columns.")
except Exception as e:
    print(e)
