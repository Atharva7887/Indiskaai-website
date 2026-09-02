import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PartnerForm from "@/components/PartnerForm";
import { emailFor, getSiteSettings } from "../../../../sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Partner",
  description:
    "Partner with IndiskaAI for structural-AI-led drug discovery programs. We work with biopharma teams from target through clinical candidate.",
};

const engagementTypes = [
  {
    title: "Target engagement",
    body: "Structure prediction, ligandability, and binding-mode discovery on a single target. 6–10 weeks.",
  },
  {
    title: "Generative program",
    body: "End-to-end generative pipeline against a defined therapeutic concept. Closed-loop with our optimization stack.",
  },
  {
    title: "Embedded research",
    body: "Long-form partnership where our team operates alongside yours. Suited for platform companies and clinical programs.",
  },
];

export default async function PartnerPage() {
  const settings = await getSiteSettings();
  const partnerEmail = emailFor(settings, "Partnerships");
  return (
    <main className="relative">
      <PageHeader
        eyebrow="Partner with us"
        title={
          <>
            Run a program with{" "}
            <span className="italic text-navy">structural rigor.</span>
          </>
        }
        lede="We partner with biopharma teams from early target hypothesis through optimized clinical-candidate handoff. Tell us a little about what you're working on."
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="lg:col-span-5 space-y-10">
            <div>
              <div className="kicker mb-4">How we engage</div>
              <ul className="space-y-6">
                {engagementTypes.map((e) => (
                  <li key={e.title} className="border-t border-black/10 pt-5">
                    <div className="font-display text-[1.35rem] md:text-[1.55rem] leading-[1.1] tracking-tightest text-ink mb-2">
                      {e.title}
                    </div>
                    <p className="text-ink-soft leading-[1.55]">{e.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-black/10 pt-6 text-sm text-ink-muted">
              <div className="kicker mb-3">Direct contact</div>
              <a
                href={`mailto:${partnerEmail}`}
                className="font-display text-2xl tracking-tightest text-ink hover:text-navy transition-colors"
              >
                {partnerEmail}
              </a>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <PartnerForm contactEmail={partnerEmail} />
          </div>
        </div>
      </section>
    </main>
  );
}
