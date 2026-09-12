from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.restaurant import Restaurant
from app.models.menu import MenuItem
from app.models.review import Review
from app.models.user import User
from app.schemas.restaurant import (
    RestaurantCreate, RestaurantUpdate, RestaurantResponse, RestaurantDetailResponse
)
from app.schemas.menu import MenuItemResponse
from app.services.auth_service import get_current_user, get_restaurant_user

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

@router.get("", response_model=List[RestaurantResponse])
def list_restaurants(
    query: Optional[str] = None,
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = Query(None, pattern="^(rating|delivery_time|delivery_fee)$"),
    db: Session = Depends(get_db),
):
    """List approved and active restaurants with optional search and filters."""
    q = db.query(Restaurant).filter(Restaurant.is_approved == True, Restaurant.is_active == True)

    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                Restaurant.name.ilike(search_pattern),
                Restaurant.cuisine_type.ilike(search_pattern),
                Restaurant.description.ilike(search_pattern),
            )
        )

    if cuisine and cuisine.lower() != "all":
        q = q.filter(Restaurant.cuisine_type.ilike(f"%{cuisine}%"))

    if min_rating is not None:
        q = q.filter(Restaurant.rating >= min_rating)

    if sort_by == "rating":
        q = q.order_by(Restaurant.rating.desc())
    elif sort_by == "delivery_time":
        q = q.order_by(Restaurant.delivery_time_minutes.asc())
    elif sort_by == "delivery_fee":
        q = q.order_by(Restaurant.delivery_fee.asc())
    else:
        q = q.order_by(Restaurant.rating.desc(), Restaurant.id.desc())

    return q.all()


@router.get("/mine/profile", response_model=RestaurantDetailResponse)
def get_my_restaurant(
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db)
):
    """Retrieve the restaurant owned by the logged-in restaurant partner."""
    restaurant = db.query(Restaurant).filter(Restaurant.owner_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No restaurant associated with this partner account."
        )
    return restaurant


@router.get("/{restaurant_id}", response_model=RestaurantDetailResponse)
def get_restaurant_detail(restaurant_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of a single restaurant including its categorized menu items."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    return restaurant


@router.post("", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant(
    restaurant_in: RestaurantCreate,
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db),
):
    """Create a new restaurant listing."""
    new_restaurant = Restaurant(
        owner_id=current_user.id,
        name=restaurant_in.name,
        description=restaurant_in.description,
        cuisine_type=restaurant_in.cuisine_type,
        delivery_time_minutes=restaurant_in.delivery_time_minutes,
        delivery_fee=restaurant_in.delivery_fee,
        minimum_order=restaurant_in.minimum_order,
        image_url=restaurant_in.image_url,
        banner_url=restaurant_in.banner_url,
        address=restaurant_in.address,
        phone=restaurant_in.phone,
        is_approved=True,  # Default to auto-approved in development
        is_active=True,
    )
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return new_restaurant


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    restaurant_in: RestaurantUpdate,
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db),
):
    """Update an existing restaurant."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    
    # Verify owner or admin
    if restaurant.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this restaurant")

    update_data = restaurant_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(restaurant, field, value)

    db.commit()
    db.refresh(restaurant)
    return restaurant
