from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    restaurant_id: int
    order_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    restaurant_id: int
    customer_id: int
    order_id: Optional[int] = None
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    customer_name: Optional[str] = None

    class Config:
        from_attributes = True
