"use client";

import { motion } from "framer-motion";
import type { StatDoc } from "../../sanity/lib/fetch";

export default function About({ stats }: { stats: StatDoc[] }) {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5">
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
              About IndiskaAI
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.98] tracking-tightest text-ink">
              Built by people who have done the bench{" "}
              <span className="italic text-navy">and</span> the bits.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-ink-soft text-[1.06rem] md:text-[1.12rem] leading-[1.65]">
            <p>
              IndiskaAI is a drug-discovery research company building generative
              and structural AI systems with the rigor of a biophysics lab and
              the velocity of a foundation-model team.
            </p>
            <p>
              We were founded on a simple thesis: most of the value in
              biology-AI today is unlocked not by a single model, but by the
              <em> orchestration</em> of many — sequence to structure, structure
              to function, function to therapeutic.
            </p>
            <p>
              Our work spans benchmarking against frontier models like
              AlphaFold 3 and Boltz-2, building our own sequence-and-structure
              foundation models, and shipping closed-loop generative pipelines
              for partners across oncology, neurology, and rare disease.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-24 md:mt-32 border-t border-black/10 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                <div className="font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-none tracking-tightest text-ink">
                  {s.value}
                </div>
                <div className="mt-4 text-ink-muted text-[0.95rem] leading-[1.5] max-w-[28ch]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
