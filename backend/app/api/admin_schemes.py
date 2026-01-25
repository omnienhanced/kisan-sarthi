from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from app.db.supabase_client import supabase
from app.utils.auth_utils import get_user_from_token

router = APIRouter()

def require_admin(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user


@router.post("/schemes")
async def create_scheme(
    scheme_name: str = Form(...),
    state: str = Form(...),
    crop_type: str = Form(...),
    summary_text: str = Form(...),
    required_documents: str = Form(...),
    video: UploadFile | None = File(None),
    authorization: str | None = Header(default=None),
):
    try:
        require_admin(authorization)

        video_path = None
        if video:
            video_bytes = await video.read()
            video_path = scheme_name.lower().replace(" ", "_") + ".mp4"

            supabase.storage.from_("generated-videos").upload(
                video_path,
                video_bytes,
                file_options={
                    "content-type": video.content_type,
                    "upsert": "true",
                },
            )

        scheme = supabase.table("schemes").insert({
            "scheme_name": scheme_name,
            "state": state,
            "crop_type": crop_type,
            "summary_text": summary_text,
            "video_url": video_path,
        }).execute()

        scheme_id = scheme.data[0]["id"]

        for doc in required_documents.split(","):
            supabase.table("scheme_required_documents").insert({
                "scheme_id": scheme_id,
                "doc_type": doc.strip(),
            }).execute()

        return {"message": "Scheme created", "scheme_id": scheme_id}

    except Exception as e:
        print("🔥 ADMIN ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
