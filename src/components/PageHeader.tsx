"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}) {
  return (
    <header className="relative pt-40 md:pt-48 pb-20 md:pb-28">
      {/* Soft gradient orb echoing the home page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #1E5BA8, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="kicker"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
          {eyebrow}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="font-display mt-5 text-[clamp(2.4rem,6.4vw,5.8rem)] leading-[0.98] tracking-tightest text-ink max-w-[18ch]"
        >
          {title}
        </motion.h1>

        {lede && (
          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-7 text-ink-soft text-[1.06rem] md:text-[1.18rem] leading-[1.55] max-w-[58ch]"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </header>
  );
}
