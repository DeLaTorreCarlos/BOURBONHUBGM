from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import pyotp
import secrets
from app.db.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.logger import logger

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str
    totp_code: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class Verify2FARequest(BaseModel):
    user_id: int
    totp_code: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == request.username) | (User.full_name == request.username)
    ).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Enforce 2FA requirement
    if not user.is_2fa_enabled:
        return {"requires_2fa_setup": True, "user_id": user.id, "message": "2FA must be configured before logging in."}
    if not request.totp_code:
        # Tell frontend to prompt for 2FA
        return {"requires_2fa": True, "user_id": user.id, "message": "2FA code required."}
        
    totp = pyotp.TOTP(user.totp_secret)
    if not totp.verify(request.totp_code):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid 2FA code")
        
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "message": "Login successful", 
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "role": user.role, "full_name": user.full_name}
    }

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        # Simulated Email Sending
        logger.info(f"[SIMULATED EMAIL] Send reset token {reset_token} to {user.email}")
    
    # Always return success to prevent email enumeration
    return {"message": "If that email exists, a password reset link has been sent."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == request.token).first()
    
    # Note: timezone-naive datetime comparison needs caution, but we'll use utcnow
    if not user or not user.reset_token_expires or user.reset_token_expires.replace(tzinfo=None) < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user.hashed_password = get_password_hash(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password successfully reset."}

@router.post("/2fa/setup")
def setup_2fa(user_id: int, db: Session = Depends(get_db)):
    # Note: For production, user_id should be extracted from active JWT context (get_current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    secret = pyotp.random_base32()
    user.totp_secret = secret
    db.commit()
    
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="BourbonHub")
    
    # Return provisioning URI so frontend can generate QR code
    return {"secret": secret, "provisioning_uri": provisioning_uri}

@router.post("/2fa/verify")
def verify_2fa(request: Verify2FARequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user or not user.totp_secret:
        raise HTTPException(status_code=404, detail="User or 2FA setup not found")
        
    totp = pyotp.TOTP(user.totp_secret)
    if totp.verify(request.totp_code):
        user.is_2fa_enabled = True
        db.commit()
        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "message": "2FA successfully enabled.",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {"id": user.id, "email": user.email, "role": user.role, "full_name": user.full_name}
        }
        
    raise HTTPException(status_code=400, detail="Invalid 2FA code")