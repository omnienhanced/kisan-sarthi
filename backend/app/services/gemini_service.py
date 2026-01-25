import os
import io
import asyncio
import traceback
from PIL import Image
import google.generativeai as genai

# -------------------------------------------------
# Load Google AI Studio API key
# -------------------------------------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("❌ GOOGLE_API_KEY not set in environment")

# Configure Gemini (Google AI Studio)
genai.configure(api_key=GOOGLE_API_KEY)

# Vision-capable public model
model = genai.GenerativeModel("gemini-2.5-flash")

# -------------------------------------------------
# Soil image analysis function
# -------------------------------------------------
async def analyze_soil_image(file):
    try:
        # Read uploaded image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # 🔒 STRICT FORMAT PROMPT (UI + FARMER FRIENDLY)
        prompt = """
You are an expert agricultural scientist.

Analyze the soil image and respond ONLY in the format below.
Do NOT write paragraphs.
Do NOT add introductions or conclusions.
Use simple farmer-friendly language.

STRICT FORMAT (follow exactly):

🌱 SOIL TYPE
- Type: <soil type>
- Color & Texture: <short description>
- Key Feature: <1 key soil characteristic>

🌾 FERTILITY LEVEL
- Level: <Low / Medium / High>
- Reasons:
  - <reason 1>
  - <reason 2>

SECTION 2: SOIL_METRICS_JSON
Return STRICT JSON ONLY in this format:

{
  "soil_type": "<string>",
  "fertility": "<Low | Medium | High>",
  "nutrients": {
    "nitrogen": <number 0-100>,
    "phosphorus": <number 0-100>,
    "potassium": <number 0-100>,
    "sulphur": <number 0-100>,
    "ph": <number 0-100>
  }

🌽 SUITABLE CROPS
- Root Crops:
  - <crop 1>
  - <crop 2>
- Cereals:
  - <crop 1>
  - <crop 2>
- Legumes:
  - <crop 1>
  - <crop 2>

🌿 FARMER ADVICE
- ✅ <short practical advice>
- ✅ <short practical advice>
- ✅ <short practical advice>

RULES:
- Use bullet points only
- Keep each line short
- No explanations
- No extra text
- No numbering
"""

        # IMPORTANT: image FIRST, then prompt
        response = await asyncio.to_thread(
            model.generate_content,
            [
                image,
                prompt
            ]
        )

        return {
            "analysis": response.text
        }

    except Exception as e:
        print("❌ GEMINI AI STUDIO ERROR")
        traceback.print_exc()
        return {
            "analysis": f"❌ Gemini error: {str(e)}"
        }
