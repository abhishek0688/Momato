from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    
    # Status lifecycle: PENDING -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED (or REJECTED / CANCELLED)
    status = Column(String, default="PENDING", nullable=False)
    
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=2.99, nullable=False)
    tax = Column(Float, default=0.0, nullable=False)
    total_amount = Column(Float, nullable=False)
    
    delivery_address = Column(String, nullable=False)
    customer_phone = Column(String, nullable=True)
    customer_notes = Column(Text, nullable=True)
    payment_method = Column(String, default="CREDIT_CARD", nullable=False)
    
    estimated_delivery_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="orders")
    restaurant = relationship("Restaurant", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id", ondelete="SET NULL"), nullable=True)
    item_name = Column(String, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    subtotal = Column(Float, nullable=False)

    # Relationship
    order = relationship("Order", back_populates="items")
