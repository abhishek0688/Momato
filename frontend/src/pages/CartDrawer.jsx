import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, 
  MapPin, AlertCircle, CheckCircle, Sparkles 
} from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onOrderPlaced, onOpenAuth }) {
  const { cartItems, restaurant, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, tax, total } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState(user?.address || '742 Evergreen Terrace, Apt 4B');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (cartItems.length === 0) return;

    if (subtotal < (restaurant?.minimum_order || 0)) {
      setError(`Minimum order amount for ${restaurant?.name} is ₹${restaurant?.minimum_order?.toFixed(0)}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        restaurant_id: restaurant.id,
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
        delivery_address: address,
        customer_notes: notes || null,
        payment_method: 'CREDIT_CARD',
      };

      const res = await api.post('/orders', payload);
      clearCart();
      onClose();
      if (onOrderPlaced) onOrderPlaced(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 900,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#0d131f',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Your Food Tray</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-glass-strong)',
              border: '1px solid var(--border-subtle)',
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
            <ShoppingBag size={48} strokeWidth={1.5} style={{ marginBottom: '14px', opacity: 0.4 }} />
            <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>Your tray is empty</p>
            <p style={{ fontSize: '0.88rem', maxWidth: '240px' }}>Explore dishes from our artisan kitchens and add your favorites.</p>
          </div>
        ) : (
          <>
            {/* Restaurant indicator */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ordering from: <strong style={{ color: '#fff' }}>{restaurant?.name}</strong></span>
              <button onClick={clearCart} style={{ color: '#ef4444', fontSize: '0.78rem' }}>Clear All</button>
            </div>

            {/* Items List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', marginBottom: '20px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>₹{item.price.toFixed(0)}</div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ color: 'var(--text-muted)', padding: '2px' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ color: '#f59e0b', padding: '2px' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address & Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Delivery Address:
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, apartment, suite..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 32px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Kitchen notes (e.g. extra sauce, gate code #404)"
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Cost Breakdown */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(0)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>Estimated Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>
                <span>Total</span>
                <span style={{ color: '#f59e0b' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
            >
              {submitting ? 'Placing Order...' : !user ? 'Sign In to Order' : `Place Order • ₹${total.toFixed(2)}`}
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
