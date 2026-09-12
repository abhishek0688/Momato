import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('foodhub_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('foodhub_cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      localStorage.removeItem('foodhub_cart_restaurant');
      setRestaurant(null);
    } else if (restaurant) {
      localStorage.setItem('foodhub_cart_restaurant', JSON.stringify(restaurant));
    }
  }, [cartItems, restaurant]);

  const addToCart = (item, restInfo) => {
    // If cart has items from another restaurant, reset cart to new restaurant
    if (restaurant && restaurant.id !== restInfo.id && cartItems.length > 0) {
      const confirmReset = window.confirm(
        `Your cart has items from ${restaurant.name}. Would you like to clear the cart and start an order from ${restInfo.name}?`
      );
      if (!confirmReset) return false;
      setCartItems([{ ...item, quantity: 1 }]);
      setRestaurant(restInfo);
      return true;
    }

    setRestaurant(restInfo);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    return true;
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
  };

  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = roundPrice(cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0));
  const deliveryFee = restaurant?.delivery_fee ?? 2.99;
  const tax = roundPrice(subtotal * 0.05);
  const total = roundPrice(subtotal + deliveryFee + tax);

  function roundPrice(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurant,
        totalItemCount,
        subtotal,
        deliveryFee,
        tax,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
