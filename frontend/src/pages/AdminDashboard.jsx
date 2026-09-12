import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { getMockStats, getMockRestaurants, getMockOrders } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, TrendingUp, Users, Store, Package, 
  Check, X, AlertCircle, RefreshCw, DollarSign, Activity 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'restaurants' | 'users' | 'orders'

  const fetchAdminData = async () => {
    try {
      const [statsRes, restRes, userRes, orderRes] = await Promise.all([
        api.get('/admin/stats').catch(() => null),
        api.get('/admin/restaurants').catch(() => null),
        api.get('/admin/users').catch(() => null),
        api.get('/admin/orders').catch(() => null)
      ]);

      setStats(statsRes?.data && typeof statsRes.data === 'object' && !Array.isArray(statsRes.data) ? statsRes.data : getMockStats());
      setRestaurants(Array.isArray(restRes?.data) ? restRes.data : getMockRestaurants());
      setUsers(Array.isArray(userRes?.data) ? userRes.data : [
        { id: 1, full_name: 'Platform Administrator', email: 'admin@foodhub.com', role: 'admin', is_active: true, created_at: new Date().toISOString() },
        { id: 2, full_name: 'Aarav Sharma', email: 'customer@foodhub.com', role: 'customer', is_active: true, created_at: new Date().toISOString() },
        { id: 3, full_name: 'Chef Tariq Khan', email: 'chef@delhidarbar.com', role: 'restaurant', is_active: true, created_at: new Date().toISOString() },
      ]);
      setOrders(Array.isArray(orderRes?.data) ? orderRes.data : getMockOrders());
    } catch (err) {
      console.warn('Failed to load admin data, using demo analytics', err);
      setStats(getMockStats());
      setRestaurants(getMockRestaurants());
      setUsers([
        { id: 1, full_name: 'Platform Administrator', email: 'admin@foodhub.com', role: 'admin', is_active: true, created_at: new Date().toISOString() },
        { id: 2, full_name: 'Aarav Sharma', email: 'customer@foodhub.com', role: 'customer', is_active: true, created_at: new Date().toISOString() },
      ]);
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 6000);
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleRestaurantApproval = async (restaurantId, currentApproval) => {
    try {
      await api.patch(`/admin/restaurants/${restaurantId}/approval`, {
        is_approved: !currentApproval,
      });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update restaurant approval');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, {
        is_active: !currentStatus,
      });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Gathering platform analytics...
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            <Shield size={16} /> Platform Executive Command
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>
            Platform Admin Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'restaurants', label: `Restaurants (${restaurants.length})` },
            { id: 'users', label: `Users (${users.length})` },
            { id: 'orders', label: `Live Stream (${orders.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={activeTab === t.id ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total GMV Revenue</span>
            <DollarSign size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
            ₹{stats?.total_revenue?.toFixed(2) || '0.00'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>From delivered orders</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Orders</span>
            <Package size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {stats?.total_orders || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {stats?.pending_orders || 0} in progress
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Users</span>
            <Users size={20} color="#6366f1" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {stats?.active_users || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Diners & Restaurant owners</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kitchen Partners</span>
            <Store size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {stats?.total_restaurants || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Approved merchant listings</div>
        </div>
      </div>

      {/* Tabs View */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {/* Quick Restaurant Table */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
              Partner Accounts Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {restaurants.map((r) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.cuisine_type} • Rating {r.rating.toFixed(1)}</div>
                  </div>
                  <button
                    onClick={() => handleToggleRestaurantApproval(r.id, r.is_approved)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: r.is_approved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: r.is_approved ? '#10b981' : '#ef4444',
                      border: r.is_approved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    {r.is_approved ? 'Approved' : 'Suspended'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Live Orders */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
              Recent Orders Feed
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{o.order_number}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.restaurant_name} • ₹{o.total_amount.toFixed(2)}</div>
                  </div>
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
            Manage All Restaurant Partners
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Restaurant Name</th>
                  <th style={{ padding: '10px' }}>Cuisine</th>
                  <th style={{ padding: '10px' }}>Rating</th>
                  <th style={{ padding: '10px' }}>Fee</th>
                  <th style={{ padding: '10px' }}>Approval Status</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>#{r.id}</td>
                    <td style={{ padding: '12px 10px', color: '#fff', fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{r.cuisine_type}</td>
                    <td style={{ padding: '12px 10px', color: '#f59e0b', fontWeight: 700 }}>★ {r.rating.toFixed(1)}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>₹{r.delivery_fee.toFixed(0)}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={r.is_approved ? 'badge badge-delivered' : 'badge badge-cancelled'}>
                        {r.is_approved ? 'Approved' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <button
                        onClick={() => handleToggleRestaurantApproval(r.id, r.is_approved)}
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        {r.is_approved ? 'Revoke' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
            Registered Users Directory
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Full Name</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Role</th>
                  <th style={{ padding: '10px' }}>Account Status</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td style={{ padding: '12px 10px', color: '#fff', fontWeight: 600 }}>{u.full_name}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600, color: u.role === 'admin' ? '#ef4444' : u.role === 'restaurant' ? '#f59e0b' : '#38bdf8' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={u.is_active ? 'badge badge-delivered' : 'badge badge-cancelled'}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          className="btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          {u.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
            Platform Real-Time Orders Stream
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((o) => (
              <div
                key={o.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, color: '#fff' }}>{o.order_number}</span>
                    <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Kitchen: <strong>{o.restaurant_name}</strong> • Diner: {o.customer_name || 'Customer'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1.05rem' }}>
                    ₹{o.total_amount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {o.items?.length || 0} items
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
