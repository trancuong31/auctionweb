import asyncio
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.Auction import Auction
from app.models.Bid import Bid
from datetime import datetime
import logging
from app.models.Notification import Notification
from app.i18n import _
from app.models.User import User

logger = logging.getLogger(__name__)

def translate(msg_key, lang, **kwargs):
    translations = {
        "win": {
            "en": "Congratulations! You have won the auction {title}.",
            "vi": "Chúc mừng! Bạn đã chiến thắng phiên đấu giá {title}.",
            "ko": "축하합니다! {title} 경매에서 낙찰되었습니다."
        },
        "lose": {
            "en": "Sorry! You did not win the auction {title}.",
            "vi": "Rất tiếc! Bạn đã đấu giá không thành công phiên đấu giá {title}.",
            "ko": "안타깝게도 {title} 경매에서 낙찰되지 못했습니다."
        }
    }
    template = translations[msg_key].get(lang, translations[msg_key]["en"])
    return template.format(**kwargs)

async def auto_set_winner_task():
    """
    Background task: Tự động set is_winner cho bid cao nhất của các auction đã kết thúc mà chưa có winner.
    Chạy mỗi 1 phút.
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
                        winner_user = db.query(User).filter(User.id == highest_bid.user_id).first()
                        winner_lang = getattr(winner_user, "language", "en")
                        if winner_lang == "vi":
                            auction_title = auction.title_vi or auction.title
                        elif winner_lang == "ko":
                            auction_title = auction.title_ko or auction.title
                        else:
                            auction_title = auction.title

                        message = translate("win", winner_lang, title=auction_title)

                        notification = Notification(
                            user_id=highest_bid.user_id,
                            auction_id=auction.id,
                            message=message,
                            created_at=datetime.now(),
                            is_read=False
                        )
                        
                        db.add(notification)
                        losing_bids = db.query(Bid).filter(Bid.auction_id == auction.id, Bid.id != highest_bid.id).all()
                        for losing_bid in losing_bids:
                            losing_user = db.query(User).filter(User.id == losing_bid.user_id).first()
                            losing_lang = getattr(losing_user, "language", "en")
                            if losing_lang == "vi":
                                auction_title = auction.title_vi or auction.title
                            elif losing_lang == "ko":
                                auction_title = auction.title_ko or auction.title
                            else:
                                auction_title = auction.title

                            message = translate("lose", losing_lang, title=auction_title)
                            losing_notification = Notification(
                            user_id=losing_bid.user_id,
                            auction_id=auction.id,
                            message=message,
                            created_at=datetime.now(),
                            is_read=False
                        )
                            db.add(losing_notification)

                        
                        logger.info(f"Auto-set winner for auction {auction.id}: bid {highest_bid.id} with amount {highest_bid.bid_amount}")
            
            db.commit()
            db.close()
        except Exception as e:
            logger.error(f"Error in auto_set_winner_task: {str(e)}")
        await asyncio.sleep(60)  # 1 phút

def start_auto_set_winner_task():
    try:
        loop = asyncio.get_event_loop()
        loop.create_task(auto_set_winner_task())
        logger.info("Auto set winner task started successfully")
    except Exception as e:
        logger.error(f"Error starting auto set winner task: {str(e)}")
