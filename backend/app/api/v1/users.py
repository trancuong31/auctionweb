import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.engine import create
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import user
from app.core.database import get_db
from app.models.User import User
from app.core.auth import get_current_user_id_from_token
from app.enums import UserRole
from starlette.status import HTTP_400_BAD_REQUEST
from app.i18n import _
router = APIRouter()

class UserOut(BaseModel):
    id: str
    username: Optional[str]
    email: Optional[str]
    role: str
    created_at: datetime
    status : int
    class Config:
        # orm_mode = True
        from_attributes = True

class UserStatusUpdate(BaseModel):
    status: int

class UserUpdate(BaseModel):
    username: Optional[str]

class UsersListOut(BaseModel):
    users: list[UserOut]
    total_users: int

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id_from_token)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail=_("User not found", request))
    return user
    
@router.get("/users", response_model=UsersListOut)
def get_users(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    search_text: Optional[str] = Query(None, description="Tìm kiếm theo username hoặc email"),
    sort_by: Optional[str] = Query("created_at", description="Sắp xếp theo: username, email, created_at"),
    sort_order: Optional[str] = Query("desc", description="Thứ tự sắp xếp: asc, desc"),
    page: int = Query(1, ge=1, description="Số trang"),
    page_size: int = Query(8, ge=1, le=100, description="Số user mỗi trang")
):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=403,
            detail=_("You don't have permison watch users!", request)
        )
    query = db.query(User)
    if search_text:
        query = query.filter(
            (User.username.ilike(f"%{search_text}%")) | (User.email.ilike(f"%{search_text}%"))
        )
    # Sắp xếp
    if sort_by == "username":
        order_col = User.username
    elif sort_by == "email":
        order_col = User.email
    else:
        order_col = User.created_at
    if sort_order == "asc":
        query = query.order_by(order_col.asc())
    else:
        query = query.order_by(order_col.desc())
    total_users = query.count()
    offset = (page - 1) * page_size
    users = query.offset(offset).limit(page_size).all()
    return {"users": users, "total_users": total_users}

@router.get("/users/{user_id}", response_model=UserOut)
def get_user(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).first()
    return users

@router.patch("/users/{user_id}/status")
def set_user_status(
    request: Request,
    user_id: str,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail=_("Permission denied", request))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=_("User not found", request))
    if data.status not in (0, 1):
        raise HTTPException(status_code=400, detail=_("Status must be 0 (disactive) or 1 (active)", request))
    user.status = data.status
    db.commit()
    return {"message": _("User status updated to {data.status}.", request)}

@router.put("/users/{user_id}")
def update_user(
    request: Request,
    user_id: str,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=_("User not found", request))
    
    if data.username is not None:
        user.username = data.username
    db.commit()
    return {"message": _("User updated successfully.", request)}


@router.delete("/users/{user_id}")
def delete_user(
    request: Request,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail=_("Permission denied", request))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=_("User not found", request))
    db.delete(user)
    db.commit()
    return {"message": _("User deleted successfully.", request)}