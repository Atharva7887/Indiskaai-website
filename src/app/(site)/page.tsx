import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
// Molecular Interaction scrollytelling — on ice for launch.
// Re-enable by uncommenting the import + the <BindingSection /> below.
// import BindingSection from "@/components/BindingSection";
import Approach from "@/components/Approach";
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
      {/* <BindingSection /> */}
      <div className="divider mx-auto max-w-[1400px]" />
      <Approach />
      <div className="divider mx-auto max-w-[1400px]" />
      <About stats={stats} />
      <Reveal />
    </main>
  );
}
