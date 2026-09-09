"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TextReveal from "@/components/TextReveal";

/**
 * Kept deliberately short: a one-paragraph description of the loop, no
 * tool names, plus a link out to the full technical breakdown at
 * /platform/lead-optimization-pipeline. Matches how comparable platforms
 * (e.g. Benchling) handle "how it works" on their homepage: a plain-
 * language summary up top, real technical depth pushed to a dedicated
 * page rather than dumped into a homepage stage-by-stage timeline.
 */
export default function Approach() {
  return (
    <section id="approach" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-[56ch]">
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
            text="Every candidate we generate is scored, structurally verified, and filtered for developability, producing a trail of evidence before a single one reaches the bench. This is the same pipeline running today, in parallel, across our CD28 and IL-2Rβ programs, with every result to date computational and a wet-lab functional assay still ahead."
            className="mt-6 text-ink-soft text-[1.02rem] leading-[1.6]"
            delay={0.1}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-8"
          >
            <Link href="/platform/lead-optimization-pipeline" className="cta cta-ghost">
              See the full pipeline breakdown
              <span className="cta-arrow">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Supporting visual — computational analysis, grounds "auditable" in something concrete */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 md:mt-20 aspect-[21/9] overflow-hidden rounded-2xl border border-black/5"
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
      </div>
    </section>
  );
}
