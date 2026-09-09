"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import TextReveal from "@/components/TextReveal";

/**
 * Grouped, homepage-scale view of the real antibody lead-optimization
 * pipeline documented in full (all 9 stages) at
 * /platform/lead-optimization-pipeline. Every sentence here maps directly
 * to a named stage and tool in src/lib/platform-data.ts — this is a
 * condensed summary of that real, running pipeline, not a separate or
 * invented process, so keep the two in sync when either changes. Labeled
 * "Phase" rather than "Stage" so the count here (5) is never read as
 * contradicting the full 9-stage breakdown on the Platform page.
 */
const stages = [
  {
    step: "Phase 01",
    title: "Encode",
    body: "The parent antibody's sequence is IMGT-numbered with ANARCI, then embedded with AbLang2, the representation every downstream step scores against.",
  },
  {
    step: "Phase 02",
    title: "Generate & score",
    body: "New variants are sampled by PSSM and ESM-2 masked-language resampling from the same phage-display repertoire, then ranked by a CatBoost classifier trained on real NGS phage-panning enrichment data.",
  },
  {
    step: "Phase 03",
    title: "Verify structurally",
    body: "Each candidate's Fv is folded by ABodyBuilder3, AlphaFold2-Multimer, and ESM3, co-folded against the target with Boltz-2, then rescored through Schrödinger docking with MM-GBSA.",
  },
  {
    step: "Phase 04",
    title: "Gate for developability",
    body: "Humanness, liability, and novelty filters narrow the ranked shortlist to candidates worth advancing, computationally, before anything reaches a bench.",
  },
  {
    step: "Phase 05",
    title: "Confirm (planned)",
    body: "A Jurkat-Luc reporter assay will confirm agonist or antagonist activity. Not yet run: every result above is in-silico, and our live CD28 and IL-2Rβ programs are at exactly this stage today.",
  },
];

export default function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="approach"
      ref={ref}
      className="relative py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-20 md:mb-28 max-w-[44ch]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.98] tracking-tightest text-ink">
              A process you can{" "}
              <span className="italic text-navy">audit</span>, end to end.
            </h2>
          </motion.div>
          <TextReveal
            as="p"
            text="This is not a generic diagram. It is a condensed view of the antibody lead-optimization pipeline running today, in parallel, across our CD28 and IL-2Rβ programs."
            className="mt-6 text-ink-soft text-[1.02rem] leading-[1.6]"
            delay={0.1}
          />
        </div>

        {/* Supporting visual — computational analysis, grounds "auditable" in something concrete */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-20 md:mb-28 aspect-[21/9] overflow-hidden rounded-2xl border border-black/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1766297248160-87aca6fa59ef?auto=format&fit=crop&q=80&w=2000"
            alt="Scientist reviewing structural imaging data across dual monitors"
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

        {/* Timeline */}
        <div className="relative pl-8 md:pl-16">
          {/* Vertical baseline */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-black/10 md:left-6" />
          {/* Animated highlight on top */}
          <motion.div
            style={{ height: lineY }}
            className="absolute left-2 top-0 w-px bg-gradient-to-b from-navy via-navy to-gold md:left-6"
          />

          <div className="space-y-16 md:space-y-24">
            {stages.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.06,
                }}
                className="group relative"
              >
                {/* Node dot — pulses on hover */}
                <span className="absolute -left-[28px] md:-left-[44px] top-2 flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full bg-cream-100 border border-navy/40 transition-[border-color,transform] duration-500 group-hover:border-navy group-hover:scale-125" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-navy transition-[background-color,transform] duration-500 group-hover:bg-gold group-hover:scale-110" />
                </span>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                  <div className="md:col-span-3">
                    <div className="kicker text-ink-muted transition-colors duration-500 group-hover:text-navy">
                      {s.step}
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-[2rem] md:text-[2.8rem] leading-[1.02] tracking-tightest text-ink mb-3 transition-colors duration-500 group-hover:text-navy">
                      {s.title}
                    </h3>
                    <p className="text-ink-soft text-[1rem] md:text-[1.05rem] leading-[1.6] max-w-[52ch]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-16 md:mt-20 pl-8 md:pl-16"
        >
          <Link
            href="/platform/lead-optimization-pipeline"
            className="cta cta-ghost"
          >
            See the full pipeline breakdown
            <span className="cta-arrow">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
