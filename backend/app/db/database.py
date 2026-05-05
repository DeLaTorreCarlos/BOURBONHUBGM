from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# In development, we use echo=True to see the generated SQL. 
# 'pool_pre_ping' ensures connections are valid before usage (especially helpful for production/Docker DBs).
engine = create_engine(
    settings.DATABASE_URL, 
    echo=(settings.ENVIRONMENT == "development"),
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()