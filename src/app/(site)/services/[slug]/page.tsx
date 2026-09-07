import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { SERVICES, getService } from "@/lib/services-data";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main className="relative">
      <PageHeader
        eyebrow="What we offer"
        title={service.title}
        lede={service.summary}
      />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="relative mb-14 md:mb-20 aspect-[21/8] overflow-hidden rounded-2xl border border-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.imageAlt}
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
                {service.description}
              </p>

              <div className="mt-12 border-t border-black/10 pt-10 flex flex-wrap items-center gap-4">
                <Link href="/partner" className="cta">
                  Enquire about this service
                  <span className="cta-arrow">→</span>
                </Link>
                <Link href="/services" className="cta cta-ghost">
                  See all services
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="kicker mb-5">Other services</div>
              <ul className="space-y-1">
                {others.map((s) => (
                  <li key={s.slug} className="border-t border-black/10 first:border-t-0">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-3 py-4"
                    >
                      <span className="font-display text-[1.15rem] tracking-tightest text-ink transition-colors duration-300 group-hover:text-navy">
                        {s.title}
                      </span>
                      <span className="text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-navy">
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
