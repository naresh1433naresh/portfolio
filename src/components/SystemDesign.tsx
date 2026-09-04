import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { systemDesignNodes } from '../data/portfolio';

const nodeColors: Record<string, { color: string; glow: string }> = {
  client:  { color: '#818cf8', glow: 'rgba(129,140,248,0.2)' },
  gateway: { color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
  service: { color: '#34d399', glow: 'rgba(52,211,153,0.2)' },
  cache:   { color: '#f87171', glow: 'rgba(248,113,113,0.2)' },
  db:      { color: '#60a5fa', glow: 'rgba(96,165,250,0.2)' },
  vector:  { color: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
  ai:      { color: '#34d399', glow: 'rgba(52,211,153,0.2)' },
};

export default function SystemDesign() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="system-design" className="section-padding" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}
          className="sd-grid">

          {/* Left: Text */}
          <div ref={ref}>
            <div className={`section-label reveal ${isVisible ? 'visible' : ''}`} style={{ marginBottom: '1.25rem' }}>
              System Design
            </div>
            <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700, letterSpacing: '-0.02em',
              lineHeight: 1.25, marginBottom: '1.5rem',
            }}>
              Thinking Beyond<br />
              <span className="accent-text">the Code</span>
            </h2>
            <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              I focus not only on writing code, but also on understanding how individual components work together to form reliable and scalable systems.
            </p>
            <p className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              From API gateway to AI services, each layer has a clear responsibility. Designing clean boundaries between components leads to systems that are easy to maintain, debug, and scale.
            </p>

            <div className={`reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}
              style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Separation of concerns across layers',
                'Cache strategies for performance',
                'Database design & normalization',
                'Vector search for AI retrieval',
                'API design & contract-first thinking',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>▶</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Architecture Diagram */}
          <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '2.5rem 2rem',
              position: 'relative',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem', color: 'var(--accent)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '2.5rem', textAlign: 'center',
              }}>
                // system_architecture
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                {systemDesignNodes.map((node, i) => {
                  const nc = nodeColors[node.type] ?? nodeColors.service;
                  return (
                    <div key={node.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <div style={{
                        width: '100%', maxWidth: 240,
                        padding: '0.65rem 1rem',
                        border: `1px solid ${nc.color}44`,
                        borderRadius: 8,
                        background: `${nc.glow}`,
                        textAlign: 'center',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.82rem',
                        color: nc.color,
                        boxShadow: `0 2px 16px ${nc.glow}`,
                        transition: 'all 0.25s ease',
                      }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${nc.glow}, 0 0 0 1px ${nc.color}44`;
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 16px ${nc.glow}`;
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                        }}
                      >
                        {node.label}
                      </div>
                      {i < systemDesignNodes.length - 1 && (
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          padding: '3px 0',
                        }}>
                          <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: 1 }}>↓</div>
                          <div style={{ width: 1, height: 4, background: 'var(--border)' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sd-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}
