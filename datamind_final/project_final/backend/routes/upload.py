from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import JSONResponse
from supabase_client import supabase
from utils import extract_text_from_file, extract_description
import os

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = Form(...), user_id: str = Form(...)):
    try:
        # Check file is present
        if not file:
            return JSONResponse(status_code=400, content={"message": "No file uploaded"})
        if not user_id:
            return JSONResponse(status_code=400, content={"message": "No user_id provided"})

        # Read file bytes for size calculation
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(0)

        # Extract content
        content = await extract_text_from_file(file)
        if content.startswith("Error:"):
            print(f"Extraction error: {content}")
            return JSONResponse(status_code=400, content={"message": content})
        document = {
            "user_id": user_id,
            "name": file.filename,
            "file_url": "",  # Use empty string if not using storage
            "type": file.content_type,
            "size": size,
            "created_at": "now()",
            "description": extract_description(content),
            "content": content
        }
        try:
            response = supabase.table("Documents").insert(document).execute()
        except Exception as db_exc:
            print(f"Supabase DB insert error: {db_exc}")
            return JSONResponse(status_code=500, content={"message": "Failed to upload file to database", "error": str(db_exc)})
        print("Supabase insert response:", response)
        if not response.data:
            print("Supabase error:", response)
            return JSONResponse(status_code=500, content={"message": "Failed to upload file", "error": str(response)})
        # Return only the inserted document (first item)
        return {"message": "File uploaded successfully", "document": response.data[0]}
    except Exception as e:
        import traceback
        print("Exception during upload:", e)
        print(traceback.format_exc())
        return JSONResponse(status_code=500, content={"message": "Exception during upload", "error": str(e)})
