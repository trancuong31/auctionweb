from sqlalchemy.orm import Session
from app.models.Auction import Auction
from app.models.Bid import Bid
from datetime import datetime, timedelta
from typing import List

class AuctionService:
    
    @staticmethod
    def auto_approve_winners(db: Session) -> List[str]:
        """
        Tự động phê duyệt người trúng thầu cho các auction đã quá hạn 1 ngày
        Returns: List of auction IDs that were auto-approved
        """
        now = datetime.now()
        one_day_ago = now - timedelta(days=1)
        
        # Lấy các auction đã kết thúc hơn 1 ngày và chưa được admin phê duyệt
        expired_auctions = db.query(Auction).filter(
            Auction.end_time < one_day_ago,
            Auction.admin_approved_at.is_(None)
        ).all()
        
        auto_approved_auctions = []
        
        for auction in expired_auctions:
            # Lấy bid cao nhất
            highest_bid = db.query(Bid).filter(
                Bid.auction_id == auction.id
            ).order_by(Bid.bid_amount.desc()).first()
            
            if highest_bid:
                # Reset tất cả bids về is_winner = False
                db.query(Bid).filter(Bid.auction_id == auction.id).update({"is_winner": False})
                
                # Set bid cao nhất thành winner
                highest_bid.is_winner = True
                
                # Đánh dấu đã được auto-approve
                auction.admin_approved_at = now
                
                auto_approved_auctions.append(auction.id)
        
        if auto_approved_auctions:
            db.commit()
        
        return auto_approved_auctions
    
    @staticmethod
    def get_auctions_needing_approval(db: Session) -> List[Auction]:
        """
        Lấy danh sách auction cần admin phê duyệt (đã kết thúc nhưng chưa quá 1 ngày)
        """
        now = datetime.now()
        one_day_ago = now - timedelta(days=1)
        
        return db.query(Auction).filter(
            Auction.end_time < now,
            Auction.end_time >= one_day_ago,
            Auction.admin_approved_at.is_(None)
        ).all()
    
    @staticmethod
    def get_auctions_expired_approval(db: Session) -> List[Auction]:
        """
        Lấy danh sách auction đã quá hạn phê duyệt (kết thúc hơn 1 ngày)
        """
        now = datetime.now()
        one_day_ago = now - timedelta(days=1)
        
        return db.query(Auction).filter(
            Auction.end_time < one_day_ago,
            Auction.admin_approved_at.is_(None)
        ).all()
    
    @staticmethod
    def can_admin_approve(auction: Auction) -> bool:
        """
        Kiểm tra xem admin có thể phê duyệt auction này không
        """
        now = datetime.now()
        one_day_ago = now - timedelta(days=1)
        
        # Admin có thể phê duyệt nếu:
        # 1. Auction đã kết thúc
        # 2. Chưa quá 1 ngày kể từ khi kết thúc
        # 3. Chưa được phê duyệt
        return (
            auction.end_time < now and
            auction.end_time >= one_day_ago and
            auction.admin_approved_at is None
        )
    
    @staticmethod
    def get_approval_deadline(auction: Auction) -> datetime:
        """
        Lấy thời hạn phê duyệt (1 ngày sau khi auction kết thúc)
        """
        return auction.end_time + timedelta(days=1) 