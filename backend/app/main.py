from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import soil, documents
from app.api import schemes
from app.api import admin_schemes
from app.api import recommendation

app = FastAPI(
    title="Kisan-Sarthi Backend",
    description="AI-powered backend for farmer assistance",
    version="1.0.0"
)

# 🔥 CORS MUST BE GLOBAL AND EARLY
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend connected successfully 🌾"}

# Routes
app.include_router(soil.router, prefix="/api/soil", tags=["Soil Analysis"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(schemes.router, prefix="/api/schemes", tags=["Schemes"])
app.include_router(
    admin_schemes.router,
    prefix="/api/admin",
    tags=["Admin Schemes"]
)
app.include_router(recommendation.router, prefix="/api/recommendation")
