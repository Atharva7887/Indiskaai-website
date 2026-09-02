"use client";

import { motion } from "framer-motion";
import type { CapabilityDoc } from "../../sanity/lib/fetch";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Capabilities({ items }: { items: CapabilityDoc[] }) {
  return (
    <section
      id="capabilities"
      className="relative py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy mr-2 align-middle" />
              What we do
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.98] tracking-tightest text-ink max-w-[14ch]">
              Four disciplines.
              <br />
              <span className="italic text-navy">One pipeline.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="md:max-w-[36ch] text-ink-soft text-[1.02rem] leading-[1.6]"
          >
            We compose modern AI methods into a single, auditable workflow —
            from initial target hypothesis through optimized lead.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5"
        >
          {items.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.article
                key={item._id ?? item.title}
                variants={itemVariants}
                className="group relative bg-cream-100 p-8 md:p-12 transition-colors duration-500 hover:bg-cream-50"
              >
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="kicker text-navy/70">{num}</span>
                  <span className="block h-px flex-1 bg-black/10 transition-all duration-700 group-hover:bg-navy/30" />
                </div>

                <h3 className="font-display text-[1.85rem] md:text-[2.4rem] leading-[1.05] tracking-tightest text-ink mb-4 transition-colors duration-500 group-hover:text-navy">
                  {item.title}
                </h3>
                <p className="text-ink-soft text-[1rem] leading-[1.55] max-w-[42ch]">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[0.72rem] tracking-[0.08em] uppercase rounded-full border border-black/10 px-3 py-1 text-ink-muted bg-cream-50 transition-all duration-500 group-hover:border-navy/20 group-hover:bg-navy/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hover accent line — sweeps from left */}
                <span className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-navy to-gold transition-all duration-700 group-hover:w-full" />
                {/* Subtle corner glow on hover */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-navy/0 group-hover:bg-navy/[0.03] rounded-br-full transition-all duration-700 pointer-events-none" />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
