import enum
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.User import User
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.core.config import  SECRET_KEY, ALGORITHM
from app.enums import UserRole
from app.i18n import _

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    role: str
    username: str
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    phone_number: str
    role: UserRole = UserRole.USER  # Mặc định role là user
    status: int = 1 #mặc định là active

class RefreshRequest(BaseModel):
    refresh_token: str

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=300)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
            
@router.post("/login", response_model=Token)
def login(request: Request, login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or user.password != login_data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=_("Incorrect email or password", request))
    if user.status != 1 and user:
        raise HTTPException(status_code=403, detail=_("User is inactive or banned", request))
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    refresh_token = create_refresh_token(data={"sub": user.email, "user_id": user.id})
    role = UserRole(user.role).name.lower()
    username= user.username
    email= user.email
    return {"access_token": access_token,"refresh_token": refresh_token, "token_type": "bearer", "role":role, "username":username, "email": email}

@router.post("/register", response_model=Token)
def register(request: Request, register_data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == register_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail=_("Account already registered", request))
    
    user = User(
        email=register_data.email,
        username = register_data.username,
        phone_number=register_data.phone_number,
        created_at=datetime.now(),
        password=register_data.password,
        role=register_data.role.value
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    refresh_token = create_refresh_token(data={"sub": user.email, "user_id": user.id})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": UserRole(user.role).name.lower(),
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number
    }

@router.post("/refresh-token")
def refresh_token(request: Request, refresh_data: RefreshRequest):
    try:
        payload = jwt.decode(refresh_data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail=_("Invalid refresh token", request))
        user_id = payload.get("user_id")
        email = payload.get("sub")
        new_access_token = create_access_token(data={"sub": email, "user_id": user_id})
        return {"access_token": new_access_token, "token_type": "bearer"}
    except JWTError:
        raise HTTPException(status_code=401, detail=_("Invalid refresh token", request))

    