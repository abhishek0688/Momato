from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.menu import MenuItemResponse

class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    cuisine_type: str
    delivery_time_minutes: int = 30
    delivery_fee: float = 2.99
    minimum_order: float = 10.0
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    address: str
    phone: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cuisine_type: Optional[str] = None
    delivery_time_minutes: Optional[int] = None
    delivery_fee: Optional[float] = None
    minimum_order: Optional[float] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None

class RestaurantResponse(RestaurantBase):
    id: int
    owner_id: int
    rating: float
    rating_count: int
    is_approved: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RestaurantDetailResponse(RestaurantResponse):
    menu_items: List[MenuItemResponse] = []

    class Config:
        from_attributes = True
