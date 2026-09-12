import React from 'react';
import { Flame, ShieldCheck, Heart, Cloud, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(8, 11, 17, 0.95)',
      padding: '48px 0 24px 0',
      marginTop: '60px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '36px'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={18} color="#0f172a" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
                FoodHub
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Artisanal online food delivery connecting discerning diners with top culinary artisans, authentic kitchens, and lightning-fast logistics.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architecture & Stack
            </h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                React 18 + Vite (SPA Frontend)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                Python FastAPI (Async REST APIs)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
                PostgreSQL + SQLAlchemy ORM
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                Docker & AWS EC2 / RDS / S3
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cloud & DevOps
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['AWS EC2', 'AWS RDS', 'AWS S3', 'CloudWatch', 'Docker Compose', 'JWT Security'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'var(--bg-glass-strong)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} FoodHub Delivery Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              API Services Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
