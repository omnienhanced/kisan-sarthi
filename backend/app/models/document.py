from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.db.document_repo import (
    create_document,
    get_documents_by_farmer,
    delete_document
)

router = APIRouter()


# 🔹 LIST DOCUMENTS
@router.get("/")
def list_documents(farmer_id: str):
    if not farmer_id:
        raise HTTPException(status_code=400, detail="farmer_id is required")

    return get_documents_by_farmer(farmer_id)


# 🔹 UPLOAD DOCUMENT
@router.post("/")
async def upload_document(
    farmer_id: str = Form(...),
    doc_type: str = Form(...),
    expiry_date: str | None = Form(None),
    file: UploadFile = File(...)
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    document = await create_document(
        farmer_id=farmer_id,
        doc_type=doc_type,
        expiry_date=expiry_date,
        file=file
    )

    return {
        "message": "Document uploaded successfully",
        "document": document
    }


# 🔹 DELETE DOCUMENT
@router.delete("/{doc_id}")
def remove_document(doc_id: str):
    if not doc_id:
        raise HTTPException(status_code=400, detail="Document ID required")

    return delete_document(doc_id)
