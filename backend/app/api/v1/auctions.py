from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, session
from app.core.database import get_db
from app.models.Auction import Auction
from typing import List

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
        orm_mode = True

router = APIRouter()

@router.get("/auctions", response_model=List[AuctionOut])
def get_auctions_by_status(
    status: int = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    query = db.query(Auction)
    if status == 0:  # Ongoing
        query = query.filter(Auction.start_time <= now, Auction.end_time > now)
    elif status == 1:  # Upcoming
        query = query.filter(Auction.start_time > now)
    elif status == 2:  # Ended
        query = query.filter(Auction.end_time < now)
    return query.all()

 