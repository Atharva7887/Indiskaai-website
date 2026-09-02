"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 1.5 + 0.5;
  }

  update(w: number, h: number, mouseX: number, mouseY: number, rectTop: number, rectLeft: number) {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0) { this.x = 0; this.vx *= -1; }
    if (this.x > w) { this.x = w; this.vx *= -1; }
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    if (this.y > h) { this.y = h; this.vy *= -1; }

    // Mouse interaction (adjust mouse pos relative to canvas)
    if (mouseX > -1 && mouseY > -1) {
      const relMouseX = mouseX - rectLeft;
      const relMouseY = mouseY - rectTop;
      
      const dx = relMouseX - this.x;
      const dy = relMouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        // Push away
        const force = (120 - dist) / 120;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(30, 91, 168, 0.4)"; // Navy
    ctx.fill();
  }
}

interface ParticleBackgroundProps {
  className?: string;
}

export default function ParticleBackground({ className = "" }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let w = container.clientWidth;
    let h = container.clientHeight;
    
    let rectTop = 0;
    let rectLeft = 0;
    let mouseX = -1;
    let mouseY = -1;

    const init = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
      
      const rect = canvas.getBoundingClientRect();
      rectTop = rect.top;
      rectLeft = rect.left;
      
      const density = w < 768 ? 20000 : 12000;
      const particleCount = Math.floor((w * h) / density);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(w, h));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };
    
    const handleScroll = () => {
       const rect = canvas.getBoundingClientRect();
       rectTop = rect.top;
       rectLeft = rect.left;
    };

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // Use ResizeObserver to detect if the container size changes
    const resizeObserver = new ResizeObserver(() => {
      init();
    });
    resizeObserver.observe(container);

    init();

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(w, h, mouseX, mouseY, rectTop, rectLeft);
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(30, 91, 168, ${0.2 * (1 - dist / 100)})`; // Fading navy line
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full mix-blend-multiply opacity-50"
        aria-hidden="true"
      />
    </div>
  );
}
