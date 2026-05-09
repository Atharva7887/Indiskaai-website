import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { getTeamMembers, type TeamMemberDoc } from "../../../../sanity/lib/fetch";
import { urlForImage } from "../../../../sanity/lib/image";

export const metadata: Metadata = {
  title: "Team — IndiskaAI",
  description:
    "The scientists, engineers, and operators behind IndiskaAI.",
};

function initialsFor(name: string): string {
  if (!name || name.trim() === "—") return "·";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function PersonCard({ p }: { p: TeamMemberDoc }) {
  const accent: "navy" | "gold" = p.accent ?? "navy";
  const ringColor =
    accent === "navy" ? "from-navy/30 to-navy/0" : "from-gold/40 to-gold/0";
  const initialBg =
    accent === "navy" ? "bg-navy text-cream-100" : "bg-gold text-ink";
  const imageUrl = p.image
    ? urlForImage(p.image)?.width(640).height(800).fit("crop").url()
    : null;

  return (
    <article className="group relative bg-cream-50 border border-black/5 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(30,91,168,0.45)]">
      {/* Decorative gradient orb (kept from previous design) */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${ringColor} blur-2xl opacity-50 group-hover:opacity-90 transition-opacity z-10`}
      />

      {/* Photo area — large 4:5 portrait. Image scales subtly on hover. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`flex h-28 w-28 items-center justify-center rounded-full ${initialBg} font-display text-[2.4rem] tracking-tightest transition-transform duration-700 ease-out group-hover:scale-[1.06]`}
            >
              {initialsFor(p.name)}
            </span>
          </div>
        )}
        {/* Soft bottom gradient for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{
            background:
              "linear-gradient(180deg, rgba(253,251,245,0) 0%, rgba(253,251,245,0.8) 100%)",
          }}
        />
      </div>

      {/* Name + role + bio */}
      <div className="relative p-6 md:p-8">
        <div className="font-display text-[1.45rem] md:text-[1.7rem] leading-[1.05] tracking-tightest text-ink">
          {p.name}
        </div>
        <div className="text-[0.74rem] tracking-[0.16em] uppercase text-ink-muted mt-2">
          {p.role}
        </div>
        {p.bio && (
          <p className="mt-4 text-ink-soft text-[0.95rem] leading-[1.55]">
            {p.bio}
          </p>
        )}
      </div>
    </article>
  );
}

export default async function TeamPage() {
  const all = await getTeamMembers();
  const leadership = all.filter((m) => m.group === "leadership");
  const scientists = all.filter((m) => m.group !== "leadership");

  return (
    <main className="relative">
      <PageHeader
        eyebrow="The team"
        title={
          <>
            Scientists, engineers,{" "}
            <span className="italic text-navy">first-principles thinkers.</span>
          </>
        }
        lede="A small team holding ambitious ground. We're growing — most of the people who will shape this company haven't joined yet."
      />

      {leadership.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="kicker mb-10">Leadership</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {leadership.map((p) => (
                <PersonCard key={p._id ?? p.name + p.role} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {scientists.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="kicker mb-10">Scientists & Engineers</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {scientists.map((p) => (
                <PersonCard key={p._id ?? p.name + p.role} p={p} />
              ))}
            </div>

            <div className="mt-16 border-t border-black/10 pt-10 flex flex-wrap items-center justify-between gap-6">
              <p className="text-ink-soft max-w-[44ch] leading-[1.6]">
                These open seats are real. If you recognise yourself in one of
                them, write to us — we read every application personally.
              </p>
              <a href="/careers" className="cta">
                See open roles
                <span className="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
