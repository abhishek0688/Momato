from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.review import Review
from app.models.restaurant import Restaurant
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a rating and review for a restaurant."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == review_in.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")

    new_review = Review(
        restaurant_id=restaurant.id,
        customer_id=current_user.id,
        order_id=review_in.order_id,
        rating=review_in.rating,
        comment=review_in.comment,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    # Recalculate restaurant average rating
    avg_rating, count = (
        db.query(func.avg(Review.rating), func.count(Review.id))
        .filter(Review.restaurant_id == restaurant.id)
        .first()
    )
    restaurant.rating = round(float(avg_rating or 4.5), 1)
    restaurant.rating_count = int(count or 1)
    db.commit()

    res = ReviewResponse.model_validate(new_review)
    res.customer_name = current_user.full_name
    return res


@router.get("/restaurant/{restaurant_id}", response_model=List[ReviewResponse])
def get_restaurant_reviews(restaurant_id: int, db: Session = Depends(get_db)):
    """Retrieve all customer reviews for a given restaurant."""
    reviews = (
        db.query(Review)
        .filter(Review.restaurant_id == restaurant_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    result = []
    for r in reviews:
        item = ReviewResponse.model_validate(r)
        if r.customer:
            item.customer_name = r.customer.full_name
        result.append(item)
    return result
