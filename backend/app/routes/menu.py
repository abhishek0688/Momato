from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.menu import MenuItem
from app.models.restaurant import Restaurant
from app.models.user import User
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse
from app.services.auth_service import get_restaurant_user

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/restaurant/{restaurant_id}", response_model=List[MenuItemResponse])
def get_restaurant_menu(restaurant_id: int, db: Session = Depends(get_db)):
    """Fetch all menu items belonging to a restaurant."""
    items = db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id).all()
    return items


@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    item_in: MenuItemCreate,
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db),
):
    """Add a new item to the restaurant partner's menu."""
    # Find restaurant owned by current partner (or admin fallback)
    restaurant = db.query(Restaurant).filter(Restaurant.owner_id == current_user.id).first()
    if not restaurant and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You must have a registered restaurant to add menu items."
        )

    restaurant_id = restaurant.id if restaurant else 1

    new_item = MenuItem(
        restaurant_id=restaurant_id,
        name=item_in.name,
        description=item_in.description,
        price=item_in.price,
        category=item_in.category,
        image_url=item_in.image_url,
        is_available=item_in.is_available,
        is_vegetarian=item_in.is_vegetarian,
        is_spicy=item_in.is_spicy,
        calories=item_in.calories,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.put("/{menu_item_id}", response_model=MenuItemResponse)
def update_menu_item(
    menu_item_id: int,
    item_in: MenuItemUpdate,
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db),
):
    """Update details, price, or availability of a menu item."""
    item = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    # Authorize ownership
    restaurant = db.query(Restaurant).filter(Restaurant.id == item.restaurant_id).first()
    if restaurant.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to modify this item")

    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item


@router.patch("/{menu_item_id}/availability", response_model=MenuItemResponse)
def toggle_availability(
    menu_item_id: int,
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db),
):
    """Quick toggle between In-Stock and Out-of-Stock."""
    item = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    restaurant = db.query(Restaurant).filter(Restaurant.id == item.restaurant_id).first()
    if restaurant.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    item.is_available = not item.is_available
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{menu_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    menu_item_id: int,
    current_user: User = Depends(get_restaurant_user),
    db: Session = Depends(get_db),
):
    """Delete a menu item."""
    item = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    restaurant = db.query(Restaurant).filter(Restaurant.id == item.restaurant_id).first()
    if restaurant.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.delete(item)
    db.commit()
    return None
