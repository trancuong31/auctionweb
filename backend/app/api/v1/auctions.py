from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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
def get_all_auctions(db: Session = Depends(get_db)):
    return db.query(Auction).all()
