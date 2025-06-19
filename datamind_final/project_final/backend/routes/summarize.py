from fastapi import APIRouter, Form
from supabase_client import supabase
from services.summarizer_groq import summarize_with_groq, get_document_description
from services.summarizer_hf import summarize_with_hf

router = APIRouter()

@router.post("/")
async def summarize(document_id: str = Form(...), model: str = Form(...)):
    document = supabase.table("Documents").select("*").eq("id", document_id).execute().data[0]
    content = document["content"]

    # Check for extraction errors or empty content
    if not content or content.strip() == "" or content.startswith("Error: "):
        return {"summary": "No summary available: Document contains no extractable text or extraction failed."}

    if model == "groq":
        summary = summarize_with_groq(content)
    else:
        summary = summarize_with_hf(content)

    analytics_entry = {
        "user_id": document["user_id"],
        "document_id": document_id,
        "analysis_type": "summary",
        "result": summary,
        "created_at": "now()"
    }
    supabase.table("Analytics").insert(analytics_entry).execute()
    return {"summary": summary}


@router.get("/description/{document_id}")
async def description(document_id: str):
    document = supabase.table("Documents").select("*").eq("id", document_id).execute().data[0]
    content = document["content"]
    overview = get_document_description(content)
    return {"description": overview}
