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

    const heartShape = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.bezierCurveTo(17, -30, 35, -12, 0, 22);
      ctx.bezierCurveTo(-35, -12, -17, -30, 0, -18);
      ctx.closePath();
      ctx.restore();
    };

    const softPulse = (t: number, speed = 1) => {
      return Math.sin(t * speed) * 0.5 + 0.5;
    };

    const render = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const w = canvas.width;
      const h = canvas.height;
      const cx = w >> 1;
      const cy = h * 0.65;

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
          const grad = ctx.createRadialGradient(ncx, ncy, 0, ncx, ncy, Math.max(w, h));
          const pulse = Math.sin(t * 0.8) * 0.5 + 0.5;
          grad.addColorStop(0, `hsla(45, 100%, 70%, ${0.4 + pulse * 0.2})`);
          grad.addColorStop(0.3, `hsla(200, 80%, 50%, ${0.15 + pulse * 0.1})`);
          grad.addColorStop(0.6, `hsla(280, 70%, 40%, ${0.12})`);
          grad.addColorStop(1, `hsla(220, 90%, 5%, 1)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        };

        // drawStars
        const drawStars = () => {
          ctx.fillStyle = '#fff';
          for (let i = 0; i < 300; i++) {
            const sx = (i * 137.5) % w;
            const sy = (i * 213.7) % h;
            const size = (i % 3 + 1) * 0.8;
            const alpha = 0.3 + Math.sin(t + i) * 0.2;
            ctx.globalAlpha = alpha;
            ctx.fillRect(sx, sy, size, size);
          }
          ctx.globalAlpha = 1;
        };

        // drawHeartGlow
        const drawHeartGlow = (hcx: number, hcy: number) => {
          const heartPulse = Math.sin(t * 2) * 20 + 60;
          const intensity = Math.sin(t * 1.5) * 0.5 + 0.8;

          // Bright core
          const coreGrad = ctx.createRadialGradient(hcx, hcy + 10, 0, hcx, hcy + 10, heartPulse);
          coreGrad.addColorStop(0, `hsla(45, 100%, 90%, 1)`);
          coreGrad.addColorStop(0.3, `hsla(45, 100%, 70%, ${intensity})`);
          coreGrad.addColorStop(1, `hsla(45, 100%, 50%, 0)`);
          ctx.fillStyle = coreGrad;
          ctx.fillRect(hcx - heartPulse * 2, hcy - heartPulse + 10, heartPulse * 4, heartPulse * 2);

          // Radiating rays
          ctx.globalCompositeOperation = 'screen';
          for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2 + t * 0.5;
            const len = 300 + Math.sin(t * 3 + i) * 100;
            ctx.strokeStyle = `hsla(45, 100%, 65%, ${0.15 - i * 0.004})`;
            ctx.lineWidth = 4 + i * 0.5;
            ctx.beginPath();
            ctx.moveTo(hcx, hcy + 10);
            ctx.lineTo(hcx + Math.cos(angle) * len, hcy + 10 + Math.sin(angle) * len);
            ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
        };

        // drawFigure
        const drawFigure = (fcx: number, fcy: number) => {
          ctx.save();
          ctx.translate(fcx, fcy);
          const breathe = Math.sin(t * 1.2) * 0.05 + 1;
          ctx.scale(breathe, breathe);

          ctx.fillStyle = '#000';
          // Legs crossed
          ctx.beginPath();
          ctx.moveTo(-40, 60);
          ctx.quadraticCurveTo(0, 20, 40, 60);
          ctx.quadraticCurveTo(30, 80, 0, 85);
          ctx.quadraticCurveTo(-30, 80, -40, 60);
          ctx.fill();

          // Torso
          ctx.beginPath();
          ctx.moveTo(-35, 55);
          ctx.lineTo(-25, -20);
          ctx.lineTo(25, -20);
          ctx.lineTo(35, 55);
          ctx.closePath();
          ctx.fill();

          // Arms / mudra
          ctx.beginPath();
          ctx.arc(-20, 25, 25, Math.PI * 0.8, Math.PI * 2.2);
          ctx.arc(20, 25, 25, Math.PI * 0.8, Math.PI * 2.2, true);
          ctx.closePath();
          ctx.fill();

          // Head
          ctx.beginPath();
          ctx.arc(0, -45, 28, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        };

        drawNebula(cx, cy - 100);
        drawStars();
        drawHeartGlow(cx, cy - 20);
        drawFigure(cx, cy);
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
