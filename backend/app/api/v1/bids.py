from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
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

import uuid

router = APIRouter()

class BidCreate(BaseModel):
    auction_id: str
    bid_amount: float
    address: Optional[str] = None
    note: Optional[str] = None

class BidOut(BaseModel):
    id: str
    auction_id: str
    user_id: str
    bid_amount: float
    created_at: datetime
    address: Optional[str] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True


@router.post("/bids", response_model=BidOut)
def create_bid(bid_in: BidCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id_from_token)):

    auction = db.query(Auction).filter(Auction.id == bid_in.auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    now = datetime.now()
    if auction.start_time > now or auction.end_time < now:
        raise HTTPException(status_code=400, detail="Auction is not active")
    user = db.query(User).filter(User.id == user_id, User.status == 1).first()
    if not user:
        raise HTTPException(status_code=403, detail="User not allowed to bid")
    highest_bid = db.query(Bid).filter(Bid.auction_id == bid_in.auction_id).order_by(Bid.bid_amount.desc()).first()
    min_bid = float(getattr(auction, 'starting_price', 0))
    if highest_bid:
        min_bid = float(getattr(highest_bid, 'bid_amount', 0)) + float(getattr(auction, 'step_price', 0))
    if float(bid_in.bid_amount) < min_bid:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Bid amount is invalid. "
                f"Your bid must be at least {min_bid:,.0f}$ "
                f"(which is the current highest bid plus the step price)."
            )
        )
    # Kiểm tra user đã đặt bid cho auction này chưa
    existing_bid = db.query(Bid).filter(Bid.auction_id == bid_in.auction_id, Bid.user_id == user_id).first()
    if existing_bid:
        raise HTTPException(status_code=400, detail="User has already placed a bid for this auction")
    bid = Bid(
        auction_id=bid_in.auction_id,
        user_id=user_id,
        bid_amount=bid_in.bid_amount,
        created_at=datetime.now(),
        address=bid_in.address,
        note=bid_in.note
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)
    return bid
