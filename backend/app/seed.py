import sys
import os
from datetime import datetime, timedelta

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.menu import MenuItem
from app.models.order import Order, OrderItem
from app.models.review import Review
from app.services.auth_service import hash_password

def seed_database():
    """Seed comprehensive test data with Indian dishes and Indian Rupee (INR) pricing."""
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Clear existing tables for a clean rupee & Indian dishes re-seed
        db.query(Review).delete()
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(MenuItem).delete()
        db.query(Restaurant).delete()
        db.query(User).delete()
        db.commit()

        print("Creating default platform accounts...")
        # 1. Users
        admin_user = User(
            email="admin@foodhub.com",
            hashed_password=hash_password("password123"),
            full_name="Platform Administrator",
            role="admin",
            phone="+91 98765 43210",
            address="FoodHub Tower, Cyber City, Gurugram, India",
            is_active=True,
        )

        customer_user = User(
            email="customer@foodhub.com",
            hashed_password=hash_password("password123"),
            full_name="Aarav Sharma",
            role="customer",
            phone="+91 98111 22334",
            address="Flat 402, Lotus Greens, Sector 78, Noida",
            is_active=True,
        )

        customer_sarah = User(
            email="priya@test.com",
            hashed_password=hash_password("password123"),
            full_name="Priya Patel",
            role="customer",
            phone="+91 98222 33445",
            address="Villa 12, Palm Meadows, Whitefield, Bengaluru",
            is_active=True,
        )

        owner_delhi = User(
            email="chef@delhidarbar.com",
            hashed_password=hash_password("password123"),
            full_name="Chef Tariq Khan",
            role="restaurant",
            phone="+91 98333 44556",
            address="45 Heritage Fort Road, Connaught Place, New Delhi",
            is_active=True,
        )

        owner_tokyo = User(
            email="tokyo@ramen.com",
            hashed_password=hash_password("password123"),
            full_name="Kenji Tanaka",
            role="restaurant",
            phone="+91 98444 55667",
            address="88 Sakura Avenue, Indiranagar, Bengaluru",
            is_active=True,
        )

        owner_burger = User(
            email="burger@lab.com",
            hashed_password=hash_password("password123"),
            full_name="Dave 'Smokey' Miller",
            role="restaurant",
            phone="+91 98555 66778",
            address="14 Carter Road, Bandra West, Mumbai",
            is_active=True,
        )

        owner_green = User(
            email="green@bowl.com",
            hashed_password=hash_password("password123"),
            full_name="Ananya Roy",
            role="restaurant",
            phone="+91 98666 77889",
            address="200 Greenway Park, Koramangala, Bengaluru",
            is_active=True,
        )

        db.add_all([admin_user, customer_user, customer_sarah, owner_delhi, owner_tokyo, owner_burger, owner_green])
        db.commit()

        # Refresh users for IDs
        db.refresh(admin_user)
        db.refresh(customer_user)
        db.refresh(customer_sarah)
        db.refresh(owner_delhi)
        db.refresh(owner_tokyo)
        db.refresh(owner_burger)
        db.refresh(owner_green)

        print("Creating premium restaurants with Indian cuisine focus...")
        # 2. Restaurants
        r_delhi = Restaurant(
            owner_id=owner_delhi.id,
            name="Delhi Darbar & Royal Biryani",
            description="Legendary slow-cooked Hyderabadi and Awadhi dum biryanis, velvety butter chicken, rich Dal Makhani, and tandoori charcoal kebabs.",
            cuisine_type="Indian",
            rating=4.9,
            rating_count=384,
            delivery_time_minutes=25,
            delivery_fee=35.0,
            minimum_order=199.0,
            image_url="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
            banner_url="https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1200&q=80",
            address="45 Heritage Fort Road, Connaught Place, New Delhi",
            phone="+91 98333 44556",
            is_approved=True,
            is_active=True,
        )

        r_tokyo = Restaurant(
            owner_id=owner_tokyo.id,
            name="Tokyo Artisan Ramen & Sushi",
            description="Slow-simmered 18-hour broth, hand-pulled noodles, and pristine seafood platters prepared by master sushi chefs.",
            cuisine_type="Japanese",
            rating=4.8,
            rating_count=194,
            delivery_time_minutes=30,
            delivery_fee=45.0,
            minimum_order=249.0,
            image_url="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
            banner_url="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
            address="88 Sakura Avenue, Indiranagar, Bengaluru",
            phone="+91 98444 55667",
            is_approved=True,
            is_active=True,
        )

        r_burger = Restaurant(
            owner_id=owner_burger.id,
            name="Smokey Burger Lab",
            description="Double smashed gourmet patties, toasted brioche buns, melted cheddar, crisp onions, and homemade spicy umami sauces.",
            cuisine_type="Burgers",
            rating=4.7,
            rating_count=260,
            delivery_time_minutes=20,
            delivery_fee=30.0,
            minimum_order=149.0,
            image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            banner_url="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
            address="14 Carter Road, Bandra West, Mumbai",
            phone="+91 98555 66778",
            is_approved=True,
            is_active=True,
        )

        r_green = Restaurant(
            owner_id=owner_green.id,
            name="Green Bowl Superfoods",
            description="100% wholesome nourish bowls, fresh cold-pressed vitality juices, organic seasonal salads, and superfood parfaits.",
            cuisine_type="Healthy",
            rating=4.9,
            rating_count=142,
            delivery_time_minutes=20,
            delivery_fee=0.0,
            minimum_order=199.0,
            image_url="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
            banner_url="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
            address="200 Greenway Park, Koramangala, Bengaluru",
            phone="+91 98666 77889",
            is_approved=True,
            is_active=True,
        )

        db.add_all([r_delhi, r_tokyo, r_burger, r_green])
        db.commit()

        db.refresh(r_delhi)
        db.refresh(r_tokyo)
        db.refresh(r_burger)
        db.refresh(r_green)

        print("Populating mouth-watering Indian and gourmet dishes in Rupees (INR)...")
        # 3. Menu Items
        menu_items = [
            # Delhi Darbar & Royal Biryani (Indian Specialties)
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Dum Pukht Chicken Biryani",
                description="Aromatic aged Daawat basmati rice cooked on slow coal dum with succulent bone-in chicken, saffron, ghee, and royal spices. Served with cooling burani raita.",
                price=349.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=True,
                calories=720,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Old Delhi Murgh Makhani (Butter Chicken)",
                description="Smoked tandoor-roasted chicken simmered in a rich tomato, butter, and cashew gravy finished with dried fenugreek leaves (kasuri methi) and fresh cream.",
                price=329.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=False,
                calories=640,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Paneer Butter Masala",
                description="Velvety cubes of fresh malai paneer simmered in an aromatic onion-tomato-butter gravy with freshly ground spices and a touch of cream.",
                price=289.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=520,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Dal Makhani (Slow Cooked Overnight)",
                description="Signature black urad lentils slow-simmered over live charcoal for 16 hours with churned white butter, tomatoes, and whole aromatic spices.",
                price=249.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=460,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Tandoori Paneer Tikka (6 pcs)",
                description="Cottage cheese cubes steeped in spiced hung curd marinade with bell peppers and onions, roasted crisp in the clay tandoor. Served with mint chutney.",
                price=259.0,
                category="Starters",
                image_url="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=True,
                calories=390,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Butter Garlic Naan (2 pcs)",
                description="Fluffy artisan leavened flatbread brushed with melted butter, minced roasted garlic, and freshly chopped coriander.",
                price=65.0,
                category="Starters",
                image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=210,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Warm Gulab Jamun with Kesar Rabri",
                description="Soft, spongy golden fried milk dumplings soaked in cardamom sugar syrup, served warm over thick saffron-infused rabri.",
                price=110.0,
                category="Desserts",
                image_url="https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=340,
            ),
            MenuItem(
                restaurant_id=r_delhi.id,
                name="Alphonso Mango Lassi",
                description="Traditional thick yogurt beverage blended with sweet Ratnagiri Alphonso mango pulp, green cardamom, and slivered pistachios.",
                price=89.0,
                category="Beverages",
                image_url="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=195,
            ),

            # Tokyo Ramen & Sushi
            MenuItem(
                restaurant_id=r_tokyo.id,
                name="Signature Black Garlic Tonkotsu Ramen",
                description="Rich pork bone broth infused with charred garlic oil, chashu pork belly, marinated ajitsuke tamago, scallions, and nori.",
                price=380.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=True,
                calories=760,
            ),
            MenuItem(
                restaurant_id=r_tokyo.id,
                name="Dragon Flame Sushi Roll (8 pcs)",
                description="Tempura shrimp and cucumber topped with spicy bluefin tuna, avocado slices, tobiko, and sweet unagi glaze.",
                price=360.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=True,
                calories=520,
            ),
            MenuItem(
                restaurant_id=r_tokyo.id,
                name="Crispy Pan-Seared Gyoza (6 pcs)",
                description="Japanese dumplings packed with spiced minced meat, cabbage, and scallions with ponzu dip.",
                price=220.0,
                category="Starters",
                image_url="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=False,
                calories=380,
            ),

            # Smokey Burger Lab
            MenuItem(
                restaurant_id=r_burger.id,
                name="Double Smashed Truffle Beast",
                description="Two smashed gourmet patties, melted aged cheddar, caramelized balsamic onions, and black truffle garlic aioli on brioche.",
                price=299.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=False,
                calories=890,
            ),
            MenuItem(
                restaurant_id=r_burger.id,
                name="Fiery Peri-Peri Fried Chicken Burger",
                description="Crispy buttermilk-brined chicken breast coated in fiery peri-peri spices with crunchy slaw on toasted brioche.",
                price=269.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=False,
                is_spicy=True,
                calories=780,
            ),
            MenuItem(
                restaurant_id=r_burger.id,
                name="Parmesan Truffle Waffle Fries",
                description="Crisp golden waffle fries tossed with aromatic white truffle oil, freshly grated Parmesan, and chopped parsley.",
                price=149.0,
                category="Starters",
                image_url="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=440,
            ),

            # Green Bowl Superfoods
            MenuItem(
                restaurant_id=r_green.id,
                name="Sunset Glow Quinoa & Avocado Bowl",
                description="Tender herb-poached protein, quinoa, roasted sweet potatoes, fresh avocado, edamame, and ginger miso tahini dressing.",
                price=320.0,
                category="Mains",
                image_url="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=490,
            ),
            MenuItem(
                restaurant_id=r_green.id,
                name="Amazonian Royal Açai Bowl",
                description="Pure organic açai purée topped with fresh strawberries, sliced bananas, almond butter drizzle, chia seeds, and granola.",
                price=249.0,
                category="Desserts",
                image_url="https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
                is_available=True,
                is_vegetarian=True,
                is_spicy=False,
                calories=380,
            )
        ]

        db.add_all(menu_items)
        db.commit()

        print("Generating realistic orders & reviews in Rupees...")
        # 4. Orders with status variety
        # Order 1: Out for delivery (Aarav)
        order1 = Order(
            order_number="ORD-78192",
            customer_id=customer_user.id,
            restaurant_id=r_delhi.id,
            status="OUT_FOR_DELIVERY",
            subtotal=678.0,
            delivery_fee=35.0,
            tax=33.90,
            total_amount=746.90,
            delivery_address="Flat 402, Lotus Greens, Sector 78, Noida",
            customer_phone="+91 98111 22334",
            customer_notes="Please send extra green chutney and onion salad!",
            payment_method="UPI_GPAY",
            estimated_delivery_time=datetime.utcnow() + timedelta(minutes=12),
            items=[
                OrderItem(menu_item_id=menu_items[0].id, item_name="Dum Pukht Chicken Biryani", price_per_unit=349.0, quantity=1, subtotal=349.0),
                OrderItem(menu_item_id=menu_items[1].id, item_name="Old Delhi Murgh Makhani (Butter Chicken)", price_per_unit=329.0, quantity=1, subtotal=329.0),
            ]
        )

        # Order 2: Delivered (Priya)
        order2 = Order(
            order_number="ORD-55410",
            customer_id=customer_sarah.id,
            restaurant_id=r_delhi.id,
            status="DELIVERED",
            subtotal=538.0,
            delivery_fee=35.0,
            tax=26.90,
            total_amount=599.90,
            delivery_address="Villa 12, Palm Meadows, Whitefield, Bengaluru",
            customer_phone="+91 98222 33445",
            customer_notes="Make the Dal Makhani extra creamy please.",
            payment_method="CREDIT_CARD",
            estimated_delivery_time=datetime.utcnow() - timedelta(hours=1),
            items=[
                OrderItem(menu_item_id=menu_items[2].id, item_name="Paneer Butter Masala", price_per_unit=289.0, quantity=1, subtotal=289.0),
                OrderItem(menu_item_id=menu_items[3].id, item_name="Dal Makhani (Slow Cooked Overnight)", price_per_unit=249.0, quantity=1, subtotal=249.0),
            ]
        )

        # Order 3: Pending in restaurant queue
        order3 = Order(
            order_number="ORD-92044",
            customer_id=customer_user.id,
            restaurant_id=r_burger.id,
            status="PENDING",
            subtotal=448.0,
            delivery_fee=30.0,
            tax=22.40,
            total_amount=500.40,
            delivery_address="Flat 402, Lotus Greens, Sector 78, Noida",
            customer_phone="+91 98111 22334",
            customer_notes="Crispy fries and extra dip please.",
            payment_method="PAYTM",
            estimated_delivery_time=datetime.utcnow() + timedelta(minutes=25),
            items=[
                OrderItem(menu_item_id=menu_items[11].id, item_name="Double Smashed Truffle Beast", price_per_unit=299.0, quantity=1, subtotal=299.0),
                OrderItem(menu_item_id=menu_items[13].id, item_name="Parmesan Truffle Waffle Fries", price_per_unit=149.0, quantity=1, subtotal=149.0),
            ]
        )

        db.add_all([order1, order2, order3])
        db.commit()

        # 5. Reviews
        rev1 = Review(
            restaurant_id=r_delhi.id,
            customer_id=customer_user.id,
            order_id=order1.id,
            rating=5,
            comment="The Biryani was fragrant, authentic, and perfectly spiced! The meat fell right off the bone. Best in town!",
        )
        rev2 = Review(
            restaurant_id=r_delhi.id,
            customer_id=customer_sarah.id,
            order_id=order2.id,
            rating=5,
            comment="Dal Makhani and Butter Garlic Naan combination was divine. Melt-in-mouth paneer makhani as well!",
        )
        db.add_all([rev1, rev2])
        db.commit()

        print("Database re-seeded successfully with Indian cuisine & INR!")
        print("  Customer:   customer@foodhub.com   / password123")
        print("  Partner:    chef@delhidarbar.com   / password123")
        print("  Admin:      admin@foodhub.com      / password123")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
