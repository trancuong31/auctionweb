import asyncio
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auction_service import AuctionService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

async def auto_approve_expired_auctions_task():
    """
    Background task để tự động phê duyệt người trúng thầu cho các auction quá hạn
    Chạy mỗi giờ một lần
    """
    while True:
        try:
            # Tạo database session
            db = next(get_db())
            
            # Chạy auto-approve
            auto_approved_auctions = AuctionService.auto_approve_winners(db)
            
            if auto_approved_auctions:
                logger.info(f"Auto-approved {len(auto_approved_auctions)} auctions: {auto_approved_auctions}")
            else:
                logger.info("No auctions needed auto-approval")
            
            # Đóng database session
            db.close()
            
        except Exception as e:
            logger.error(f"Error in auto_approve_expired_auctions_task: {str(e)}")
        
        # Chờ 1 giờ trước khi chạy lại
        await asyncio.sleep(3600)  # 3600 seconds = 1 hour

def start_auto_approve_task():
    """
    Khởi động background task
    """
    try:
        loop = asyncio.get_event_loop()
        loop.create_task(auto_approve_expired_auctions_task())
        logger.info("Auto-approve task started successfully")
    except Exception as e:
        logger.error(f"Error starting auto-approve task: {str(e)}") 