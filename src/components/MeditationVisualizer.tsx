import React, { useEffect, useRef } from 'react';

export type VisualizerType = 'aura' | 'loving-kindness' | 'chakra';

interface MeditationVisualizerProps {
  type: VisualizerType;
}

export const MeditationVisualizer: React.FC<MeditationVisualizerProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const w = canvas.width;
      const h = canvas.height;
      const cx = w >> 1;
      const cy = h * 0.35; // Moved to the top third of the screen

      if (type === 'aura') {
        t += 0.02;
        let b = (Math.sin(t) + 1) / 2;
        let R = 80 + 60 * b;
        let g = 150 + 100 * b;
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(cx, h / 2, R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,${g},255,0.8)`;
        ctx.fill();
      } else if (type === 'loving-kindness') {
        t += 0.008;

        // Dark cosmic background
        ctx.fillStyle = '#000416';
        ctx.fillRect(0, 0, w, h);

        // drawNebula
        const drawNebula = (ncx: number, ncy: number) => {
          const pulse = Math.sin(t * 0.6) * 0.5 + 0.5;
          const g = ctx.createRadialGradient(ncx, ncy, 0, ncx, ncy, w);

          g.addColorStop(0, `hsla(220, 90%, 70%, ${0.4 + pulse * 0.35})`);
          g.addColorStop(0.3, `hsla(210, 65%, 40%, ${0.28 + pulse * 0.15})`);
          g.addColorStop(0.65, `hsla(200, 50%, 20%, 0.2)`);
          g.addColorStop(1, `hsla(220, 90%, 6%, 1)`);

          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        };

        // drawStars
        const drawStars = () => {
          ctx.fillStyle = "#ffffff";
          for (let i = 0; i < 400; i++) {
            const sx = (i * 137.5) % w;
            const sy = (i * 213.7) % h;
            const tw = 0.3 + Math.sin(t * 3 + i) * 0.3;
            ctx.globalAlpha = tw;
            ctx.fillRect(sx, sy, 1.3, 1.3);
          }
          ctx.globalAlpha = 1;
        };

        // drawMontblancAura
        const drawMontblancAura = (hcx: number, hcy: number) => {
          const breathe = Math.sin(t * 1.4) * 30 + 100; // Breathing core
          const pulse = Math.sin(t * 3) * 8; // micro shimmer
          const intensity = 0.65 + Math.sin(t * 2.2) * 0.25;

          for (let i = 0; i < 5; i++) {
            const r = breathe + pulse + i * 35;
            const alpha = (0.18 - i * 0.03) * intensity;

            const grad = ctx.createRadialGradient(hcx, hcy, 0, hcx, hcy, r);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.35, `hsla(45, 100%, 75%, ${alpha + 0.2})`);
            grad.addColorStop(1, `hsla(215, 80%, 20%, 0)`);

            ctx.fillStyle = grad;
            ctx.fillRect(hcx - r, hcy - r * 0.8, r * 2, r * 1.6);
          }
        };

        // drawSilhouette
        const drawSilhouette = (fcx: number, fcy: number) => {
          ctx.save();
          ctx.translate(fcx, fcy);
          const breathe = Math.sin(t * 1.4) * 0.02 + 1;
          ctx.scale(breathe * 2.0, breathe * 2.0);

          // A more “human” silhouette: use a single vector outline + negative-space cutouts
          // so the arms/legs read immediately as a seated meditator (not a blob).
          const silhouette = new Path2D();

          // ---- Outer head + body + lotus base ----
          // Head
          silhouette.ellipse(0, -72, 14, 18, 0, 0, Math.PI * 2);

          // Neck
          silhouette.moveTo(-5, -56);
          silhouette.quadraticCurveTo(0, -52, 5, -56);
          silhouette.lineTo(6, -46);
          silhouette.quadraticCurveTo(0, -44, -6, -46);
          silhouette.closePath();

          // Torso + shoulders (rounded, natural slopes)
          silhouette.moveTo(-42, -44);
          silhouette.bezierCurveTo(-58, -38, -70, -18, -62, 6); // left shoulder → left rib
          silhouette.bezierCurveTo(-56, 26, -42, 38, -24, 44);  // left waist → left hip
          silhouette.quadraticCurveTo(0, 52, 24, 44);           // belly curve
          silhouette.bezierCurveTo(42, 38, 56, 26, 62, 6);      // right hip → right rib
          silhouette.bezierCurveTo(70, -18, 58, -38, 42, -44);  // right rib → right shoulder
          silhouette.quadraticCurveTo(0, -54, -42, -44);        // collar line
          silhouette.closePath();

          // Lotus base (wide, clearly seated)
          silhouette.moveTo(-28, 46);
          silhouette.bezierCurveTo(-70, 44, -122, 64, -132, 96); // left knee
          silhouette.quadraticCurveTo(-134, 112, -106, 114);     // left foot outer
          silhouette.quadraticCurveTo(-62, 116, -22, 104);       // left foot → center
          silhouette.quadraticCurveTo(0, 98, 22, 104);           // center → right foot
          silhouette.quadraticCurveTo(62, 116, 106, 114);        // right foot outer
          silhouette.quadraticCurveTo(134, 112, 132, 96);        // right knee
          silhouette.bezierCurveTo(122, 64, 70, 44, 28, 46);     // back to start
          silhouette.closePath();

          // ---- Negative space cutouts (arms + leg separation) ----
          // Under-arm / lap opening (gives “hands in lap” without drawing hands)
          silhouette.moveTo(-36, 0);
          silhouette.quadraticCurveTo(-24, 30, 0, 34);
          silhouette.quadraticCurveTo(24, 30, 36, 0);
          silhouette.quadraticCurveTo(18, 10, 0, 10);
          silhouette.quadraticCurveTo(-18, 10, -36, 0);
          silhouette.closePath();

          // Leg split (so it’s clearly crossed, not one big base)
          silhouette.ellipse(-34, 92, 34, 18, 0.05, 0, Math.PI * 2);
          silhouette.ellipse(34, 92, 34, 18, -0.05, 0, Math.PI * 2);

          // A small “gap” at the center for the crossed ankles
          silhouette.ellipse(0, 106, 18, 10, 0, 0, Math.PI * 2);

          // Fill with even-odd rule so the “cutout” subpaths become holes.
          ctx.fillStyle = 'rgba(5, 5, 12, 0.98)';
          ctx.fill(silhouette, 'evenodd');

          // Premium rim light along outer contour
          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = `hsla(45, 100%, 85%, ${0.14 + Math.sin(t * 2) * 0.04})`;
          ctx.lineWidth = 1.25;
          ctx.stroke(silhouette);
          ctx.globalCompositeOperation = 'source-over';

          ctx.restore();
        };

        drawNebula(cx, cy * 0.97);
        drawStars();
        drawMontblancAura(cx, cy - 50); // Moved up
        drawSilhouette(cx, cy - 10);    // Moved up significantly from center
      } else if (type === 'chakra') {
        t += 0.05;
        const cols = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        cols.forEach((col, i) => {
          let y = canvas.height * 0.8 - i * (canvas.height * 0.1);
          let s = 12 + 6 * Math.sin(t + i);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, y, s, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 bg-black"
      style={{ touchAction: 'none' }}
    />
  );
};
