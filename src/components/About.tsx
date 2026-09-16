import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { about } from '../data/portfolio';

export default function About() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="about" className="section-padding" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'start' }}
          className="about-grid"
        >
          {/* Left */}
          <div>
            <div className={`reveal ${isVisible ? 'visible' : ''}`}>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>About</div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '2rem',
              }}>
                A developer who thinks<br />
                <span className="accent-text">before typing.</span>
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {about.bio.map((para, i) => (
                <p
                  key={i}
                  className={`reveal reveal-delay-${i + 2} ${isVisible ? 'visible' : ''}`}
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Mini stats */}
            <div className={`reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}
              style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { value: '∞', label: 'Problems to solve' },
                { value: '01', label: 'Focused mindset' },
                { value: '∞', label: 'Things to learn' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="stat-value" style={{ color: 'var(--accent-light)' }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: "'JetBrains Mono',monospace" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
            {/* Currently focused */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}>
                // currently_focused_on
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {about.focus.map((item, i) => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0.875rem',
                    background: i === 0 ? 'rgba(99,102,241,0.08)' : 'transparent',
                    border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`,
                    borderRadius: 8,
                    transition: 'all 0.2s ease',
                  }}>
                    <span style={{
                      width: 6, height: 6,
                      background: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      boxShadow: i === 0 ? '0 0 8px rgba(99,102,241,0.6)' : 'none',
                    }} />
                    <span style={{
                      fontSize: '0.9rem',
                      color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: i === 0 ? 500 : 400,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(129,140,248,0.04))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 12,
              padding: '1.5rem',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                // philosophy
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, fontStyle: 'italic' }}>
                "Write code that your future self can understand. Build systems that can scale. Learn continuously."
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: clamp(1.5rem, 4vw, 3rem) !important; }
        }
      `}</style>
    </section>
  );
}
