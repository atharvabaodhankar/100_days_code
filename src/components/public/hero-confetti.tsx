"use client";

import * as React from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  decay: number;
  shape: "rect" | "circle";
}

const CELEBRATION_COLORS = [
  "#10b981", // emerald
  "#f59e0b", // amber
  "#fbbf24", // gold
  "#38bdf8", // sky
  "#f43f5e", // rose
  "#a855f7", // purple
];

/**
 * Lightweight HTML5 canvas confetti overlay that fires celebratory bursts
 * whenever `burstKey` increments (respecting reduced-motion preferences).
 */
export function HeroConfetti({ burstKey }: { burstKey: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const rafRef = React.useRef<number | null>(null);

  const spawnBurst = React.useCallback((width: number, height: number) => {
    const origins = [
      { x: width * 0.15, y: height * 0.55, angleBase: -Math.PI / 3 },
      { x: width * 0.85, y: height * 0.55, angleBase: (-2 * Math.PI) / 3 },
      { x: width * 0.5, y: height * 0.35, angleBase: -Math.PI / 2 },
    ];

    origins.forEach((origin, originIdx) => {
      const count = originIdx === 2 ? 45 : 35;
      for (let i = 0; i < count; i++) {
        const spread = originIdx === 2 ? Math.PI * 0.9 : Math.PI * 0.45;
        const angle = origin.angleBase + (Math.random() - 0.5) * spread;
        const speed = 5 + Math.random() * 9;
        particlesRef.current.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 5 + Math.random() * 5,
          color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          alpha: 1,
          decay: 0.007 + Math.random() * 0.006,
          shape: Math.random() > 0.35 ? "rect" : "circle",
        });
      }
    });
  }, []);

  React.useEffect(() => {
    if (burstKey <= 0) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    spawnBurst(window.innerWidth, window.innerHeight);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.99; // air drag
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > window.innerHeight + 40) {
          return false;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return true;
      });

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [burstKey, spawnBurst]);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
