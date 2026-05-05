from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DATABASE_URL: str
    FRONTEND_URL: str = "http://localhost:3000" # Default for local Next.js
    
    class Config:
        env_file = ".env"
        # Avoid warnings about extra env vars finding their way in
        extra = "ignore"

settings = Settings()