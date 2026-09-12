import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { techCategories } from '../data/portfolio';

export default function TechStack() {
  const { ref, isVisible } = useIntersectionObserver();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="skills" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`}
            style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            Tech Stack
          </div>
          <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}>
            Tools & Technologies
          </h2>
          <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`} style={{
            color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto',
          }}>
            Technologies I work with to design and build systems.
          </p>
        </div>

        {/* Category Filter */}
        <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 100,
              border: `1px solid ${activeCategory === null ? 'var(--accent)' : 'var(--border)'}`,
              background: activeCategory === null ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: activeCategory === null ? 'var(--accent-light)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            All
          </button>
          {techCategories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category === activeCategory ? null : cat.category)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 100,
                border: `1px solid ${activeCategory === cat.category ? 'var(--accent)' : 'var(--border)'}`,
                background: activeCategory === cat.category ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: activeCategory === cat.category ? 'var(--accent-light)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Tech Cards Grid */}
        <div className="tech-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {techCategories
            .filter((cat) => !activeCategory || cat.category === activeCategory)
            .map((cat, ci) => (
              <div
                key={cat.category}
                className={`reveal reveal-delay-${(ci % 4) + 2} ${isVisible ? 'visible' : ''}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '1.5rem',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(99,102,241,0.4)';
                  el.style.background = 'var(--surface-hover)';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 8px 32px rgba(99,102,241,0.1)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.background = 'var(--surface)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1.1rem',
                    color: 'var(--accent)',
                    lineHeight: 1,
                  }}>{cat.icon}</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>{cat.category}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {cat.items.map((item) => (
                    <span key={item} className="tech-chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 400px) {
          .tech-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
