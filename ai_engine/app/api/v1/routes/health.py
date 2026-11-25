from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.health import HealthResponse


router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():

    return HealthResponse(
        success=True,
        service=settings.APP_NAME,
        status="healthy",
        version=settings.APP_VERSION,
        timestamp=datetime.now(timezone.utc)
    )