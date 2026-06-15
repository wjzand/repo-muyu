import { useEffect, useRef } from 'react';
import { Particle, Ripple } from '@/types';
import { useGameStore } from '@/store/useGameStore';

const STAR_COLORS = ['#a855f7', '#22d3ee', '#ec4899', '#00ff88', '#ffffff'];

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ActiveRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<StarParticle[]>([]);
  const knockParticlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<ActiveRipple[]>([]);
  const lastRippleIdRef = useRef<Set<number>>(new Set());

  const gameRipples = useGameStore((s) => s.ripples);
  const gameParticles = useGameStore((s) => s.particles);
  const updateParticles = useGameStore((s) => s.updateParticles);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initStars();
    };

    const initStars = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const starCount = Math.floor((w * h) / 15000);
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.5 + 0.5,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          alpha: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frame = 0;

    const animate = () => {
      frame++;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = 'rgba(10, 10, 15, 0.3)';
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.max(w, h) * 0.7
      );
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.03)');
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.02)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      starsRef.current.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.twinklePhase += star.twinkleSpeed;

        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;

        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const alpha = star.alpha * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        if (star.size > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha * 0.2;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      gameRipples.forEach((r: Ripple) => {
        if (!lastRippleIdRef.current.has(r.id)) {
          lastRippleIdRef.current.add(r.id);
          ripplesRef.current.push({
            id: r.id,
            x: r.x,
            y: r.y,
            radius: 10,
            maxRadius: 200,
            alpha: 0.6,
            color: '#a855f7',
          });
        }
      });

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 5;
        ripple.alpha -= 0.01;

        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          return false;
        }

        for (let i = 0; i < 3; i++) {
          const layerRadius = ripple.radius - i * 15;
          if (layerRadius > 0) {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, layerRadius, 0, Math.PI * 2);
            ctx.strokeStyle = ripple.color;
            ctx.globalAlpha = ripple.alpha * (1 - i * 0.3);
            ctx.lineWidth = 2 - i * 0.5;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;

        return true;
      });

      if (ripplesRef.current.length === 0 && lastRippleIdRef.current.size > 100) {
        lastRippleIdRef.current.clear();
      }

      if (gameParticles.length > 0 && knockParticlesRef.current.length === 0) {
        knockParticlesRef.current = [...gameParticles];
        updateParticles([]);
      }

      knockParticlesRef.current = knockParticlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += 0.05;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.3;
        ctx.fill();

        ctx.globalAlpha = 1;
        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameRipples, gameParticles, updateParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
