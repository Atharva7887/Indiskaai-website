"use client";

import { useEffect, useState, useRef } from "react";
import { useMotionValue, useSpring, useAnimationFrame } from "framer-motion";

export default function CatCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Cursor target positions
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);

  // Cat actual positions (springs) - lower damping and higher mass for "skidding" momentum
  const springConfig = { damping: 10, stiffness: 60, mass: 1.5 };
  const catX = useSpring(targetX, springConfig);
  const catY = useSpring(targetY, springConfig);

  // Refs for animation state to avoid dependency cycles in requestAnimationFrame
  const directionRef = useRef(0); // 0: down, 1: left, 2: right, 3: up
  const frameRef = useRef(1);
  const lastTimeRef = useRef(0);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  // Image loading and background removal
  useEffect(() => {
    const img = new window.Image();
    img.src = "/cat-sprite.jpg";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      
      // Remove white/near-white background
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // If RGB values are high, it's the white background
        if (data[i] > 230 && data[i+1] > 230 && data[i+2] > 230) {
          data[i+3] = 0; // Set Alpha to 0
        }
      }
      ctx.putImageData(imageData, 0, 0);
      
      offscreenCanvasRef.current = canvas;
      setIsLoaded(true);
    };
  }, []);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      // Offset slightly to the bottom right of the main cursor
      targetX.set(e.clientX + 16);
      targetY.set(e.clientY + 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [targetX, targetY, isVisible]);

  useAnimationFrame((time) => {
    if (!isLoaded || !offscreenCanvasRef.current || !canvasRef.current) return;

    const currentX = catX.get();
    const currentY = catY.get();
    
    const dx = currentX - lastXRef.current;
    const dy = currentY - lastYRef.current;
    
    lastXRef.current = currentX;
    lastYRef.current = currentY;

    const speed = Math.sqrt(dx * dx + dy * dy);
    const moving = speed > 0.5;

    let dir = directionRef.current;
    if (moving) {
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 2 : 1; // 2: right, 1: left
      } else {
        dir = dy > 0 ? 0 : 3; // 0: down, 3: up
      }
      directionRef.current = dir;
    }

    if (time - lastTimeRef.current > 150) {
      if (moving) {
        frameRef.current = (frameRef.current + 1) % 4; 
      } else {
        frameRef.current = 1;
      }
      lastTimeRef.current = time;
    }

    // Render to canvas
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 48, 48);
    
    const colIndex = frameRef.current === 3 ? 1 : frameRef.current;
    const srcX = colIndex * 32;
    const srcY = dir * 32;
    
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreenCanvasRef.current, srcX, srcY, 32, 32, 0, 0, 48, 48);
    
    // Snap to integers to prevent pixel-art jittering
    canvasRef.current.style.transform = `translate3d(${Math.round(currentX) - 24}px, ${Math.round(currentY) - 24}px, 0)`;
  });

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      width={48}
      height={48}
      className="fixed top-0 left-0 pointer-events-none z-[98]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
