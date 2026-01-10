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
      const cy = h * 0.35; // top third

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

      const drawChakraDots = () => {
        const cols = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
        cols.forEach((col, i) => {
          let y = canvas.height * 0.8 - i * (canvas.height * 0.1);
          let s = 12 + 6 * Math.sin(t + i);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, y, s, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        });
      };

      const renderCosmicScene = () => {
        ctx.fillStyle = '#000416';
        ctx.fillRect(0, 0, w, h);
        drawNebula(cx, cy);
        drawStars();
        drawMontblancAura(cx, cy - 10);
      };

      if (type === 'loving-kindness') {
        t += 0.008;
        renderCosmicScene();
      } else if (type === 'aura') {
        t += 0.02;
        renderCosmicScene();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(cx, cy, 120, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120, 190, 255, 0.08)';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else if (type === 'chakra') {
        t += 0.05;
        renderCosmicScene();
        drawChakraDots();
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
