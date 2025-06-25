from fastapi import APIRouter
from . import users, auth, auctions

router = APIRouter()
router.include_router(users.router)
router.include_router(auth.router)
router.include_router(auctions.router)
