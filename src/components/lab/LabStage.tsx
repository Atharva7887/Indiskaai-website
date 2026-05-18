"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Each shader is heavy enough (WebGL setup, simulation state) that it's worth
// lazy-loading so the initial route bundle stays small.
const LiquidChrome = dynamic(() => import("./LiquidChrome"), { ssr: false });
const Water = dynamic(() => import("./Water"), { ssr: false });
const GravityGrid = dynamic(() => import("./GravityGrid"), { ssr: false });
const MeshGradient = dynamic(() => import("./MeshGradient"), { ssr: false });

type ShaderId = "liquid-chrome" | "water" | "gravity-grid" | "mesh-gradient";

type Shader = {
  id: ShaderId;
  number: string;
  name: string;
  note: string;
  interactions: string[];
  Component: React.ComponentType;
};

const SHADERS: Shader[] = [
  {
    id: "liquid-chrome",
    number: "01",
    name: "Liquid chrome",
    note: "A persistent height-field driving the surface normals of a brand-tinted chrome material. Clicks add energy that propagates and accumulates rather than resetting.",
    interactions: [
      "Drag the cursor — leaves a continuous wake.",
      "Click anywhere — drops an impulse into the height field.",
      "Repeated clicks build energy; the surface keeps moving.",
    ],
    Component: LiquidChrome,
  },
  {
    id: "water",
    number: "02",
    name: "Water",
    note: "Top-down view of a pool. The same height-field simulation, rendered with refractive caustics dancing on the floor.",
    interactions: [
      "Drag — surface wake distorts the caustic pattern.",
      "Click — drops a stone; ripples propagate outward.",
      "Watch the caustics move with the waves.",
    ],
    Component: Water,
  },
  {
    id: "gravity-grid",
    number: "03",
    name: "Gravity grid",
    note: "An infinite grid warped by gravitational wells. The cursor is one mass; clicks deposit additional permanent masses.",
    interactions: [
      "Move the cursor — grid lines bend toward it.",
      "Click — drops a permanent mass at that point.",
      "Up to six click-masses; oldest is replaced when full.",
    ],
    Component: GravityGrid,
  },
  {
    id: "mesh-gradient",
    number: "04",
    name: "Mesh gradient",
    note: "A handful of colored blobs blended via inverse-distance weighting. Blobs drift on a slow oscillation; the cursor is an extra blob; clicks shove blobs outward.",
    interactions: [
      "Move the cursor — adds a gold blob that follows you.",
      "Click anywhere — pushes nearby blobs away.",
      "Blobs spring back to their base positions.",
    ],
    Component: MeshGradient,
  },
];

export default function LabStage() {
  const [activeId, setActiveId] = useState<ShaderId>("liquid-chrome");
  const active = SHADERS.find((s) => s.id === activeId) ?? SHADERS[0];
  const ActiveShader = active.Component;

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Tab row */}
        <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {SHADERS.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`group relative inline-flex items-baseline gap-2 py-2 text-[0.85rem] transition-colors ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
                aria-pressed={isActive}
              >
                <span className="font-mono text-[0.72rem] tracking-[0.18em] text-ink-muted">
                  {s.number}
                </span>
                <span>{s.name}</span>
                <span
                  className={`absolute -bottom-0.5 left-0 right-0 h-px transition-all ${
                    isActive ? "bg-gold" : "bg-transparent group-hover:bg-black/15"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Stage */}
        <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/10 bg-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
          {/* Mounting per-id forces a clean teardown when switching shaders */}
          <div key={active.id} className="absolute inset-0">
            <ActiveShader />
          </div>

          <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-cream-100/85">
            <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
            {active.number} · {active.name}
          </div>

          <div className="pointer-events-none absolute right-5 bottom-5 text-[0.7rem] tracking-[0.16em] uppercase text-cream-100/70">
            Move · Click
          </div>
        </div>

        {/* Notes — updates per shader */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          <div className="md:col-span-6">
            <div className="kicker mb-2">Notes</div>
            <p className="text-ink-soft text-[0.98rem] leading-[1.65]">
              {active.note}
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="kicker mb-2">Interactions</div>
            <ul className="text-ink-soft text-[0.98rem] leading-[1.7] space-y-1">
              {active.interactions.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
