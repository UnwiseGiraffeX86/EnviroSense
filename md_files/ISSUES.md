# Project Issues

## 1. Web Scraper (`ingest_knowledge.py`) Malfunction

**Status:** Open  
**Priority:** High  
**Date Reported:** 2025-12-06

### Description
The dynamic knowledge ingestion pipeline (`ingest_knowledge.py`) is currently failing to execute successfully.

### Symptoms
1. **OpenAI API Authentication Error:**
   - The script fails during the embedding/upsert phase with `Error code: 401 - Incorrect API key provided`.
   - This indicates the `OPENAI_API_KEY` in `.env` is invalid, expired, or missing.

2. **Access Forbidden (403) on Target Sites:**
   - Several target URLs (e.g., `envira.global`, `coe.int`, `mdpi.com`) are returning `403 Forbidden`.
   - The scraper needs better user-agent rotation or handling for these anti-bot measures, or we need to find alternative data sources.

### Steps to Reproduce
Run the ingestion script:
```bash
/home/stefan/Desktop/BESTEM/.venv/bin/python ingest_knowledge.py
```

### Proposed Fixes
- [ ] Update `OPENAI_API_KEY` in `.env` with a valid key.
- [ ] Improve `scrape_webpage` function to handle 403 errors more gracefully or use a more robust scraping tool (e.g., Selenium/Playwright) if simple requests continue to fail.
- [ ] Review and update `SEARCH_QUERIES` to target more accessible data sources if necessary.
