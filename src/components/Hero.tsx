import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { personal } from '../data/portfolio';
import CursorReveal from '../canvas/CursorReveal';

const socialLinks = [
  { icon: Github,   href: personal.github,   label: 'GitHub'   },
  { icon: Linkedin, href: personal.linkedin,  label: 'LinkedIn' },
  { icon: Mail,     href: `mailto:${personal.email}`, label: 'Email' },
];

const codeLines = [
  { indent: 0, content: 'class Naresh:', color: '#818cf8' },
  { indent: 1, content: 'role = "AI & Backend Developer"', color: '#34d399' },
  { indent: 1, content: 'stack = ["Python", "Java", "FastAPI"]', color: '#34d399' },
  { indent: 1, content: 'passion = "Building intelligent systems"', color: '#34d399' },
  { indent: 0, content: '', color: '' },
  { indent: 1, content: 'def build(self, idea):',  color: '#f59e0b' },
  { indent: 2, content: 'return Solution(idea)', color: '#a78bfa' },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
      }}
    >
      {/* Background orbs */}
      <div className="hero-orb" style={{
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        top: '-100px', left: '-200px',
      }} />
      <div className="hero-orb" style={{
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)',
        bottom: '0', right: '-100px',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gap: '4rem',
          alignItems: 'center',
        }}
          className="hero-grid"
        >
          {/* Left: Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Badge */}
            <div style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.35rem 1rem',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '100px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: '#818cf8',
                letterSpacing: '0.05em',
              }}>
                <span style={{
                  width: 6, height: 6, background: '#34d399',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #34d399',
                  animation: 'pulse 2s infinite',
                }} />
                Available for opportunities
              </span>
            </div>

            {/* Name */}
            <div style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.25rem',
              }}>
                &gt; Hello, I'm
              </div>
              <h1 style={{
                fontSize: 'clamp(3rem, 7vw, 5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #f0f0f5 0%, #c7d2fe 50%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {personal.name}
              </h1>
              <div style={{
                marginTop: '0.5rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
                color: 'var(--accent-light)',
                letterSpacing: '0.05em',
              }}>
                {personal.role}
              </div>
            </div>

            {/* Tagline */}
            <div style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
              }}>
                {personal.tagline}
              </h2>
            </div>

            {/* Description */}
            <div style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
            }}>
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                maxWidth: '520px',
              }}>
                {personal.description}
              </p>
            </div>

            {/* CTAs */}
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
            }}>
              <a
                href="#projects"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                View My Work <ArrowRight size={16} />
              </a>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <Github size={16} /> GitHub
              </a>
            </div>

            {/* Social Icons */}
            <div style={{
              display: 'flex', gap: '1rem', alignItems: 'center',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease 0.65s',
            }}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40,
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent-light)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent-glow)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
              <span style={{
                height: 1, width: 40,
                background: 'linear-gradient(90deg, var(--border), transparent)',
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {personal.email}
              </span>
            </div>
          </div>

          {/* Right: Canvas Reveal + Code Block */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
            className="hero-right"
          >
            {/* Profile Photo */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Outer glow ring */}
              <div style={{
                position: 'absolute',
                inset: -3,
                borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(129,140,248,0.2), rgba(99,102,241,0.5))',
                filter: 'blur(1px)',
                zIndex: 0,
                animation: 'borderRotate 4s linear infinite',
              }} />
              {/* Photo container */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: 18,
                overflow: 'hidden',
                width: '100%',
                maxWidth: 360,
                aspectRatio: '3/4',
                border: '1px solid rgba(99,102,241,0.35)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.2)',
                animation: 'float 6s ease-in-out infinite',
              }}>
              {/* ── Canvas reveal: grayscale → color on cursor move ── */}
                <CursorReveal src="/naresh.jpg" />
                {/* Hint label */}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(129,140,248,0.7)',
                  background: 'rgba(10,10,15,0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: 5,
                  padding: '0.25rem 0.55rem',
                  border: '1px solid rgba(99,102,241,0.2)',
                  pointerEvents: 'none',
                  letterSpacing: '0.06em',
                }}>move cursor ✦</div>
                {/* Gradient overlay at bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '38%',
                  background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
                {/* Name tag at bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.25rem',
                  right: '1.25rem',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    color: 'rgba(129,140,248,0.9)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.2rem',
                  }}>Software Developer</div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '-0.01em',
                  }}>Naresh</div>
                </div>
              </div>
              {/* Floating accent dots */}
              <div style={{
                position: 'absolute',
                top: '10%', right: '-12px',
                width: 8, height: 8,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 12px rgba(99,102,241,0.8)',
                animation: 'float 3s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '20%', left: '-10px',
                width: 5, height: 5,
                borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 8px rgba(52,211,153,0.8)',
                animation: 'float 4s ease-in-out infinite 1s',
              }} />
              <div style={{
                position: 'absolute',
                top: '40%', right: '-20px',
                width: 4, height: 4,
                borderRadius: '50%',
                background: '#818cf8',
                boxShadow: '0 0 6px rgba(129,140,248,0.6)',
                animation: 'float 5s ease-in-out infinite 0.5s',
              }} />
            </div>

            {/* Code snippet */}
            <div className="code-block">
              {codeLines.map((line, i) => (
                <div key={i} style={{ paddingLeft: `${line.indent * 1.25}rem`, minHeight: line.content ? undefined : '0.75rem' }}>
                  {line.content && (
                    <span style={{ color: line.color || 'var(--text-secondary)' }}>
                      {line.content}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        opacity: 0.45,
      }}>
        <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SCROLL</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, var(--accent), transparent)',
          animation: 'pulse 2s infinite',
        }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes borderRotate {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}
