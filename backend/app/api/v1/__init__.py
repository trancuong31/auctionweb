from fastapi import APIRouter
from . import users, auth, auctions, bids, notification
router = APIRouter()
router.include_router(users.router)
router.include_router(auth.router)
router.include_router(auctions.router)
router.include_router(bids.router)
router.include_router(notification.router)
