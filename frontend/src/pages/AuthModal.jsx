import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, quickLoginAs } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await register({
          email,
          password,
          full_name: fullName,
          role,
          phone: phone || null,
          address: address || null,
        });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetRole) => {
    setLoading(true);
    setError(null);
    try {
      await quickLoginAs(targetRole);
      onClose();
    } catch (err) {
      setError('Quick login failed');
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: '480px',
          background: '#0f1626',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            background: 'var(--bg-glass-strong)',
            padding: '6px',
            borderRadius: '50%',
          }}
        >
          <X size={18} />
        </button>

        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <button
            onClick={() => { setIsRegister(false); setError(null); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: !isRegister ? '#f59e0b' : 'var(--text-muted)',
              borderBottom: !isRegister ? '2px solid #f59e0b' : 'none',
              transition: 'var(--transition)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(null); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: isRegister ? '#f59e0b' : 'var(--text-muted)',
              borderBottom: isRegister ? '2px solid #f59e0b' : 'none',
              transition: 'var(--transition)'
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Account Type
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['customer', 'restaurant'].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: role === r ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                        border: role === r ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                        color: role === r ? '#f59e0b' : 'var(--text-secondary)'
                      }}
                    >
                      {r === 'restaurant' ? 'Restaurant Partner' : 'Customer'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Delivery Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="123 Ocean Blvd, Apt 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create My Account' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Instant Demo Sign-in
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              onClick={() => handleQuickLogin('customer')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 6px', textAlign: 'center' }}
            >
              Customer
            </button>
            <button
              onClick={() => handleQuickLogin('restaurant')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 6px', textAlign: 'center', color: '#f59e0b' }}
            >
              Partner
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 6px', textAlign: 'center', color: '#ef4444' }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
