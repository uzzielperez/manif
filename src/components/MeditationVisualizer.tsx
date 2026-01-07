import React, { useEffect, useRef } from 'react';

export type VisualizerType = 'aura' | 'loving-kindness' | 'chakra';

interface MeditationVisualizerProps {
  type: VisualizerType;
}

export const MeditationVisualizer: React.FC<MeditationVisualizerProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const silhouetteRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (type === 'loving-kindness') {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = 'https://www.shutterstock.com/image-vector/silhouette-person-meditating-lotus-pose-260nw-2702309933.jpg';
      silhouetteRef.current = img;
    }
  }, [type]);

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
        t += 0.009;

        // Dark cosmic background
        ctx.fillStyle = '#000416';
        ctx.fillRect(0, 0, w, h);

        // drawNebula
        const drawNebula = (ncx: number, ncy: number) => {
          const grad = ctx.createRadialGradient(ncx, ncy - 150, 0, ncx, ncy, Math.max(w, h) * 0.8);
          const pulse = Math.sin(t * 0.6) * 0.5 + 0.5;
          grad.addColorStop(0, `hsla(40, 100%, 70%, ${0.5 + pulse * 0.3})`);
          grad.addColorStop(0.25, `hsla(180, 70%, 40%, ${0.2 + pulse * 0.15})`);
          grad.addColorStop(0.5, `hsla(270, 80%, 30%, 0.18)`);
          grad.addColorStop(1, `hsla(220, 90%, 6%, 1)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        };

        // drawStars
        const drawStars = () => {
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 400; i++) {
            const sx = (i * 137.5) % w;
            const sy = (i * 213.7) % h;
            const size = 0.8 + (i % 4) * 0.5;
            const twinkle = 0.3 + Math.sin(t * 3 + i) * 0.3;
            ctx.globalAlpha = twinkle;
            ctx.fillRect(sx, sy, size, size);
          }
          ctx.globalAlpha = 1;
        };

        // drawVibratingGlow
        const drawVibratingGlow = (hcx: number, hcy: number) => {
          const basePulse = Math.sin(t * 1.8) * 30 + 80; // Main breathing
          const vibe = Math.sin(t * 12) * 8; // High-frequency vibration
          const intensity = 0.7 + Math.sin(t * 2.2) * 0.3;

          // Multiple layered glows for depth
          for (let i = 3; i >= 0; i--) {
            const radius = basePulse + vibe + i * 60;
            const alpha = (0.25 - i * 0.06) * intensity;
            const grad = ctx.createRadialGradient(hcx, hcy, 0, hcx, hcy, radius);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.4, `hsla(45, 100%, 75%, ${alpha + 0.3})`);
            grad.addColorStop(1, 'hsla(45, 100%, 50%, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(hcx - radius * 1.5, hcy - radius, radius * 3, radius * 2);
          }

          // Vibrating rays
          ctx.globalCompositeOperation = 'screen';
          for (let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2 + t * 0.3;
            const length = 400 + Math.sin(t * 4 + i * 1.5) * 150 + vibe * 5;
            const width = 3 + i * 0.3 + vibe * 0.5;
            const alpha = 0.18 + Math.sin(t * 5 + i) * 0.08;
            ctx.strokeStyle = `hsla(45, 100%, 70%, ${alpha})`;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(hcx, hcy);
            ctx.lineTo(hcx + Math.cos(angle) * length, hcy + Math.sin(angle) * length);
            ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
        };

        // drawSilhouette
        const drawSilhouette = (fcx: number, fcy: number) => {
          const silhouette = silhouetteRef.current;
          if (silhouette && silhouette.complete) {
            const scale = Math.min(h * 0.6 / silhouette.height, w * 0.6 / silhouette.width);
            const sw = silhouette.width * scale * 1.1;
            const sh = silhouette.height * scale * 1.1;
            const breathe = 1 + Math.sin(t * 1.5) * 0.03;
            ctx.globalAlpha = 1;
            ctx.drawImage(silhouette, fcx - sw/2, fcy - sh/2 + 20, sw * breathe, sh * breathe);
          }
        };

        drawNebula(cx, cy);
        drawStars();
        drawVibratingGlow(cx, cy - 30);
        drawSilhouette(cx, cy);
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
