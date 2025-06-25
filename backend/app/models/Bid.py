from sqlalchemy import Column, Numeric, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.models.base import Base
import uuid
from datetime import datetime

class Bid(Base):
    __tablename__ = "bids"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auction_id = Column(UUID(as_uuid=True), ForeignKey("auctions.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    bid_amount = Column(Numeric, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # quantity = Column(Integer)  # Nếu cần dùng số lượng

    # Quan hệ ngược về User và Auction
    auction = relationship("Auction", back_populates="bids")
    user = relationship("User", back_populates="bids")
