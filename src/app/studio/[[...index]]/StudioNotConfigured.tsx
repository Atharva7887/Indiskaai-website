export default function StudioNotConfigured() {
  return (
    <main className="min-h-screen bg-cream-100 grid place-items-center px-6 py-20">
      <div className="max-w-2xl border border-black/10 rounded-xl p-10 bg-cream-50">
        <div className="kicker mb-4">Studio</div>
        <h1 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tightest text-ink mb-6">
          Set up your <span className="italic text-navy">Sanity project</span>{" "}
          to enable the dashboard.
        </h1>
        <p className="text-ink-soft leading-[1.6] mb-8">
          The CMS is wired and ready — once you point it at a Sanity project, the
          Capabilities, Stats, and Team content on the site will be editable
          here.
        </p>

        <ol className="space-y-5 text-ink-soft leading-[1.6]">
          <li>
            <span className="font-medium text-ink">1.</span> Create a free
            project at{" "}
            <a
              href="https://www.sanity.io/manage"
              className="text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy"
              target="_blank"
              rel="noreferrer"
            >
              sanity.io/manage
            </a>{" "}
            and copy your <code className="bg-cream-100 px-1.5 py-0.5 rounded text-sm">projectId</code>.
          </li>
          <li>
            <span className="font-medium text-ink">2.</span> Add to{" "}
            <code className="bg-cream-100 px-1.5 py-0.5 rounded text-sm">.env.local</code>:
            <pre className="mt-3 bg-ink text-cream-100 p-4 rounded-lg text-sm overflow-x-auto leading-relaxed">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production`}
            </pre>
          </li>
          <li>
            <span className="font-medium text-ink">3.</span> In Sanity Manage,
            add{" "}
            <code className="bg-cream-100 px-1.5 py-0.5 rounded text-sm">
              http://localhost:3001
            </code>{" "}
            and your production domain to the project&apos;s CORS origins (with
            credentials enabled).
          </li>
          <li>
            <span className="font-medium text-ink">4.</span> Restart the dev
            server and reload <code className="bg-cream-100 px-1.5 py-0.5 rounded text-sm">/studio</code>.
            You&apos;ll see the editor for Team Members, Capabilities, and
            Stats.
          </li>
        </ol>

        <div className="mt-10 text-xs text-ink-muted">
          The site itself works fine without Sanity configured — content falls
          back to in-code defaults.
        </div>
      </div>
    </main>
  );
}
