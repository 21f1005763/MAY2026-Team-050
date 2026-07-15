import json
import logging
import sys
from datetime import datetime, timezone
from functools import lru_cache
from typing import Literal, TextIO
from pydantic import SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from jan_setu.logctx import RequestIdFilter


LOG_RECORD_RESERVED = set(logging.LogRecord("", 0, "", 0, "", (), None).__dict__)

Environment = Literal["development", "test", "staging", "production"]

DEV_POSTGRES_PASSWORD = "jan_setu_dev_password"

class Settings(BaseSettings):
    environment: Environment = "development"
    log_level: str = "INFO"
    log_format: str = "text"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "jan_setu"
    postgres_user: str = "jan_setu_app"
    postgres_password: SecretStr = SecretStr(DEV_POSTGRES_PASSWORD)
    database_url: str | None = None
    db_pool_size: int = 5
    db_max_overflow: int = 10
    # Web frontend.
    cors_origins: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    @field_validator("database_url", mode="before")
    @classmethod
    def empty_database_url_to_none(cls, value: str | None) -> str | None:
        return None if value == "" else value
    @property
    def sqlalchemy_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        password = self.postgres_password.get_secret_value()
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )
    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


class JsonLogFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.fromtimestamp(record.created, timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for key, value in record.__dict__.items():
            if key not in LOG_RECORD_RESERVED and not key.startswith("_"):
                payload[key] = value
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        if record.stack_info:
            payload["stack"] = self.formatStack(record.stack_info)
        return json.dumps(payload, default=str, separators=(",", ":"))

@lru_cache
def get_settings() -> Settings:
    return Settings()

def configure_logging(
    level: str,
    *,
    log_format: str = "text",
    stream: TextIO | None = None,
) -> None:
    log_level = getattr(logging, level.upper(), logging.INFO)
    handler = logging.StreamHandler(stream or sys.stdout)
    if log_format.lower() == "json":
        handler.setFormatter(JsonLogFormatter())
    else:
        handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s"))
    handler.addFilter(RequestIdFilter())

    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(log_level)
