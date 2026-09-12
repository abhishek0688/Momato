from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str = "Mains"
    image_url: Optional[str] = None
    is_available: bool = True
    is_vegetarian: bool = False
    is_spicy: bool = False
    calories: Optional[int] = None

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    is_spicy: Optional[bool] = None
    calories: Optional[int] = None

class MenuItemResponse(MenuItemBase):
    id: int
    restaurant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
