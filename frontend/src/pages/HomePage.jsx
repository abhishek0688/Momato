import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, Star, Clock, Bike, Sparkles, Filter, ChevronRight } from 'lucide-react';

const CUISINES = [
  { id: 'All', label: 'All Cuisines', emoji: '🍽️' },
  { id: 'Indian', label: 'Indian & Biryanis', emoji: '🍛' },
  { id: 'Japanese', label: 'Ramen & Sushi', emoji: '🍣' },
  { id: 'Burgers', label: 'Gourmet Burgers', emoji: '🍔' },
  { id: 'Healthy', label: 'Superfoods & Bowls', emoji: '🥗' },
];

export default function HomePage({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState(null);
  const [sortBy, setSortBy] = useState('rating');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (selectedCuisine && selectedCuisine !== 'All') params.cuisine = selectedCuisine;
      if (minRating) params.min_rating = minRating;
      if (sortBy) params.sort_by = sortBy;

      const res = await api.get('/restaurants', { params });
      setRestaurants(res.data);
    } catch (err) {
      console.error('Error fetching restaurants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchRestaurants, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCuisine, minRating, sortBy]);

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '50px 0 35px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          color: '#f59e0b',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '18px'
        }}>
          <Sparkles size={16} /> Premium Local Culinary Artisans
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
          lineHeight: 1.15,
          marginBottom: '16px',
          maxWidth: '850px',
          margin: '0 auto 16px auto',
        }}>
          Crave Extraordinary.<br />
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Delivered in Minutes.
          </span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto 30px auto'
        }}>
          Explore award-winning local bistros, master sushi chefs, and wood-fired pizzerias crafted with top-tier ingredients.
        </p>

        {/* Global Search Bar */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(18, 25, 38, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 12px 8px 20px',
            boxShadow: 'var(--shadow-lg)',
            transition: 'var(--transition)'
          }}>
            <Search size={22} color="#f59e0b" style={{ marginRight: '12px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, cuisines, or restaurant names..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.05rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0 8px' }}
              >
                Clear
              </button>
            )}
            <button
              onClick={fetchRestaurants}
              className="btn-primary"
              style={{ padding: '10px 24px', flexShrink: 0 }}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Pills & Filters Bar */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Cuisine Category Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '6px',
            maxWidth: '100%'
          }}>
            {CUISINES.map((c) => {
              const active = selectedCuisine === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCuisine(c.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: active ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'var(--bg-glass-strong)',
                    color: active ? '#0f172a' : 'var(--text-primary)',
                    border: active ? 'none' : '1px solid var(--border-subtle)',
                    boxShadow: active ? 'var(--shadow-glow)' : 'none',
                    transition: 'var(--transition)'
                  }}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filters: Rating & Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMinRating(minRating === 4.8 ? null : 4.8)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: minRating ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-glass-strong)',
                border: minRating ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                color: minRating ? '#f59e0b' : 'var(--text-secondary)'
              }}
            >
              <Star size={14} fill={minRating ? '#f59e0b' : 'transparent'} />
              Top Rated (4.8+)
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-glass-strong)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <option value="rating">Highest Rated</option>
              <option value="delivery_time">Fastest Delivery</option>
              <option value="delivery_fee">Lowest Delivery Fee</option>
            </select>
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>
            {selectedCuisine === 'All' ? 'Featured Kitchens' : `${selectedCuisine} Selections`}
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '10px' }}>
              ({restaurants.length} available)
            </span>
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading delicious options...
          </div>
        ) : restaurants.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
              No restaurants match your filters.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
              Try adjusting your search terms or cuisine preferences.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); setMinRating(null); }}
              className="btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '24px'
          }}>
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                className="glass-card animate-fade"
                onClick={() => onSelectRestaurant(rest.id)}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Image Container with overlay */}
                <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                  <img
                    src={rest.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                    alt={rest.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Rating Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{rest.rating.toFixed(1)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({rest.rating_count})</span>
                  </div>

                  {/* Delivery Fee Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: rest.delivery_fee === 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    {rest.delivery_fee === 0 ? 'Free Delivery' : `₹${rest.delivery_fee.toFixed(0)} Delivery`}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {rest.cuisine_type}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Clock size={13} /> {rest.delivery_time_minutes} mins
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '6px' }}>
                    {rest.name}
                  </h3>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flexGrow: 1
                  }}>
                    {rest.description}
                  </p>

                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span>Min. order ₹{rest.minimum_order.toFixed(0)}</span>
                    <span style={{ color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Menu <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
