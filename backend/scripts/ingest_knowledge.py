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
import random
import time
import concurrent.futures
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
    # --- Regulatory & Policy ---
    "Regulatory_EU": "latest EU air quality directives 2024 2025 pdf",
    "Regulatory_WHO": "WHO global air quality guidelines 2024 update",
    
    # --- Clinical: Respiratory (The Basics) ---
    "Clinical_Respiratory": "asthma COPD exacerbation PM2.5 NO2 studies 2024",
    
    # --- Clinical: Neurological (The USP) ---
    "Clinical_Neuro": "air pollution neuro-inflammation cognitive decline studies 2024",
    "Clinical_Psych": "air pollution depression anxiety suicide risk correlation research",
    
    # --- Local Context (Romania/Bucharest) ---
    "Local_Romania": "Romania mental health action plan pollution statistics 2024",
    "Local_Bucharest": "Bucharest air quality annual report 2024 health impact",
    
    # --- Environmental Science ---
    "Env_Science": "urban heat island effect air quality correlation studies",
    "Env_Sensors": "low cost air quality sensor accuracy validation studies 2024"
}

MAX_RESULTS_PER_QUERY = 5  # Increased for better coverage
MAX_WORKERS = 4  # For parallel processing

# User Agents for Rotation
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
]

# ------------------------------------------------------------------------------
# 2. Helper Functions
# ------------------------------------------------------------------------------

def get_headers() -> Dict[str, str]:
    """Returns headers with a random User-Agent to avoid blocking."""
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    }

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
        response = requests.get(url, headers=get_headers(), timeout=15, stream=True)
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
        response = requests.get(url, headers=get_headers(), timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script, style, and other non-content elements
        for element in soup(["script", "style", "nav", "footer", "header", "aside", "form", "iframe", "noscript"]):
            element.extract()
            
        text = soup.get_text(separator=' ')
        return clean_text(text)
    except Exception as e:
        print(f"  [!] Failed to scrape webpage {url}: {e}")
        return ""

# ------------------------------------------------------------------------------
# 3. ETL Pipeline
# ------------------------------------------------------------------------------

def process_result(result: Dict, category: str, text_splitter: RecursiveCharacterTextSplitter):
    """
    Processes a single search result: Checks existence, scrapes, chunks, and upserts.
    """
    url = result['link']
    title = result['title']
    
    # Random sleep to be polite
    time.sleep(random.uniform(1, 3))

    print(f"\n[Thread] Processing: {title[:30]}... ({url})")

    # 1. Check for Duplicates
    if check_url_exists(url):
        print(f"  [i] Skipping {url}: Already exists.")
        return

    documents_to_process = []
    
    # 2. Extraction
    if url.lower().endswith(".pdf"):
        print(f"  [i] Downloading PDF: {url}")
        pdf_path = download_pdf(url)
        if pdf_path:
            try:
                loader = PyPDFLoader(pdf_path)
                raw_docs = loader.load()
                for doc in raw_docs:
                    doc.page_content = clean_text(doc.page_content)
                    doc.metadata["source_url"] = url
                    doc.metadata["category"] = category
                    doc.metadata["title"] = title
                    doc.metadata["date_scraped"] = datetime.now().isoformat()
                    documents_to_process.extend(raw_docs)
            except Exception as e:
                print(f"  [!] Error processing PDF {url}: {e}")
            finally:
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)
    else:
        print(f"  [i] Scraping Webpage: {url}")
        content = scrape_webpage(url)
        if content and len(content) > 500:
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
            print(f"  [!] Content too short for {url}")

    if not documents_to_process:
        return

    # 3. Transformation (Chunking)
    chunks = text_splitter.split_documents(documents_to_process)
    print(f"  Generated {len(chunks)} chunks for {url}")

    # 4. Loading (Supabase)
    if chunks:
        try:
            # Use a lock if needed, but Supabase client is thread-safe enough for this volume
            with get_openai_callback() as cb:
                SupabaseVectorStore.from_documents(
                    documents=chunks,
                    embedding=embeddings,
                    client=supabase,
                    table_name="knowledge_base",
                    query_name="match_documents",
                    chunk_size=100
                )
                print(f"  [+] Success {url}! Tokens: {cb.total_tokens}")
        except Exception as e:
            print(f"  [!] Error upserting {url}: {e}")

# ------------------------------------------------------------------------------
# 3. ETL Pipeline
# ------------------------------------------------------------------------------

def run_pipeline():
    print("Starting Dynamic Knowledge Ingestion Pipeline...")
    
    # Initialize Search Tool
    wrapper = DuckDuckGoSearchAPIWrapper(max_results=MAX_RESULTS_PER_QUERY)
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    for category, query in SEARCH_QUERIES.items():
        print(f"\n--- Processing Category: {category} ---")
        print(f"Query: {query}")
        
        try:
            results = wrapper.results(query, max_results=MAX_RESULTS_PER_QUERY)
            
            if not results:
                print("  No results found.")
                continue

            # Parallel Processing
            with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = [
                    executor.submit(process_result, result, category, text_splitter)
                    for result in results
                ]
                concurrent.futures.wait(futures)
                
        except Exception as e:
            print(f"Error searching for {category}: {e}")

if __name__ == "__main__":
    run_pipeline()
