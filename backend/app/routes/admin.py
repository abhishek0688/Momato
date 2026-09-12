from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.order import Order
from app.schemas.admin import PlatformStatsResponse, UserStatusUpdate, RestaurantApprovalUpdate
from app.schemas.user import UserResponse
from app.schemas.restaurant import RestaurantResponse
from app.schemas.order import OrderResponse
from app.routes.orders import serialize_order
from app.services.auth_service import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/stats", response_model=PlatformStatsResponse)
def get_platform_analytics(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """Retrieve platform-wide KPIs, revenue, order totals, and vendor counts."""
    # Total revenue from delivered orders
    rev = db.query(func.sum(Order.total_amount)).filter(Order.status == "DELIVERED").scalar()
    total_revenue = round(float(rev or 0.0), 2)

    total_orders = db.query(func.count(Order.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
    total_restaurants = db.query(func.count(Restaurant.id)).scalar() or 0

    pending_orders = (
        db.query(func.count(Order.id))
        .filter(Order.status.in_(["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"]))
        .scalar() or 0
    )
    delivered_orders = (
        db.query(func.count(Order.id))
        .filter(Order.status == "DELIVERED")
        .scalar() or 0
    )

    return PlatformStatsResponse(
        total_revenue=total_revenue,
        total_orders=total_orders,
        active_users=active_users,
        total_restaurants=total_restaurants,
        pending_orders=pending_orders,
        delivered_orders=delivered_orders,
    )


@router.get("/restaurants", response_model=List[RestaurantResponse])
def get_all_restaurants(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """List all restaurants on the platform regardless of approval state."""
    restaurants = db.query(Restaurant).order_by(Restaurant.id.desc()).all()
    return restaurants


@router.patch("/restaurants/{restaurant_id}/approval", response_model=RestaurantResponse)
def toggle_restaurant_approval(
    restaurant_id: int,
    approval_in: RestaurantApprovalUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """Approve or suspend a restaurant partner account."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")

    restaurant.is_approved = approval_in.is_approved
    if approval_in.is_active is not None:
        restaurant.is_active = approval_in.is_active

    db.commit()
    db.refresh(restaurant)
    return restaurant


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """List all registered platform users."""
    users = db.query(User).order_by(User.id.desc()).all()
    return users


@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: int,
    status_in: UserStatusUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """Activate or deactivate a user account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate own admin account")

    user.is_active = status_in.is_active
    db.commit()
    db.refresh(user)
    return user


@router.get("/orders", response_model=List[OrderResponse])
def get_all_platform_orders(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    """Stream all platform orders for administrative oversight."""
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(100).all()
    return [serialize_order(o) for o in orders]
