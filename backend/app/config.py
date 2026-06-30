from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application configuration loaded from environment variables / .env file."""

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "fake_news_db"

    jwt_secret_key: str = "CHANGE_ME_IN_PRODUCTION_super_secret_key"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    model_path: str = "app/ai/artifacts/model.joblib"
    vectorizer_path: str = "app/ai/artifacts/vectorizer.joblib"

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = {"env_file": ".env", "protected_namespaces": ("settings_",)}


@lru_cache
def get_settings() -> Settings:
    return Settings()
