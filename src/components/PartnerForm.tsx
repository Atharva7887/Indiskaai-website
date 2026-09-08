"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Stage = "idle" | "submitting" | "success" | "error";

const interests = [
  "Target engagement",
  "Generative program",
  "Embedded research",
  "Just exploring",
];

const stages = ["Discovery", "Lead optimization", "Preclinical", "Clinical", "Other"];

export default function PartnerForm({
  contactEmail = "hello@indiskaai.com",
}: {
  contactEmail?: string;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [interest, setInterest] = useState(interests[0]);
  const [pipelineStage, setPipelineStage] = useState(stages[0]);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStage("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "We could not send your request.");
      setStage("success");
      form.reset();
    } catch (submissionError) {
      setStage("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your request."
      );
    }
  }

  if (stage === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-signal/40 bg-signal/10 p-10 text-center md:p-14"
        role="status"
      >
        <div className="kicker mb-4 text-navy">Request received</div>
        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-tightest text-ink">
          Thank you. We&apos;ll be in touch <span className="italic text-navy">shortly.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[42ch] leading-[1.6] text-ink-soft">
          Our partnerships team replies within two business days. Or contact us directly at{" "}
          <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a>.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-black/10 bg-cream-50 p-7 md:p-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field id="name" label="Your name" required />
        <Field id="company" label="Company" required />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field id="email" label="Work email" type="email" required />
        <Field id="role" label="Your role" />
      </div>

      <fieldset>
        <legend className="kicker mb-3 text-ink-muted">What are you interested in?</legend>
        <div className="flex flex-wrap gap-2">
          {interests.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setInterest(item)}
              aria-pressed={interest === item}
              className={`rounded-full border px-4 py-2 text-[0.85rem] transition-colors ${
                interest === item
                  ? "border-deep bg-deep text-cream-100"
                  : "border-black/10 bg-cream-100 text-ink-soft hover:border-navy/30"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <input type="hidden" name="interest" value={interest} />
      </fieldset>

      <fieldset>
        <legend className="kicker mb-3 text-ink-muted">Where is your program today?</legend>
        <div className="flex flex-wrap gap-2">
          {stages.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setPipelineStage(item)}
              aria-pressed={pipelineStage === item}
              className={`rounded-full border px-4 py-2 text-[0.85rem] transition-colors ${
                pipelineStage === item
                  ? "border-navy bg-navy text-cream-100"
                  : "border-black/10 bg-cream-100 text-ink-soft hover:border-navy/40"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <input type="hidden" name="stage" value={pipelineStage} />
      </fieldset>

      <div>
        <Label htmlFor="message">A few sentences about what you&apos;re working on</Label>
        <textarea id="message" name="message" rows={5} maxLength={5000} className="w-full resize-none rounded-lg border border-black/10 bg-cream-100 px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus-visible:border-navy/60 focus-visible:ring-2 focus-visible:ring-navy" placeholder="Target, modality, timeline, or anything else you want us to know." />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="max-w-[40ch] text-xs text-ink-muted">We&apos;ll only use this to respond. Nothing is added to a marketing list.</p>
        <button type="submit" disabled={stage === "submitting"} className="cta disabled:cursor-not-allowed disabled:opacity-60">
          {stage === "submitting" ? "Sending…" : "Send request"}
          <span className="cta-arrow">→</span>
        </button>
      </div>

      {stage === "error" && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error} You can also email <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a> directly.
        </p>
      )}
    </form>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="kicker mb-3 block text-ink-muted">{children}</label>;
}

function Field({ id, label, type = "text", required }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <Label htmlFor={id}>{label}{required && <span className="text-navy"> *</span>}</Label>
      <input id={id} name={id} type={type} required={required} maxLength={160} className="w-full rounded-lg border border-black/10 bg-cream-100 px-4 py-3 text-ink outline-none transition-colors focus-visible:border-navy/60 focus-visible:ring-2 focus-visible:ring-navy" />
    </div>
  );
}
