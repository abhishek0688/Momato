from typing import Optional
from pydantic import BaseModel

class PlatformStatsResponse(BaseModel):
    total_revenue: float
    total_orders: int
    active_users: int
    total_restaurants: int
    pending_orders: int
    delivered_orders: int

class UserStatusUpdate(BaseModel):
    is_active: bool

class RestaurantApprovalUpdate(BaseModel):
    is_approved: bool
    is_active: Optional[bool] = None
