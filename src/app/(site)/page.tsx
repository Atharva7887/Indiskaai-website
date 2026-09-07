import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import StatsStrip from "@/components/StatsStrip";
import Services from "@/components/Services";
import PlatformTeaser from "@/components/PlatformTeaser";
import Approach from "@/components/Approach";
import MidPageCTA from "@/components/MidPageCTA";
import About from "@/components/About";
import Reveal from "@/components/Reveal";
import { getCapabilities, getStats } from "../../../sanity/lib/fetch";

export default async function Home() {
  const [capabilities, stats] = await Promise.all([
    getCapabilities(),
    getStats(),
  ]);

  return (
    <main className="relative">
      <Hero />
      <div className="divider mx-auto max-w-[1400px]" />
      <Capabilities items={capabilities} />
      <StatsStrip stats={stats} />
      <div className="divider mx-auto max-w-[1400px]" />
      <Services />
      <PlatformTeaser />
      <div className="divider mx-auto max-w-[1400px]" />
      <Approach />
      <MidPageCTA />
      <div className="divider mx-auto max-w-[1400px]" />
      <About />
      <Reveal />
    </main>
  );
}
