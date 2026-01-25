from fastapi import APIRouter, Header, HTTPException
from app.db.supabase_client import supabase
from app.utils.auth_utils import get_user_from_token

router = APIRouter()

# -----------------------------
# Auth Guard
# -----------------------------
def require_user(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user


# -----------------------------
# Get schemes + eligibility
# -----------------------------
@router.get("/")
def get_schemes(
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    # Farmer documents
    farmer_docs = (
        supabase
        .table("documents")
        .select("doc_type")
        .eq("farmer_id", user.id)
        .execute()
        .data
    )
    farmer_doc_types = {d["doc_type"] for d in farmer_docs}

    # Schemes
    schemes = supabase.table("schemes").select("*").execute().data

    result = []

    for scheme in schemes:
        # Required docs for this scheme
        req_docs = (
            supabase
            .table("scheme_required_documents")
            .select("doc_type")
            .eq("scheme_id", scheme["id"])
            .execute()
            .data
        )

        required = [d["doc_type"] for d in req_docs]
        available = [d for d in required if d in farmer_doc_types]
        missing = [d for d in required if d not in farmer_doc_types]

        result.append({
            "id": scheme["id"],
            "scheme_name": scheme["scheme_name"],
            "state": scheme["state"],
            "crop_type": scheme["crop_type"],
            "summary_text": scheme["summary_text"],
            "required_documents": required,
            "available_documents": available,
            "missing_documents": missing,
            "is_eligible": len(missing) == 0,
            "last_updated": scheme["last_updated"],
        })

    return result


# -----------------------------
# Get scheme video (SIGNED URL)
# -----------------------------
@router.get("/{scheme_id}/video")
def get_scheme_video(
    scheme_id: str,
    authorization: str | None = Header(default=None),
):
    require_user(authorization)

    scheme = (
        supabase
        .table("schemes")
        .select("video_url")
        .eq("id", scheme_id)
        .single()
        .execute()
    )

    if not scheme.data or not scheme.data.get("video_url"):
        raise HTTPException(status_code=404, detail="Video not available")

    signed = supabase.storage.from_("generated-videos").create_signed_url(
        scheme.data["video_url"],
        300
    )

    return {"video_url": signed["signedURL"]}
