from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = 1

class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: Optional[int] = None
    item_name: str
    price_per_unit: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    restaurant_id: int
    items: List[OrderItemCreate]
    delivery_address: str
    customer_phone: Optional[str] = None
    customer_notes: Optional[str] = None
    payment_method: str = "CREDIT_CARD"

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: int
    restaurant_id: int
    status: str
    subtotal: float
    delivery_fee: float
    tax: float
    total_amount: float
    delivery_address: str
    customer_phone: Optional[str] = None
    customer_notes: Optional[str] = None
    payment_method: str
    estimated_delivery_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    # Optional computed / related fields for frontend convenience
    restaurant_name: Optional[str] = None
    customer_name: Optional[str] = None

    class Config:
        from_attributes = True
