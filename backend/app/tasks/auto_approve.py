import asyncio
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.Auction import Auction
from app.models.Bid import Bid
from datetime import datetime
import logging
from app.models.Notification import Notification

logger = logging.getLogger(__name__)

async def auto_set_winner_task():
    """
    Background task: Tự động set is_winner cho bid cao nhất của các auction đã kết thúc mà chưa có winner.
    Chạy mỗi 5 phút.
    """
    while True:
        try:
            db = next(get_db())
            now = datetime.now()
            # Lấy các auction đã kết thúc mà chưa có bid nào is_winner
            ended_auctions = db.query(Auction).filter(Auction.end_time < now).all()
            
            for auction in ended_auctions:
                winner_bid = db.query(Bid).filter(
                    Bid.auction_id == auction.id,
                    Bid.is_winner == True
                ).first()
                
                if not winner_bid:
                    highest_bid = db.query(Bid).filter(
                        Bid.auction_id == auction.id
                    ).order_by(Bid.bid_amount.desc()).first()
                    
                    if highest_bid:
                        # Reset tất cả bid về is_winner = False
                        db.query(Bid).filter(Bid.auction_id == auction.id).update({"is_winner": False})
                        highest_bid.is_winner = True
                        # Thêm bản ghi notification cho user chiến thắng
                        notification = Notification(
                            user_id=highest_bid.user_id,
                            auction_id=auction.id,
                            message=f"Chúc mừng! Bạn đã chiến thắng phiên đấu giá {auction.title}.",
                            created_at=datetime.now(),
                            is_read=False
                        )
                        db.add(notification)
                        logger.info(f"Auto-set winner for auction {auction.id}: bid {highest_bid.id} with amount {highest_bid.bid_amount}")
            
            db.commit()
            db.close()
        except Exception as e:
            logger.error(f"Error in auto_set_winner_task: {str(e)}")
        await asyncio.sleep(60)  # 5 phút

def start_auto_set_winner_task():
    try:
        loop = asyncio.get_event_loop()
        loop.create_task(auto_set_winner_task())
        logger.info("Auto set winner task started successfully")
    except Exception as e:
        logger.error(f"Error starting auto set winner task: {str(e)}")
