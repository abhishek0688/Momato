import React, { useState } from 'react';
import api from '../api/client';
import { Star, X, Check, AlertCircle } from 'lucide-react';

export default function ReviewModal({ restaurantId, restaurantName, orderId, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/reviews', {
        restaurant_id: restaurantId,
        order_id: orderId || null,
        rating,
        comment,
      });
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
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
          maxWidth: '460px',
          background: '#0f1626',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            color: 'var(--text-muted)',
            background: 'var(--bg-glass-strong)',
            padding: '6px',
            borderRadius: '50%',
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
          Rate & Review
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Share your culinary experience with <strong>{restaurantName}</strong>
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    padding: '8px',
                    transition: 'transform 0.15s ease',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)'
                  }}
                >
                  <Star
                    size={32}
                    fill={active ? '#f59e0b' : 'transparent'}
                    color={active ? '#f59e0b' : 'var(--text-muted)'}
                  />
                </button>
              );
            })}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Your Feedback:
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What made this meal memorable? How was the taste, presentation, and packaging?"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
