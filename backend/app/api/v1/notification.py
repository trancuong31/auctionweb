from email import message
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import user
from app.core.database import get_db
from app.models.Bid import Bid
from app.models.Auction import Auction
from app.models.User import User
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from jose import jwt, JWTError
from app.core.config import SECRET_KEY, ALGORITHM
from app.core.auth import get_current_user_id_from_token
from app.models.Notification import Notification
import uuid

router = APIRouter()

class NotificationOut(BaseModel):
    id: str
    user_id: str
    auction_id:str
    message:str
    is_read:bool
    created_at:datetime

class Notification_read(BaseModel):
    is_read:bool

@router.get("/notifications", response_model=list[NotificationOut])
def get_notifications(
    db: Session = Depends(get_db), 
    user_id: str = Depends(get_current_user_id_from_token)
    ):
    notifications = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    return notifications

@router.post("/set_read")
def set_read_notification(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id_from_token),
    data: Notification_read = None
    ):
    notifications = db.query(Notification).filter(Notification.user_id == user_id).all()
    
    for notification in notifications:
        notification.is_read = True
    
    db.commit()
    return {"message": "Set read successful!"}
 