import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Github, Linkedin, Mail } from 'lucide-react';
import { personal } from '../data/portfolio';
import CursorReveal from '../canvas/CursorReveal';

// ── Replace with your own HDR in /public/room.hdr if you have one ──
// Free CC0 indoor HDR from polyhaven.com (no login needed)
const HDR_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lebombo_1k.hdr';
const ORBIT_RADIUS = 4.4;
const LERP          = 0.06;

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

    /* ── Renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(renderer.domElement);

    /* ── Scene ───────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
    const center = new THREE.Vector3(0, 0, 0);

    /* ── HDR environment — camera sits INSIDE the equirectangular map ── */
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    new RGBELoader().load(
      HDR_URL,
      (hdr: any) => {
        hdr.mapping    = THREE.EquirectangularReflectionMapping;
        scene.background  = hdr;   // scrolls as camera orbits → immersive room feel
        scene.environment = hdr;   // drives reflections on chrome knot
        pmrem.dispose();
      },
      undefined,
      () => {
        // Fallback: RoomEnvironment + subtle dark bg
        const env = pmrem.fromScene(new RoomEnvironment()).texture;
        scene.environment = env;
        scene.background  = new THREE.Color(0x111118);
        pmrem.dispose();
      }
    );

    /* ── Chrome TorusKnot ─────────────────────────────────── */
    const knotGeo = new THREE.TorusKnotGeometry(0.65, 0.22, 200, 48);
    const knotMat = new THREE.MeshStandardMaterial({
      metalness: 1.0,
      roughness: 0.06,
      color:     0xffffff,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    /* ── Subtle point lights to add knot sparkle ─────────── */
    const pl1 = new THREE.PointLight(0x6366f1, 2.5, 6);
    pl1.position.set(2, 2, 2);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x818cf8, 1.5, 6);
    pl2.position.set(-2, -1, -2);
    scene.add(pl2);

    /* ── Resize ──────────────────────────────────────────── */
    const setSize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    /* ── Cursor tracking ─────────────────────────────────── */
    let nx = 0, ny = 0;
    let yaw = 0, pitch = 0;

    const onMouse = (e: MouseEvent) => {
      nx = (e.clientX / innerWidth)  * 2 - 1;
      ny = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener('mousemove', onMouse);

    /* ── RAF render loop ─────────────────────────────────── */
    let animId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Idle knot spin
      knot.rotation.x = t * 0.28;
      knot.rotation.y = t * 0.47;

      // Orbit pulse lights
      pl1.position.x = Math.sin(t * 0.5) * 2.5;
      pl1.position.z = Math.cos(t * 0.5) * 2.5;

      if (!reduced) {
        // Cursor → yaw/pitch targets, eased with LERP = "weight"
        yaw   += (nx * 0.5  - yaw)   * LERP;
        pitch += (ny * 0.4  - pitch) * LERP;
      }

      // Place camera on orbit sphere — as yaw/pitch change the HDR background
      // scrolls in all directions, creating the inside-a-room illusion
      camera.position.x = ORBIT_RADIUS * Math.sin(yaw)  * Math.cos(pitch);
      camera.position.y = ORBIT_RADIUS * Math.sin(pitch);
      camera.position.z = ORBIT_RADIUS * Math.cos(yaw)  * Math.cos(pitch);
      camera.lookAt(center);

      // DOM text parallax — more than the room, creating perceived depth
      if (overlay && !reduced) {
        const ry =  yaw   * (180 / Math.PI) * 0.65;  // deg
        const rx = -pitch * (180 / Math.PI) * 0.55;
        overlay.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
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

      {/* ── DOM text with perspective — each layer at different translateZ ── */}
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
          style={{
            textAlign: 'left',
            transformStyle: 'preserve-3d',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5rem',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
          }}
        >
          {/* Left Column: Typography & CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1.5rem',
            transformStyle: 'preserve-3d',
          }}>
          {/* Eyebrow — deepest Z, moves most with cursor */}
          <div style={{ transform: 'translateZ(90px)' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(165,180,252,0.95)',
              background: 'rgba(10,10,15,0.55)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 100,
              padding: '0.4rem 1.4rem',
              display: 'inline-block',
            }}>
              &gt; Software Developer · AI &amp; Backend
            </span>
          </div>

          {/* Headline — mid Z */}
          <h1
            style={{
              transform: 'translateZ(55px)',
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
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
              fontSize: '0.8rem',
              color: 'rgba(161,161,176,0.8)',
              letterSpacing: '0.05em',
            }}
          >
            {personal.name} — {personal.role}
          </div>

          {/* Pill CTA — closest Z */}
          <div style={{ transform: 'translateZ(25px)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 2.5rem',
                background: 'rgba(99,102,241,0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.92rem',
                letterSpacing: '0.02em',
                borderRadius: 100,
                textDecoration: 'none',
                border: '1px solid rgba(129,140,248,0.45)',
                boxShadow: '0 8px 32px rgba(99,102,241,0.42)',
                transition: 'all 0.25s ease',
                pointerEvents: 'auto',
                cursor: 'pointer',
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
                padding: '0.875rem 1.75rem',
                background: 'rgba(10,10,15,0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                fontSize: '0.92rem',
                borderRadius: 100,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.25s ease',
                pointerEvents: 'auto',
                cursor: 'pointer',
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

          {/* Social row — shallowest Z */}
          <div
            style={{
              transform: 'translateZ(12px)',
              display: 'flex', gap: '0.75rem',
              pointerEvents: 'auto',
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
                  width: 36, height: 36,
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

          {/* Right Column: Clean Profile Photo */}
          <div style={{
            transform: 'translateZ(40px)',
            pointerEvents: 'auto',
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              width: 300,
              aspectRatio: '3/4',
              background: 'rgba(10,10,15,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}>
              <CursorReveal src="/naresh.jpg" />
              
              {/* Minimal Hint label */}
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)', borderRadius: 4, padding: '0.2rem 0.5rem',
                border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none',
                letterSpacing: '0.1em', textTransform: 'uppercase'
              }}>explore ✦</div>
              
              {/* Subtle Gradient overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                background: 'linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to portfolio bg */}
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
        }}
      >
        <span>move cursor — explore</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)' }} />
      </div>
    </section>
  );
}
