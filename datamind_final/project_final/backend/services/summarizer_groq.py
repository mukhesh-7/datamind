import os
from dotenv import load_dotenv
import requests
import time

# Load .env from project root
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise EnvironmentError("GROQ_API_KEY not set in environment variables.")

def groq_post_with_retry(url, headers, payload, max_retries=5, base_delay=1.0):
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 429:
                # Too Many Requests, exponential backoff
                delay = base_delay * (2 ** attempt)
                print(f"Groq 429 Too Many Requests, retrying in {delay:.1f}s...")
                time.sleep(delay)
                continue
            response.raise_for_status()
            return response
        except requests.exceptions.HTTPError as e:
            if response.status_code == 429 and attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)
                print(f"Groq 429 Too Many Requests, retrying in {delay:.1f}s...")
                time.sleep(delay)
                continue
            raise
    raise Exception("Groq API: Too Many Requests, all retries failed.")

def get_document_description(content: str) -> str:
    """
    Generate a 2-3 line overview of the document, stating only what the document is about, without explaining or summarizing its content in detail.
    Automatically chunk/truncate input to avoid exceeding Groq API limits.
    """
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        # Lower chunk size to reduce API rate limit issues
        MAX_CHARS = 16000
        CHUNK_SIZE = MAX_CHARS
        if len(content) > MAX_CHARS:
            chunks = [content[i:i+CHUNK_SIZE] for i in range(0, len(content), CHUNK_SIZE)]
            overviews = []
            for chunk in chunks:
                time.sleep(1)  # Add delay to avoid rate limiting
                prompt = (
                    "Provide a 2-3 line overview of the following document. Do NOT explain or summarize its content, just state what the document is about in a generic way. "
                    "Be concise and avoid details.\n\n" + chunk
                )
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": "You are a helpful assistant that generates document overviews (not summaries)."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 256,
                    "temperature": 0.2,
                    "top_p": 1,
                    "n": 1,
                    "stop": None
                }
                response = groq_post_with_retry(url, headers, payload)
                data = response.json()
                if "choices" in data and len(data["choices"]) > 0:
                    overview = data["choices"][0]["message"]["content"].strip()
                    overview_lines = [line for line in overview.splitlines() if line.strip()]
                    overview = '\n'.join(overview_lines[:3])
                    overviews.append(overview)
                time.sleep(1)  # Add delay to avoid rate limiting
            combined = '\n'.join(overviews)
            if len(combined) > CHUNK_SIZE:
                return get_document_description(combined)
            return combined
        else:
            prompt = (
                "Provide a 2-3 line overview of the following document. Do NOT explain or summarize its content, just state what the document is about in a generic way. "
                "Be concise and avoid details.\n\n" + content
            )
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that generates document overviews (not summaries)."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 256,
                "temperature": 0.2,
                "top_p": 1,
                "n": 1,
                "stop": None
            }
            response = groq_post_with_retry(url, headers, payload)
            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                overview = data["choices"][0]["message"]["content"].strip()
                overview_lines = [line for line in overview.splitlines() if line.strip()]
                overview = '\n'.join(overview_lines[:3])
                return overview
            else:
                return "Error: No overview returned from Groq API."
    except Exception as e:
        print(f"Error generating document overview: {e}")
        return f"Error: Unable to generate document overview. ({str(e)})"

def summarize_with_groq(content: str) -> str:
    """
    Summarize the document content robustly, retrying failed chunks with exponential backoff,
    and always attempting to summarize all chunks (never fail the whole doc if one chunk fails).
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    MAX_CHARS = 10000
    CHUNK_SIZE = MAX_CHARS
    def summarize_chunk(chunk):
        prompt = (
            "Summarize the following document in a detailed paragraph.\n\n" + chunk
        )
        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that summarizes documents."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 512,
            "temperature": 0.2,
            "top_p": 1,
            "n": 1,
            "stop": None
        }
        max_retries = 5
        base_delay = 1.0
        for attempt in range(max_retries):
            try:
                response = requests.post(url, headers=headers, json=payload)
                if response.status_code == 429:
                    delay = base_delay * (2 ** attempt)
                    print(f"Groq 429 Too Many Requests (summary), retrying in {delay:.1f}s...")
                    time.sleep(delay)
                    continue
                response.raise_for_status()
                data = response.json()
                if "choices" in data and len(data["choices"]) > 0:
                    return data["choices"][0]["message"]["content"].strip()
                else:
                    return "[Error: No summary returned for this chunk]"
            except Exception as e:
                print(f"Error summarizing chunk (attempt {attempt+1}): {e}")
                if attempt == max_retries - 1:
                    return f"[Error: Unable to summarize this chunk after {max_retries} attempts]"
                delay = base_delay * (2 ** attempt)
                time.sleep(delay)
        return "[Error: Unknown summarization failure]"

    try:
        if len(content) > MAX_CHARS:
            chunks = [content[i:i+CHUNK_SIZE] for i in range(0, len(content), CHUNK_SIZE)]
            summaries = []
            for chunk in chunks:
                summary = summarize_chunk(chunk)
                summaries.append(summary)
                time.sleep(1)  # Delay to avoid rate limiting
            combined = '\n'.join(summaries)
            if len(combined) > CHUNK_SIZE:
                # Recursively summarize if needed
                return summarize_with_groq(combined)
            return combined
        else:
            return summarize_chunk(content)
    except Exception as e:
        print(f"Error generating summary: {e}")
        return f"Error: Unable to generate summary. ({str(e)})"

