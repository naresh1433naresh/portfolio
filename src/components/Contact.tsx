import { useState } from 'react';
import { Github, Linkedin, Mail, Send, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { personal } from '../data/portfolio';

export default function Contact() {
  const { ref, isVisible } = useIntersectionObserver();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire up to your preferred form handler (Formspree, EmailJS, etc.)
    const mailtoUrl = `mailto:${personal.email}?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.email}`;
    window.location.href = mailtoUrl;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="section-padding" style={{ background: 'var(--bg-secondary)', position: 'relative' }}>
      {/* BG orb */}
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-200px',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`}
            style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            Contact
          </div>
          <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem',
          }}>
            Let's build something<br />
            <span className="accent-text">useful.</span>
          </h2>
          <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
            style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 420, margin: '0 auto' }}>
            Have an idea, project, or opportunity? I'd be happy to connect.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: '3rem', alignItems: 'start' }}
          className="contact-grid">

          {/* Form */}
          <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="form-input"
                  placeholder="Your message..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              </div>
              <button
                id="contact-submit"
                type="submit"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}
              >
                {sent ? 'Opening mail client...' : (<><Send size={15} /> Send Message</>)}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {/* TODO: Replace mailto with Formspree/EmailJS for direct delivery */}
                Uses mailto — replace with a form service for direct delivery.
              </p>
            </form>
          </div>

          {/* Contact info */}
          <div className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {[
              { icon: Mail,     label: 'Email',    value: personal.email,    href: `mailto:${personal.email}` },
              { icon: Github,   label: 'GitHub',   value: 'github.com/yourusername', href: personal.github },  // TODO
              { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/yourprofile', href: personal.linkedin }, // TODO
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(99,102,241,0.4)';
                  el.style.background = 'var(--surface-hover)';
                  el.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.background = 'var(--surface)';
                  el.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: 38, height: 38,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color="var(--accent-light)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{value}</div>
                </div>
                <ArrowRight size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </a>
            ))}

            <div style={{
              marginTop: '0.5rem',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(129,140,248,0.04))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 10,
            }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Response time:</span> I aim to reply within 24–48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
