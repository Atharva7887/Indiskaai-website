"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Hardcoded publication data                                        */
/* ------------------------------------------------------------------ */

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string | null;
  status: "Published" | "Preprint" | "In Preparation";
}

const publications: Publication[] = [
  {
    title:
      "Benchmarking AlphaFold 3 vs. Specialist Folders on Antibody–Antigen Complexes",
    authors: "Atharva Shirke, IndiskaAI Research",
    venue: "bioRxiv (preprint)",
    year: 2026,
    doi: "#",
    status: "Preprint",
  },
  {
    title:
      "Pocket-Conditioned Diffusion for Structure-Based Drug Design: A Benchmark Study",
    authors: "IndiskaAI Research Team",
    venue: "In preparation",
    year: 2026,
    doi: null,
    status: "In Preparation",
  },
  {
    title:
      "Closed-Loop Generative Discovery: From Sequence to Therapeutic Lead in Silico",
    authors: "IndiskaAI",
    venue: "Whitepaper",
    year: 2025,
    doi: "#",
    status: "Published",
  },
  {
    title:
      "Boltz-2 Pose Recovery on a Targeted Kinase Set: An Independent Evaluation",
    authors: "IndiskaAI Research",
    venue: "Internal Technical Report",
    year: 2026,
    doi: "#",
    status: "Published",
  },
];

/* ------------------------------------------------------------------ */
/*  Status badge styles                                               */
/* ------------------------------------------------------------------ */

const badgeStyles: Record<Publication["status"], string> = {
  Published: "bg-[#1E5BA8] text-white",
  Preprint: "bg-[#F4C430] text-[#1A1A1A]",
  "In Preparation": "bg-[#F0EDE4] text-[#6B6B6B]",
};

/* ------------------------------------------------------------------ */
/*  Shared motion config                                              */
/* ------------------------------------------------------------------ */

const ease = [0.16, 1, 0.3, 1] as const;

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Publications() {
  return (
    <section id="publications" className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="mb-14"
        >
          {/* Eyebrow / kicker */}
          <p className="kicker tracking-tightest mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-[#1E5BA8]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#1E5BA8]" />
            Publications
          </p>

          {/* Heading */}
          <h2 className="font-display tracking-tightest text-3xl font-bold text-[#1A1A1A] sm:text-4xl md:text-5xl">
            Peer-reviewed work and{" "}
            <span className="italic text-[#1E5BA8]">preprints.</span>
          </h2>
        </motion.div>

        {/* ── Publication rows ───────────────────────────────────── */}
        <motion.ul
          className="divide-y divide-black/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          {publications.map((pub, i) => (
            <motion.li
              key={i}
              variants={rowVariants}
              className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-start sm:justify-between"
            >
              {/* Left content */}
              <div className="flex-1 min-w-0">
                {/* Badge + year row */}
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold leading-5 ${badgeStyles[pub.status]}`}
                  >
                    {pub.status}
                  </span>
                  <span className="kicker tracking-tightest text-xs font-semibold uppercase text-[#6B6B6B]">
                    {pub.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display tracking-tightest text-[1.3rem] font-semibold leading-snug text-[#1A1A1A]">
                  {pub.title}
                </h3>

                {/* Authors */}
                <p className="mt-1.5 text-sm text-[#6B6B6B]">{pub.authors}</p>

                {/* Venue */}
                <p className="mt-0.5 text-sm italic text-[#6B6B6B]">
                  {pub.venue}
                </p>
              </div>

              {/* Right — DOI link */}
              {pub.doi && (
                <div className="flex-shrink-0 sm:ml-6 sm:mt-2">
                  <a
                    href={pub.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1E5BA8]/30 px-4 py-1.5 text-sm font-medium text-[#1E5BA8] transition-all duration-300 hover:border-[#1E5BA8] hover:bg-[#1E5BA8] hover:text-white"
                  >
                    View paper
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </div>
              )}
            </motion.li>
          ))}
        </motion.ul>

        {/* ── Footer note ────────────────────────────────────────── */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="mt-12 text-center text-sm text-[#6B6B6B]"
        >
          For collaboration inquiries or pre-publication access, contact{" "}
          <a
            href="mailto:research@indiskaai.com"
            className="font-medium text-[#1E5BA8] underline decoration-[#1E5BA8]/30 underline-offset-2 transition-colors hover:text-[#1E5BA8]/80"
          >
            research@indiskaai.com
          </a>
        </motion.p>
      </div>
    </section>
  );
}
