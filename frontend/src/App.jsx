import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import OrdersPage from './pages/OrdersPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartDrawer from './pages/CartDrawer';
import AuthModal from './pages/AuthModal';
import OrderTrackerModal from './components/OrderTrackerModal';

function MainApp() {
  const { user, role } = useAuth();

  const [activePage, setActivePage] = useState('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const handleSelectRestaurant = (id) => {
    setSelectedRestaurantId(id);
    setActivePage('restaurant-detail');
  };

  const handleOrderPlaced = (order) => {
    setTrackingOrderId(order.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'admin' && role !== 'admin') {
            setIsAuthOpen(true);
            return;
          }
          if (page === 'restaurant-portal' && role !== 'restaurant' && role !== 'admin') {
            setIsAuthOpen(true);
            return;
          }
          setActivePage(page);
        }}
      />

      <main style={{ flexGrow: 1 }}>
        {activePage === 'home' && (
          <HomePage onSelectRestaurant={handleSelectRestaurant} />
        )}

        {activePage === 'restaurant-detail' && (
          <RestaurantPage
            restaurantId={selectedRestaurantId}
            onBack={() => setActivePage('home')}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activePage === 'orders' && (
          <OrdersPage onBrowseClick={() => setActivePage('home')} />
        )}

        {activePage === 'restaurant-portal' && (
          <RestaurantDashboard />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Live Order Tracker Modal */}
      {trackingOrderId && (
        <OrderTrackerModal
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
