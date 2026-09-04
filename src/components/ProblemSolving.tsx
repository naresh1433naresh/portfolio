import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { dsaTopics, personal } from '../data/portfolio';
import { Github } from 'lucide-react';

export default function ProblemSolving() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id="problem-solving" className="section-padding" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ marginBottom: '3.5rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`} style={{ marginBottom: '1rem' }}>
            Problem Solving
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}
            className="ps-header-grid">
            <div>
              <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem',
              }}>
                Thinking in<br /><span className="accent-text">Algorithms</span>
              </h2>
              <p className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
                style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                I practice Data Structures & Algorithms to develop logical thinking, pattern recognition, and the ability to design efficient solutions to complex problems.
              </p>
              <p className={`reveal reveal-delay-3 ${isVisible ? 'visible' : ''}`}
                style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem', marginTop: '0.75rem' }}>
                Problem solving is not just an interview skill — it's a fundamental engineering discipline.
              </p>
            </div>
            <div className={`reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '1.5rem',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  // approach
                </div>
                {[
                  'Read the problem carefully',
                  'Identify patterns and constraints',
                  'Think brute force first',
                  'Optimize for time & space',
                  'Test with edge cases',
                ].map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      color: 'var(--accent)',
                      width: '1.25rem',
                      flexShrink: 0,
                      marginTop: '0.15rem',
                    }}>{String(i + 1).padStart(2, '0')}.</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DSA Topic Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.875rem',
          marginBottom: '2.5rem',
        }}>
          {dsaTopics.map((topic, i) => (
            <div
              key={topic.name}
              className={`reveal reveal-delay-${(i % 5) + 2} ${isVisible ? 'visible' : ''}`}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '1.25rem 1rem',
                textAlign: 'center',
                transition: 'all 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(99,102,241,0.5)';
                el.style.background = 'rgba(99,102,241,0.08)';
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.background = 'var(--surface)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.6rem', color: 'var(--accent)' }}>{topic.icon}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {topic.name}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer" className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Github size={16} /> GitHub Solutions
          </a>
          <a href={personal.leetcode} target="_blank" rel="noopener noreferrer" className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            ◈ LeetCode Profile
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ps-header-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
