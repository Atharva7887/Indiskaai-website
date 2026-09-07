import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { PLATFORM, getPlatformEntry } from "@/lib/platform-data";

export function generateStaticParams() {
  return PLATFORM.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const entry = getPlatformEntry(params.slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default function PlatformDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getPlatformEntry(params.slug);
  if (!entry) notFound();

  const others = PLATFORM.filter((p) => p.slug !== entry.slug);

  return (
    <main className="relative">
      <PageHeader
        eyebrow={entry.kindLabel}
        title={entry.title}
        lede={entry.summary}
      />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="relative mb-14 md:mb-20 aspect-[21/8] overflow-hidden rounded-2xl border border-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.image}
              alt={entry.imageAlt}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="text-ink-soft text-[1.06rem] md:text-[1.12rem] leading-[1.7]">
                {entry.description}
              </p>

              {/* Product capability list */}
              {entry.capabilities && entry.capabilities.length > 0 && (
                <div className="mt-10">
                  <div className="kicker mb-4">Capabilities</div>
                  <div className="flex flex-wrap gap-2">
                    {entry.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[0.8rem] rounded-full border border-black/10 px-3.5 py-1.5 text-ink-soft bg-cream-50"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pipeline: named programs */}
              {entry.programs && entry.programs.length > 0 && (
                <div className="mt-12">
                  <div className="kicker mb-5">Live programs</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {entry.programs.map((prog) => (
                      <div
                        key={prog.name}
                        className="border border-black/10 rounded-2xl p-6 bg-cream-50"
                      >
                        <div className="font-display text-[1.3rem] tracking-tightest text-navy mb-2">
                          {prog.name}
                        </div>
                        <p className="text-ink-soft text-[0.92rem] leading-[1.55]">
                          {prog.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pipeline: stages */}
              {entry.stages && entry.stages.length > 0 && (
                <div className="mt-12">
                  <div className="kicker mb-5">Pipeline stages</div>
                  <ol className="space-y-5">
                    {entry.stages.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-navy/10 text-navy text-[0.8rem] font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-ink font-medium mb-1">
                            {s.title}
                          </div>
                          <p className="text-ink-soft text-[0.92rem] leading-[1.55]">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Pipeline: validation honesty note */}
              {entry.validationNote && (
                <div className="mt-12 border border-gold/40 bg-gold/5 rounded-2xl p-6">
                  <div className="kicker mb-3 text-ink">Validation status</div>
                  <p className="text-ink-soft text-[0.92rem] leading-[1.6]">
                    {entry.validationNote}
                  </p>
                </div>
              )}

              {/* Toolkit: categorized tool catalog */}
              {entry.toolCategories && entry.toolCategories.length > 0 && (
                <div className="mt-12">
                  <div className="kicker mb-5">Capability catalog</div>
                  <div className="space-y-8">
                    {entry.toolCategories.map((cat) => (
                      <div key={cat.category}>
                        <div className="text-[0.72rem] tracking-[0.1em] uppercase text-navy/70 mb-3">
                          {cat.category}
                        </div>
                        <div className="border-t border-black/10">
                          {cat.tools.map((t) => (
                            <div
                              key={t.name}
                              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3 border-b border-black/10"
                            >
                              <span className="shrink-0 sm:w-[13ch] font-medium text-ink text-[0.9rem]">
                                {t.name}
                              </span>
                              <span className="text-ink-soft text-[0.88rem] leading-[1.5]">
                                {t.body}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 border-t border-black/10 pt-10 flex flex-wrap items-center gap-4">
                <Link href="/partner" className="cta">
                  Partner with us
                  <span className="cta-arrow">→</span>
                </Link>
                <Link href="/platform" className="cta cta-ghost">
                  See all of platform
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="kicker mb-5">Elsewhere in platform</div>
              <ul className="space-y-1">
                {others.map((p) => (
                  <li key={p.slug} className="border-t border-black/10 first:border-t-0">
                    <Link
                      href={`/platform/${p.slug}`}
                      className="group flex items-center justify-between gap-3 py-4"
                    >
                      <span>
                        <span className="block text-[0.68rem] tracking-[0.1em] uppercase text-ink-muted mb-1">
                          {p.kindLabel}
                        </span>
                        <span className="font-display text-[1.1rem] leading-[1.1] tracking-tightest text-ink transition-colors duration-300 group-hover:text-navy">
                          {p.title}
                        </span>
                      </span>
                      <span className="text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-navy shrink-0">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
