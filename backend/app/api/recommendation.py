from fastapi import APIRouter, Header, Query
from app.db.supabase_client import supabase
from app.utils.auth_utils import get_user_from_token

router = APIRouter()

def require_user(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.replace("Bearer ", "")
    return get_user_from_token(token)


@router.get("/crop/{crop_name}")
def recommend_crop(
    crop_name: str,
    lat: float = Query(...),
    lon: float = Query(...),
    authorization: str | None = Header(default=None),
):
    user = require_user(authorization)
    if not user:
        return {"error": "Unauthorized"}

    # 1️⃣ Soil report
    soil_res = supabase.table("soil_reports") \
        .select("*") \
        .eq("farmer_id", user.id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not soil_res.data:
        return {"error": "No soil analysis found"}

    soil = soil_res.data[0]
    nutrients = soil.get("estimated_nutrients") or {}

    # 2️⃣ Crop requirement
    crop_res = supabase.table("crop_requirements") \
        .select("*") \
        .eq("crop_name", crop_name) \
        .execute()

    if not crop_res.data:
        return {"error": f"Crop '{crop_name}' not found in database"}

    crop = crop_res.data[0]

    # 3️⃣ Compare safely
    recommendations = []

    def need(n):
        return nutrients.get(n, 0) < (crop.get(f"{n}_min") or 0)

    if need("nitrogen"):
        recommendations.append("Add Nitrogen (Urea)")
    if need("phosphorus"):
        recommendations.append("Add Phosphorus (DAP)")
    if need("potassium"):
        recommendations.append("Add Potassium (MOP)")
    if need("sulphur"):
        recommendations.append("Add Sulphur")

    if not recommendations:
        recommendations.append("Soil is suitable for this crop")

    return {
        "crop": crop_name,
        "soil_type": soil.get("soil_type"),
        "nutrients": nutrients,
        "recommendations": recommendations,
        "water_need": crop.get("water_need"),
        "climate": crop.get("climate"),
        "location": {"lat": lat, "lon": lon},
    }
