import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LiquidChrome from "@/components/lab/LiquidChrome";

export const metadata: Metadata = {
  title: "Lab — IndiskaAI",
  description:
    "An interactive shader playground. Move the cursor. Click anywhere.",
};

export default function LabPage() {
  return (
    <main className="relative">
      <PageHeader
        eyebrow="Lab"
        title={
          <>
            A <span className="italic text-navy">tactile</span> surface.
          </>
        }
        lede="One of a small collection of interactive shader pieces — each a single fragment shader running on a fullscreen quad. Move the cursor through it. Click anywhere to drop a ripple."
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/10 bg-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
            <LiquidChrome />

            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-cream-100/85">
              <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
              01 · Liquid chrome
            </div>

            <div className="pointer-events-none absolute right-5 bottom-5 text-[0.7rem] tracking-[0.16em] uppercase text-cream-100/70">
              Move · Click
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            <div className="md:col-span-5">
              <div className="kicker mb-2">Notes</div>
              <p className="text-ink-soft text-[0.98rem] leading-[1.65]">
                The surface is a domain-warped noise field, lit by two
                brand-tinted lights. The cursor bends space around itself with a
                short falloff; clicks emit a decaying sine ripple that
                propagates through the field.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="kicker mb-2">Interactions</div>
              <ul className="text-ink-soft text-[0.98rem] leading-[1.7] space-y-1">
                <li>Pointer — pulls the chrome toward the cursor.</li>
                <li>Click / tap — drops a ripple at that point.</li>
                <li>Up to eight active ripples at a time.</li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <div className="kicker mb-2">More coming</div>
              <p className="text-ink-muted text-[0.95rem] leading-[1.6]">
                Plasma · Voronoi · Caustics · Field lines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
