import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { getMockRestaurantById, getMockReviews } from '../api/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Star, Clock, Bike, ArrowLeft, Plus, Minus, Check, 
  Sparkles, Flame, MessageSquare, ShieldAlert 
} from 'lucide-react';
import ReviewModal from '../components/ReviewModal';

export default function RestaurantPage({ restaurantId, onBack, onOpenCart }) {
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { cartItems, addToCart, updateQuantity } = useCart();
  const { user } = useAuth();

  const fetchDetails = async () => {
    try {
      const [restRes, revRes] = await Promise.all([
        api.get(`/restaurants/${restaurantId}`).catch(() => null),
        api.get(`/reviews/restaurant/${restaurantId}`).catch(() => null)
      ]);

      const restData = restRes?.data && typeof restRes.data === 'object' && !Array.isArray(restRes.data) && restRes.data.id
        ? restRes.data
        : getMockRestaurantById(restaurantId);

      const revData = revRes?.data && Array.isArray(revRes.data)
        ? revRes.data
        : getMockReviews(restaurantId);

      setRestaurant(restData);
      setReviews(revData);
    } catch (err) {
      console.warn('Failed to load restaurant details, using demo data', err);
      setRestaurant(getMockRestaurantById(restaurantId));
      setReviews(getMockReviews(restaurantId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Preparing menu selections...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Restaurant not found</h2>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '16px' }}>
          Back to Kitchens
        </button>
      </div>
    );
  }

  // Group categories
  const categories = ['All', ...new Set(restaurant.menu_items?.map((item) => item.category) || [])];

  const filteredItems = selectedCategory === 'All'
    ? restaurant.menu_items || []
    : (restaurant.menu_items || []).filter((item) => item.category === selectedCategory);

  const getItemQuantity = (itemId) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          margin: '24px 0 16px 0',
          fontSize: '0.9rem',
          fontWeight: 600,
          transition: 'var(--transition)'
        }}
      >
        <ArrowLeft size={18} /> Back to All Restaurants
      </button>

      {/* Hero Banner Card */}
      <div 
        className="glass-card" 
        style={{
          overflow: 'hidden',
          marginBottom: '36px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{
          height: '240px',
          position: 'relative',
          backgroundImage: `url(${restaurant.banner_url || restaurant.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10, 13, 20, 0.2) 0%, rgba(10, 13, 20, 0.95) 100%)'
          }} />
        </div>

        <div style={{ padding: '0 32px 28px 32px', marginTop: '-40px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-pending" style={{ fontSize: '0.78rem' }}>
                  {restaurant.cuisine_type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" /> {restaurant.rating.toFixed(1)} ({restaurant.rating_count} reviews)
                </span>
              </div>
              <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '6px' }}>
                {restaurant.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {restaurant.description}
              </p>
            </div>

            {/* Delivery specs pill */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 20px',
              display: 'flex',
              gap: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Delivery</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{restaurant.delivery_time_minutes} mins</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivery Fee</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: restaurant.delivery_fee === 0 ? '#10b981' : '#fff' }}>
                  {restaurant.delivery_fee === 0 ? 'Free' : `₹${restaurant.delivery_fee.toFixed(0)}`}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min. Order</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>₹{restaurant.minimum_order.toFixed(0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
        marginBottom: '32px'
      }}>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.9rem',
                background: active ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                border: active ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                color: active ? '#f59e0b' : 'var(--text-secondary)',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Dishes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {filteredItems.map((item) => {
          const qty = getItemQuantity(item.id);

          return (
            <div
              key={item.id}
              className="glass-card animate-fade"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {item.image_url && (
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Dietary badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    {item.is_vegetarian && (
                      <span className="badge badge-veg">Veg</span>
                    )}
                    {item.is_spicy && (
                      <span className="badge badge-spicy">Spicy</span>
                    )}
                  </div>
                </div>
              )}

              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{item.name}</h3>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b' }}>
                    ₹{item.price.toFixed(0)}
                  </span>
                </div>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  flexGrow: 1
                }}>
                  {item.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.calories ? `${item.calories} kcal` : item.category}
                  </span>

                  {!item.is_available ? (
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>
                      Out of Stock
                    </span>
                  ) : qty > 0 ? (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        style={{ color: '#f59e0b', padding: '2px' }}
                      >
                        <Minus size={15} />
                      </button>
                      <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem', minWidth: '16px', textAlign: 'center' }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, qty + 1)}
                        style={{ color: '#f59e0b', padding: '2px' }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, restaurant)}
                      className="btn-primary btn-sm"
                    >
                      <Plus size={15} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Reviews Section */}
      <section style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>
              Guest Reviews & Ratings
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Verified feedback from diners who ordered from {restaurant.name}
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageSquare size={16} /> Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            No reviews yet. Be the first to share your dining experience!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                    {rev.customer_name || 'Verified Diner'}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? '#f59e0b' : 'transparent'}
                        color={i < rev.rating ? '#f59e0b' : 'var(--text-muted)'}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={fetchDetails}
        />
      )}
    </div>
  );
}
