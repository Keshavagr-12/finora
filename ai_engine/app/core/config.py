from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    APP_NAME: str = "FINORA AI Engine"
    APP_VERSION: str = "1.0.0"

    APP_ENV: Literal[
        "development",
        "production",
        "test"
    ] = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()