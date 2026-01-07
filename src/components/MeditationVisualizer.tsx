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
          ctx.scale(breathe * 0.45, breathe * 0.45); // Scale of the SVG path
          
          ctx.fillStyle = 'rgba(5, 5, 12, 0.98)';
          
          // Professional Human Yoga Silhouette Path
          const p = new Path2D("M256,108.6c19.1,0,34.5-15.4,34.5-34.5S275.1,39.6,256,39.6s-34.5,15.4-34.5,34.5S236.9,108.6,256,108.6z M428.4,263.8c-12.7-18.7-32.5-30.8-54.8-33.6c-18.8-2.3-37.5-6.7-55.8-13.1c-14.6-5.1-29.9-7.7-45.3-7.7c-5.1,0-10.2,0.3-15.3,0.9c-1.8,0.2-3.7,0.3-5.5,0.4c-1.8-0.1-3.7-0.2-5.5-0.4c-5.1-0.6-10.2-0.9-15.3-0.9c-15.4,0-30.7,2.6-45.3,7.7c-18.3,6.4-37,10.8-55.8,13.1c-22.3,2.8-42.1,14.9-54.8,33.6C107.5,283.5,96,306,96,330.1v34.3c0,42.5,34.5,77.1,77.1,77.1h165.8c42.5,0,77.1-34.5,77.1-77.1v-34.3C416,306,404.5,283.5,428.4,263.8z");
          
          // Center the Path2D (the path is based on a 512x512 grid)
          ctx.translate(-256, -256);
          ctx.fill(p);

          // Subtle Rim Light highlight
          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = `hsla(45, 100%, 80%, ${0.1 + (Math.sin(t * 2) * 0.05)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke(p);
          ctx.globalCompositeOperation = 'source-over';

          ctx.restore();
        };

        drawNebula(cx, cy);
        drawStars();
        drawMontblancAura(cx, cy - 20);
        drawSilhouette(cx, cy + 10);
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
