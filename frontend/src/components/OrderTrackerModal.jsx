import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { getMockOrderById } from '../api/mockData';
import { 
  X, CheckCircle, Clock, ChefHat, Bike, PackageCheck, AlertCircle, RefreshCw 
} from 'lucide-react';

const STEPS = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Sent to restaurant kitchen', icon: Clock },
  { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Accepted by partner', icon: CheckCircle },
  { key: 'PREPARING', label: 'Preparing Dishes', desc: 'Crafted fresh with care', icon: ChefHat },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Driver is on the way', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your doorstep', icon: PackageCheck },
];

export default function OrderTrackerModal({ orderId, onClose, onOrderUpdated }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data && typeof res.data === 'object' && res.data.id && typeof res.data.status === 'string') {
        setOrder(res.data);
        if (onOrderUpdated) onOrderUpdated(res.data);
        return;
      }
      throw new Error('Invalid order response');
    } catch (err) {
      const mock = getMockOrderById(orderId);
      setOrder(mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Live polling every 4 seconds
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const getCurrentStepIndex = () => {
    if (!order || !order.status || typeof order.status !== 'string') return 0;
    const s = order.status.toUpperCase();
    if (s === 'REJECTED' || s === 'CANCELLED') return -1;
    const idx = STEPS.findIndex((step) => step.key === s);
    return idx !== -1 ? idx : 0;
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-card animate-fade"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0f1626',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            background: 'var(--bg-glass-strong)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} className="pulse-active" />
            Live Delivery Tracking
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>
            Order {order?.order_number || `#${orderId}`}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Restaurant: <strong>{order?.restaurant_name || 'Partner Kitchen'}</strong>
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            Connecting to live telemetry...
          </div>
        ) : error ? (
          <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        ) : (
          <>
            {/* Timeline Stepper */}
            {order.status === 'CANCELLED' || order.status === 'REJECTED' ? (
              <div style={{
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#fca5a5',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <AlertCircle size={28} style={{ margin: '0 auto 8px', color: '#ef4444' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#ef4444', marginBottom: '4px' }}>
                  Order {order.status}
                </h3>
                <p style={{ fontSize: '0.85rem' }}>This order was declined or cancelled. You have not been charged.</p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                  {STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = currentIndex > idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                        {/* Connecting Line */}
                        {idx < STEPS.length - 1 && (
                          <div style={{
                            position: 'absolute',
                            left: '19px',
                            top: '38px',
                            bottom: '-20px',
                            width: '2px',
                            background: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.1)'
                          }} />
                        )}

                        {/* Step Circle */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isDone 
                            ? '#10b981' 
                            : isCurrent 
                            ? 'linear-gradient(135deg, #f59e0b, #f97316)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isCurrent 
                            ? '2px solid #f59e0b' 
                            : isDone 
                            ? '2px solid #10b981' 
                            : '2px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDone || isCurrent ? '#0f172a' : 'var(--text-muted)',
                          zIndex: 2,
                          boxShadow: isCurrent ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none',
                          flexShrink: 0
                        }}>
                          <StepIcon size={20} strokeWidth={2.5} />
                        </div>

                        {/* Step Text */}
                        <div style={{ paddingTop: '6px', flexGrow: 1 }}>
                          <div style={{
                            fontSize: '0.95rem',
                            fontWeight: isCurrent || isDone ? 700 : 500,
                            color: isCurrent ? '#f59e0b' : isDone ? '#fff' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span>{step.label}</span>
                            {isCurrent && (
                              <span className="badge badge-preparing" style={{ fontSize: '0.7rem' }}>
                                In Progress
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items & Summary Details */}
            <div style={{
              background: 'var(--bg-glass-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Order Items ({order.items?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: '#fff' }}>
                      <strong>{item.quantity}x</strong> {item.item_name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#fff' }}>
                <span>Total Paid:</span>
                <span style={{ color: '#f59e0b' }}>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <strong>Delivery Address:</strong> {order.delivery_address}
            </div>

            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done Tracking
            </button>
          </>
        )}
      </div>
    </div>
  );
}
