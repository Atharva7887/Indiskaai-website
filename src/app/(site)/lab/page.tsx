import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LabStage from "@/components/lab/LabStage";

export const metadata: Metadata = {
  title: "Lab — IndiskaAI",
  description:
    "Interactive shader pieces — liquid chrome, water, gravity grid, mesh gradient. Move the cursor. Click anywhere.",
};

export default function LabPage() {
  return (
    <main className="relative">
      <PageHeader
        eyebrow="Lab"
        title={
          <>
            A small collection of{" "}
            <span className="italic text-navy">tactile</span> surfaces.
          </>
        }
        lede="Four interactive shaders, each driven by a single fragment program. Some run a live simulation in a feedback loop, so disturbances persist and compound. Move the cursor. Click anywhere."
      />
      <LabStage />
    </main>
  );
}
