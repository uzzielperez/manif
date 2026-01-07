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
      const cy = h * 0.57;

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
        t += 0.007;

        // Very soft breathing background
        const grad = ctx.createRadialGradient(
          cx, cy * 1.4, w * 0.05,
          cx, cy * 0.4, w * 1.1
        );

        const breath = softPulse(t * 0.4, 0.4) * 0.25;
        grad.addColorStop(0.00, `hsla(40, 90%, 72%, ${0.38 + breath})`);
        grad.addColorStop(0.35, `hsla(60, 85%, 65%, ${0.22 + breath * 0.6})`);
        grad.addColorStop(0.70, `hsla(190, 70%, 28%, 0.12)`);
        grad.addColorStop(1.00, `hsla(220, 60%, 8%, 1.00)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Gentle mouse following glow
        const glowX = cx + (mouseRef.current.x - cx) * 0.06;
        const glowY = cy + (mouseRef.current.y - cy) * 0.08;

        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(glowX, glowY, 180 + Math.sin(t * 0.7) * 40, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(45,100%,78%,0.07)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 140 + softPulse(t * 0.9) * 60, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(50,100%,82%,0.09)';
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';

        // Main meditative figure
        ctx.save();
        ctx.translate(cx, cy);
        const scale = 1.75 + Math.sin(t * 0.6) * 0.04;
        ctx.scale(scale, scale);

        // Halo
        ctx.beginPath();
        ctx.arc(0, -25, 85, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,220,140,0.07)';
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.ellipse(0, -68, 26, 32, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#111122';
        ctx.fill();

        // Neck & shoulders
        ctx.beginPath();
        ctx.moveTo(-38, -38);
        ctx.quadraticCurveTo(-55, -10, -68, 35);
        ctx.lineTo(68, 35);
        ctx.quadraticCurveTo(55, -10, 38, -38);
        ctx.closePath();
        ctx.fillStyle = '#0a0a18';
        ctx.fill();

        // Hands
        ctx.beginPath();
        ctx.moveTo(-32, -8);
        ctx.quadraticCurveTo(-18, 38, 0, 52);
        ctx.quadraticCurveTo(18, 38, 32, -8);
        ctx.quadraticCurveTo(0, 12, -32, -8);
        ctx.fillStyle = '#111122';
        ctx.fill();

        // Glowing heart
        ctx.globalCompositeOperation = 'screen';
        const heartPulseValue = softPulse(t * 1.6, 1.2) * 12;
        ctx.beginPath();
        heartShape(0, 18, 0.9 + heartPulseValue * 0.03);
        ctx.fillStyle = `hsla(${42 + heartPulseValue * 8}, 100%, 78%, ${0.7 + heartPulseValue * 0.2})`;
        ctx.fill();

        ctx.restore();

        // Ripples
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 7; i++) {
          const radius = 110 + i * 42 + Math.sin(t * 1.3 + i * 1.4) * (18 - i * 2);
          const alpha = 0.12 - i * 0.016;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${38 + i * 12}, 100%, ${72 + i * 3}%, ${alpha})`;
          ctx.lineWidth = 2.8 + i * 0.4;
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
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
