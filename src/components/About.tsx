"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { StatDoc } from "../../sanity/lib/fetch";

const textReveal = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function About({ stats }: { stats: StatDoc[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" ref={sectionRef} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
              About IndiskaAI
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.98] tracking-tightest text-ink">
              Built by people who have done the bench{" "}
              <span className="italic text-navy">and</span> the bits.
            </h2>
          </motion.div>

          <div className="lg:col-span-7 space-y-6 text-ink-soft text-[1.06rem] md:text-[1.12rem] leading-[1.65]">
            {[
              <p key="p1">
                IndiskaAI is a drug-discovery research company building generative
                and structural AI systems with the rigor of a biophysics lab and
                the velocity of a foundation-model team.
              </p>,
              <p key="p2">
                We were founded on a simple thesis: most of the value in
                biology-AI today is unlocked not by a single model, but by the
                <em> orchestration</em> of many — sequence to structure, structure
                to function, function to therapeutic.
              </p>,
              <p key="p3">
                Our work spans benchmarking against frontier models like
                AlphaFold 3 and Boltz-2, building our own sequence-and-structure
                foundation models, and shipping closed-loop generative pipelines
                for partners across oncology, neurology, and rare disease.
              </p>,
            ].map((el, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
              >
                {el}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-24 md:mt-32 border-t border-black/10 pt-12">
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
                <div className="mt-4 h-[2px] w-0 bg-gradient-to-r from-gold to-navy transition-all duration-700 group-hover:w-16" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
