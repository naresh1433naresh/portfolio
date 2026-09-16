import { Github, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { featuredProject } from '../data/portfolio';

export default function FeaturedProject() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="featured-project" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* BG accent */}
      <div style={{
        position: 'absolute', top: '20%', right: '-200px',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ marginBottom: '3rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`} style={{ marginBottom: '1rem' }}>
            Featured Project
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>
                <span className="gradient-text">{featuredProject.name}</span>
              </h2>
              <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`} style={{
                color: 'var(--accent-light)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                marginTop: '0.5rem',
              }}>
                {featuredProject.tagline}
              </p>
            </div>
            <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
              style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: 100,
                fontSize: '0.72rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#fbbf24',
              }}>
                {featuredProject.status}
              </span>
              <a href={featuredProject.github} target="_blank" rel="noopener noreferrer"
                className="btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                <Github size={15} /> View Code
              </a>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: 'clamp(1.5rem, 3vw, 2rem)' }}
          className="featured-grid">

          {/* Left: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Description */}
            <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.75rem' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {featuredProject.description}
              </p>
            </div>

            {/* Problem / Solution */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
              className="problem-solution-grid">
              {[
                { label: 'Problem', content: featuredProject.problem, icon: AlertCircle, color: '#f87171' },
                { label: 'Solution', content: featuredProject.solution, icon: CheckCircle2, color: '#34d399' },
              ].map(({ label, content, icon: Icon, color }) => (
                <div
                  key={label}
                  className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Icon size={15} color={color} />
                    <span style={{ fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{content}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className={`reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Key Features
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {featuredProject.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.7rem', marginTop: '0.25rem', flexShrink: 0 }}>▶</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className={`reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Tech Stack
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {featuredProject.technologies.map((t) => (
                  <span key={t} className="tech-chip">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Architecture */}
          <div className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '2rem',
              height: '100%',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                // architecture
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '0',
              }}>
                {featuredProject.architecture.map((node, i) => (
                  <div key={node.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div
                      className={`arch-node${node.active ? ' active' : ''}`}
                      style={{ width: '100%', maxWidth: 260 }}
                    >
                      {node.label}
                    </div>
                    {i < featuredProject.architecture.length - 1 && (
                      <div style={{
                        width: 1, height: 24,
                        background: node.active
                          ? 'linear-gradient(to bottom, rgba(99,102,241,0.6), rgba(99,102,241,0.2))'
                          : 'var(--border)',
                        margin: '2px 0',
                      }} />
                    )}
                  </div>
                ))}
              </div>
              <p style={{
                marginTop: '2rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.6,
              }}>
                RAG-powered retrieval<br />over industrial data
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .problem-solution-grid { grid-template-columns: 1fr !important; }
        }
        /* On very small screens also force single column for problem/solution */
        @media (max-width: 480px) {
          .problem-solution-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
