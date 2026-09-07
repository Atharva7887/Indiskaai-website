"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "button" | "a" | "div";
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  as = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for the button container
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Motion values for the inner text/content (moves slightly more for parallax)
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);

  // Springs for smooth physics
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const buttonXSpring = useSpring(x, springConfig);
  const buttonYSpring = useSpring(y, springConfig);
  
  const textSpringConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const textXSpring = useSpring(textX, textSpringConfig);
  const textYSpring = useSpring(textY, textSpringConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    // Calculate distance from center of the button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull strength (higher divisor = less pull)
    const pullX = (e.clientX - centerX) / 3;
    const pullY = (e.clientY - centerY) / 3;
    
    x.set(pullX);
    y.set(pullY);
    
    // Inner text moves slightly further to create a 3D parallax effect
    textX.set(pullX * 1.5);
    textY.set(pullY * 1.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset positions
    x.set(0);
    y.set(0);
    textX.set(0);
    textY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const Component = as as any;

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <motion.div
        style={{ x: buttonXSpring, y: buttonYSpring }}
        className="w-full h-full"
      >
        <Component
          className={`${className} block`}
          onClick={onClick}
          href={href}
          data-interactive="true"
        >
          <motion.span
            className="inline-block w-full h-full"
            style={{ x: textXSpring, y: textYSpring }}
          >
            {children}
          </motion.span>
        </Component>
      </motion.div>
    </div>
  );
}
