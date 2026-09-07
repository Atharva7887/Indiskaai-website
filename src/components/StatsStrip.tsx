"use client";

import { motion } from "framer-motion";
import type { StatDoc } from "../../sanity/lib/fetch";

/**
 * Problem-scale stats — previously buried at the bottom of About. Moved
 * up to right after Capabilities so the scale of the problem lands
 * before the pitch is fully made ("here's why this is hard" before
 * "here's how we do it"), rather than after.
 */
export default function StatsStrip({ stats }: { stats: StatDoc[] }) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[52ch] mb-12 md:mb-16"
        >
          <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.1] tracking-tightest text-ink">
            Drug discovery is a search problem at an{" "}
            <span className="italic text-navy">inhuman scale.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.12,
              }}
              className="group"
            >
              <div className="font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-none tracking-tightest text-ink transition-colors duration-500 group-hover:text-navy">
                {s.value}
              </div>
              <div className="mt-4 text-ink-muted text-[0.95rem] leading-[1.5] max-w-[28ch]">
                {s.label}
              </div>
              {/* Underline accent */}
              <div className="mt-4 h-[2px] w-16 origin-left scale-x-0 bg-gradient-to-r from-gold to-navy transition-transform duration-700 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
