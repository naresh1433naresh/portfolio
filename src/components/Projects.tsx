import { Github, ExternalLink } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { projects } from '../data/portfolio';

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  'In Development': { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  'Planned':        { bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)', text: '#9ca3af' },
  'Completed':      { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', text: '#34d399' },
};

export default function Projects() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="projects" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ marginBottom: '3.5rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`} style={{ marginBottom: '1rem' }}>
            Projects
          </div>
          <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em',
          }}>
            Other Projects
          </h2>
          <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
            style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.75rem', maxWidth: 480 }}>
            A collection of projects I've built or am building. Each one is a step toward stronger engineering.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {projects.map((project, i) => {
            const sc = statusColors[project.status] ?? statusColors['Planned'];
            return (
              <div
                key={project.id}
                className={`reveal reveal-delay-${i + 2} ${isVisible ? 'visible' : ''}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(99,102,241,0.4)';
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = '0 12px 40px rgba(99,102,241,0.1)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                  }}>
                    Project {String(project.id).padStart(2, '0')}
                  </span>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    background: sc.bg, border: `1px solid ${sc.border}`,
                    borderRadius: 100, fontSize: '0.68rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: sc.text,
                  }}>
                    {project.status}
                  </span>
                </div>

                {/* Name */}
                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)',
                  letterSpacing: '-0.01em', lineHeight: 1.3,
                }}>
                  {project.name}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, flex: 1 }}>
                  {project.description}
                </p>

                {/* Technologies */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {project.technologies.map((t) => (
                    <span key={t} className="tech-chip">{t}</span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{
                      flex: 1, display: 'inline-flex', alignItems: 'center',
                      justifyContent: 'center', gap: '0.4rem',
                      textDecoration: 'none', fontSize: '0.82rem', padding: '0.55rem 0.75rem',
                    }}
                  >
                    <Github size={14} /> GitHub
                  </a>
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        flex: 1, display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', gap: '0.4rem',
                        textDecoration: 'none', fontSize: '0.82rem', padding: '0.55rem 0.75rem',
                      }}
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  ) : (
                    <span
                      style={{
                        flex: 1, display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', gap: '0.4rem',
                        fontSize: '0.82rem', padding: '0.55rem 0.75rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: 'var(--text-muted)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.75rem',
                      }}
                    >
                      Demo Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
