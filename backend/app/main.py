from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_indexes
from app.routers import auth_router, predict_router, history_router

settings = get_settings()

app = FastAPI(
    title="AI Fake News Detection System",
    description="REST API for user auth, fake/real news prediction, and history.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(predict_router.router)
app.include_router(history_router.router)


@app.on_event("startup")
async def on_startup():
    await init_indexes()


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
