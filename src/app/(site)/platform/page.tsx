import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  PLATFORM_PRODUCTS,
  PLATFORM_PIPELINES,
  PLATFORM_TOOLKITS,
} from "@/lib/platform-data";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "IndiskaAI's software products, named pipelines, and computational toolkit: Structure Suite, the Antibody Engineering Platform, MutantGen, lead optimization, de novo design, and genomics.",
};

function PlatformCard({
  slug,
  title,
  summary,
  image,
  imageAlt,
  num,
}: {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  num: string;
}) {
  return (
    <Link
      href={`/platform/${slug}`}
      className="group relative bg-cream-100 p-8 md:p-10 transition-colors duration-500 hover:bg-cream-50"
    >
      <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
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

      <h3 className="font-display text-[1.5rem] md:text-[1.7rem] leading-[1.05] tracking-tightest text-ink mb-3 transition-colors duration-500 group-hover:text-navy">
        {title}
      </h3>
      <p className="text-ink-soft text-[0.95rem] leading-[1.5] max-w-[38ch]">
        {summary}
      </p>

      <span className="mt-6 inline-flex items-center gap-2 text-[0.85rem] text-navy">
        Learn more
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>

      <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-navy to-gold transition-transform duration-700 group-hover:scale-x-100" />
    </Link>
  );
}

export default function PlatformPage() {
  let n = 0;
  return (
    <main className="relative">
      <PageHeader
        eyebrow="Platform"
        title={
          <>
            Software, pipelines,{" "}
            <span className="italic text-navy">and a toolkit.</span>
          </>
        }
        lede="Alongside our antibody library and discovery services, we build and run our own software: three shipped products, a named lead-optimization pipeline, and the computational toolkit behind our de novo design and genomics work."
      />

      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="kicker mb-8">Products</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
            {PLATFORM_PRODUCTS.map((p) => {
              n += 1;
              return (
                <PlatformCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  summary={p.summary}
                  image={p.image}
                  imageAlt={p.imageAlt}
                  num={String(n).padStart(2, "0")}
                />
              );
            })}
          </div>
        </div>
      </section>

      <div className="divider mx-auto max-w-[1400px]" />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="kicker mb-8">Named pipeline</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
            {PLATFORM_PIPELINES.map((p) => {
              n += 1;
              return (
                <PlatformCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  summary={p.summary}
                  image={p.image}
                  imageAlt={p.imageAlt}
                  num={String(n).padStart(2, "0")}
                />
              );
            })}
          </div>
        </div>
      </section>

      <div className="divider mx-auto max-w-[1400px]" />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="kicker mb-8">Computational toolkit</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
            {PLATFORM_TOOLKITS.map((p) => {
              n += 1;
              return (
                <PlatformCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  summary={p.summary}
                  image={p.image}
                  imageAlt={p.imageAlt}
                  num={String(n).padStart(2, "0")}
                />
              );
            })}
          </div>

          <div className="mt-16 border-t border-black/10 pt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="text-ink-soft max-w-[44ch] leading-[1.6]">
              Want to see the platform in action, or talk through a
              program that needs it?
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
