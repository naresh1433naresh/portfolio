import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { journey } from '../data/portfolio';

export default function Journey() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="journey" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ marginBottom: '4rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`} style={{ marginBottom: '1rem' }}>
            Journey
          </div>
          <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em',
          }}>
            Learning & Building
          </h2>
          <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
            style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.75rem', maxWidth: 480 }}>
            A living timeline of my milestones — continuously updated as I learn and build.
          </p>
        </div>

        <div style={{ maxWidth: 680 }}>
          {journey.map((item, i) => (
            <div
              key={`${item.year}-${i}`}
              className={`timeline-item reveal reveal-delay-${i + 2} ${isVisible ? 'visible' : ''}`}
              style={{ marginBottom: '3rem' }}
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}>
                {item.year}
              </div>
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.6rem',
                letterSpacing: '-0.01em',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
              }}>
                {item.description}
              </p>
            </div>
          ))}

          {/* Add more placeholder */}
          <div className={`reveal reveal-delay-5 ${isVisible ? 'visible' : ''}`}
            style={{
              marginLeft: '2rem',
              padding: '1rem 1.25rem',
              border: '1px dashed rgba(99,102,241,0.3)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>
              + Add your next milestone in{' '}
              <code style={{ color: 'var(--accent-light)', background: 'rgba(99,102,241,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                src/data/portfolio.ts
              </code>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
