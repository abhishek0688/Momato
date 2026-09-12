from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    cuisine_type = Column(String, index=True, nullable=False)  # e.g. 'Italian', 'Asian', 'Burgers'
    rating = Column(Float, default=4.8)
    rating_count = Column(Integer, default=0)
    delivery_time_minutes = Column(Integer, default=30)
    delivery_fee = Column(Float, default=2.99)
    minimum_order = Column(Float, default=10.0)
    image_url = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    is_approved = Column(Boolean, default=True)  # Can be moderated by admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="restaurants")
    menu_items = relationship("MenuItem", back_populates="restaurant", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="restaurant")
    reviews = relationship("Review", back_populates="restaurant", cascade="all, delete-orphan")
