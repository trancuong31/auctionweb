from fastapi import APIRouter, Depends, Query, HTTPException, File, UploadFile, status
from sqlalchemy.orm import Session
from starlette.status import HTTP_400_BAD_REQUEST
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
    winner_info: Optional[Dict] = None  # Thông tin người trúng thầu
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

class AuctionSearchResponse(BaseModel):
    total: int
    auctions: List[AuctionOut]

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

#tạo đấu giá
@router.post("/auctions", response_model=AuctionOut)
def create_auction(auction_in: AuctionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # chỉ admin mới được add đấu giá
    if current_user.role != UserRole.ADMIN :
        raise HTTPException(
            status_code = HTTP_400_BAD_REQUEST,
            detail="You don't have permison create auction!"
        )
    auction = db.query(Auction.title == auction_in).first()
    if auction :
        raise HTTPException(
            status_code= HTTP_400_BAD_REQUEST,
            detail= "Auction title already exists"
        )
    """
    - status = 0 (ongoing): start_time <= now < end_time (đang diễn ra)
    - status = 1 (upcoming): start_time > now (sắp diễn ra)
    - status = 2 (ended): end_time <= now (đã kết thúc)
    """
    now = datetime.now()
    status = 0
    if now > auction_in.start_time and auction_in.end_time:
        status =0
    elif now < auction_in.start_time:
        status = 1
    else:
        status = 2
    
    auction = Auction(
        title=auction_in.title,
        description=auction_in.description,
        starting_price=auction_in.starting_price,
        step_price=auction_in.step_price,
        image_url = json.dumps(auction_in.image_url) if auction_in.image_url else None,
        file_exel=auction_in.file_exel,
        start_time=auction_in.start_time,
        end_time=auction_in.end_time,
        status=status
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

@router.get("/auctions/search", response_model=AuctionSearchResponse)
def search_auctions(
    status: Optional[int] = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    title: Optional[str] = Query(None, description="Tìm kiếm theo tên auction"),
    sort_by: Optional[str] = Query("created_at", description="Sắp xếp theo: title, created_at, start_time, end_time"),
    sort_order: Optional[str] = Query("desc", description="Thứ tự sắp xếp: asc (A-Z), desc (Z-A)"),
    page: int = Query(1, ge=1, description="Số trang"),
    page_size: int = Query(4, ge=1, le=100, description="Số item trên mỗi trang"),
    db: Session = Depends(get_db)
):
    """
    API tìm kiếm auction với các filter:
    - status: lọc theo trạng thái (0: đang diễn ra, 1: sắp diễn ra, 2: đã kết thúc)
    - title: tìm kiếm theo title auction
    - sort_by: sắp xếp theo trường (title, created_at, start_time, end_time)
    - sort_order: thứ tự sắp xếp (asc: A-Z, desc: Z-A)
    - page: số trang( ví dụ trang 1 ,2,3,4,5)
    - page_size: số item trên mỗi trang(8)
    
    Điều kiện xác định trạng thái:
    - status = 0 (ongoing): start_time <= now < end_time (đang diễn ra)
    - status = 1 (upcoming): start_time > now (sắp diễn ra)
    - status = 2 (ended): end_time <= now (đã kết thúc)
    """
    now = datetime.now()
    query = db.query(Auction)

    # Filter theo trạng thái - phân tích trực tiếp điều kiện thời gian
    if status is not None:
        if status == 0:  # ongoing - đang diễn ra
            # Điều kiện: start_time <= now < end_time
            query = query.filter(Auction.start_time <= now, Auction.end_time > now)
        elif status == 1:  # upcoming - sắp diễn ra
            # Điều kiện: start_time > now
            query = query.filter(Auction.start_time > now)
        elif status == 2:  # ended - đã kết thúc
            # Điều kiện: end_time <= now
            query = query.filter(Auction.end_time < now)

    # Filter theo tên (tìm kiếm không phân biệt hoa thường)
    if title:
        query = query.filter(Auction.title.ilike(f"%{title}%"))

    # Sắp xếp
    if sort_by == "title":
        if sort_order.lower() == "asc":
            query = query.order_by(Auction.title.asc())
        else:
            query = query.order_by(Auction.title.desc())
    elif sort_by == "start_time":
        if sort_order.lower() == "asc":
            query = query.order_by(Auction.start_time.asc())
        else:
            query = query.order_by(Auction.start_time.desc())
    elif sort_by == "end_time":
        if sort_order.lower() == "asc":
            query = query.order_by(Auction.end_time.asc())
        else:
            query = query.order_by(Auction.end_time.desc())
    else:  # default sort by created_at
        if sort_order.lower() == "asc":
            query = query.order_by(Auction.created_at.asc())
        else:
            query = query.order_by(Auction.created_at.desc())
    total_count = query.count()

    # Kiểm tra nếu không tìm thấy kết quả nào
    if total_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Auction not found"
        )

    # Phân trang
    offset = (page - 1) * page_size
    results = query.offset(offset).limit(page_size).all()

    auctions_out = []

    for auction in results:
        data = AuctionOut.from_orm(auction).model_dump()

        # Xử lý image_url lưu dưới dạng JSON string
        raw_image = getattr(auction, "image_url", None)
        if isinstance(raw_image, str):
            try:
                data["image_url"] = json.loads(raw_image)
            except Exception:
                data["image_url"] = []
        else:
            data["image_url"] = []

        # Thêm highest_amount nếu là phiên đã kết thúc
        # Phân tích trực tiếp điều kiện: end_time <= now
        if auction.end_time < now:
            highest_bid = db.query(Bid).filter(
                Bid.auction_id == auction.id
            ).order_by(Bid.bid_amount.desc()).first()

            try:
                data["highest_amount"] = float(highest_bid.bid_amount) if highest_bid else None
            except Exception:
                data["highest_amount"] = None

        auctions_out.append(AuctionOut(**data))

    return {
        "total": total_count,
        "auctions": auctions_out
    }

#lấy ra đấu giá theo auction_id
@router.get("/auctions/{auction_id}", response_model=AuctionOut)
def get_auction_by_id(auction_id: str, db: Session = Depends(get_db)):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    # Thêm thông tin người trúng thầu nếu có
    winner_bid = db.query(Bid).filter(
        Bid.auction_id == auction_id,
        Bid.is_winner == True
    ).first()
    
    auction_data = AuctionOut.from_orm(auction).model_dump()
    
    # Xử lý image_url
    if isinstance(auction.image_url, str):
        try:
            auction_data["image_url"] = json.loads(auction.image_url)
        except Exception:
            auction_data["image_url"] = []
    else:
        auction_data["image_url"] = []
    
    # Thêm thông tin người trúng thầu
    if winner_bid:
        winner_user = db.query(User).filter(User.id == winner_bid.user_id).first()
        auction_data["winner_info"] = {
            "bid_id": winner_bid.id,
            "user_id": winner_bid.user_id,
            "user_name": winner_user.name if winner_user else "Unknown",
            "bid_amount": float(winner_bid.bid_amount),
            "created_at": winner_bid.created_at
        }
    
    return AuctionOut(**auction_data)
