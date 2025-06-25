# app/models/order.py
from sqlalchemy import Column, Numeric, DateTime, ForeignKey, UUID, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
import uuid
from datetime import datetime
from app.enums import OrderStatus

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auction_id = Column(UUID(as_uuid=True), ForeignKey("auctions.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric, nullable=False)
    status = Column(Enum(OrderStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    auction = relationship("Auction", back_populates="orders")
    user = relationship("User", back_populates="orders")