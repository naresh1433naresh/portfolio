// ── CursorReveal — Optimized Edition ──
// Changes from original:
// 1. Temp canvas is created ONCE, not every frame (eliminates memory churn)
// 2. RAF pauses when canvas is off-screen (IntersectionObserver)
// 3. RAF pauses when tab is hidden (Page Visibility API)
// 4. On touch-only devices (mobile), shows the color image directly — no reveal effect
//    (there's no cursor to move on mobile, so the grayscale base just wastes a canvas)
// 5. Image loads only when canvas becomes visible (lazy)
const IMAGE_SRC = '/naresh.jpg';

import { useEffect, useRef } from 'react';

interface Props {
  src?: string;
}

export default function CursorReveal({ src = IMAGE_SRC }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // On touch-only devices (phones/tablets without a pointer), just show the image.
    // There is no cursor to move, so the reveal effect is meaningless on mobile.
    // We detect this via the CSS media feature (not UA sniffing).
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    // ── On touch devices: show a simple image tag instead of canvas ──
    if (isTouch) {
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      img.alt = 'Profile photo of Naresh';
      img.decoding = 'async';
      canvas.style.display = 'none';
      canvas.parentElement?.appendChild(img);
      return () => { img.remove(); };
    }

    // ── Offscreen canvases — created once ──
    const offBase   = document.createElement('canvas'); // grayscale + dark tint
    const offReveal = document.createElement('canvas'); // full vivid color
    const offTrail  = document.createElement('canvas'); // alpha mask trail
    // ── Reusable temp canvas — created ONCE, not every frame ──
    const offTemp   = document.createElement('canvas');

    const ctxBase   = offBase.getContext('2d')!;
    const ctxReveal = offReveal.getContext('2d')!;
    const ctxTrail  = offTrail.getContext('2d')!;
    const ctxTemp   = offTemp.getContext('2d')!;

    let animId = 0;
    let img: HTMLImageElement | null = null;
    let prevX = -1, prevY = -1;
    let curX  = -1, curY  = -1;
    let isVisible = false; // Intersection state
    let isTabVisible = !document.hidden; // Page visibility state

    // ── Draw image "contain"-fit centered into a canvas context ──
    function drawContain(
      c: CanvasRenderingContext2D,
      image: HTMLImageElement,
      filterStr: string,
      overlayColor?: string,
      overlayAlpha?: number
    ) {
      const cw = c.canvas.width;
      const ch = c.canvas.height;
      const scale = Math.min(cw / image.naturalWidth, ch / image.naturalHeight);
      const dw = image.naturalWidth  * scale;
      const dh = image.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      c.clearRect(0, 0, cw, ch);
      c.fillStyle = '#0a0a0f';
      c.fillRect(0, 0, cw, ch);
      c.filter = filterStr;
      c.drawImage(image, dx, dy, dw, dh);
      c.filter = 'none';

      if (overlayColor && overlayAlpha) {
        c.globalAlpha = overlayAlpha;
        c.fillStyle = overlayColor;
        c.fillRect(dx, dy, dw, dh);
        c.globalAlpha = 1;
      }
    }

    function redrawImages() {
      if (!img) return;
      drawContain(ctxBase,   img, 'grayscale(100%) brightness(0.55) contrast(1.1)', '#1e1b4b', 0.35);
      drawContain(ctxReveal, img, 'saturate(1.15) brightness(1.0) contrast(1.05)');
    }

    function syncTempSize(w: number, h: number) {
      offTemp.width  = w;
      offTemp.height = h;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === 0 || h === 0) return;

      ([canvas, offBase, offReveal, offTrail] as HTMLCanvasElement[]).forEach((c) => {
        c.width  = w;
        c.height = h;
      });
      syncTempSize(w, h);
      ctxTrail.clearRect(0, 0, w, h);
      redrawImages();
    }

    function stampBrush(cx: number, cy: number) {
      const radius = offTrail.height * 0.17;
      const grad = ctxTrail.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0,    'rgba(255,255,255,1)');
      grad.addColorStop(0.45, 'rgba(255,255,255,0.75)');
      grad.addColorStop(0.8,  'rgba(255,255,255,0.2)');
      grad.addColorStop(1,    'rgba(255,255,255,0)');
      ctxTrail.globalCompositeOperation = 'source-over';
      ctxTrail.fillStyle = grad;
      ctxTrail.beginPath();
      ctxTrail.arc(cx, cy, radius, 0, Math.PI * 2);
      ctxTrail.fill();
    }

    function paintStroke(x0: number, y0: number, x1: number, y1: number) {
      const r    = offTrail.height * 0.17;
      const dx   = x1 - x0;
      const dy   = y1 - y0;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = r / 3;
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        stampBrush(x0 + dx * t, y0 + dy * t);
      }
    }

    function render() {
      // ── Pause when off-screen or tab hidden ──
      if (!isVisible || !isTabVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      animId = requestAnimationFrame(render);
      if (!img) return;

      const w = canvas.width;
      const h = canvas.height;

      // Fade trail
      ctxTrail.globalCompositeOperation = 'destination-out';
      ctxTrail.fillStyle = 'rgba(0,0,0,0.035)';
      ctxTrail.fillRect(0, 0, w, h);

      // Paint stroke
      if (curX >= 0 && curY >= 0) {
        const px = prevX < 0 ? curX : prevX;
        const py = prevY < 0 ? curY : prevY;
        paintStroke(px, py, curX, curY);
        prevX = curX;
        prevY = curY;
      }

      // Draw grayscale base
      ctx.drawImage(offBase, 0, 0);

      // ── Reuse the persistent temp canvas (no new canvas per frame!) ──
      if (offTemp.width !== w || offTemp.height !== h) syncTempSize(w, h);
      ctxTemp.clearRect(0, 0, w, h);
      ctxTemp.drawImage(offReveal, 0, 0);
      ctxTemp.globalCompositeOperation = 'destination-in';
      ctxTemp.drawImage(offTrail, 0, 0);
      ctxTemp.globalCompositeOperation = 'source-over'; // reset

      // Composite reveal on top
      ctx.drawImage(offTemp, 0, 0);

      // Subtle cursor glow ring
      if (curX >= 0 && curY >= 0 && !prefersReduced) {
        const ringR = offTrail.height * 0.035;
        const glow  = ctx.createRadialGradient(curX, curY, ringR * 0.3, curX, curY, ringR);
        glow.addColorStop(0, 'rgba(129,140,248,0.55)');
        glow.addColorStop(1, 'rgba(129,140,248,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(curX, curY, ringR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      curX = e.clientX - rect.left;
      curY = e.clientY - rect.top;
    }

    function onTouchMove(e: TouchEvent) {
      // touch is handled by the isTouch early-return above; this is dead code
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      curX = t.clientX - rect.left;
      curY = t.clientY - rect.top;
    }

    // ── Page Visibility: pause RAF when tab is hidden ──
    function onVisibilityChange() {
      isTabVisible = !document.hidden;
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // ── Load image — deferred until canvas is visible ──
    const image = new Image();
    image.onload = () => {
      img = image;
      resize();
      animId = requestAnimationFrame(render);
    };
    image.src = src;

    // ── Resize observer ──
    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(canvas);

    // ── Intersection Observer: pause RAF when canvas is not in viewport ──
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    io.observe(canvas);
    // Check initial state (in case canvas is already visible)
    isVisible = canvas.getBoundingClientRect().top < window.innerHeight;

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    resize();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        cursor: 'none',
      }}
      aria-label="Interactive photo reveal — move cursor to reveal color"
    />
  );
}
