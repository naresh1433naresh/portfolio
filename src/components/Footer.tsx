import { Github, Linkedin, Mail } from 'lucide-react';
import { personal } from '../data/portfolio';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-primary)',
      padding: '3rem 1.5rem',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      }}>

        {/* Logo */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text-primary)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{
            width: 28, height: 28,
            background: 'var(--accent)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 800, color: 'white',
          }}>N</span>
          {personal.name} — Software Developer
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.03em',
          textAlign: 'center',
        }}>
          Building systems. Solving problems. Learning continuously.
        </p>

        {/* Social */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { icon: Github,   href: personal.github,   label: 'GitHub' },
            { icon: Linkedin, href: personal.linkedin,  label: 'LinkedIn' },
            { icon: Mail,     href: `mailto:${personal.email}`, label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--accent)';
                el.style.color = 'var(--accent-light)';
                el.style.background = 'var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.color = 'var(--text-muted)';
                el.style.background = 'transparent';
              }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider" style={{ width: '100%', maxWidth: 400 }} />

        {/* Copyright */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
          © {year} {personal.name}. Built with React + TypeScript.
        </p>
      </div>
    </footer>
  );
}
