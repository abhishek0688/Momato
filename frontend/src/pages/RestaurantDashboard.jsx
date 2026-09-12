import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { getMockRestaurantById, getMockRestaurantOrders } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  Store, Utensils, DollarSign, Clock, CheckCircle2, 
  XCircle, Plus, Trash2, Edit3, ToggleLeft, ToggleRight, 
  ChefHat, Bike, PackageCheck, AlertCircle, RefreshCw, X 
} from 'lucide-react';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  // New Dish Form State
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishCategory, setDishCategory] = useState('Mains');
  const [dishImage, setDishImage] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const restRes = await api.get('/restaurants/mine/profile');
      if (restRes?.data && typeof restRes.data === 'object' && restRes.data.id) {
        setRestaurant(restRes.data);
        setMenuItems(restRes.data.menu_items || []);
        const ordersRes = await api.get(`/orders/restaurant/${restRes.data.id}`);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : getMockRestaurantOrders(restRes.data.id));
      } else {
        const mockRest = getMockRestaurantById(1);
        setRestaurant(mockRest);
        setMenuItems(mockRest.menu_items || []);
        setOrders(getMockRestaurantOrders(1));
      }
    } catch (err) {
      console.warn('Using demo restaurant data for portal view', err);
      const mockRest = getMockRestaurantById(1);
      setRestaurant(mockRest);
      setMenuItems(mockRest.menu_items || []);
      setOrders(getMockRestaurantOrders(1));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: nextStatus });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update order status');
    }
  };

  const handleToggleStock = async (itemId) => {
    try {
      await api.patch(`/menu/${itemId}/availability`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to toggle stock status');
    }
  };

  const handleDeleteDish = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this dish from your menu?')) return;
    try {
      await api.delete(`/menu/${itemId}`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menu', {
        name: dishName,
        description: dishDesc,
        price: parseFloat(dishPrice),
        category: dishCategory,
        image_url: dishImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        is_vegetarian: isVeg,
        is_spicy: isSpicy,
        is_available: true,
      });
      setShowAddDishModal(false);
      setDishName('');
      setDishDesc('');
      setDishPrice('');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add dish');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading partner portal...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>No Restaurant Registered</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Please log in as a Restaurant Partner (e.g. bella@napoli.com) to manage kitchen orders.
        </p>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const activeOrders = orders.filter((o) => ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status));
  const completedOrders = orders.filter((o) => ['DELIVERED', 'REJECTED', 'CANCELLED'].includes(o.status));
  const totalRevenue = orders.reduce((sum, o) => o.status === 'DELIVERED' ? sum + o.total_amount : sum, 0);

  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            <Store size={16} /> Partner Kitchen Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>
            {restaurant.name}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={activeTab === 'orders' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
          >
            Live Orders ({pendingOrders.length + activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={activeTab === 'menu' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
          >
            Menu Manager ({menuItems.length})
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Action Required</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: pendingOrders.length > 0 ? '#f59e0b' : '#fff' }}>
            {pendingOrders.length} Pending
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Incoming customer orders</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active in Kitchen</span>
            <ChefHat size={20} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {activeOrders.length} Cooking
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Confirmed or out for delivery</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Delivered Revenue</span>
            <DollarSign size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>From completed deliveries</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Menu Dishes</span>
            <Utensils size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {menuItems.length} Dishes
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{menuItems.filter(i => i.is_available).length} currently in stock</div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <div>
          {/* Pending Orders Alert Section */}
          {pendingOrders.length > 0 && (
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#f59e0b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} className="pulse-active" />
                New Incoming Orders (Action Required)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {pendingOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="glass-card" 
                    style={{
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '20px',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{order.order_number}</span>
                      <span className="badge badge-pending">PENDING</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Delivery to: <strong style={{ color: '#fff' }}>{order.delivery_address}</strong>
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fff' }}>
                          <span><strong>{item.quantity}x</strong> {item.item_name}</span>
                          <span>₹{item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.customer_notes && (
                        <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '6px' }}>
                          Note: "{order.customer_notes}"
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total:</span>
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.15rem' }}>₹{order.total_amount.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#ef4444',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                        className="btn-primary"
                        style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active In-Progress Kitchen Orders */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '14px' }}>
              Kitchen Orders in Progress ({activeOrders.length})
            </h2>

            {activeOrders.length === 0 ? (
              <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active orders being cooked right now.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {activeOrders.map((order) => (
                  <div key={order.id} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{order.order_number}</span>
                      <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Customer: <strong>{order.customer_name || 'Customer'}</strong> • {order.delivery_address}
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fff' }}>
                          <span><strong>{item.quantity}x</strong> {item.item_name}</span>
                          <span>₹{item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Sequential Progress Action */}
                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                      >
                        <ChefHat size={16} /> Start Cooking Dish
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'OUT_FOR_DELIVERY')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
                      >
                        <Bike size={16} /> Dispatch with Driver
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <PackageCheck size={16} /> Confirm Delivered
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Menu Management Tab */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>
              Menu Catalog & Stock Control
            </h2>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add New Dish
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: item.is_available ? '1px solid var(--border-subtle)' : '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '1rem', color: '#fff' }}>{item.name}</h4>
                      <span style={{ color: '#f59e0b', fontWeight: 800 }}>₹{item.price.toFixed(0)}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', flexGrow: 1, marginBottom: '14px' }}>
                  {item.description}
                </p>

                {/* Bottom Bar: Stock Toggle and Delete */}
                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => handleToggleStock(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: item.is_available ? '#10b981' : '#ef4444'
                    }}
                  >
                    {item.is_available ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    <span>{item.is_available ? 'In Stock' : 'Out of Stock'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDish(item.id)}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    title="Delete dish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddDishModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div 
            className="glass-card animate-fade"
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#0f1626',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowAddDishModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                color: 'var(--text-muted)',
                background: 'var(--bg-glass-strong)',
                padding: '6px',
                borderRadius: '50%'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '16px' }}>
              Add Dish to Menu
            </h3>

            <form onSubmit={handleAddDish} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Mushroom Risotto"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ingredients, preparation notes, flavor profile..."
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="250"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Image URL (or Unsplash photo)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={dishImage}
                  onChange={(e) => setDishImage(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', margin: '4px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                  />
                  Vegetarian
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isSpicy}
                    onChange={(e) => setIsSpicy(e.target.checked)}
                  />
                  Spicy
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
