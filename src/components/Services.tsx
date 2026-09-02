"use client";

import { motion } from "framer-motion";

interface Service {
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Services() {
  const services: Service[] = [
    {
      title: "AI-Driven Drug Discovery",
      description: "End-to-end computational drug discovery pipeline — from target identification to optimized lead compounds, powered by our foundation models and structural biology systems.",
      tags: ["Target ID", "Hit Generation", "Lead Optimization"],
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E5BA8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Central hub and connections */}
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
          <circle cx="12" cy="20" r="2" />
          <path d="M12 6v3M6 12h3M15 12h3M12 15v3" />
          <path d="M7.5 7.5l2 2M14.5 9.5l2-2M7.5 16.5l2-2M14.5 14.5l2 2" />
          <circle cx="6.5" cy="6.5" r="1.5" />
          <circle cx="17.5" cy="6.5" r="1.5" />
          <circle cx="6.5" cy="17.5" r="1.5" />
          <circle cx="17.5" cy="17.5" r="1.5" />
        </svg>
      ),
    },
    {
      title: "Protein Structure Prediction",
      description: "High-accuracy structure prediction for proteins, protein complexes, and antibody-antigen interactions using state-of-the-art folding models and our proprietary refinement pipeline.",
      tags: ["AlphaFold 3", "Boltz-2", "Ab-Ag Complexes"],
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E5BA8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Elegant spiral folding ribbon structure */}
          <path d="M4.5 16.5c1.5-3.5 3-7 6-8s6 1 8 4.5" />
          <path d="M3 13.5c2-3.5 4-6 7.5-6s5.5 2 7 5.5" />
          <path d="M7.5 19.5c1-2 2-4 4.5-4.5s4.5 1 5.5 3" />
          <path d="M11 3.5l1 2.5-2.5-1z" />
          <path d="M18 17.5l-1 2.5 2.5-1z" />
          <circle cx="11.5" cy="8.2" r="1" fill="#1E5BA8" />
          <circle cx="15.5" cy="10.2" r="1" fill="#1E5BA8" />
        </svg>
      ),
    },
    {
      title: "Generative Molecular Design",
      description: "De novo molecule generation conditioned on 3D binding pockets, target chemistry, and ADMET profiles — producing synthesizable, drug-like candidates.",
      tags: ["Diffusion Models", "Pocket-Conditioned", "SBDD"],
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E5BA8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sparkles + molecular bonds */}
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="M5.64 5.64l2.83 2.83M15.53 15.53l2.83 2.83M5.64 18.36l2.83-2.83M15.53 8.47l2.83-2.83" />
          <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" fill="#1E5BA8" fillOpacity="0.15" />
          <path d="M19 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
        </svg>
      ),
    },
    {
      title: "Binding Affinity & Scoring",
      description: "Physics-aware scoring with free-energy perturbation, ensemble docking, and ML-based affinity prediction to rank and filter candidates with confidence.",
      tags: ["FEP", "Docking", "ML Scoring"],
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E5BA8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Docking fitting key-lock / affinity curve concept */}
          <path d="M3 12h18" />
          <path d="M12 3v18" strokeDasharray="3 3" />
          <path d="M6 18c0-3.5 2.5-6 6-6s6 2.5 6 6" />
          <path d="M9 6c1.5-2 4.5-2 6 0" />
          <circle cx="12" cy="12" r="2" fill="#1E5BA8" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
        </svg>
      ),
    },
    {
      title: "Foundation Model Fine-Tuning",
      description: "Custom fine-tuning of biology foundation models on your proprietary sequence, structure, or assay data — with full lineage tracking and reproducibility.",
      tags: ["Sequence Models", "Structure Models", "Multi-Modal"],
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E5BA8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Layered neural network / fine-tuning sliders */}
          <path d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="8" cy="6" r="2.5" fill="#FAF7F0" />
          <circle cx="16" cy="12" r="2.5" fill="#FAF7F0" />
          <circle cx="10" cy="18" r="2.5" fill="#FAF7F0" />
          <path d="M8 8.5v1M16 14.5v1M10 15.5v-1" />
        </svg>
      ),
    },
    {
      title: "Computational Consulting",
      description: "Expert advisory on integrating AI into your existing drug discovery pipeline — from tool selection and benchmarking to full workflow design.",
      tags: ["Pipeline Design", "Benchmarking", "Integration"],
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E5BA8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Expert handshake or collaboration shapes */}
          <path d="M16 3h5v5" />
          <path d="M8 21H3v-5" />
          <path d="M12 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0" />
          <path d="M21 3L14 10M3 21l7-7" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="relative py-28 md:py-40 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy mr-2 align-middle" />
              What we offer
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.98] tracking-tightest text-ink">
              Services built for{" "}
              <span className="italic text-navy">discovery.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-ink-soft text-[1.05rem] leading-[1.6] max-w-[40ch] md:mb-2"
          >
            Deploying state-of-the-art machine learning models and biophysical
            workflows to accelerate your pipelines.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="group relative rounded-xl border border-black/10 bg-cream-50/20 p-8 transition-[background-color,box-shadow] duration-500 hover:bg-cream-50 hover:shadow-lg hover:shadow-black/[0.03]"
            >
              {/* Top accent line on hover */}
              <span className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-navy to-gold transition-all duration-700 group-hover:w-full rounded-t-xl" />

              {/* Icon Container */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E5BA8]/5 transition-colors duration-500 group-hover:bg-[#1E5BA8]/10">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-[1.35rem] md:text-[1.5rem] leading-[1.1] tracking-tightest text-ink mb-4 transition-colors duration-500 group-hover:text-navy">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-ink-soft text-[0.95rem] leading-[1.55] max-w-[36ch]">
                {service.description}
              </p>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.7rem] tracking-[0.06em] uppercase rounded-full border border-black/10 px-3 py-1 text-ink-muted bg-cream-50/50 transition-all duration-500 group-hover:border-navy/20 group-hover:bg-navy/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Subtle corner glow on hover */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-navy/0 group-hover:bg-navy/[0.02] rounded-br-full transition-all duration-700 pointer-events-none" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
