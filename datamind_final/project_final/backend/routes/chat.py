from fastapi import APIRouter, Form  
from supabase_client import supabase  
from services.chatbot_gemini import chat_with_gemini  
from services.chatbot_mistral import chat_with_mistral  

router = APIRouter()

@router.post("/")
async def chat(document_id: str = Form(...), query: str = Form(...), model: str = Form(...)):
    document = supabase.table("Documents").select("*").eq("id", document_id).execute().data[0]
    content = document["content"]

    if model == "gemini":
        response = chat_with_gemini(query, content)
    else:
        response = chat_with_mistral(query, content)

    chat_entry = {
        "user_id": document["user_id"],
        "document_id": document_id,
        "message": query,
        "response": response,
        "created_at": "now()"
    }
    supabase.table("Chats").insert(chat_entry).execute()
    return {"response": response}
