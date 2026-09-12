// ── CursorReveal — Single Photo Edition ──
// Base layer:   your photo in grayscale + dark tint (the "stone")
// Reveal layer: your photo in full vivid color (revealed by cursor trail)
//
// Swap IMAGE_SRC to change the photo.
const IMAGE_SRC = '/naresh.jpg';

import { useEffect, useRef } from 'react';

interface Props {
  src?: string;
}

export default function CursorReveal({ src = IMAGE_SRC }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    // ── Three offscreen canvases ──
    const offBase    = document.createElement('canvas'); // grayscale + dark tint
    const offReveal  = document.createElement('canvas'); // full vivid color
    const offTrail   = document.createElement('canvas'); // alpha mask trail
    const ctxBase    = offBase.getContext('2d')!;
    const ctxReveal  = offReveal.getContext('2d')!;
    const ctxTrail   = offTrail.getContext('2d')!;

    let animId = 0;
    let img: HTMLImageElement | null = null;
    let prevX = -1, prevY = -1;
    let curX  = -1, curY  = -1;

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
      // dark background matching the portfolio bg
      c.fillStyle = '#0a0a0f';
      c.fillRect(0, 0, cw, ch);

      // apply filter (grayscale / vivid) then draw
      c.filter = filterStr;
      c.drawImage(image, dx, dy, dw, dh);
      c.filter = 'none';

      // optional color overlay (for the base duotone tint)
      if (overlayColor && overlayAlpha) {
        c.globalAlpha = overlayAlpha;
        c.fillStyle = overlayColor;
        c.fillRect(dx, dy, dw, dh);
        c.globalAlpha = 1;
      }
    }

    function redrawImages() {
      if (!img) return;
      // Base: deep grayscale + subtle indigo tint
      drawContain(ctxBase, img, 'grayscale(100%) brightness(0.55) contrast(1.1)', '#1e1b4b', 0.35);
      // Reveal: full vivid color, slightly boosted
      drawContain(ctxReveal, img, 'saturate(1.15) brightness(1.0) contrast(1.05)');
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === 0 || h === 0) return;

      [canvas, offBase, offReveal, offTrail].forEach((c) => {
        c.width  = w;
        c.height = h;
      });

      // Trail starts fully transparent
      ctxTrail.clearRect(0, 0, w, h);
      redrawImages();
    }

    // ── Stamp a single soft brush dab ──
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

    // ── Paint continuous ribbon from (x0,y0) to (x1,y1) ──
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

    // ── RAF render loop ──
    function render() {
      animId = requestAnimationFrame(render);
      if (!img) return;

      const { width: w, height: h } = canvas;

      // 1. Fade trail (how fast reveal disappears — lower = longer linger)
      ctxTrail.globalCompositeOperation = 'destination-out';
      ctxTrail.fillStyle = 'rgba(0,0,0,0.035)';
      ctxTrail.fillRect(0, 0, w, h);

      // 2. Paint new brush stroke
      if (curX >= 0 && curY >= 0) {
        const px = prevX < 0 ? curX : prevX;
        const py = prevY < 0 ? curY : prevY;
        paintStroke(px, py, curX, curY);
        prevX = curX;
        prevY = curY;
      }

      // 3. Draw grayscale base to visible canvas
      ctx.drawImage(offBase, 0, 0);

      // 4. Create temp canvas: full-color image masked by trail
      const tmp    = document.createElement('canvas');
      tmp.width    = w;
      tmp.height   = h;
      const tmpCtx = tmp.getContext('2d')!;
      tmpCtx.drawImage(offReveal, 0, 0);
      tmpCtx.globalCompositeOperation = 'destination-in';
      tmpCtx.drawImage(offTrail, 0, 0);

      // 5. Composite the color reveal on top
      ctx.drawImage(tmp, 0, 0);

      // 6. Subtle cursor glow ring on top
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

    // ── Event handlers ──
    function onMouseMove(e: MouseEvent) {
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      curX = e.clientX - rect.left;
      curY = e.clientY - rect.top;
    }

    function onTouchMove(e: TouchEvent) {
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      curX = t.clientX - rect.left;
      curY = t.clientY - rect.top;
    }

    function onMouseLeave() {
      // keep showing last position but stop updating — let trail fade naturally
    }

    // ── Load image ──
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

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave);

    resize();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        cursor: 'none',  // hide system cursor; glow ring acts as cursor
      }}
      aria-label="Interactive photo reveal — move cursor to reveal color"
    />
  );
}
