from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from app.db.supabase_client import supabase
from app.utils.auth_utils import get_user_from_token
import google.generativeai as genai
import os
import json
import io
from PIL import Image
import asyncio
import traceback

router = APIRouter(tags=["Soil Analysis"])

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
# Gemini config
# -------------------------------------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not set")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


# -------------------------------------------------
# Soil Analysis API
# -------------------------------------------------
@router.post("/analyze")
async def analyze_soil(
    farm_name: str = Form(...),        # ✅ REQUIRED NICKNAME
    file: UploadFile | None = File(None),
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)

    try:
        image = None

        # ---------------------------------------------
        # Read image ONLY if provided
        # ---------------------------------------------
        if file:
            image_bytes = await file.read()
            image = Image.open(io.BytesIO(image_bytes))

        # ---------------------------------------------
        # Gemini Prompt (STRICT JSON)
        # ---------------------------------------------
        prompt = """
You are an expert agricultural scientist.

Analyze the soil.

Return STRICT JSON ONLY in this format:

{
  "soil_type": "Loamy",
  "health_score": 0-100,
  "nutrients": {
    "nitrogen": 0-100,
    "phosphorus": 0-100,
    "potassium": 0-100,
    "sulphur": 0-100,
    "ph": 0-14
  }
}

RULES:
- JSON only
- No markdown
- No explanations
"""

        # ---------------------------------------------
        # Call Gemini
        # ---------------------------------------------
        response = await asyncio.to_thread(
            model.generate_content,
            [image, prompt] if image else prompt
        )

        raw_text = response.text.strip()

        # ---------------------------------------------
        # 🔥 FIX: Remove ```json wrappers
        # ---------------------------------------------
        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        try:
            parsed = json.loads(raw_text)
        except Exception:
            raise HTTPException(
                status_code=500,
                detail=f"Gemini returned invalid JSON: {raw_text}"
            )

        soil_type = parsed.get("soil_type")
        health_score = parsed.get("health_score")
        nutrients = parsed.get("nutrients")

        if not soil_type or not nutrients:
            raise HTTPException(status_code=500, detail="Incomplete Gemini response")

        # ---------------------------------------------
        # SAVE TO SUPABASE (soil_reports)
        # ---------------------------------------------
        supabase.table("soil_reports").insert({
            "farmer_id": user.id,
            "farm_name": farm_name,              # ✅ nickname
            "soil_type": soil_type,
            "estimated_nutrients": nutrients,
            "health_score": health_score,
        }).execute()

        return {
            "message": "Soil analyzed successfully",
            "farm_name": farm_name,
            "soil_type": soil_type,
            "health_score": health_score,
            "nutrients": nutrients,
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
