import random
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.menu import MenuItem
from app.models.restaurant import Restaurant
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

def serialize_order(order: Order) -> OrderResponse:
    """Helper to convert Order ORM to OrderResponse schema with populated extra names."""
    res = OrderResponse.model_validate(order)
    if order.restaurant:
        res.restaurant_name = order.restaurant.name
    if order.customer:
        res.customer_name = order.customer.full_name
    return res

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Place a new food order from a restaurant."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == order_in.restaurant_id).first()
    if not restaurant or not restaurant.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant is currently unavailable."
        )

    if not order_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item."
        )

    # Calculate prices and build order items
    subtotal = 0.0
    order_items_to_create = []

    for item_data in order_in.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item_data.menu_item_id,
            MenuItem.restaurant_id == restaurant.id
        ).first()

        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item ID {item_data.menu_item_id} not found at this restaurant."
            )

        if not menu_item.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{menu_item.name}' is currently out of stock."
            )

        item_subtotal = round(menu_item.price * item_data.quantity, 2)
        subtotal += item_subtotal

        order_items_to_create.append(
            OrderItem(
                menu_item_id=menu_item.id,
                item_name=menu_item.name,
                price_per_unit=menu_item.price,
                quantity=item_data.quantity,
                subtotal=item_subtotal,
            )
        )

    delivery_fee = restaurant.delivery_fee
    tax = round(subtotal * 0.05, 2)  # 5% standard tax
    total_amount = round(subtotal + delivery_fee + tax, 2)

    order_number = f"ORD-{random.randint(10000, 99999)}"

    # Estimated delivery time
    est_delivery = datetime.utcnow() + timedelta(minutes=restaurant.delivery_time_minutes or 35)

    new_order = Order(
        order_number=order_number,
        customer_id=current_user.id,
        restaurant_id=restaurant.id,
        status="PENDING",
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        tax=tax,
        total_amount=total_amount,
        delivery_address=order_in.delivery_address or current_user.address or "Standard Address",
        customer_phone=order_in.customer_phone or current_user.phone,
        customer_notes=order_in.customer_notes,
        payment_method=order_in.payment_method,
        estimated_delivery_time=est_delivery,
        items=order_items_to_create,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return serialize_order(new_order)


@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve order history for the logged-in customer."""
    orders = (
        db.query(Order)
        .filter(Order.customer_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [serialize_order(o) for o in orders]


@router.get("/restaurant/{restaurant_id}", response_model=List[OrderResponse])
def get_restaurant_orders(
    restaurant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve incoming and past orders for a restaurant partner."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")

    if restaurant.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    orders = (
        db.query(Order)
        .filter(Order.restaurant_id == restaurant_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [serialize_order(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_tracking(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get live tracking status and details of an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Authorize customer, restaurant owner, or admin
    if (
        order.customer_id != current_user.id and
        order.restaurant.owner_id != current_user.id and
        current_user.role != "admin"
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return serialize_order(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update order status (PENDING -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Only restaurant partner or admin can advance/reject orders
    if order.restaurant.owner_id != current_user.id and current_user.role != "admin":
        # Allow customer to cancel if still PENDING
        if current_user.id == order.customer_id and status_in.status.upper() == "CANCELLED" and order.status == "PENDING":
            order.status = "CANCELLED"
            db.commit()
            db.refresh(order)
            return serialize_order(order)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update status")

    valid_statuses = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "REJECTED", "CANCELLED"]
    next_status = status_in.status.upper()
    if next_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{next_status}'. Must be one of {valid_statuses}"
        )

    order.status = next_status
    db.commit()
    db.refresh(order)
    return serialize_order(order)
