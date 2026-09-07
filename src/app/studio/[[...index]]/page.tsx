import { Suspense } from "react";
import { isSanityConfigured } from "../../../../sanity/lib/client";
import StudioClient from "./StudioClient";
import StudioNotConfigured from "./StudioNotConfigured";

// The Studio is fully interactive and reads runtime env vars. Force dynamic
// so Next never tries to pre-render it as a static page.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <StudioNotConfigured />;
  }
  return (
    <Suspense fallback={null}>
      <StudioClient />
    </Suspense>
  );
}
