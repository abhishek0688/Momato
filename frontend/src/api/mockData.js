// Comprehensive demo data for standalone preview, testing, and offline fallback

export const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: 'Delhi Darbar & Royal Biryani',
    description: 'Legendary slow-cooked Hyderabadi and Awadhi dum biryanis, velvety butter chicken, rich Dal Makhani, and tandoori charcoal kebabs.',
    cuisine_type: 'Indian',
    rating: 4.9,
    rating_count: 384,
    delivery_time_minutes: 25,
    delivery_fee: 35.0,
    minimum_order: 199.0,
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    banner_url: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1200&q=80',
    address: '45 Heritage Fort Road, Connaught Place, New Delhi',
    phone: '+91 98333 44556',
    is_approved: true,
    is_active: true,
    menu_items: [
      {
        id: 101,
        name: 'Hyderabadi Shahi Dum Biryani',
        description: 'Fragrant basmati rice layered with marinated tender pieces, saffron, brown onions, and royal spices. Served with cooling cucumber raita.',
        price: 380,
        category: 'Biryani & Rice',
        is_available: true,
        is_vegetarian: false,
        is_spicy: true,
        image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 102,
        name: 'Old Delhi Butter Chicken (Murgh Makhani)',
        description: 'Charcoal-grilled chicken morsels steeped in a rich, satin-smooth tomato, cashew nut, and butter gravy with kasuri methi.',
        price: 420,
        category: 'Mains & Curries',
        is_available: true,
        is_vegetarian: false,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 103,
        name: 'Dal Makhani Bukhara Style',
        description: 'Black lentils slow-cooked overnight with churned butter, cream, and subtle ginger garlic aromatics.',
        price: 310,
        category: 'Mains & Curries',
        is_available: true,
        is_vegetarian: true,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 104,
        name: 'Paneer Tikka Angara',
        description: 'Soft cottage cheese cubes marinated in spiced hung curd, smoked in a clay oven with bell peppers and onion bulbs.',
        price: 290,
        category: 'Starters & Tandoor',
        is_available: true,
        is_vegetarian: true,
        is_spicy: true,
        image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 105,
        name: 'Garlic & Butter Chur-Chur Naan',
        description: 'Crispy, flaky, multi-layered tandoori flatbread brushed with garlic butter and fresh coriander.',
        price: 75,
        category: 'Breads',
        is_available: true,
        is_vegetarian: true,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 2,
    name: 'Tokyo Artisan Ramen & Sushi',
    description: 'Slow-simmered 18-hour broth, hand-pulled noodles, and pristine seafood platters prepared by master sushi chefs.',
    cuisine_type: 'Japanese',
    rating: 4.8,
    rating_count: 194,
    delivery_time_minutes: 30,
    delivery_fee: 45.0,
    minimum_order: 249.0,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    banner_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    address: '88 Sakura Avenue, Indiranagar, Bengaluru',
    phone: '+91 98444 55667',
    is_approved: true,
    is_active: true,
    menu_items: [
      {
        id: 201,
        name: 'Truffle Tonkotsu Ramen',
        description: 'Silky rich 18-hour pork broth with springy noodles, chashu, nitamago egg, menma, and black truffle drizzle.',
        price: 540,
        category: 'Ramen',
        is_available: true,
        is_vegetarian: false,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 202,
        name: 'Spicy Miso Veggie Ramen',
        description: 'Roasted red miso vegetable broth with bok choy, corn, wood-ear mushrooms, bamboo shoots, and rayu chili oil.',
        price: 460,
        category: 'Ramen',
        is_available: true,
        is_vegetarian: true,
        is_spicy: true,
        image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 203,
        name: 'Dragon Roll Sushi Platter (8 pcs)',
        description: 'Crispy tempura prawn and avocado wrapped with tobiko caviar, sweet eel glaze, and spicy kewpie mayo.',
        price: 590,
        category: 'Sushi',
        is_available: true,
        is_vegetarian: false,
        is_spicy: true,
        image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 204,
        name: 'Crispy Pan-Fried Gyoza',
        description: 'Handcrafted dumplings filled with minced chicken, scallions, and water chestnuts with ponzu dip.',
        price: 320,
        category: 'Appetizers',
        is_available: true,
        is_vegetarian: false,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 3,
    name: 'Smokey Burger Lab',
    description: 'Double smashed gourmet patties, toasted brioche buns, melted cheddar, crisp onions, and homemade spicy umami sauces.',
    cuisine_type: 'Burgers',
    rating: 4.7,
    rating_count: 260,
    delivery_time_minutes: 20,
    delivery_fee: 30.0,
    minimum_order: 149.0,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    address: '14 Carter Road, Bandra West, Mumbai',
    phone: '+91 98555 66778',
    is_approved: true,
    is_active: true,
    menu_items: [
      {
        id: 301,
        name: 'The Ultimate Double Smash Truffle Burger',
        description: 'Two smashed patties seared crispy, double smoked gouda cheese, truffle aioli, caramelized onions on butter brioche.',
        price: 390,
        category: 'Burgers',
        is_available: true,
        is_vegetarian: false,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 302,
        name: 'Nashville Hot Crispy Chicken Burger',
        description: 'Buttermilk fried chicken dipped in spicy Nashville chili glaze, creamy slaw, house pickles, garlic mayo.',
        price: 360,
        category: 'Burgers',
        is_available: true,
        is_vegetarian: false,
        is_spicy: true,
        image_url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 303,
        name: 'Crispy Truffle Parmesan Fries',
        description: 'Golden skin-on fries tossed in white truffle oil, grated aged parmesan, and fresh rosemary with garlic dip.',
        price: 180,
        category: 'Sides',
        is_available: true,
        is_vegetarian: true,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 4,
    name: 'Green Bowl Superfoods',
    description: '100% wholesome nourish bowls, fresh cold-pressed vitality juices, organic seasonal salads, and superfood parfaits.',
    cuisine_type: 'Healthy',
    rating: 4.9,
    rating_count: 142,
    delivery_time_minutes: 20,
    delivery_fee: 0.0,
    minimum_order: 199.0,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    banner_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    address: '200 Greenway Park, Koramangala, Bengaluru',
    phone: '+91 98666 77889',
    is_approved: true,
    is_active: true,
    menu_items: [
      {
        id: 401,
        name: 'Avocado Quinoa Super-Power Bowl',
        description: 'Hass avocado, tri-color quinoa, roasted chickpeas, kale, edamame, pomegranate, and creamy lemon tahini dressing.',
        price: 340,
        category: 'Bowls',
        is_available: true,
        is_vegetarian: true,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 402,
        name: 'Smoked Salmon Teriyaki Poke Bowl',
        description: 'Sustainably sourced salmon, brown rice, seaweed salad, cucumber, pickled ginger, sesame, and wasabi shoyu.',
        price: 490,
        category: 'Bowls',
        is_available: true,
        is_vegetarian: false,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 403,
        name: 'Cold-Pressed Green Glow Detox (300ml)',
        description: 'Green apple, celery, cucumber, kale, lemon, and organic baby spinach. Zero added sugar or water.',
        price: 180,
        category: 'Juices & Smoothies',
        is_available: true,
        is_vegetarian: true,
        is_spicy: false,
        image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

export const MOCK_REVIEWS = [
  {
    id: 1,
    restaurant_id: 1,
    rating: 5,
    comment: 'The Hyderabadi Dum Biryani arrived piping hot! Authentic aroma, succulent pieces, and the raita was delicious.',
    customer_name: 'Aarav Sharma',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 2,
    restaurant_id: 1,
    rating: 5,
    comment: 'Butter chicken and garlic naan combination was sublime. Top quality restaurant in Connaught Place!',
    customer_name: 'Priya Patel',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 3,
    restaurant_id: 2,
    rating: 5,
    comment: 'Best ramen broth in the city. Noodles had great chewiness and the chashu was meltingly soft.',
    customer_name: 'Rohan Mehta',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export const MOCK_ORDERS = [
  {
    id: 5001,
    order_number: 'ORD-8821',
    restaurant_id: 1,
    restaurant: {
      name: 'Delhi Darbar & Royal Biryani',
      cuisine_type: 'Indian',
      image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      phone: '+91 98333 44556',
    },
    status: 'PREPARING',
    subtotal: 800.0,
    delivery_fee: 35.0,
    tax: 40.0,
    total_amount: 875.0,
    delivery_address: 'Flat 402, Lotus Greens, Sector 78, Noida',
    customer_notes: 'Please keep spicy gravy separate',
    estimated_delivery_time: new Date(Date.now() + 18 * 60000).toISOString(),
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    items: [
      {
        id: 1,
        menu_item_name: 'Hyderabadi Shahi Dum Biryani',
        unit_price: 380.0,
        quantity: 1,
        total_price: 380.0,
      },
      {
        id: 2,
        menu_item_name: 'Old Delhi Butter Chicken (Murgh Makhani)',
        unit_price: 420.0,
        quantity: 1,
        total_price: 420.0,
      },
    ],
  },
  {
    id: 4992,
    order_number: 'ORD-7640',
    restaurant_id: 3,
    restaurant: {
      name: 'Smokey Burger Lab',
      cuisine_type: 'Burgers',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      phone: '+91 98555 66778',
    },
    status: 'DELIVERED',
    subtotal: 570.0,
    delivery_fee: 30.0,
    tax: 28.5,
    total_amount: 628.5,
    delivery_address: 'Flat 402, Lotus Greens, Sector 78, Noida',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        id: 3,
        menu_item_name: 'The Ultimate Double Smash Truffle Burger',
        unit_price: 390.0,
        quantity: 1,
        total_price: 390.0,
      },
      {
        id: 4,
        menu_item_name: 'Crispy Truffle Parmesan Fries',
        unit_price: 180.0,
        quantity: 1,
        total_price: 180.0,
      },
    ],
  },
];

export const MOCK_STATS = {
  total_revenue: 148900.0,
  total_orders: 342,
  active_users: 184,
  total_restaurants: 4,
  pending_orders: 3,
  delivered_orders: 326,
};

// Helper functions for fallback retrieval
export function getMockRestaurants(filters = {}) {
  let list = [...MOCK_RESTAURANTS];
  const { query, cuisine, min_rating, sort_by } = filters;

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine_type.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }

  if (cuisine && cuisine !== 'All') {
    list = list.filter((r) => r.cuisine_type.toLowerCase() === cuisine.toLowerCase());
  }

  if (min_rating) {
    list = list.filter((r) => r.rating >= parseFloat(min_rating));
  }

  if (sort_by === 'delivery_time') {
    list.sort((a, b) => a.delivery_time_minutes - b.delivery_time_minutes);
  } else if (sort_by === 'delivery_fee') {
    list.sort((a, b) => a.delivery_fee - b.delivery_fee);
  } else {
    // Default highest rating
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

export function getMockRestaurantById(id) {
  const numId = parseInt(id, 10);
  const found = MOCK_RESTAURANTS.find((r) => r.id === numId);
  return found || MOCK_RESTAURANTS[0];
}

export function getMockReviews(restaurantId) {
  const numId = parseInt(restaurantId, 10);
  const filtered = MOCK_REVIEWS.filter((rev) => rev.restaurant_id === numId);
  return filtered.length > 0 ? filtered : MOCK_REVIEWS;
}

export function getMockOrders() {
  return [...MOCK_ORDERS];
}

export function getMockRestaurantOrders(restaurantId = 1) {
  return [...MOCK_ORDERS];
}

export function getMockStats() {
  return { ...MOCK_STATS };
}

export function getMockUser(role = 'customer') {
  if (role === 'restaurant') {
    return {
      id: 4,
      email: 'chef@delhidarbar.com',
      full_name: 'Chef Tariq Khan',
      role: 'restaurant',
      phone: '+91 98333 44556',
      address: '45 Heritage Fort Road, Connaught Place, New Delhi',
    };
  }
  if (role === 'admin') {
    return {
      id: 1,
      email: 'admin@foodhub.com',
      full_name: 'Platform Administrator',
      role: 'admin',
      phone: '+91 98765 43210',
      address: 'FoodHub Tower, Cyber City, Gurugram, India',
    };
  }
  return {
    id: 2,
    email: 'customer@foodhub.com',
    full_name: 'Aarav Sharma',
    role: 'customer',
    phone: '+91 98111 22334',
    address: 'Flat 402, Lotus Greens, Sector 78, Noida',
  };
}

let mockOrderCounter = 6000;
export function createMockOrder(orderData) {
  mockOrderCounter += 1;
  const rest = getMockRestaurantById(orderData.restaurant_id);
  const items = (orderData.items || []).map((it, idx) => {
    const menuItem = rest.menu_items?.find((m) => m.id === it.menu_item_id) || {
      name: 'Artisan Dish',
      price: 250,
    };
    return {
      id: idx + 1,
      menu_item_name: menuItem.name,
      unit_price: menuItem.price,
      quantity: it.quantity,
      total_price: menuItem.price * it.quantity,
    };
  });

  const subtotal = items.reduce((acc, i) => acc + i.total_price, 0);
  const delivery_fee = rest.delivery_fee || 35.0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total_amount = subtotal + delivery_fee + tax;

  const newOrder = {
    id: mockOrderCounter,
    order_number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    restaurant_id: rest.id,
    restaurant: {
      name: rest.name,
      cuisine_type: rest.cuisine_type,
      image_url: rest.image_url,
      phone: rest.phone,
    },
    status: 'PENDING',
    subtotal,
    delivery_fee,
    tax,
    total_amount,
    delivery_address: orderData.delivery_address || '742 Evergreen Terrace',
    customer_notes: orderData.customer_notes || null,
    estimated_delivery_time: new Date(Date.now() + 25 * 60000).toISOString(),
    created_at: new Date().toISOString(),
    items,
  };

  MOCK_ORDERS.unshift(newOrder);
  return newOrder;
}

export function getMockOrderById(id) {
  const numId = parseInt(id, 10);
  const found = MOCK_ORDERS.find((o) => o.id === numId);
  if (found) return found;

  return {
    ...MOCK_ORDERS[0],
    id: numId,
    order_number: `ORD-${numId}`,
  };
}
