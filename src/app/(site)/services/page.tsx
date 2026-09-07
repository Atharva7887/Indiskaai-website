import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { CORE_SERVICES, ENGAGEMENT_MODELS } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Antibody libraries, discovery, engineering, and AI-driven data packages: the services IndiskaAI offers biopharma and biotechnology partners.",
};

const pillars = [
  {
    title: "Scientific Expertise",
    body: "Advanced knowledge and expertise in antibody discovery, engineering, and biotechnology research.",
  },
  {
    title: "Innovative Technology",
    body: "We combine modern sequencing, computational analysis, and AI-driven approaches to advance antibody research.",
  },
  {
    title: "Customized Solutions",
    body: "Flexible and tailored solutions designed to meet the unique requirements of every research project.",
  },
  {
    title: "Quality & Reliability",
    body: "Committed to rigorous quality, reliable data, and consistent solutions that support confident scientific decisions.",
  },
];

export default function ServicesPage() {
  return (
    <main className="relative">
      <PageHeader
        eyebrow="What we offer"
        title={
          <>
            Antibody discovery,{" "}
            <span className="italic text-navy">engineered.</span>
          </>
        }
        lede="From library construction through discovery, data, and R&D: the services behind every antibody program we run with a partner."
      />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-10 md:mb-14 max-w-[44ch]">
            <p className="text-ink-soft leading-[1.6]">
              What we build: the products and processes behind every
              antibody program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5">
            {CORE_SERVICES.map((s, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group relative bg-cream-100 p-8 md:p-12 transition-colors duration-500 hover:bg-cream-50"
                >
                  <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.imageAlt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(26,26,26,0) 60%, rgba(26,26,26,0.24) 100%)",
                      }}
                    />
                  </div>

                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="kicker text-navy/70">{num}</span>
                    <span className="block h-px flex-1 bg-black/10 transition-colors duration-700 group-hover:bg-navy/30" />
                  </div>

                  <h2 className="font-display text-[1.85rem] md:text-[2.2rem] leading-[1.05] tracking-tightest text-ink mb-4 transition-colors duration-500 group-hover:text-navy">
                    {s.title}
                  </h2>
                  <p className="text-ink-soft text-[1rem] leading-[1.55] max-w-[42ch]">
                    {s.summary}
                  </p>

                  <span className="mt-8 inline-flex items-center gap-2 text-[0.85rem] text-navy">
                    Learn more
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>

                  <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-navy to-gold transition-transform duration-700 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </div>

          {/* Engagement models — how a partner accesses the work, kept
              visually distinct from the product/process grid above. */}
          {ENGAGEMENT_MODELS.map((s) => (
            <div
              key={s.slug}
              className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 rounded-2xl border border-black/5 bg-cream-50 p-8 md:p-12 items-center"
            >
              <div className="md:col-span-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="kicker mb-4">Engagement model</div>
                <h2 className="font-display text-[1.85rem] md:text-[2.2rem] leading-[1.05] tracking-tightest text-ink mb-4">
                  {s.title}
                </h2>
                <p className="text-ink-soft text-[1rem] leading-[1.6] max-w-[52ch] mb-6">
                  {s.summary} Rather than a standalone product, this is a
                  dedicated way of working together. Talk to us about
                  scoping one for your program.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/services/${s.slug}`} className="cta cta-ghost">
                    Learn more
                    <span className="cta-arrow">→</span>
                  </Link>
                  <Link href="/partner" className="cta">
                    Partner with us
                    <span className="cta-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider mx-auto max-w-[1400px]" />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-16 md:mb-20 max-w-[44ch]">
            <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.98] tracking-tightest text-ink">
              Built for scientific{" "}
              <span className="italic text-navy">confidence.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {pillars.map((p) => (
              <div key={p.title}>
                <h3 className="font-display text-[1.3rem] leading-[1.1] tracking-tightest text-ink mb-3">
                  {p.title}
                </h3>
                <p className="text-ink-soft text-[0.95rem] leading-[1.55]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-black/10 pt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="text-ink-soft max-w-[44ch] leading-[1.6]">
              Have a target or a program in mind? Tell us what you&apos;re
              working on and we&apos;ll scope the right service.
            </p>
            <Link href="/partner" className="cta">
              Partner with us
              <span className="cta-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
