from app.db.supabase_client import supabase
from fastapi import UploadFile
import uuid

BUCKET = "documents"


# 🔹 FETCH DOCUMENTS (WITH SIGNED URL)
def get_documents_by_farmer(farmer_id: str):
    res = (
        supabase
        .table("documents")
        .select("*")
        .eq("farmer_id", farmer_id)
        .order("created_at", desc=True)
        .execute()
    )

    documents = res.data or []

    # 🔥 IMPORTANT: generate signed URLs
    for doc in documents:
        signed = supabase.storage.from_(BUCKET).create_signed_url(
            doc["file_url"],
            3600  # valid for 1 hour
        )
        doc["signed_url"] = signed["signedURL"]

    return documents


# 🔹 CREATE DOCUMENT
async def create_document(
    farmer_id: str,
    doc_type: str,
    expiry_date: str | None,
    file: UploadFile
):
    file_path = f"{farmer_id}/{uuid.uuid4()}-{file.filename}"

    file_bytes = await file.read()

    # Upload to storage
    supabase.storage.from_(BUCKET).upload(
        file_path,
        file_bytes,
        {"content-type": file.content_type}
    )

    # Insert DB record
    res = (
        supabase
        .table("documents")
        .insert({
            "farmer_id": farmer_id,
            "doc_type": doc_type,
            "file_url": file_path,
            "expiry_date": expiry_date,
            "status": "Uploaded"
        })
        .execute()
    )

    return res.data[0]


# 🔹 DELETE DOCUMENT
def delete_document(document_id: str):
    supabase.table("documents").delete().eq("id", document_id).execute()
    return {"success": True}
