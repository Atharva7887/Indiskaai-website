"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const DnaHelix = dynamic(() => import("./DnaHelix"), {
  ssr: false,
  loading: () => null,
});

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden pt-28 md:pt-32 pb-32 md:pb-24"
    >
      {/* 3D backdrop —
          • mobile: centered behind the copy at reduced opacity so it reads as ambient
          • desktop: pinned to the right of the headline */}
      <div className="pointer-events-auto absolute inset-0 md:left-auto md:right-[-8%] md:w-[58%] z-10 opacity-60 md:opacity-100">
        <DnaHelix />
      </div>

      {/* Radial wash — different framing per breakpoint so the copy stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 md:hidden"
        style={{
          background:
            "radial-gradient(85% 60% at 50% 32%, rgba(250,247,240,0) 0%, rgba(250,247,240,0.55) 55%, rgba(250,247,240,0.96) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden md:block"
        style={{
          background:
            "radial-gradient(60% 70% at 18% 50%, rgba(250,247,240,0.96) 0%, rgba(250,247,240,0.78) 35%, rgba(250,247,240,0) 70%)",
        }}
      />

      <div className="relative z-30 mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="kicker"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
          Generative intelligence, built for biology
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-display mt-6 max-w-[18ch] text-[clamp(2.6rem,7.4vw,6.6rem)] leading-[0.96] tracking-tightest text-ink"
        >
          From sequence
          <br />
          to{" "}
          <span className="relative inline-block">
            <em className="not-italic font-display italic">therapeutic</em>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 320 14"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M2 9 C 80 2, 200 14, 318 6"
                stroke="#F4C430"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
          ,
          <br />
          accelerated.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-8 max-w-[44ch] text-[1.06rem] md:text-[1.15rem] leading-[1.55] text-ink-soft"
        >
          IndiskaAI builds foundation models and structural biology systems for
          drug discovery — collapsing months of wet-lab work into hours of
          principled, in-silico design.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#capabilities" className="cta">
            Explore our work
            <span className="cta-arrow">→</span>
          </a>
          <a href="/partner" className="cta cta-ghost">
            Partner with us
          </a>
        </motion.div>

        {/* Scroll indicator — animated arrow-down chevron only */}
        <motion.a
          href="#capabilities"
          aria-label="Scroll to capabilities"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-16 md:mt-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
        >
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M7 2 v9" />
            <path d="M3 7.5 L7 11.5 L11 7.5" />
          </motion.svg>
        </motion.a>
      </div>
    </section>
  );
}
