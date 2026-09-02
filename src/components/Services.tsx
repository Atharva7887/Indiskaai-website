"use client";

import { motion } from "framer-motion";

/**
 * Condensed teaser — the full services/products breakdown is moving to
 * its own "What we offer" nav destination once that IA lands. Until then
 * this stays a short pointer rather than a duplicate of that page.
 */
export default function Services() {
  return (
    <section id="services" className="relative py-20 md:py-28 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy mr-2 align-middle" />
              What we offer
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.98] tracking-tightest text-ink">
              Services built for{" "}
              <span className="italic text-navy">discovery.</span>
            </h2>
            <p className="mt-5 text-ink-soft text-[1.02rem] leading-[1.6] max-w-[38ch]">
              From target hypothesis to optimized lead — deployed as a
              pipeline, a program, or a standalone engagement.
            </p>
            <a href="/partner" className="cta cta-ghost mt-8">
              See what we offer
              <span className="cta-arrow">→</span>
            </a>
          </motion.div>

          {/* Supporting visual — a physical model of a protein complex, makes "structure" tangible */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1707863080685-177f4f6e850d?auto=format&fit=crop&q=80&w=2000"
              alt="Physical model of a multi-chain protein complex surface structure"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,26,26,0) 60%, rgba(26,26,26,0.28) 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
