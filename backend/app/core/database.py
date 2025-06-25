from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.core.config import SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from app.models.User import User
from app.models.Auction import Auction
from app.models.Bid import Bid
from app.models.Order import Order
from app.models.Notification import Notification

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
