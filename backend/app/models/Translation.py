from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.models.base import Base

class Translation(Base):
    __tablename__ = "translations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String(255), unique=True, nullable=False)
    vi = Column(Text, nullable=True)
    en = Column(Text, nullable=True)
    kr = Column(Text, nullable=True)
    event_time = Column(DateTime, default=datetime.now)
    event_user = Column(String(50), nullable=False)
