import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ── Place your downloaded PolyHaven .gltf in /public/model/scene.gltf ──
const MODEL_PATH = '/model/scene.gltf';

const CAPTIONS = [
  {
    at: 0.05,
    label: '01 — FORM',
    text: 'Structure over noise.',
    sub: 'Clean architecture thinking',
    pos: { top: '12%', left: '4%' } as React.CSSProperties,
  },
  {
    at: 0.32,
    label: '02 — DEPTH',
    text: 'Complexity made visible.',
    sub: 'System design & data flow',
    pos: { top: '12%', right: '4%', textAlign: 'right' as const } as React.CSSProperties,
  },
  {
    at: 0.58,
    label: '03 — WEIGHT',
    text: 'Every layer counts.',
    sub: 'Backend engineering',
    pos: { bottom: '22%', left: '4%' } as React.CSSProperties,
  },
  {
    at: 0.82,
    label: '04 — PRECISION',
    text: 'Built to last.',
    sub: 'Scalable, reliable systems',
    pos: { bottom: '22%', right: '4%', textAlign: 'right' as const } as React.CSSProperties,
  },
];

export default function ScrollFallingObject() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const mountRef    = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const readoutRef  = useRef<HTMLSpanElement>(null);
  const pctRef      = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper   = wrapperRef.current;
    const container = mountRef.current;
    if (!wrapper || !container) return;

    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    /* ── Renderer — transparent so the CSS gradient shows through ── */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    // Cap DPR — more aggressive on mobile for this section (it's already a slow scroll)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog   = new THREE.Fog(0xccd1d7, 3.2, 8.5);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
    camera.position.set(0, 0, 6.4);
    camera.lookAt(0, 0, 0);

    /* ── Environment ── */
    const pmrem   = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex  = pmrem.fromScene(roomEnv).texture;
    scene.environment = envTex;
    roomEnv.dispose();
    pmrem.dispose();

    /* ── Lights ── */
    scene.add(new THREE.HemisphereLight(0xffffff, 0xccd1d7, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(2, 5, 3);
    scene.add(dir);

    /* ── Ice material ── */
    const makeIceMat = (normalMap?: THREE.Texture | null) => {
      const m = new THREE.MeshPhysicalMaterial({
        color:               new THREE.Color(0xe8f3fb),
        transmission:        0.72,
        thickness:           1.8,
        ior:                 1.31,
        roughness:           0.22,
        clearcoat:           0.55,
        clearcoatRoughness:  0.12,
        attenuationColor:    new THREE.Color(0xb0d4ee),
        attenuationDistance: 2.5,
        envMapIntensity:     1.2,
      });
      if (normalMap) {
        m.normalMap   = normalMap;
        m.normalScale = new THREE.Vector2(1.15, 1.15);
      }
      return m;
    };

    /* ── Group that holds the falling object ── */
    const group = new THREE.Group();
    scene.add(group);

    /* ── Normalize helper ── */
    const normalizeObj = (obj: THREE.Object3D) => {
      const box    = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      obj.position.sub(center);
      obj.scale.setScalar(2.3 / maxDim);
    };

    /* ── Apply ice material ── */
    const applyIce = (obj: THREE.Object3D) => {
      obj.traverse((child: any) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh   = child as THREE.Mesh;
        const mats   = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const normal = (mats[0] as THREE.MeshStandardMaterial)?.normalMap ?? null;
        mesh.material = makeIceMat(normal);
      });
    };

    /* ── Load GLTF ──
       On mobile: skip the GLTF load attempt entirely (file doesn't exist → saves a 404 round-trip).
       Use the procedural icosahedron fallback directly. ── */
    const createFallback = () => {
      // Lower subdivision on mobile (2 vs 4) — fewer triangles, faster render
      const detail = isMobile ? 2 : 4;
      const geo = new THREE.IcosahedronGeometry(1.15, detail);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
        const noise = 1 + (Math.sin(v.x * 5.3) * Math.cos(v.y * 4.1) * Math.sin(v.z * 3.7)) * 0.22;
        v.multiplyScalar(1.15 * noise);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      group.add(new THREE.Mesh(geo, makeIceMat(null)));
    };

    if (isMobile) {
      // Skip GLTF attempt on mobile — use fallback immediately
      createFallback();
    } else {
      new GLTFLoader().load(
        MODEL_PATH,
        (gltf: any) => {
          const obj = gltf.scene;
          normalizeObj(obj);
          applyIce(obj);
          group.add(obj);
        },
        undefined,
        () => { createFallback(); }
      );
    }

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

    /* ── State ── */
    let scrollP = 0, eased = 0;
    let mouseX  = 0, mouseY = 0;
    const revealed = new Set<number>();
    let isTabVisible = !document.hidden;
    let isSectionVisible = false; // Start paused; Intersection Observer will enable

    const getP = () => {
      const rect  = wrapper.getBoundingClientRect();
      const wrapH = wrapper.clientHeight;
      const viewH = window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / (wrapH - viewH)));
    };

    const onScroll = () => { scrollP = getP(); };
    const onMouse  = (e: MouseEvent) => {
      mouseX = (e.clientX / innerWidth  - 0.5) * 2;
      mouseY = -(e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener('scroll', onScroll, { passive: true });
    // Skip mouse parallax on mobile (saves event handler cost)
    if (!isMobile) addEventListener('mousemove', onMouse);

    if (reduced) {
      scrollP = 0.5;
      eased   = 0.5;
    }

    /* ── RAF loop ── */
    let animId = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // ── Pause when not visible ──
      if (!isTabVisible || !isSectionVisible) return;

      eased += (scrollP - eased) * 0.08;

      const p  = eased;
      const PI = Math.PI;

      group.position.x = 0;
      group.position.y = 4.4 - p * 8.8;
      group.position.z = -2.5 + Math.sin(p * PI) * 3.6;

      group.rotation.x = p * PI * 3.6;
      group.rotation.y = p * PI * 2.4;
      group.rotation.z = p * PI * 1.7;

      if (!reduced && !isMobile) {
        camera.position.x += (mouseX * 0.9 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.6 - camera.position.y) * 0.05;
      }
      camera.lookAt(0, 0, 0);

      // Caption reveals
      CAPTIONS.forEach((cap, i) => {
        if (p >= cap.at && !revealed.has(i)) {
          revealed.add(i);
          const el = captionRefs.current[i];
          if (el) {
            (el.querySelector('.cap-inner') as HTMLElement).style.transform = 'translateY(0)';
          }
        }
      });

      // Live readout
      if (readoutRef.current) readoutRef.current.textContent = (p * 100).toFixed(1);
      if (pctRef.current)     pctRef.current.textContent    = `y: ${group.position.y.toFixed(2)}  z: ${group.position.z.toFixed(2)}`;

      // Progress bar
      const bar = document.getElementById('sfo-progress-bar');
      if (bar) bar.style.width = `${p * 100}%`;

      renderer.render(scene, camera);
    };
    tick();

    /* ── Page Visibility ── */
    const onVisibility = () => { isTabVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    /* ── Intersection Observer: pause RAF when sticky section is not in viewport ── */
    const io = new IntersectionObserver(
      ([entry]) => { isSectionVisible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    io.observe(wrapper);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('scroll', onScroll);
      if (!isMobile) removeEventListener('mousemove', onMouse);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    /* ── Scroll driver:
       Desktop: 480vh for the full parallax experience
       Mobile:  280vh — still gives the full animation range but much less dead scrolling ── */
    <section
      ref={wrapperRef}
      className="sfo-wrapper"
      style={{ position: 'relative' }}
    >
      {/* ── Sticky full-viewport stage ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 40%, #dde3e9 0%, #c5cdd6 35%, #0a0a0f 100%)',
        }}
      >
        {/* WebGL canvas */}
        <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        {/* Section label */}
        <div style={{
          position: 'absolute', top: '2.25rem', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(99,102,241,0.6)',
          zIndex: 2, pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          Systems &amp; Architecture
        </div>

        {/* Four HUD caption blocks */}
        {CAPTIONS.map((cap, i) => (
          <div
            key={i}
            ref={(el) => { captionRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              ...cap.pos,
              zIndex: 2,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              className="cap-inner"
              style={{
                transform: 'translateY(120%)',
                transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                fontFamily: "'JetBrains Mono', monospace",
                maxWidth: 'clamp(140px, 28vw, 220px)',
              }}
            >
              <div style={{
                fontSize: '0.6rem', color: 'rgba(99,102,241,0.8)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                marginBottom: '0.3rem', fontWeight: 600,
              }}>
                {cap.label}
              </div>
              <div style={{
                fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)', color: '#1a1a2e',
                fontWeight: 600, lineHeight: 1.3,
                marginBottom: '0.2rem',
              }}>
                {cap.text}
              </div>
              <div style={{
                fontSize: 'clamp(0.6rem, 1.4vw, 0.72rem)', color: '#4a5568',
                lineHeight: 1.4,
              }}>
                {cap.sub}
              </div>
            </div>
          </div>
        ))}

        {/* Live readout */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem', letterSpacing: '0.08em',
          color: 'rgba(50,50,80,0.65)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
          zIndex: 2, pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'rgba(99,102,241,0.7)' }}>SCROLL</span>
            <span ref={readoutRef} style={{
              color: '#6366f1', fontWeight: 700,
              minWidth: '3rem', textAlign: 'right',
            }}>0.0</span>
            <span style={{ color: 'rgba(99,102,241,0.7)' }}>%</span>
          </div>
          <span ref={pctRef} style={{ color: 'rgba(50,50,80,0.4)', fontSize: '0.58rem' }}>
            y: 4.40  z: -2.50
          </span>
        </div>

        {/* Thin progress bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: 'rgba(99,102,241,0.1)',
          zIndex: 2,
        }}>
          <div
            id="sfo-progress-bar"
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              width: '0%',
              transition: 'width 0.15s ease',
            }}
          />
        </div>
      </div>

      <style>{`
        /* Desktop: full 480vh experience */
        .sfo-wrapper { height: 480vh; }
        /* Mobile: reduce to 280vh — still covers full animation, far less dead scrolling */
        @media (max-width: 768px) {
          .sfo-wrapper { height: 280vh; }
        }
        @media (max-width: 480px) {
          .sfo-wrapper { height: 240vh; }
        }
      `}</style>
    </section>
  );
}
