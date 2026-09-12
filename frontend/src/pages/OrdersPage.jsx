import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { getMockOrders } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  Package, Clock, CheckCircle, ChefHat, Bike, 
  PackageCheck, RefreshCw, Star, ArrowRight, AlertCircle 
} from 'lucide-react';
import OrderTrackerModal from '../components/OrderTrackerModal';
import ReviewModal from '../components/ReviewModal';

export default function OrdersPage({ onBrowseClick }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders(getMockOrders());
      }
    } catch (err) {
      console.warn('Failed to load orders, using demo orders', err);
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this pending order?')) return;
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'CANCELLED' });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    return <span className={`badge badge-${s}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '6px' }}>
            My Orders & Deliveries
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track live meals in transit or review your past culinary orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={15} /> Refresh List
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Retrieving order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Package size={48} strokeWidth={1.5} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '6px' }}>
            No orders placed yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Your culinary journey starts here. Explore our handcrafted menus.
          </p>
          <button onClick={onBrowseClick} className="btn-primary">
            Explore Restaurants
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-card animate-fade"
              style={{ padding: '24px', position: 'relative' }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                      {order.order_number}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Kitchen: <strong style={{ color: 'var(--text-secondary)' }}>{order.restaurant_name}</strong> • Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                    ₹{order.total_amount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Payment: {order.payment_method.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: '#fff' }}>
                        <strong>{item.quantity}x</strong> {item.item_name}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.customer_notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px' }}>
                    <strong>Note:</strong> "{order.customer_notes}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    style={{
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === 'DELIVERED' && (
                  <button
                    onClick={() => setReviewOrder(order)}
                    className="btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Star size={15} color="#f59e0b" fill="#f59e0b" /> Rate Restaurant
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrderId(order.id)}
                  className="btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Bike size={16} /> Track Live Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Tracker Modal */}
      {selectedOrderId && (
        <OrderTrackerModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onOrderUpdated={fetchOrders}
        />
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <ReviewModal
          restaurantId={reviewOrder.restaurant_id}
          restaurantName={reviewOrder.restaurant_name}
          orderId={reviewOrder.id}
          onClose={() => setReviewOrder(null)}
          onReviewSubmitted={fetchOrders}
        />
      )}
    </div>
  );
}
