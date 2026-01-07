import React, { useEffect, useRef } from 'react';

export type VisualizerType = 'aura' | 'loving-kindness' | 'chakra';

interface MeditationVisualizerProps {
  type: VisualizerType;
}

export const MeditationVisualizer: React.FC<MeditationVisualizerProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      const drawAura = (x: number, y: number, r: number, alpha: number, color: number) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${color}, 80%, 65%, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      };

      const drawPerson = (cx: number, cy: number, s: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(s, s);

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        
        // HEAD
        ctx.beginPath();
        ctx.arc(0, -50, 20, 0, Math.PI * 2);
        ctx.fill();

        // BODY + LEGS
        ctx.beginPath();
        ctx.moveTo(-25, -35);
        ctx.lineTo(0, 40);
        ctx.lineTo(25, -35);
        ctx.closePath();
        ctx.fill();

        // LEGS OUTSIDE
        ctx.beginPath();
        ctx.moveTo(-25, -35);
        ctx.lineTo(-45, 25);
        ctx.lineTo(0, 40);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(25, -35);
        ctx.lineTo(45, 25);
        ctx.lineTo(0, 40);
        ctx.closePath();
        ctx.fill();

        // ARMS IN LAP
        ctx.beginPath();
        ctx.moveTo(-25, -20);
        ctx.quadraticCurveTo(0, 10, 25, -20);
        ctx.quadraticCurveTo(0, -10, -25, -20);
        ctx.fill();

        ctx.restore();
      };
      
      if (type === 'aura') {
        t += 0.02;
        let b = (Math.sin(t) + 1) / 2;
        let R = 80 + 60 * b;
        let g = 150 + 100 * b;
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,${g},255,0.8)`;
        ctx.fill();
      } else if (type === 'loving-kindness') {
        t += 0.01;

        // Gradient background (breathing)
        let bg = ctx.createRadialGradient(
          canvas.width / 2, canvas.height, canvas.width * 0.1,
          canvas.width / 2, canvas.height * 0.7, canvas.width
        );
        const pulse = (Math.sin(t) * 0.5 + 0.5);
        bg.addColorStop(0, `hsla(45,90%,60%,${0.6 + pulse * 0.3})`);
        bg.addColorStop(1, `hsla(230,60%,10%,1)`);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height * 0.6;
        
        // Aura rings
        for (let i = 0; i < 5; i++) {
          drawAura(cx, cy,
            80 + i * 30 + Math.sin(t * 2) * 10,
            0.18 - i * 0.025,
            200 + i * 15 + pulse * 40
          );
        }

        // Glow pulse
        ctx.beginPath();
        ctx.arc(cx, cy, 60 + pulse * 40, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${200 + pulse * 50}, 100%, 70%, ${0.12})`;
        ctx.fill();

        drawPerson(cx, cy, 1.6);
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
