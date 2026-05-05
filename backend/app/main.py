from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import users
from app.db.database import engine, Base
from app.core.config import settings
from app.core.logger import logger

# Create all database tables based on our SQLAlchemy models
# Note: In a production environment, you should use 'Alembic' for database migrations instead of create_all()
Base.metadata.create_all(bind=engine)
logger.info("Database tables verified.")

app = FastAPI(
    title="BourbonHub API",
    description="Backend Service for the BourbonHub Marketing App",
    version="1.0.0"
)

# Set up CORS for integration with the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint to verify server is running & check environment
@app.get("/")
def root():
    logger.info("Root endpoint was accessed.")
    return {
        "status": "online",
        "environment": settings.ENVIRONMENT,
        "message": "Welcome to the BourbonHub API"
    }

# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])

from app.api.endpoints import auth
app.include_router(auth.router, prefix="/auth", tags=["Auth"])