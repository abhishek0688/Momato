import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Flame, ShoppingBag, User, LogOut, Shield, Store, 
  ChevronDown, Layers, Check, Menu, X 
} from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenCart, activePage, setActivePage }) {
  const { user, role, logout, quickLoginAs } = useAuth();
  const { totalItemCount } = useCart();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSwitch = async (targetRole) => {
    await quickLoginAs(targetRole);
    setShowRoleMenu(false);
    if (targetRole === 'admin') setActivePage('admin');
    else if (targetRole === 'restaurant') setActivePage('restaurant-portal');
    else setActivePage('home');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
          }}>
            <Flame size={24} color="#0f172a" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 40%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              FoodHub
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600
            }}>
              Artisanal Delivery
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActivePage('home')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              color: activePage === 'home' ? '#fff' : 'var(--text-secondary)',
              background: activePage === 'home' ? 'var(--bg-glass-strong)' : 'transparent',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            Explore
          </button>

          {user && (
            <button
              onClick={() => setActivePage('orders')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                color: activePage === 'orders' ? '#fff' : 'var(--text-secondary)',
                background: activePage === 'orders' ? 'var(--bg-glass-strong)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'var(--transition)'
              }}
            >
              My Orders
            </button>
          )}

          {(role === 'restaurant' || role === 'admin') && (
            <button
              onClick={() => setActivePage('restaurant-portal')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                color: activePage === 'restaurant-portal' ? '#f59e0b' : 'var(--text-secondary)',
                background: activePage === 'restaurant-portal' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                border: activePage === 'restaurant-portal' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition)'
              }}
            >
              <Store size={16} /> Partner Portal
            </button>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setActivePage('admin')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                color: activePage === 'admin' ? '#ef4444' : 'var(--text-secondary)',
                background: activePage === 'admin' ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
                border: activePage === 'admin' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition)'
              }}
            >
              <Shield size={16} /> Admin Panel
            </button>
          )}
        </nav>

        {/* Right Actions: Quick Switcher, Cart Button, Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Role Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'var(--transition)'
              }}
              title="One-click demo role switcher"
            >
              <Layers size={14} color="#f59e0b" />
              <span>Role: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{role}</strong></span>
              <ChevronDown size={14} />
            </button>

            {showRoleMenu && (
              <div 
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '210px',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  zIndex: 100,
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Quick Switch Demo
                </div>
                {[
                  { id: 'customer', label: 'Customer (Aarav)', icon: User },
                  { id: 'restaurant', label: 'Partner (Delhi Darbar)', icon: Store },
                  { id: 'admin', label: 'Admin (Director)', icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = role === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRoleSwitch(item.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                        color: isActive ? '#f59e0b' : 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Drawer Button */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              background: totalItemCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-glass-strong)',
              border: totalItemCount > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
              padding: '9px 16px',
              borderRadius: 'var(--radius-full)',
              color: totalItemCount > 0 ? '#f59e0b' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            <ShoppingBag size={18} />
            <span style={{ display: 'inline-block' }}>Cart</span>
            {totalItemCount > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: '#0f172a',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                lineHeight: 1,
              }}>
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Auth Info */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-glass-strong)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={16} color="#f59e0b" />
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.full_name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'var(--bg-glass-strong)',
                  border: '1px solid var(--border-subtle)',
                  padding: '8px',
                  borderRadius: '50%',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary btn-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
