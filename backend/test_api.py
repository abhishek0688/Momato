import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    # 1. Test Customer Login
    print("Testing Customer Login...")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "customer@foodhub.com",
        "password": "password123"
    })
    assert res.status_code == 200, f"Customer login failed: {res.text}"
    token_data = res.json()
    token = token_data["access_token"]
    print("  [OK] Customer token received:", token[:20] + "...")

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test Fetching Restaurants
    print("Testing Restaurant Discovery...")
    res = requests.get(f"{BASE_URL}/restaurants")
    assert res.status_code == 200, f"List restaurants failed: {res.text}"
    restaurants = res.json()
    assert len(restaurants) >= 4, f"Expected at least 4 restaurants, got {len(restaurants)}"
    print(f"  [OK] Retrieved {len(restaurants)} restaurants.")

    # 3. Test Restaurant Details & Menu (Delhi Darbar)
    delhi_rest = next(r for r in restaurants if "Delhi" in r["name"])
    rest_id = delhi_rest["id"]
    print(f"Testing Restaurant Detail for ID {rest_id} ({delhi_rest['name']})...")
    res = requests.get(f"{BASE_URL}/restaurants/{rest_id}")
    assert res.status_code == 200, f"Restaurant detail failed: {res.text}"
    rest_detail = res.json()
    menu_items = rest_detail["menu_items"]
    assert len(menu_items) > 0, "No menu items found"
    print(f"  [OK] {rest_detail['name']} has {len(menu_items)} menu items.")

    # 4. Test Placing an Order
    print("Testing Order Placement...")
    item = menu_items[0]
    order_payload = {
        "restaurant_id": rest_id,
        "items": [{"menu_item_id": item["id"], "quantity": 2}],
        "delivery_address": "123 Test Avenue, Suite 500",
        "customer_notes": "Extra napkins please",
        "payment_method": "CREDIT_CARD"
    }
    res = requests.post(f"{BASE_URL}/orders", json=order_payload, headers=headers)
    assert res.status_code == 201, f"Order placement failed: {res.text}"
    order = res.json()
    order_id = order["id"]
    print(f"  [OK] Order created successfully: {order['order_number']}, Total: INR {order['total_amount']}, Status: {order['status']}")

    # 5. Test Restaurant Partner Login and Order Status Update
    print("Testing Restaurant Partner Order Management...")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "chef@delhidarbar.com",
        "password": "password123"
    })
    assert res.status_code == 200
    rest_token = res.json()["access_token"]
    rest_headers = {"Authorization": f"Bearer {rest_token}"}

    # Update order to PREPARING
    res = requests.patch(
        f"{BASE_URL}/orders/{order_id}/status",
        json={"status": "PREPARING"},
        headers=rest_headers
    )
    assert res.status_code == 200, f"Order update failed: {res.text}"
    updated_order = res.json()
    assert updated_order["status"] == "PREPARING"
    print(f"  [OK] Order status advanced to: {updated_order['status']}")

    # 6. Test Admin Login and Platform Analytics
    print("Testing Admin Platform Analytics...")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@foodhub.com",
        "password": "password123"
    })
    assert res.status_code == 200
    admin_token = res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    res = requests.get(f"{BASE_URL}/admin/stats", headers=admin_headers)
    assert res.status_code == 200, f"Admin stats failed: {res.text}"
    stats = res.json()
    print(f"  [OK] Admin KPIs - Revenue: INR {stats['total_revenue']}, Orders: {stats['total_orders']}, Users: {stats['active_users']}, Restaurants: {stats['total_restaurants']}")

    print("\nALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
