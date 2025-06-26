from fastapi import APIRouter, Depends, Query, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.Auction import Auction
from typing import List, Dict, Any
from uuid import UUID
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
import os
from fastapi.responses import JSONResponse

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

class AuctionsWithTotalOut(BaseModel):
    auctions: List[AuctionOut]
    total_ongoing: int
    total_upcoming: int
    total_ended: int

class AuctionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    starting_price: float
    step_price: float
    image_url: Optional[str] = None
    file_exel: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: int

router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
UPLOAD_IMAGE_DIR = os.path.join(BASE_DIR, 'uploads', 'images')
UPLOAD_EXCEL_DIR = os.path.join(BASE_DIR, 'uploads', 'excels')

@router.get("/auctions", response_model=AuctionsWithTotalOut)
def get_auctions_by_status(
    status: int = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    db: Session = Depends(get_db)
):
    now = datetime.now()
    query = db.query(Auction)
    if status == 0:
        query = query.filter(Auction.start_time <= now, Auction.end_time > now)
    elif status == 1:
        query = query.filter(Auction.start_time > now)
    elif status == 2:
        query = query.filter(Auction.end_time < now)
    
    results = query.order_by(Auction.created_at.desc()).limit(4).all()

    # Tính tổng từng status
    total_ongoing = db.query(Auction).filter(Auction.start_time <= now, Auction.end_time > now).count()
    total_upcoming = db.query(Auction).filter(Auction.start_time > now).count()
    total_ended = db.query(Auction).filter(Auction.end_time < now).count()

    return {
        "auctions": results if results else [],
        "total_ongoing": total_ongoing,
        "total_upcoming": total_upcoming,
        "total_ended": total_ended
    }

@router.get("/auctions/{auction_id}", response_model=AuctionOut)
def get_auction_by_id(auction_id: str, db: Session = Depends(get_db)):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return auction

@router.post("/auctions", response_model=AuctionOut)
def create_auction(auction_in: AuctionCreate, db: Session = Depends(get_db)):
    auction = Auction(
        title=auction_in.title,
        description=auction_in.description,
        starting_price=auction_in.starting_price,
        step_price=auction_in.step_price,
        image_url=auction_in.image_url,
        file_exel=auction_in.file_exel,
        start_time=auction_in.start_time,
        end_time=auction_in.end_time,
        status=auction_in.status
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    return auction

@router.post("/upload/image")
def upload_image(file: UploadFile = File(...)):
    allowed_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    max_size = 5 * 1024 * 1024  # 5MB
    if not file.filename:
        return JSONResponse(status_code=400, content={"detail": "No filename provided"})
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        return JSONResponse(status_code=400, content={"detail": "Invalid image file type"})
    contents = file.file.read()
    if len(contents) > max_size:
        return JSONResponse(status_code=400, content={"detail": "Image file too large (max 5MB)"})
    if not os.path.exists(UPLOAD_IMAGE_DIR):
        os.makedirs(UPLOAD_IMAGE_DIR)
    file_location = os.path.join(UPLOAD_IMAGE_DIR, str(file.filename))
    with open(file_location, "wb") as f:
        f.write(contents)
    return {"image_url": f"/uploads/images/{file.filename}"}

@router.post("/upload/excel")
def upload_excel(file: UploadFile = File(...)):
    allowed_exts = {".xls", ".xlsx"}
    max_size = 10 * 1024 * 1024  # 10MB
    if not file.filename:
        return JSONResponse(status_code=400, content={"detail": "No filename provided"})
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        return JSONResponse(status_code=400, content={"detail": "Invalid excel file type"})
    contents = file.file.read()
    if len(contents) > max_size:
        return JSONResponse(status_code=400, content={"detail": "Excel file too large (max 10MB)"})
    if not os.path.exists(UPLOAD_EXCEL_DIR):
        os.makedirs(UPLOAD_EXCEL_DIR)
    file_location = os.path.join(UPLOAD_EXCEL_DIR, str(file.filename))
    with open(file_location, "wb") as f:
        f.write(contents)
    return {"file_excel": f"/uploads/excels/{file.filename}"}


 