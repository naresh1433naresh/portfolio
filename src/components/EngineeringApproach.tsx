import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { engineeringSteps } from '../data/portfolio';

export default function EngineeringApproach() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="approach" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`}
            style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            Engineering Approach
          </div>
          <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem',
          }}>
            How I Build Software
          </h2>
          <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
            style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', fontSize: '0.95rem' }}>
            A systematic approach to every problem: understand deeply, design clearly, build carefully.
          </p>
        </div>

        {/* Steps — 5 columns on desktop, 2 on tablet, 1 on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1px',
          background: 'var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
          className="steps-grid">
          {engineeringSteps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal reveal-delay-${i + 2} ${isVisible ? 'visible' : ''}`}
              style={{
                background: 'var(--bg-secondary)',
                padding: '2rem 1.5rem',
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--bg-secondary)';
              }}
            >
              {/* Number */}
              <div className="step-number" style={{ marginBottom: '1rem' }}>{step.number}</div>

              {/* Accent line */}
              <div style={{
                width: '2rem', height: 2,
                background: `hsl(${240 + i * 15}, 70%, 65%)`,
                borderRadius: 1,
                marginBottom: '1.25rem',
                boxShadow: `0 0 8px hsl(${240 + i * 15}, 70%, 65%, 0.4)`,
              }} />

              {/* Title */}
              <h3 style={{
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
                letterSpacing: '-0.01em',
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {step.description}
              </p>

              {/* Corner accent */}
              {i < engineeringSteps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 1, height: '40%',
                  background: 'var(--border)',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* 5 columns only on wide screens where there's sufficient space */
        @media (max-width: 1100px) {
          .steps-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
