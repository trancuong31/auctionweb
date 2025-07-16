from fastapi import APIRouter, Depends, Query, HTTPException, File, UploadFile, status, Request, Path
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
from sqlalchemy import func
from fastapi.responses import JSONResponse
from app.models.Bid import Bid
import json
from app.models.User import User
from app.core.auth import get_current_user_id_from_token
from app.enums import UserRole
from pydantic import field_validator
from zoneinfo import ZoneInfo
from fastapi import APIRouter
from app.i18n import _

router = APIRouter()
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
    winner_info: Optional[dict] = None
    # bids: Optional[List] = None  
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

class AuctionDetailOut(BaseModel):
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
    count_users: Optional[int] = None
    highest_amount: Optional[float] = None
    bids : Optional[List]

class AuctionsWithTotalOut(BaseModel):
    auctions: List[AuctionOut]
    total_ongoing: int
    total_upcoming: int
    total_ended: int

class AuctionCreate(BaseModel):
    title: str
    title_vi: Optional[str] = None
    title_ko: Optional[str] = None
    description: Optional[str] = None
    description_vi: Optional[str] = None
    description_ko: Optional[str] = None
    starting_price: float
    step_price: float
    image_url: Optional[List[str]] = None
    file_exel: Optional[str] = None
    start_time: datetime
    end_time: datetime
    # status: int

class AuctionSearchResponse(BaseModel):
    total: int
    auctions: List[AuctionOut]

class OverviewStats(BaseModel):
    total_user: int
    total_auction: int
    total_successful_auctions: int
    total_auction_in_progress: int
    total_unsuccessful_auctions: int
    total_upcoming_auctions: int

class AuctionUpdate(BaseModel):
    title: Optional[str] = None
    title_vi: Optional[str] = None
    title_ko: Optional[str] = None
    description: Optional[str] = None
    description_vi: Optional[str] = None
    description_ko: Optional[str] = None
    starting_price: Optional[float] = None
    step_price: Optional[float] = None
    image_url: Optional[List[str]] = None
    file_exel: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
UPLOAD_IMAGE_DIR = os.path.join(BASE_DIR, 'uploads', 'images')
UPLOAD_EXCEL_DIR = os.path.join(BASE_DIR, 'uploads', 'excels')

def get_current_user(request: Request, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id_from_token)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail=_("User not found", request))
    return user

