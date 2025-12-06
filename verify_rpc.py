import os
from dotenv import load_dotenv
from supabase import create_client
from langchain_openai import OpenAIEmbeddings

# 1. Load Environment Variables
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
openai_key = os.getenv("OPENAI_API_KEY")

if not all([url, key, openai_key]):
    raise ValueError("Missing environment variables. Check .env file.")

# 2. Initialize Clients
supabase = create_client(url, key)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=openai_key)

def verify_rpc():
    query = "What are the EU air quality standards for 2025?"
    print(f"Generating embedding for query: '{query}'...")
    
    # 3. Generate Vector
    try:
        query_vector = embeddings.embed_query(query)
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return

    print("Calling 'match_documents' RPC function...")

    # 4. Call RPC
    try:
        response = supabase.rpc("match_documents", {
            "query_embedding": query_vector,
            "match_threshold": 0.1, # Low threshold to ensure we get *some* result if data exists
            "match_count": 3
        }).execute()

        # 5. Check Results
        if response.data:
            print(f"\n✅ Success! Found {len(response.data)} relevant documents:")
            for i, doc in enumerate(response.data):
                print(f"\n--- Result {i+1} (Similarity: {doc['similarity']:.4f}) ---")
                print(f"Content Preview: {doc['content'][:150]}...")
                print(f"Source: {doc['metadata'].get('source_url', 'Unknown')}")
        else:
            print("\n⚠️  RPC call succeeded, but returned no results. Try lowering the threshold or checking if 'knowledge_base' has data.")
            
    except Exception as e:
        print(f"\n❌ RPC Call Failed: {e}")
        print("Tip: Ensure you have run the SQL to create the 'match_documents' function in Supabase.")

if __name__ == "__main__":
    verify_rpc()
