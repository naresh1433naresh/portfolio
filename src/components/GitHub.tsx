import { useMemo } from 'react';
import { Github, Star } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { personal, githubRepos } from '../data/portfolio';

const langColors: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  Java: '#b07219',
  JavaScript: '#f1e05a',
};

export default function GitHubSection() {
  const { ref, isVisible } = useIntersectionObserver();

  // Memoize the random contribution grid — prevents new random values on every re-render
  const contributionCells = useMemo(() =>
    Array.from({ length: 140 }).map(() => {
      const intensity = Math.random();
      return intensity > 0.7 ? 0.8 : intensity > 0.4 ? 0.4 : intensity > 0.2 ? 0.2 : 0.06;
    }),
    [] // empty deps = computed once
  );

  return (
    <section id="github" className="section-padding" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className={`section-label reveal ${isVisible ? 'visible' : ''}`}
            style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            GitHub
          </div>
          <h2 className={`reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem',
          }}>
            Code is where ideas<br />
            <span className="accent-text">become systems.</span>
          </h2>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-ghost reveal reveal-delay-2 ${isVisible ? 'visible' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginTop: '0.5rem' }}
          >
            <Github size={16} /> View GitHub Profile  {/* TODO: Replace URL in portfolio.ts */}
          </a>
        </div>

        {/* Repos */}
        <div style={{
          display: 'grid',
          /* min(300px, 100%) ensures cards never overflow their container on 320px screens */
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          {githubRepos.map((repo, i) => {
            const langColor = langColors[repo.language] ?? '#6b7280';
            return (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`reveal reveal-delay-${i + 2} ${isVisible ? 'visible' : ''}`}
                style={{
                  display: 'block',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '1.5rem',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(99,102,241,0.4)';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 8px 32px rgba(99,102,241,0.1)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Github size={15} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-light)' }}>{repo.name}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {repo.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: langColor, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{repo.language}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Star size={12} /> {repo.stars}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Contribution placeholder */}
        <div className={`reveal reveal-delay-4 ${isVisible ? 'visible' : ''}`}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
          }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            // contribution_activity — add GitHub contribution graph here
          </div>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '3px', flexWrap: 'wrap',
            maxWidth: 600, margin: '0 auto',
          }}>
            {contributionCells.map((opacity, i) => (
              <div key={i} style={{
                width: 11, height: 11, borderRadius: 2,
                background: `rgba(99,102,241,${opacity})`,
              }} />
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            Replace with GitHub Contribution Graph embed
          </p>
        </div>
      </div>
    </section>
  );
}
