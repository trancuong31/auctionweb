from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.Auction import Auction
from typing import List
from uuid import UUID
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class AuctionOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    starting_price: float
    step_price: float
    image_url: Optional[str]
    file_exel: Optional[str]
    start_time: datetime
    end_time: datetime
    created_at: datetime
    status: int

    class Config:
        # orm_mode = True
        from_attributes = True

router = APIRouter()

@router.get("/auctions", response_model=List[AuctionOut])
def get_auctions_by_status(
    status: int = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    query = db.query(Auction)
    if status == 0:
        query = query.filter(Auction.start_time <= now, Auction.end_time > now)
    elif status == 1:
        query = query.filter(Auction.start_time > now)
    elif status == 2:
        query = query.filter(Auction.end_time < now)
    
    results = query.all()
    return results if results else []

@router.get("/auctions/{auction_id}", response_model=AuctionOut)
def get_auction_by_id(auction_id: str, db: Session = Depends(get_db)):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return auction


 