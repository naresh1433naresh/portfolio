import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { personal } from '../data/portfolio';

const navLinks = [
  { label: 'About',          href: '#about' },
  { label: 'Skills',         href: '#skills' },
  { label: 'Projects',       href: '#projects' },
  { label: 'Problem Solving',href: '#problem-solving' },
  { label: 'System Design',  href: '#system-design' },
  { label: 'Journey',        href: '#journey' },
  { label: 'Contact',        href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevScroll = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 40);
      setHidden(cur > prevScroll.current && cur > 120);
      prevScroll.current = cur;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: hidden ? '-80px' : '0',
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'top 0.35s ease, background 0.35s ease, box-shadow 0.35s ease',
          background: scrolled
            ? 'rgba(10,10,15,0.88)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <nav
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNav('#hero'); }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{
              width: 32, height: 32,
              background: 'var(--accent)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 800, color: 'white',
            }}>N</span>
            {personal.name}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ gap: '2rem', alignItems: 'center' }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link"
                onClick={(e) => { e.preventDefault(); handleNav(l.href); }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="flex md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              transition: 'border-color 0.2s',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : 'closed'}`}>
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.5rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={24} />
        </button>
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="mobile-nav-link"
            onClick={(e) => { e.preventDefault(); handleNav(l.href); }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
