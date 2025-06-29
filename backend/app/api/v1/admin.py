from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from starlette.status import HTTP_400_BAD_REQUEST
from app.core.database import get_db
from app.models.Auction import Auction
from app.models.Bid import Bid
from app.models.User import User
from app.core.auth import get_current_user_id_from_token
from app.enums import UserRole
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.services.auction_service import AuctionService

class SetWinnerRequest(BaseModel):
    bid_id: str

class BidInfo(BaseModel):
    id: str
    user_id: str
    user_name: str
    bid_amount: float
    created_at: datetime
    note: Optional[str] = None
    address: Optional[str] = None
    is_winner: bool

class AuctionSummary(BaseModel):
    id: str
    title: str
    end_time: datetime
    total_bids: int
    has_winner: bool
    winner_name: Optional[str] = None
    approval_deadline: datetime
    can_approve: bool
    is_expired: bool

router = APIRouter()

def get_current_user(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id_from_token)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Admin: Chạy auto-approve cho các auction quá hạn
@router.post("/admin/auto-approve-expired")
def auto_approve_expired_auctions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Chỉ admin mới được truy cập
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="You don't have permission to access this endpoint!"
        )
    
    auto_approved_auctions = AuctionService.auto_approve_winners(db)
    
    return {
        "message": f"Auto-approved {len(auto_approved_auctions)} auctions",
        "auto_approved_auctions": auto_approved_auctions
    }

# Admin: Lấy danh sách các auction cần phê duyệt (có thời hạn)
@router.get("/admin/auctions/pending-winner", response_model=List[AuctionSummary])
def get_auctions_pending_winner(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Chỉ admin mới được truy cập
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="You don't have permission to access this endpoint!"
        )
    
    # Lấy các auction cần phê duyệt (đã kết thúc nhưng chưa quá 1 ngày)
    auctions_needing_approval = AuctionService.get_auctions_needing_approval(db)
    
    # Lấy các auction đã quá hạn phê duyệt
    expired_auctions = AuctionService.get_auctions_expired_approval(db)
    
    # Kết hợp cả hai danh sách
    all_ended_auctions = auctions_needing_approval + expired_auctions
    
    auction_summaries = []
    for auction in all_ended_auctions:
        # Đếm số bids
        total_bids = db.query(Bid).filter(Bid.auction_id == auction.id).count()
        
        # Kiểm tra có người trúng thầu chưa
        winner_bid = db.query(Bid).filter(
            Bid.auction_id == auction.id,
            Bid.is_winner == True
        ).first()
        
        winner_name = None
        if winner_bid:
            winner_user = db.query(User).filter(User.id == winner_bid.user_id).first()
            winner_name = winner_user.name if winner_user else "Unknown"
        
        # Tính thời hạn phê duyệt
        approval_deadline = AuctionService.get_approval_deadline(auction)
        
        # Kiểm tra trạng thái
        can_approve = AuctionService.can_admin_approve(auction)
        is_expired = auction in expired_auctions
        
        auction_summary = AuctionSummary(
            id=auction.id,
            title=auction.title,
            end_time=auction.end_time,
            total_bids=total_bids,
            has_winner=winner_bid is not None,
            winner_name=winner_name,
            approval_deadline=approval_deadline,
            can_approve=can_approve,
            is_expired=is_expired
        )
        auction_summaries.append(auction_summary)
    
    return auction_summaries

# Admin: Lấy danh sách tất cả bids của một auction
@router.get("/admin/auctions/{auction_id}/bids", response_model=List[BidInfo])
def get_auction_bids(
    auction_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Chỉ admin mới được xem danh sách bids
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="You don't have permission to view bids!"
        )
    
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    bids = db.query(Bid).filter(Bid.auction_id == auction_id).order_by(Bid.bid_amount.desc()).all()
    
    bid_infos = []
    for bid in bids:
        user = db.query(User).filter(User.id == bid.user_id).first()
        bid_info = BidInfo(
            id=bid.id,
            user_id=bid.user_id,
            user_name=user.name if user else "Unknown",
            bid_amount=float(bid.bid_amount),
            created_at=bid.created_at,
            note=bid.note,
            address=bid.address,
            is_winner=bid.is_winner
        )
        bid_infos.append(bid_info)
    
    return bid_infos

# Admin: Set người trúng thầu (có kiểm tra thời hạn)
@router.post("/admin/auctions/{auction_id}/set-winner")
def set_auction_winner(
    auction_id: str,
    request: SetWinnerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Chỉ admin mới được set người trúng thầu
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="You don't have permission to set winner!"
        )
    
    # Kiểm tra auction có tồn tại không
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    # Kiểm tra xem admin có thể phê duyệt không
    if not AuctionService.can_admin_approve(auction):
        approval_deadline = AuctionService.get_approval_deadline(auction)
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve this auction. Approval deadline was: {approval_deadline.strftime('%Y-%m-%d %H:%M:%S')}"
        )
    
    # Kiểm tra bid có tồn tại và thuộc về auction này không
    bid = db.query(Bid).filter(
        Bid.id == request.bid_id,
        Bid.auction_id == auction_id
    ).first()
    
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found for this auction")
    
    # Reset tất cả bids của auction này về is_winner = False
    db.query(Bid).filter(Bid.auction_id == auction_id).update({"is_winner": False})
    
    # Set bid được chọn thành winner
    bid.is_winner = True
    
    # Đánh dấu thời gian admin phê duyệt
    auction.admin_approved_at = datetime.now()
    
    db.commit()
    
    # Lấy thông tin người trúng thầu
    winner_user = db.query(User).filter(User.id == bid.user_id).first()
    
    return {
        "message": "Winner set successfully",
        "winner_bid_id": bid.id,
        "winner_user_id": bid.user_id,
        "winner_user_name": winner_user.name if winner_user else "Unknown",
        "winner_amount": float(bid.bid_amount),
        "approved_at": auction.admin_approved_at
    }

# Admin: Xóa người trúng thầu (reset về không có người trúng thầu)
@router.delete("/admin/auctions/{auction_id}/clear-winner")
def clear_auction_winner(
    auction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Chỉ admin mới được xóa người trúng thầu
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="You don't have permission to clear winner!"
        )
    
    # Kiểm tra auction có tồn tại không
    auction = db.query(Auction).filter(Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    # Kiểm tra xem admin có thể phê duyệt không
    if not AuctionService.can_admin_approve(auction):
        approval_deadline = AuctionService.get_approval_deadline(auction)
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Cannot modify this auction. Approval deadline was: {approval_deadline.strftime('%Y-%m-%d %H:%M:%S')}"
        )
    
    # Reset tất cả bids của auction này về is_winner = False
    db.query(Bid).filter(Bid.auction_id == auction_id).update({"is_winner": False})
    
    # Reset thời gian phê duyệt
    auction.admin_approved_at = None
    
    db.commit()
    
    return {
        "message": "Winner cleared successfully",
        "auction_id": auction_id
    } 