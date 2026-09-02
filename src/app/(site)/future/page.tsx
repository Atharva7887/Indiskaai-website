import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "The Future",
  description:
    "Where IndiskaAI is heading — programmable biology, end-to-end therapeutic design, and the long arc of generative medicine.",
};

const horizons = [
  {
    when: "Now",
    title: "Closed-loop discovery",
    body: "Generative pipelines coupled to physics-aware optimization, validated against proprietary and public assay data. Already running in partner programs.",
  },
  {
    when: "3 years",
    title: "Foundation models for biology",
    body: "Multi-modal models that jointly reason over sequence, structure, dynamics, and assay readouts — trained on a corpus that compounds with every program we run.",
  },
  {
    when: "5 years",
    title: "Programmable therapeutics",
    body: "Designed-from-scratch biologics and small molecules with predictable PK, immunogenicity, and selectivity profiles — and a meaningfully shorter clinic-to-bedside loop.",
  },
  {
    when: "10 years",
    title: "Generative medicine",
    body: "Personalized, structurally-grounded therapeutic design at the scale of a population — and a research culture in which dry-lab and wet-lab are no longer distinguishable.",
  },
];

export default function FuturePage() {
  return (
    <main className="relative">
      <PageHeader
        eyebrow="The future"
        title={
          <>
            We&apos;re building toward{" "}
            <span className="italic text-navy">programmable biology.</span>
          </>
        }
        lede="The next decade of therapeutic discovery will not be won by the team with the most data, but by the team that builds the most coherent system around it. This is what we're building, and roughly when."
      />

      {/* Horizon timeline */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5 rounded-xl overflow-hidden">
            {horizons.map((h) => (
              <article
                key={h.title}
                className="bg-cream-100 p-8 md:p-12 group hover:bg-cream-50 transition-colors duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display text-[2.6rem] md:text-[3.4rem] leading-none tracking-tightest text-navy">
                    {h.when}
                  </span>
                  <span className="block h-px flex-1 bg-black/10" />
                </div>
                <h3 className="font-display text-[1.6rem] md:text-[2rem] leading-[1.05] tracking-tightest text-ink mb-3">
                  {h.title}
                </h3>
                <p className="text-ink-soft text-[1rem] leading-[1.6] max-w-[44ch]">
                  {h.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 md:py-32 bg-ink text-cream-100 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #1E5BA8, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="kicker text-cream-300">Manifesto</div>
          </div>
          <div className="md:col-span-8 space-y-6 text-cream-100/90 leading-[1.7] text-[1.05rem] md:text-[1.18rem]">
            <p>
              The wet-lab will not disappear. It will become an instrument that
              the model wields — precise, expensive, and used only when its
              evidence is needed.
            </p>
            <p>
              Most of medicine has been written by accident. The next chapter
              will be written by design — and the alphabet is structure,
              dynamics, and the learned priors that connect them.
            </p>
            <p>
              We are building the company we&apos;d want to work at if we were
              twenty years older and looking back at what we&apos;d helped build.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
