import React, { useEffect, useRef } from 'react';
import { AnimeTheme } from '../types';

interface ParticleBackgroundProps {
  theme: AnimeTheme;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles based on theme.particles
    const particleCount = theme.particles === 'none' ? 0 : 50;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const getColor = () => {
      switch (theme.particles) {
        case 'shadow':
          return Math.random() > 0.5 ? '#06b6d4' : '#a855f7'; // Cyan & Purple
        case 'sparks':
          return Math.random() > 0.5 ? '#f43f5e' : '#fb923c'; // Rose & Orange
        case 'flames':
          return Math.random() > 0.5 ? '#f97316' : '#eab308'; // Orange & Yellow
        case 'sakura':
          return '#f472b6'; // Pink
        case 'cyber':
          return Math.random() > 0.5 ? '#10b981' : '#3b82f6'; // Emerald & Blue
        case 'stars':
          return '#e0e7ff'; // Star white
        default:
          return '#38bdf8'; // Sky blue default
      }
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: theme.particles === 'sakura' ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.7 + 0.2,
        color: getColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (theme.particles === 'sakura') {
          // Draw Sakura petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2, p.size, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme.particles === 'cyber') {
          // Draw small matrix pixel square
          ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
        } else {
          // Glow particle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};
