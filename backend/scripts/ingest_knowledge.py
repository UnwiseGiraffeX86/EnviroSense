# ==============================================================================
# Eco-Neuro Sentinel: Dynamic Knowledge Ingestion Pipeline
# ==============================================================================
# This script automates the discovery, extraction, transformation, and loading (ETL)
# of knowledge into the Supabase Vector Store. It searches for real-time data
# across Regulatory, Clinical, and Local domains, processes the content, and
# upserts embeddings for RAG functionality.

# ------------------------------------------------------------------------------
# Prerequisites & Installation
# ------------------------------------------------------------------------------
# pip install langchain langchain-community langchain-openai supabase pypdf python-dotenv beautifulsoup4 duckduckgo-search requests

import os
import re
import requests
import tempfile
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urlparse

from dotenv import load_dotenv
from bs4 import BeautifulSoup
from supabase import create_client, Client

# LangChain Imports
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.documents import Document
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
from langchain_community.callbacks import get_openai_callback

# ------------------------------------------------------------------------------
# 1. Configuration
# ------------------------------------------------------------------------------

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY]):
    raise ValueError("Missing required environment variables in .env file.")

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY)

# Search Configuration
SEARCH_QUERIES = {
    "Regulatory": "latest EU air quality directives 2024 2025 pdf",
    "Clinical": "medical studies air pollution neuro-inflammation depression 2024",
    "National": "Romania mental health action plan pollution statistics"
}

MAX_RESULTS_PER_QUERY = 3

# ------------------------------------------------------------------------------
# 2. Helper Functions
# ------------------------------------------------------------------------------

def clean_text(text: str) -> str:
    """
    Cleans extracted text by removing excessive whitespace and artifacts.
    """
    if not text:
        return ""
    # Replace newlines with spaces
    text = text.replace("\n", " ")
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def check_url_exists(url: str) -> bool:
    """
    Checks if the URL has already been ingested into the knowledge_base.
    """
    try:
        # We query the metadata column for the source_url
        # Note: This assumes metadata is a JSONB column
        response = supabase.table("knowledge_base") \
            .select("id") \
            .filter("metadata->>source_url", "eq", url) \
            .limit(1) \
            .execute()
        
        return len(response.data) > 0
    except Exception as e:
        print(f"Warning: Could not check for existing URL {url}: {e}")
        return False

def download_pdf(url: str) -> Optional[str]:
    """
    Downloads a PDF from a URL to a temporary file.
    Returns the path to the temporary file or None if failed.
    """
    try:
        response = requests.get(url, timeout=15, stream=True)
        response.raise_for_status()
        
        # Create a temp file
        fd, path = tempfile.mkstemp(suffix=".pdf")
        with os.fdopen(fd, 'wb') as tmp:
            for chunk in response.iter_content(chunk_size=8192):
                tmp.write(chunk)
        return path
    except Exception as e:
        print(f"  [!] Failed to download PDF from {url}: {e}")
        return None

def scrape_webpage(url: str) -> str:
    """
    Scrapes text content from a standard webpage using BeautifulSoup.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.extract()
            
        text = soup.get_text()
        return clean_text(text)
    except Exception as e:
        print(f"  [!] Failed to scrape webpage {url}: {e}")
        return ""

# ------------------------------------------------------------------------------
# 3. ETL Pipeline
# ------------------------------------------------------------------------------

def run_pipeline():
    print("Starting Dynamic Knowledge Ingestion Pipeline...")
    
    # Initialize Search Tool
    wrapper = DuckDuckGoSearchAPIWrapper(max_results=MAX_RESULTS_PER_QUERY)
    search = DuckDuckGoSearchRun(api_wrapper=wrapper)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    for category, query in SEARCH_QUERIES.items():
        print(f"\n--- Processing Category: {category} ---")
        print(f"Query: {query}")
        
        try:
            # Perform Search
            # Note: DuckDuckGoSearchRun returns a string summary. 
            # For actual URLs, we need to use the wrapper's results method if available, 
            # or parse the results. The standard tool returns a string.
            # We will use the wrapper directly to get metadata.
            results = wrapper.results(query, max_results=MAX_RESULTS_PER_QUERY)
            
            if not results:
                print("  No results found.")
                continue

            for result in results:
                url = result['link']
                title = result['title']
                snippet = result['snippet']
                
                print(f"\nFound: {title}")
                print(f"URL: {url}")

                # 1. Check for Duplicates
                if check_url_exists(url):
                    print("  [i] Skipping: URL already exists in database.")
                    continue

                documents_to_process = []
                
                # 2. Extraction
                if url.lower().endswith(".pdf"):
                    print("  [i] Detected PDF. Downloading...")
                    pdf_path = download_pdf(url)
                    if pdf_path:
                        try:
                            loader = PyPDFLoader(pdf_path)
                            raw_docs = loader.load()
                            # Combine text or keep pages? Keeping pages is better for context.
                            for doc in raw_docs:
                                doc.page_content = clean_text(doc.page_content)
                                doc.metadata["source_url"] = url
                                doc.metadata["category"] = category
                                doc.metadata["title"] = title
                                doc.metadata["date_scraped"] = datetime.now().isoformat()
                                documents_to_process.extend(raw_docs)
                        except Exception as e:
                            print(f"  [!] Error processing PDF: {e}")
                        finally:
                            os.remove(pdf_path) # Clean up temp file
                else:
                    print("  [i] Detected Webpage. Scraping...")
                    content = scrape_webpage(url)
                    if content and len(content) > 500: # Minimum content check
                        doc = Document(
                            page_content=content,
                            metadata={
                                "source_url": url,
                                "category": category,
                                "title": title,
                                "date_scraped": datetime.now().isoformat()
                            }
                        )
                        documents_to_process.append(doc)
                    else:
                        print("  [!] Content too short or empty. Skipping.")

                if not documents_to_process:
                    continue

                # 3. Transformation (Chunking)
                chunks = text_splitter.split_documents(documents_to_process)
                print(f"  Generated {len(chunks)} chunks.")

                # 4. Loading (Supabase)
                if chunks:
                    try:
                        print("  Upserting to Supabase...")
                        with get_openai_callback() as cb:
                            SupabaseVectorStore.from_documents(
                                documents=chunks,
                                embedding=embeddings,
                                client=supabase,
                                table_name="knowledge_base",
                                query_name="match_documents",
                                chunk_size=100
                            )
                            print(f"  [+] Success! Tokens Used: {cb.total_tokens}")
                            
                            # Log to DB
                            try:
                                supabase.table("token_usage_logs").insert({
                                    "source": "ingest_knowledge_script",
                                    "model": "text-embedding-3-small",
                                    "prompt_tokens": cb.prompt_tokens,
                                    "completion_tokens": cb.completion_tokens,
                                    "total_tokens": cb.total_tokens
                                }).execute()
                            except Exception as log_err:
                                print(f"  [!] Warning: Could not log token usage: {log_err}")

                    except Exception as e:
                        print(f"  [!] Error upserting to Supabase: {e}")

        except Exception as e:
            print(f"Error processing category {category}: {e}")

    print("\nPipeline Complete.")

if __name__ == "__main__":
    run_pipeline()
