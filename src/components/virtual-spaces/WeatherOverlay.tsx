import React, { useEffect, useRef } from 'react';
import { WeatherEffect, WeatherIntensity } from '../../types';

interface WeatherOverlayProps {
  effect: WeatherEffect;
  intensity: WeatherIntensity;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ effect, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === 'none' || intensity === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount =
      intensity === 'low' ? 35 : intensity === 'medium' ? 80 : 160;

    // Initialize particles based on effect type
    const particles = Array.from({ length: particleCount }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: effect === 'rain' ? (Math.random() - 0.5) * 1 - 1 : (Math.random() - 0.5) * 0.8,
        vy:
          effect === 'rain'
            ? Math.random() * 8 + 6
            : effect === 'snow'
            ? Math.random() * 1.5 + 0.5
            : (Math.random() - 0.5) * 0.4,
        size:
          effect === 'rain'
            ? Math.random() * 12 + 8
            : effect === 'snow'
            ? Math.random() * 3 + 1.5
            : effect === 'fireflies'
            ? Math.random() * 3 + 2
            : Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        flicker: Math.random() * 0.05,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (effect === 'fog') {
        // Subtle moving fog gradient
        const fogGrad = ctx.createLinearGradient(0, 0, width, height);
        fogGrad.addColorStop(0, 'rgba(200, 210, 230, 0.08)');
        fogGrad.addColorStop(0.5, 'rgba(180, 195, 215, 0.12)');
        fogGrad.addColorStop(1, 'rgba(200, 210, 230, 0.05)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (effect === 'rain') {
        ctx.strokeStyle = 'rgba(180, 210, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        particles.forEach((p) => {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.size);

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        });
        ctx.stroke();
      } else if (effect === 'snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.vy;
          p.x += Math.sin(p.y * 0.01) * 0.5;

          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        });
      } else if (effect === 'fireflies') {
        particles.forEach((p) => {
          p.alpha += Math.sin(Date.now() * 0.003 + p.x) * p.flicker;
          const clampedAlpha = Math.max(0.1, Math.min(0.9, p.alpha));

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, `rgba(235, 255, 160, ${clampedAlpha})`);
          grad.addColorStop(1, 'rgba(235, 255, 160, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        });
      } else if (effect === 'stars') {
        particles.forEach((p) => {
          const twinkle = Math.sin(Date.now() * 0.002 + p.x) * 0.4 + 0.6;
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (effect === 'clouds') {
        particles.slice(0, 12).forEach((p) => {
          ctx.fillStyle = 'rgba(200, 220, 240, 0.03)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 30 + 40, 0, Math.PI * 2);
          ctx.fill();

          p.x += 0.2;
          if (p.x - 100 > width) p.x = -100;
        });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect, intensity]);

  if (effect === 'none' || intensity === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 w-full h-full"
    />
  );
};