#lấy ra ds các đấu giá
@router.get("/auctions", response_model=AuctionsWithTotalOut)
def get_auctions_by_status(
    request: Request,
    status: int = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    db: Session = Depends(get_db)
):
    lang = request.state.locale
    now = datetime.now()
    query = db.query(Auction)
    if status is not None and status not in [0, 1, 2]:
        raise HTTPException(status_code=400, detail=_("Invalid status value", request))
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
        # gán giá trị dựa them ngôn ngữ mà FE chọn
        if lang == "vi" and getattr(auction, "title_vi", None):
            data["title"] = auction.title_vi or auction.title
            data["description"] = auction.description_vi or auction.description
        elif lang == "ko" and getattr(auction, "title_ko", None):
            data["title"] = auction.title_ko or auction.title
            data["description"] = auction.description_ko or auction.description
        # Tính lại status động
        if now < auction.start_time:
            data["status"] = 1  # upcoming
        elif auction.start_time <= now < auction.end_time:
            data["status"] = 0  # ongoing
        else:
            data["status"] = 2  # ended

        # Thêm highest_amount nếu là phiên đã kết thúc
        if data["status"] == 2:
            # Ưu tiên lấy người trúng thầu (is_winner = true)
            winner_bid = db.query(Bid).filter(
                Bid.auction_id == auction.id,
                Bid.is_winner == True
            ).first()
            
            if winner_bid:
                # Hiển thị thông tin người trúng thầu
                winner_user = db.query(User).filter(User.id == winner_bid.user_id).first()
                data["winner_info"] = {
                    "bid_id": winner_bid.id,
                    "user_id": winner_bid.user_id,
                    "user_name": winner_user.username if winner_user else "Unknown",
                    "bid_amount": float(winner_bid.bid_amount),
                    "created_at": winner_bid.created_at
                }
                data["highest_amount"] = float(winner_bid.bid_amount)
            else:
                # Nếu chưa có người trúng thầu, lấy giá cao nhất trong số những người đấu giá hợp lệ
                min_valid_bid = float(auction.starting_price) + float(auction.step_price)
                highest_valid_bid = db.query(Bid).filter(
                    Bid.auction_id == auction.id,
                    Bid.bid_amount >= min_valid_bid
                ).order_by(Bid.bid_amount.desc()).first()
                
                try:
                    data["highest_amount"] = float(highest_valid_bid.bid_amount) if highest_valid_bid else None
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
def create_auction(
    request: Request,
    auction_in: AuctionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Chỉ admin hoặc super admin mới được tạo đấu giá
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=_("You don't have permission to create auction!", request)
        )
    auction = db.query(Auction).filter(Auction.title == auction_in.title).first()
    if auction:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=_("Auction title already exists", request)
        )
    """
    - status = 0 (ongoing): start_time <= now < end_time (đang diễn ra)
    - status = 1 (upcoming): start_time > now (sắp diễn ra)
    - status = 2 (ended): end_time <= now (đã kết thúc)
    """
    now = datetime.now(ZoneInfo("Asia/Ho_Chi_Minh"))
    status = 0
    if now > auction_in.start_time and auction_in.end_time:
        status =0
    elif now < auction_in.start_time:
        status = 1
    else:
        status = 2
    
    auction = Auction(
        title=auction_in.title,
        title_vi=auction_in.title_vi,
        title_ko=auction_in.title_ko,
        description=auction_in.description,
        description_vi=auction_in.description_vi,
        description_ko=auction_in.description_ko,
        starting_price=auction_in.starting_price,
        step_price=auction_in.step_price,
        image_url = json.dumps(auction_in.image_url) if auction_in.image_url else None,
        file_exel=auction_in.file_exel,
        start_time=auction_in.start_time,
        end_time=auction_in.end_time,
        status=status,
        created_by=current_user.id
        
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    auction_data = auction.__dict__.copy()
    auction_data['image_url'] = json.loads(auction.image_url) if auction.image_url else []
    return AuctionOut(**auction_data)

@router.put("/auctions/{auction_id}", response_model=AuctionOut)
def update_auction(
    request: Request,
    auction_id: str = Path(..., description="ID của auction cần sửa"),    
    auction_in: AuctionUpdate = ...,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail=_("Auction not found", request))

    # Kiểm tra quyền
    if current_user.role == UserRole.SUPER_ADMIN:
        pass  # Được phép sửa tất cả
    elif current_user.role == UserRole.ADMIN:
        if auction.created_by != current_user.id:
            raise HTTPException(status_code=403, detail=_("You are not allowed to edit this auction", request))
    else:
        raise HTTPException(status_code=403, detail=_("You are not allowed to edit auctions", request))

    # Cập nhật các trường
    update_data = auction_in.dict(exclude_unset=True)
    if "title" in update_data:
        existing = db.query(Auction).filter(Auction.title == update_data["title"], Auction.id != auction_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Auction title already exists")
    if "start_time" in update_data and "end_time" in update_data:
        if update_data["start_time"] >= update_data["end_time"]:
            raise HTTPException(status_code=400, detail="start_time must be before end_time")
    elif "start_time" in update_data:
        if auction.end_time and update_data["start_time"] >= auction.end_time:
            raise HTTPException(status_code=400, detail="start_time must be before end_time")
    elif "end_time" in update_data:
        if auction.start_time and auction.start_time >= update_data["end_time"]:
            raise HTTPException(status_code=400, detail="end_time must be after start_time")
    
    if "image_url" in update_data and update_data["image_url"] is not None:
        update_data["image_url"] = json.dumps(update_data["image_url"])
    for key, value in update_data.items():
        setattr(auction, key, value)

    db.commit()
    db.refresh(auction)
    auction_data = auction.__dict__.copy()
    auction_data['image_url'] = json.loads(auction.image_url) if auction.image_url else []
    return AuctionOut(**auction_data)


#admin upload ảnh khi thêm auction
@router.post("/upload/image")
def upload_image(request: Request, files: List[UploadFile] = File(...)):
    try:
        allowed_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        max_size = 5 * 1024 * 1024  # 5MB
        image_urls = []

        if not files:
            return JSONResponse(status_code=400, content={"detail": _("No files provided", request)})

        if not os.path.exists(UPLOAD_IMAGE_DIR):
            os.makedirs(UPLOAD_IMAGE_DIR)

        for file in files:
            if not file.filename or not isinstance(file.filename, str):
                return JSONResponse(status_code=400, content={"detail": _("Invalid file name.", request)})
            ext = os.path.splitext(file.filename)[1].lower()
            if ext not in allowed_exts:
                return JSONResponse(
                    status_code=400,
                    content={"detail": _("Invalid image file type: ", request) + file.filename}
                )
            contents = file.file.read()
            if len(contents) > max_size:
                return JSONResponse(
                    status_code=400,
                    content={"detail": _("Image file too large (max 5MB): ", request) + file.filename}
                )

            # Xử lý trùng tên file
            base_name, ext = os.path.splitext(file.filename)
            file_location = os.path.join(UPLOAD_IMAGE_DIR, f"{base_name}{ext}")
            counter = 1
            while os.path.exists(file_location):
                new_filename = f"{base_name}_{counter}{ext}"
                file_location = os.path.join(UPLOAD_IMAGE_DIR, new_filename)
                counter += 1

            with open(file_location, "wb") as f_out:
                f_out.write(contents)
            saved_filename = os.path.basename(file_location)
            image_urls.append(f"/uploads/images/{saved_filename}")
            total_length = sum(len(url) for url in image_urls)
            if total_length > 500:
                return JSONResponse(
                    status_code=400,
                    content={"detail": _("Total image URLs length too long (max 500 chars): ", request) + str(image_urls)}
                )
        return {"image_urls": image_urls}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": _("Internal server error: ", request) + str(e)})

#admin upload excel khi thêm auction
@router.post("/upload/excel")
def upload_excel(request: Request, file: UploadFile = File(...)):
    allowed_exts = {".xls", ".xlsx"}
    max_size = 10 * 1024 * 1024  # 10MB
    if not file.filename:
        return JSONResponse(status_code=400, content={"detail": _("No filename provided", request)})
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        return JSONResponse(status_code=400, content={"detail": _("Invalid excel file type", request)})
    contents = file.file.read()
    if len(contents) > max_size:
        return JSONResponse(status_code=400, content={"detail": _("Excel file too large (max 10MB)", request)})
    if not os.path.exists(UPLOAD_EXCEL_DIR):
        os.makedirs(UPLOAD_EXCEL_DIR)
    
    # Xử lý trùng tên file
    base_name, ext = os.path.splitext(file.filename)
    file_location = os.path.join(UPLOAD_EXCEL_DIR, file.filename)
    counter = 1
    while os.path.exists(file_location):
        new_filename = f"{base_name}_{counter}{ext}"
        file_location = os.path.join(UPLOAD_EXCEL_DIR, new_filename)
        counter += 1

    try:
        with open(file_location, "wb") as f:
            f.write(contents)
        saved_filename = os.path.basename(file_location)
        return {"file_excel": f"/uploads/excels/{saved_filename}"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": _("Internal server error: ", request) + str(e)})

#user down excel auction_id
@router.get("/download/excel/by-auction/{auction_id}")
def download_excel_by_auction(request: Request, auction_id: str, db: Session = Depends(get_db)):
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction or not auction.file_exel:
        raise HTTPException(status_code=404, detail=_("Auction or file not found", request))
    #auction.file_exel là '/uploads/excels/auction_xe_123.xlsx'
    # lấy filename = 'auction_xe_123.xlsx'
    filename = os.path.basename(auction.file_exel)
    # Tạo đường dẫn thực tới file
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
    file_path = os.path.join(BASE_DIR, 'uploads', 'excels', filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=_("File not found on server", request))

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

@router.get("/auctions/search", response_model=AuctionSearchResponse)
def search_auctions(
    request: Request,
    status: Optional[int] = Query(None, description="0: ongoing, 1: upcoming, 2: ended"),
    title: Optional[str] = Query(None, description="Tìm kiếm theo title auction"),
    sort_by: Optional[str] = Query("created_at", description="Sắp xếp theo: title, created_at, start_time, end_time"),
    sort_order: Optional[str] = Query("desc", description="Thứ tự sắp xếp: asc (A-Z), desc (Z-A)"),
    page: int = Query(1, ge=1, description="Số trang"),
    page_size: int = Query(8, ge=1, le=100, description="Số item trên mỗi trang"),
    start_time: datetime = Query(None, description="Từ ngày"),
    end_time: datetime = Query(None, description="Đến ngày"),    
    db: Session = Depends(get_db)
):

    """
    API tìm kiếm auction với các filter:
    - status: lọc theo trạng thái (0: đang diễn ra, 1: sắp diễn ra, 2: đã kết thúc)
    - title: tìm kiếm theo title auction
    - sort_by: sắp xếp theo trường (title, created_at, start_time, end_time)
    - sort_order: thứ tự sắp xếp (asc: A-Z, desc: Z-A)
    - page: số trang( ví dụ trang 1,2,3,4,5)
    - page_size: số item trên mỗi trang(8)
    
    Điều kiện xác định trạng thái:
    - status = 0 (ongoing): start_time <= now < end_time (đang diễn ra)
    - status = 1 (upcoming): start_time > now (sắp diễn ra)
    - status = 2 (ended): end_time <= now (đã kết thúc)
    """
    now = datetime.now()
    query = db.query(Auction)
    lang = request.state.locale
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
            query = query.filter(Auction.end_time <= now)
    
    # Filter theo tên (tìm kiếm không phân biệt hoa thường)
    if title:
        query = query.filter(Auction.title.ilike(f"%{title}%"))
    # Lọc từ ngày bắt đầu và kết thúc trong khoảng time đó có các auction thì truy vấn ra
    if start_time and end_time:
        query = query.filter(
            Auction.end_time >= start_time,
            Auction.start_time <= end_time
        )
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

    # Phân trang
    offset = (page - 1) * page_size
    results = query.offset(offset).limit(page_size).all()

    auctions_out = []
    
    for auction in results:
        data = AuctionOut.from_orm(auction).model_dump()
        #xử lý đa ngôn ngữ cho trường title và description
        if lang == "vi" and getattr(auction, "title_vi", None):
            data["title"] = auction.title_vi or auction.title
            data["description"] = auction.description_vi or auction.description
        elif lang == "ko" and getattr(auction, "title_ko", None):
            data["title"] = auction.title_ko or auction.title
            data["description"] = auction.description_ko or auction.description
        # Xử lý image_url lưu dưới dạng JSON string
        raw_image = getattr(auction, "image_url", None)
        if isinstance(raw_image, str):
            try:
                data["image_url"] = json.loads(raw_image)
            except Exception:
                data["image_url"] = []
        else:
            data["image_url"] = []

        # Tính lại status động
        if now < auction.start_time:
            data["status"] = 1  # upcoming
        elif auction.start_time <= now < auction.end_time:
            data["status"] = 0  # ongoing
        else:
            data["status"] = 2  # ended

        # Thêm highest_amount nếu là phiên đã kết thúc
        if data["status"] == 2:
            # Ưu tiên lấy người trúng thầu (is_winner = true)
            winner_bid = db.query(Bid).filter(
                Bid.auction_id == auction.id,
                Bid.is_winner == True
            ).first()
            
            if winner_bid:
                # Hiển thị thông tin người trúng thầu
                winner_user = db.query(User).filter(User.id == winner_bid.user_id).first()
                data["winner_info"] = {
                    "bid_id": winner_bid.id,
                    "user_id": winner_bid.user_id,
                    "user_name": winner_user.username if winner_user else "Unknown",
                    "bid_amount": float(winner_bid.bid_amount),
                    "created_at": winner_bid.created_at
                }
                data["highest_amount"] = float(winner_bid.bid_amount)
            else:
                # Nếu chưa có người trúng thầu, lấy giá cao nhất trong số những người đấu giá hợp lệ
                min_valid_bid = float(auction.starting_price) + float(auction.step_price)
                highest_valid_bid = db.query(Bid).filter(
                    Bid.auction_id == auction.id,
                    Bid.bid_amount >= min_valid_bid
                ).order_by(Bid.bid_amount.desc()).first()
                
                try:
                    data["highest_amount"] = float(highest_valid_bid.bid_amount) if highest_valid_bid else None
                except Exception:
                    data["highest_amount"] = None

        auctions_out.append(AuctionOut(**data))
    total = query.order_by(None).count()
    return {
        "total": total,
        "auctions": auctions_out
    }

#lấy ra đấu giá chi tiết gồm các user đã đấu giá theo auction_id
@router.get("/auctions/{auction_id}", response_model=AuctionDetailOut)
def get_auction_by_id(request:Request ,auction_id: str, db: Session = Depends(get_db)):
    lang = request.state.locale
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail=_("Auction not found", request))
    
    auction_data = AuctionOut.from_orm(auction).model_dump()
    #xử lý đa ngôn ngữ cho trường title và description
    if lang == "vi" and getattr(auction, "title_vi", None):
        auction_data["title"] = auction.title_vi or auction.title
        auction_data["description"] = auction.description_vi or auction.description
    elif lang == "ko" and getattr(auction, "title_ko", None):
        auction_data["title"] = auction.title_ko or auction.title
        auction_data["description"] = auction.description_ko or auction.description
    # Xử lý image_url
    if isinstance(auction.image_url, str):
        try:
            auction_data["image_url"] = json.loads(auction.image_url)
        except Exception:
            auction_data["image_url"] = []
    else:
        auction_data["image_url"] = []
    
    # Tính lại status động
    now = datetime.now()
    if now < auction.start_time:
        auction_data["status"] = 1  # upcoming
    elif auction.start_time <= now < auction.end_time:
        auction_data["status"] = 0  # ongoing
    else:
        auction_data["status"] = 2  # ended

    highest_bid = db.query(Bid).filter(
        Bid.auction_id == auction_id
    ).order_by(Bid.bid_amount.desc()).first()
    auction_data["highest_amount"] = float(highest_bid.bid_amount) if highest_bid else None

    bids = db.query(Bid).filter(Bid.auction_id == auction_id).order_by(Bid.bid_amount.desc()).all()
    bid_list = []
    for bid in bids:
        user = db.query(User).filter(User.id == bid.user_id).first()
        bid_list.append({
            "id": bid.id,
            "user_id": bid.user_id,
            "email": user.email,
            "user_name": user.username if user else "Unknown",
            "bid_amount": float(bid.bid_amount),
            "created_at": bid.created_at,
            "note": bid.note,
            "address": bid.address,
            "is_winner": bid.is_winner
        })
    if auction_data["status"] in [0, 2]:
        count_users = db.query(Bid.user_id).filter(Bid.auction_id == auction_id).distinct().count()
        auction_data["count_users"] = count_users
    else:
        auction_data["count_users"] = None
    auction_data["bids"] = bid_list

    return auction_data


@router.get("/overview", response_model=OverviewStats)
def get_overview_stats(db: Session = Depends(get_db)):
    now = datetime.now()

    # Tổng số user
    total_user = db.query(func.count(User.id)).scalar()

    # Tổng số phiên đấu giá
    total_auction = db.query(func.count(Auction.id)).scalar()

    # Tổng số phiên đấu giá đang diễn ra
    total_auction_in_progress = db.query(Auction).filter(
        Auction.start_time <= now, Auction.end_time > now
    ).count()

    # Tổng số phiên đấu giá thành công
    total_successful_auctions = db.query(Auction).filter(
        Auction.end_time < now,
        db.query(Bid).filter(
            Bid.auction_id == Auction.id,
            Bid.is_winner == 1
        ).exists()
    ).count()
    # Tổng phiên đấu giá chưa diễn ra
    total_upcoming_auctions = db.query(Auction).filter(Auction.start_time > now).count()
    # Tổng số phiên đấu giá thất bại
    total_unsuccessful_auctions = db.query(Auction).filter(
        Auction.end_time < now,
        ~db.query(Bid).filter(
            Bid.auction_id == Auction.id,
            Bid.is_winner == 1
        ).exists()
    ).count()

    return {
        "total_user": total_user,
        "total_auction": total_auction,
        "total_successful_auctions": total_successful_auctions,
        "total_auction_in_progress": total_auction_in_progress,
        "total_unsuccessful_auctions": total_unsuccessful_auctions,
        "total_upcoming_auctions": total_upcoming_auctions
    }

    
