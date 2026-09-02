"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function About() {
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

            {/* Structural biology lab — grounds the "bench" half of the claim */}
            <div className="mt-10 relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1630959305790-4c956ce6c0b6?auto=format&fit=crop&q=80&w=1200"
                alt="Scientist examining a sample under a microscope in a structural biology laboratory"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26,26,26,0) 55%, rgba(26,26,26,0.32) 100%)",
                }}
              />
            </div>
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
      </div>
    </section>
  );
}
