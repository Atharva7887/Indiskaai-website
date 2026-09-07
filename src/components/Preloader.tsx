"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Keep the preloader visible to allow heavy assets (Canvas/Video) to mount cleanly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cream-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      onAnimationComplete={() => {
        if (!isLoading) {
          const el = document.getElementById("preloader");
          if (el) el.style.display = "none";
        }
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      id="preloader"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <Image
          src="/logo.png"
          alt="IndiskaAI Logo"
          width={72}
          height={72}
          priority
          className="h-18 w-18 object-contain"
        />
        <div className="h-[2px] w-32 bg-ink/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
