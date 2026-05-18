// Shown automatically by Next during route transitions and async data
// fetches for any page inside the (site) group. Nav + Footer come from
// the layout, so this file is only the page body.

export default function Loading() {
  return (
    <main className="relative">
      {/* Matches PageHeader spacing so transitions feel like the real page
          is loading in, not a different layout. */}
      <header className="relative pt-40 md:pt-48 pb-20 md:pb-28">
        {/* Brand gradient orbs — kept un-pulsed; they're decorative continuity */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #1E5BA8, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 animate-pulse">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-black/15" />
            <div className="h-3 w-20 rounded-sm bg-black/10" />
          </div>

          {/* Title — three big bars */}
          <div className="mt-7 space-y-3 md:space-y-4">
            <div className="h-10 md:h-16 w-[78%] rounded-md bg-black/10" />
            <div className="h-10 md:h-16 w-[62%] rounded-md bg-black/10" />
            <div className="h-10 md:h-16 w-[44%] rounded-md bg-black/10" />
          </div>

          {/* Lede */}
          <div className="mt-9 space-y-2.5 max-w-[58ch]">
            <div className="h-3.5 w-[94%] rounded-sm bg-black/[0.08]" />
            <div className="h-3.5 w-[88%] rounded-sm bg-black/[0.08]" />
            <div className="h-3.5 w-[60%] rounded-sm bg-black/[0.08]" />
          </div>
        </div>
      </header>

      {/* Generic content scaffold — three-column card grid covers the common
          page shape (capabilities, horizons, team, etc.) */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5 rounded-xl overflow-hidden animate-pulse">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-cream-100 p-8 md:p-12">
                <div className="h-3 w-16 rounded-sm bg-black/10 mb-6" />
                <div className="space-y-2.5">
                  <div className="h-6 w-[85%] rounded-sm bg-black/10" />
                  <div className="h-6 w-[55%] rounded-sm bg-black/10" />
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-3 w-full rounded-sm bg-black/[0.07]" />
                  <div className="h-3 w-[92%] rounded-sm bg-black/[0.07]" />
                  <div className="h-3 w-[78%] rounded-sm bg-black/[0.07]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <span className="sr-only" role="status" aria-live="polite">
        Loading
      </span>
    </main>
  );
}
