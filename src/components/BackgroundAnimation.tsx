import React, { useRef, useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { COSMIC_THEMES } from '../styles/themes/cosmic';

export const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cosmicThemeId = useUIStore((state) => state.cosmicTheme);
  const theme = COSMIC_THEMES[cosmicThemeId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      angle: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * (theme.particles.maxSize - theme.particles.minSize) + theme.particles.minSize;
        this.speed = Math.random() * (theme.particles.maxSpeed - theme.particles.minSpeed) + theme.particles.minSpeed;
        this.angle = Math.random() * Math.PI * 2;
        this.color = theme.particles.colors[Math.floor(Math.random() * theme.particles.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.angle += Math.random() * 0.02 - 0.01;
      }

      draw() {
        if (!ctx) return;
        
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < theme.particles.count; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [theme]); // Re-run effect when theme changes

  return (
    <div 
      className="fixed inset-0 z-0 transition-colors duration-1000"
      style={{ backgroundColor: theme.colors.background }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      />
      {/* Dynamic gradients for nebula effect */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${theme.colors.primary}44 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, ${theme.colors.secondary}44 0%, transparent 50%)`
        }}
      />
    </div>
  );
};
