from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.user import User

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Very simple authentication for now based on the fake hashing in crud
    user = db.query(User).filter(
        (User.email == request.username) | (User.full_name == request.username)
    ).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Check password manually since crud/user.py uses naive "password" + "notreallyhashed"
    if user.hashed_password != request.password + "notreallyhashed":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    return {"message": "Login successful", "user": {"id": user.id, "email": user.email, "role": user.role}}
