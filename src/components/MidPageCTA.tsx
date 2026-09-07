"use client";

import { motion } from "framer-motion";

/**
 * Full-bleed CTA band — the homepage's only conversion point between
 * the Hero and the Footer. Sits right after Approach: by then a visitor
 * has seen what we do, the scale of the problem, and how the pipeline
 * works, so this is the moment to ask.
 */
export default function MidPageCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 md:py-28">
      {/* Decorative gradient blobs — consistent with Footer / Future manifesto treatment */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #FAF7F0, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[38ch]"
        >
          <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.05] tracking-tightest text-cream-100">
            Have a target in mind?
          </h2>
          <p className="mt-4 text-cream-100/80 leading-[1.6]">
            We partner with biopharma teams from early target hypothesis
            through optimized clinical-candidate handoff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="shrink-0"
        >
          <a href="/partner" className="cta cta-light">
            Partner with us
            <span className="cta-arrow">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
