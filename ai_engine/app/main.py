from fastapi import FastAPI

from app.core.config import settings
from app.api.v1.routes import health


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI and Machine Learning service for FINORA"
)


app.include_router(
    health.router,
    prefix="/ai/v1",
    tags=["Health"]
)