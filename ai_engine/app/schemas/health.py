from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):

    success: bool
    service: str
    status: Literal["healthy"]
    version: str
    timestamp: datetime