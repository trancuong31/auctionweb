from email import message
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.Bid import Bid
from app.models.Auction import Auction
from app.models.User import User
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.core.auth import get_current_user_id_from_token
from app.models.Notification import Notification
from app.i18n import _


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
def create_bid(
    request: Request,
    bid_in: BidCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id_from_token)
):
    auction = db.query(Auction).filter(Auction.id == bid_in.auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail=_("Auction not found", request))
    now = datetime.now()
    if auction.start_time > now or auction.end_time < now:
        raise HTTPException(status_code=400, detail=_("Auction is not active", request))
    user = db.query(User).filter(User.id == user_id, User.status == 1).first()
    if not user:
        raise HTTPException(status_code=403, detail=_("User not allowed to bid", request))
    
    if float(bid_in.bid_amount) < float(auction.starting_price):
        raise HTTPException(
            status_code=400,
            detail=_("Bid amount must be at least the starting price", request)
        )
    # Kiểm tra user đã đặt bid cho auction này chưa 
    existing_bid = db.query(Bid).filter(Bid.auction_id == bid_in.auction_id, Bid.user_id == user_id).first()
    if existing_bid:
        db.delete(existing_bid)
        db.commit()
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

    message = "You have successfully placed a bid of  {bid_in_bid_amount:,.0f}$ on auction {auction_title}.".format(
        bid_in_bid_amount=bid_in.bid_amount,
        auction_title=auction.title
    )
    message_vi = "Bạn đã đặt giá thầu thành công {bid_in_bid_amount:,.0f}$ của {auction_title}.".format(
        bid_in_bid_amount=bid_in.bid_amount,
        auction_title=auction.title
    )
    message_ko = "{auction_title} 경매에 {bid_in_bid_amount:,.0f}$의 입찰을 성공적으로 완료하였습니다.".format(
        bid_in_bid_amount=bid_in.bid_amount,
        auction_title=auction.title
    )
    notification = Notification(
        user_id=user_id,
        auction_id = bid_in.auction_id,
        message=message,
        message_vi=message_vi,
        message_ko=message_ko,
        created_at=datetime.now(),
        is_read=False
    )
    db.add(notification)
    db.commit()
    return bid
