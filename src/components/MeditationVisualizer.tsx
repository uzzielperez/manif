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
        t += 0.02;
        let p = 75 + 25 * Math.sin(t);
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height * 0.6, 80, Math.PI, 0); // body base
        ctx.arc(canvas.width / 2, canvas.height * 0.48, 30, 0, Math.PI * 2); // head
        ctx.strokeStyle = `hsla(${200 + 50 * Math.sin(t)}, 90%, 60%, 0.7)`;
        ctx.lineWidth = p / 50;
        ctx.stroke();
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
