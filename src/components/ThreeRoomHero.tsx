import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Github, Linkedin, Mail } from 'lucide-react';
import { personal } from '../data/portfolio';
import CursorReveal from '../canvas/CursorReveal';

// ── Only load the heavy HDR on desktop. Mobile uses the RoomEnvironment fallback
// which is generated procedurally (zero network cost).
// The HDR file is ~2–4MB and is the single biggest LCP bottleneck on mobile.
const HDR_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lebombo_1k.hdr';
const ORBIT_RADIUS = 4.4;
const LERP = 0.06;

const socialLinks = [
  { icon: Github,   href: personal.github,   label: 'GitHub' },
  { icon: Linkedin, href: personal.linkedin,  label: 'LinkedIn' },
  { icon: Mail,     href: `mailto:${personal.email}`, label: 'Email' },
];

export default function ThreeRoomHero() {
  const mountRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const overlay = overlayRef.current;
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    /* ── Renderer ── */
    // Disable antialias on mobile — significant GPU cost, barely visible on small screens
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
    // Cap DPR at 2 (standard), 1.5 on mobile to save GPU fill rate
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
    const center = new THREE.Vector3(0, 0, 0);

    /* ── Environment ──
       Desktop: loads the full HDR panorama (room illusion).
       Mobile:  uses procedural RoomEnvironment — zero network cost, same reflections. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    if (!isMobile) {
      // Desktop: beautiful HDR room environment
      new RGBELoader().load(
        HDR_URL,
        (hdr: any) => {
          hdr.mapping    = THREE.EquirectangularReflectionMapping;
          scene.background  = hdr;
          scene.environment = hdr;
          pmrem.dispose();
        },
        undefined,
        () => {
          // HDR load failed: fall back to RoomEnvironment
          const env = pmrem.fromScene(new RoomEnvironment()).texture;
          scene.environment = env;
          scene.background  = new THREE.Color(0x111118);
          pmrem.dispose();
        }
      );
    } else {
      // Mobile: skip 2–4MB HDR download entirely
      const env = pmrem.fromScene(new RoomEnvironment()).texture;
      scene.environment = env;
      scene.background  = new THREE.Color(0x0d0d14);
      pmrem.dispose();
    }

    /* ── Chrome TorusKnot ──
       Reduce vertex count on mobile (200→80 tubes, 48→24 radial segments) */
    const tubeSegs   = isMobile ? 80  : 200;
    const radialSegs = isMobile ? 24  : 48;
    const knotGeo = new THREE.TorusKnotGeometry(0.65, 0.22, tubeSegs, radialSegs);
    const knotMat = new THREE.MeshStandardMaterial({
      metalness: 1.0,
      roughness: 0.06,
      color:     0xffffff,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    /* ── Point lights ── */
    const pl1 = new THREE.PointLight(0x6366f1, 2.5, 6);
    pl1.position.set(2, 2, 2);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x818cf8, 1.5, 6);
    pl2.position.set(-2, -1, -2);
    scene.add(pl2);

    /* ── Resize ── */
    const setSize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    /* ── Cursor tracking ── */
    let nx = 0, ny = 0;
    let yaw = 0, pitch = 0;

    const onMouse = (e: MouseEvent) => {
      nx = (e.clientX / innerWidth)  * 2 - 1;
      ny = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener('mousemove', onMouse);

    /* ── RAF render loop ── */
    let animId = 0;
    const clock = new THREE.Clock();
    let isPageVisible = !document.hidden;
    let isSectionVisible = true; // Assume visible initially

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // ── Pause rendering when tab is hidden or section is off-screen ──
      if (!isPageVisible || !isSectionVisible) return;

      const t = clock.getElapsedTime();

      // Idle knot spin
      knot.rotation.x = t * 0.28;
      knot.rotation.y = t * 0.47;

      // Orbit pulse lights
      pl1.position.x = Math.sin(t * 0.5) * 2.5;
      pl1.position.z = Math.cos(t * 0.5) * 2.5;

      if (!reduced) {
        yaw   += (nx * 0.5  - yaw)   * LERP;
        pitch += (ny * 0.4  - pitch) * LERP;
      }

      camera.position.x = ORBIT_RADIUS * Math.sin(yaw)  * Math.cos(pitch);
      camera.position.y = ORBIT_RADIUS * Math.sin(pitch);
      camera.position.z = ORBIT_RADIUS * Math.cos(yaw)  * Math.cos(pitch);
      camera.lookAt(center);

      if (overlay && !reduced) {
        const ry =  yaw   * (180 / Math.PI) * 0.65;
        const rx = -pitch * (180 / Math.PI) * 0.55;
        overlay.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
      }

      renderer.render(scene, camera);
    };
    tick();

    /* ── Page Visibility: pause when tab is hidden ── */
    const onVisibility = () => { isPageVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    /* ── Intersection Observer: pause when hero scrolled out of view ── */
    const io = new IntersectionObserver(
      ([entry]) => { isSectionVisible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    io.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('mousemove', onMouse);
      knotGeo.dispose();
      knotMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
    >
      {/* ── WebGL canvas ── */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* ── DOM text overlay with parallax depth effect ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={overlayRef}
          className="hero-grid"
          style={{
            textAlign: 'left',
            transformStyle: 'preserve-3d',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(2rem, 5vw, 5rem)',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 clamp(1rem, 4vw, 2rem)',
            willChange: 'transform',
          }}
        >
          {/* Left Column: Typography & CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1.5rem',
            transformStyle: 'preserve-3d',
            minWidth: 0, /* Prevent flex overflow */
          }}>
            {/* Eyebrow */}
            <div style={{ transform: 'translateZ(90px)' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(165,180,252,0.95)',
                background: 'rgba(10,10,15,0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(99,102,241,0.35)',
                borderRadius: 100,
                padding: '0.4rem 1.2rem',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}>
                &gt; Software Developer · AI &amp; Backend
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                transform: 'translateZ(55px)',
                fontSize: 'clamp(2rem, 7vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#f0f0f5',
                textShadow: '0 4px 48px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.5)',
                margin: 0,
              }}
            >
              Building{' '}
              <em
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #c7d2fe 0%, #818cf8 50%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                intelligent
              </em>
              <br />
              systems.
            </h1>

            {/* Name tag */}
            <div
              style={{
                transform: 'translateZ(40px)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                color: 'rgba(161,161,176,0.8)',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {personal.name} — {personal.role}
            </div>

            {/* CTA buttons */}
            <div style={{
              transform: 'translateZ(25px)',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              pointerEvents: 'auto',
            }}>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.8rem clamp(1.25rem, 3vw, 2.5rem)',
                  background: 'rgba(99,102,241,0.88)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.92rem)',
                  letterSpacing: '0.02em',
                  borderRadius: 100,
                  textDecoration: 'none',
                  border: '1px solid rgba(129,140,248,0.45)',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.42)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  minHeight: '44px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background    = 'rgba(129,140,248,0.95)';
                  el.style.boxShadow     = '0 12px 40px rgba(99,102,241,0.55)';
                  el.style.transform     = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background    = 'rgba(99,102,241,0.88)';
                  el.style.boxShadow     = '0 8px 32px rgba(99,102,241,0.42)';
                  el.style.transform     = 'scale(1)';
                }}
              >
                View My Work →
              </a>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.8rem clamp(1rem, 2.5vw, 1.75rem)',
                  background: 'rgba(10,10,15,0.5)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 600,
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.92rem)',
                  borderRadius: 100,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  minHeight: '44px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.5)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(99,102,241,0.18)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(10,10,15,0.5)';
                }}
              >
                GitHub ↗
              </a>
            </div>

            {/* Social row */}
            <div
              style={{
                transform: 'translateZ(12px)',
                display: 'flex',
                gap: '0.75rem',
                pointerEvents: 'auto',
                flexWrap: 'nowrap',
              }}
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 40, height: 40, /* Minimum 44px would be ideal but 40px is the design */
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    background: 'rgba(10,10,15,0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(99,102,241,0.6)';
                    el.style.color       = '#818cf8';
                    el.style.background  = 'rgba(99,102,241,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.12)';
                    el.style.color       = 'rgba(255,255,255,0.55)';
                    el.style.background  = 'rgba(10,10,15,0.45)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Profile Photo — hidden on small mobile to give text room */}
          <div style={{
            transform: 'translateZ(40px)',
            pointerEvents: 'auto',
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
          }}
            className="hero-profile-col"
          >
            <div className="hero-profile-container" style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              width: 'clamp(180px, 22vw, 300px)',
              aspectRatio: '3/4',
              background: 'rgba(10,10,15,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}>
              <CursorReveal src="/naresh.jpg" />

              {/* Minimal hint label */}
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)', borderRadius: 4, padding: '0.2rem 0.5rem',
                border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>explore ✦</div>

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                background: 'linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
          background: 'linear-gradient(to top, var(--bg-primary), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Hint */}
      <div
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span>move cursor — explore</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)' }} />
      </div>

      <style>{`
        /* Stack columns on narrow screens */
        @media (max-width: 900px) {
          .hero-grid {
            flex-direction: column !important;
            gap: 2rem !important;
            padding-top: 4rem !important;
            align-items: center !important;
            text-align: center !important;
          }
          .hero-grid > div:first-child {
            align-items: center !important;
          }
        }
        /* Hide profile photo on very small screens — give text full width */
        @media (max-width: 480px) {
          .hero-profile-col {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
