from fastapi import APIRouter, Depends, Query, HTTPException, File, UploadFile, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.Auction import Auction
from typing import List, Dict, Any
from fastapi.responses import FileResponse
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
import os
from fastapi.responses import JSONResponse
from app.models.Bid import Bid
from app.enums import OrderStatus
from decimal import Decimal
import json
from app.models.User import User
from app.core.auth import get_current_user_id_from_token
from app.enums import UserRole
from pydantic import field_validator

class AuctionOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    starting_price: float
    step_price: float
    image_url: Optional[List[str]] = None
    file_exel: Optional[str]
    start_time: datetime
    end_time: datetime
    created_at: datetime
    status: int
    highest_amount: Optional[float] = None
    @field_validator("image_url", mode="before")
    @classmethod
    def parse_image_url(cls, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return []
        return value
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
    image_url: Optional[List[str]] = None
    file_exel: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: int

router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
UPLOAD_IMAGE_DIR = os.path.join(BASE_DIR, 'uploads', 'images')
UPLOAD_EXCEL_DIR = os.path.join(BASE_DIR, 'uploads', 'excels')

def get_current_user(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id_from_token)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

#lấy ra ds các đấu giá
@router.get("/auctions", response_model=AuctionsWithTotalOut)
def get_auctions_by_status(
    status: int = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    db: Session = Depends(get_db)
):
    now = datetime.now()
    query = db.query(Auction)

    # Filter theo trạng thái
    if status == 0:
        query = query.filter(Auction.start_time <= now, Auction.end_time > now)
    elif status == 1:
        query = query.filter(Auction.start_time > now)
    elif status == 2:
        query = query.filter(Auction.end_time < now)

    # Lấy tối đa 4 kết quả mới nhất
    results = query.order_by(Auction.created_at.desc()).limit(4).all()

    auctions_out = []

    for auction in results:
        data = AuctionOut.from_orm(auction).model_dump()

        # Xử lý image_url nếu lưu dưới dạng JSON string
        raw_image = getattr(auction, "image_url", None)
        if isinstance(raw_image, str):
            try:
                data["image_url"] = json.loads(raw_image)
            except Exception:
                data["image_url"] = []
        else:
            data["image_url"] = []

        # Thêm highest_amount nếu là phiên đã kết thúc
        if status == 2:
            highest_bid = db.query(Bid).filter(
                Bid.auction_id == auction.id
            ).order_by(Bid.bid_amount.desc()).first()

            try:
                data["highest_amount"] = float(highest_bid.bid_amount) if highest_bid else None
            except Exception:
                data["highest_amount"] = None

        auctions_out.append(AuctionOut(**data))

    # Tính tổng số phiên theo từng trạng thái
    total_ongoing = db.query(Auction).filter(Auction.start_time <= now, Auction.end_time > now).count()
    total_upcoming = db.query(Auction).filter(Auction.start_time > now).count()
    total_ended = db.query(Auction).filter(Auction.end_time < now).count()

    return {
        "auctions": auctions_out,
        "total_ongoing": total_ongoing,
        "total_upcoming": total_upcoming,
        "total_ended": total_ended
    }
#lấy ra đấu giá theo auction_id
@router.get("/auctions/{auction_id}", response_model=AuctionOut)
def get_auction_by_id(auction_id: str, db: Session = Depends(get_db)):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return auction

#tạo đấu giá
@router.post("/auctions", response_model=AuctionOut)
def create_auction(auction_in: AuctionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # chỉ admin mới được add đấu giá
    if current_user.role != UserRole.ADMIN :
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permison create auction!"
        )
    
    auction = Auction(
        title=auction_in.title,
        description=auction_in.description,
        starting_price=auction_in.starting_price,
        step_price=auction_in.step_price,
        image_url = json.dumps(auction_in.image_url) if auction_in.image_url else None,
        file_exel=auction_in.file_exel,
        start_time=auction_in.start_time,
        end_time=auction_in.end_time,
        status=auction_in.status
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    auction_data = auction.__dict__.copy()
    auction_data['image_url'] = json.loads(auction.image_url) if auction.image_url else []
    return AuctionOut(**auction_data)

#admin upload ảnh khi thêm auction
@router.post("/upload/image")
def upload_image(files: List[UploadFile] = File(...)):
    
    allowed_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    max_size = 5 * 1024 * 1024  # 5MB
    image_urls = []

    if not files:
        return JSONResponse(status_code=400, content={"detail": "No files provided"})

    if not os.path.exists(UPLOAD_IMAGE_DIR):
        os.makedirs(UPLOAD_IMAGE_DIR)

    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_exts:
            return JSONResponse(status_code=400, content={"detail": f"Invalid image file type: {file.filename}"})
        contents = file.file.read()
        if len(contents) > max_size:
            return JSONResponse(status_code=400, content={"detail": f"Image file too large (max 5MB): {file.filename}"})
        file_location = os.path.join(UPLOAD_IMAGE_DIR, file.filename)
        with open(file_location, "wb") as f:
            f.write(contents)
        image_urls.append(f"/uploads/images/{file.filename}")

    return {"image_urls": image_urls}

#admin upload excel khi thêm auction
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

#user down excel auction_id
@router.get("/download/excel/by-auction/{auction_id}")
def download_excel_by_auction(auction_id: str, db: Session = Depends(get_db)):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction or not auction.file_exel:
        raise HTTPException(status_code=404, detail="Auction or file not found")

    #auction.file_exel là '/uploads/excels/auction_xe_123.xlsx'
    # lấy filename = 'auction_xe_123.xlsx'
    filename = os.path.basename(auction.file_exel)
    # Tạo đường dẫn thực tới file
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
    file_path = os.path.join(BASE_DIR, 'uploads', 'excels', filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
 