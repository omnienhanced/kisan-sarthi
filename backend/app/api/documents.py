from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from app.db.supabase_client import supabase
from app.utils.auth_utils import get_user_from_token

router = APIRouter()

# -------------------------------------------------
# Auth Guard
# -------------------------------------------------
def require_user(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user


# -------------------------------------------------
# Upload Document
# -------------------------------------------------
@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str = Form(...),
    expiry_date: str = Form(None),
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    try:
        extension = file.filename.split(".")[-1]
        file_path = f"{user.id}/{doc_type}.{extension}"

        file_bytes = await file.read()

        supabase.storage.from_("documents").upload(
            file_path,
            file_bytes,
            file_options={
                "content-type": file.content_type,
                "upsert": "true",
            },
        )

        supabase.table("documents").insert({
            "farmer_id": user.id,
            "doc_type": doc_type,
            "file_url": file_path,
            "expiry_date": expiry_date,
            "status": "valid",
        }).execute()

        return {"message": "Document uploaded successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# Get My Documents
# -------------------------------------------------
@router.get("/my")
def get_my_documents(
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    result = (
        supabase
        .table("documents")
        .select("id, doc_type, expiry_date, file_url")
        .eq("farmer_id", user.id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


# -------------------------------------------------
# Preview Document (SIGNED URL)
# -------------------------------------------------
@router.get("/{doc_id}/preview")
def preview_document(
    doc_id: str,
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    doc = (
        supabase
        .table("documents")
        .select("file_url")
        .eq("id", doc_id)
        .eq("farmer_id", user.id)
        .single()
        .execute()
    )

    if not doc.data or not doc.data.get("file_url"):
        raise HTTPException(status_code=404, detail="Document not found")

    signed = supabase.storage.from_("documents").create_signed_url(
        doc.data["file_url"],
        120,
    )

    return {"signed_url": signed["signedURL"]}


# -------------------------------------------------
# Download Document (SIGNED URL)
# -------------------------------------------------
@router.get("/{doc_id}/download")
def download_document(
    doc_id: str,
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    doc = (
        supabase
        .table("documents")
        .select("file_url")
        .eq("id", doc_id)
        .eq("farmer_id", user.id)
        .single()
        .execute()
    )

    if not doc.data or not doc.data.get("file_url"):
        raise HTTPException(status_code=404, detail="Document not found")

    signed = supabase.storage.from_("documents").create_signed_url(
        doc.data["file_url"],
        120,
    )

    return {"signed_url": signed["signedURL"]}


# -------------------------------------------------
# Delete Document
# -------------------------------------------------
@router.delete("/{doc_id}")
def delete_document(
    doc_id: str,
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    supabase.table("documents") \
        .delete() \
        .eq("id", doc_id) \
        .eq("farmer_id", user.id) \
        .execute()

    return {"message": "Document deleted"}
