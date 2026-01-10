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
      baseAngle: number;
      angle: number;
      radius: number;
      orbitRadius: number;
      color: string;
      opacity: number;
      rotationSpeed: number;
      x: number;
      y: number;

      constructor() {
        this.baseAngle = Math.random() * Math.PI * 2;
        this.angle = this.baseAngle;
        this.radius = Math.random() * (theme.particles.maxSize - theme.particles.minSize) + theme.particles.minSize;
        this.orbitRadius = Math.random() * Math.min(canvas.width, canvas.height) * 0.55;
        this.color = theme.particles.colors[Math.floor(Math.random() * theme.particles.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
        this.rotationSpeed = Math.random() * 0.005 + 0.001;
        this.x = 0;
        this.y = 0;
      }

      update(centerX: number, centerY: number, globalRotation: number) {
        this.angle += this.rotationSpeed;
        const totalAngle = this.angle + globalRotation * 0.3;
        this.x = centerX + Math.cos(totalAngle) * this.orbitRadius;
        this.y = centerY + Math.sin(totalAngle) * this.orbitRadius;
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

    let rotationTime = 0;
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rotationTime += 0.004;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (const particle of particles) {
        particle.update(centerX, centerY, rotationTime);
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
