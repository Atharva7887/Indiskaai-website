"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { type MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NAVY = "#1E5BA8";
const GOLD = "#F4C430";

/* -----------------------------  ANTIGEN  ----------------------------- */
/* A central icosahedron with surface "spike" atoms — abstract spike-protein vibe. */
function Antigen({
  positionRef,
  glowRef,
}: {
  positionRef: React.MutableRefObject<number>;
  glowRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const matCore = useRef<THREE.MeshStandardMaterial>(null);

  const spikes = useMemo(() => {
    const out: { p: [number, number, number]; s: number }[] = [];
    const N = 28;
    for (let i = 0; i < N; i++) {
      // Fibonacci sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.92;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      out.push({ p: [x, y, z], s: 0.085 + Math.random() * 0.04 });
    }
    return out;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Vertical docking — antigen drops from above the viewport (y = +3.5)
    // and locks just above center (y = +0.2). Together with the antibody
    // ending at y = -0.2 the bound complex sits centered around y = 0.
    const targetY = 3.5 - 3.3 * positionRef.current;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      4.5,
      delta
    );
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x += delta * 0.05;

    // Glow ramps up as binding completes
    if (matCore.current) {
      matCore.current.emissiveIntensity = THREE.MathUtils.damp(
        matCore.current.emissiveIntensity,
        0.18 + glowRef.current * 0.7,
        3.5,
        delta
      );
    }
  });

  return (
    <group ref={group} position={[0, 3.5, 0]}>
      {/* Core */}
      <mesh>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshStandardMaterial
          ref={matCore}
          color={NAVY}
          roughness={0.35}
          metalness={0.45}
          emissive={NAVY}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Surface spikes (atoms) — low-poly icosahedrons keep tri count tiny */}
      {spikes.map((sp, i) => (
        <mesh key={i} position={sp.p}>
          <icosahedronGeometry args={[sp.s, 1]} />
          <meshStandardMaterial
            color={NAVY}
            roughness={0.3}
            metalness={0.55}
            emissive={NAVY}
            emissiveIntensity={0.22}
            flatShading
          />
        </mesh>
      ))}

      {/* Wireframe overlay for that "scientific scan" feel */}
      <mesh>
        <icosahedronGeometry args={[0.95, 2]} />
        <meshBasicMaterial color={NAVY} wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/* -----------------------------  ANTIBODY  ----------------------------- */
/* Classic Y-shape: stem + two arms with terminal binding regions. */
function Antibody({
  positionRef,
  glowRef,
}: {
  positionRef: React.MutableRefObject<number>;
  glowRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const tipL = useRef<THREE.MeshStandardMaterial>(null);
  const tipR = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Vertical docking — antibody rises from below the viewport (y = -3.5)
    // and locks just below center (y = -0.2). Arms still point up so the
    // binding tips meet the antigen base.
    const targetY = -3.5 + 3.3 * positionRef.current;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      4.5,
      delta
    );
    // Slight orientation shift as it approaches — antibody "rotates into pose"
    const targetRotZ = (1 - positionRef.current) * -0.3;
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      targetRotZ,
      3.0,
      delta
    );
    group.current.rotation.y += delta * 0.12;

    const glow = 0.15 + glowRef.current * 0.85;
    if (tipL.current)
      tipL.current.emissiveIntensity = THREE.MathUtils.damp(
        tipL.current.emissiveIntensity,
        glow,
        3.5,
        delta
      );
    if (tipR.current)
      tipR.current.emissiveIntensity = THREE.MathUtils.damp(
        tipR.current.emissiveIntensity,
        glow,
        3.5,
        delta
      );
  });

  // Build Y-shape
  return (
    <group ref={group} position={[0, -3.5, 0]} rotation={[0, 0, -0.3]}>
      {/* Stem (Fc region) */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.9, 12]} />
        <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.55} />
      </mesh>

      {/* Hinge node */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.16, 2]} />
        <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Left arm */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0.65]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 1.0, 12]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.55} />
        </mesh>
        {/* Variable region tip — this is what binds */}
        <mesh position={[0, 1.12, 0]}>
          <icosahedronGeometry args={[0.2, 2]} />
          <meshStandardMaterial
            ref={tipL}
            color={GOLD}
            roughness={0.25}
            metalness={0.65}
            emissive={GOLD}
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0, 0, 0]} rotation={[0, 0, -0.65]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 1.0, 12]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.55} />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <icosahedronGeometry args={[0.2, 2]} />
          <meshStandardMaterial
            ref={tipR}
            color={GOLD}
            roughness={0.25}
            metalness={0.65}
            emissive={GOLD}
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}

/* -----------------------------  RESPONSIVE OFFSET  -----------------------------
   Shifts the docking complex to the right side of the viewport on landscape /
   wide screens so it never crowds the left-side text panel. On portrait /
   narrow screens it stays centered (x = 0). Updates reactively on resize.
*/
function ResponsiveOffset({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const xOffset = THREE.MathUtils.clamp(viewport.aspect - 1.0, 0, 1) * 1.5;
  return <group position={[xOffset, 0, 0]}>{children}</group>;
}

/* -----------------------------  AURA / GLOW HALO  ----------------------------- */
function BindingAura({ glowRef }: { glowRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!ref.current || !mat.current) return;
    const targetScale = 1 + glowRef.current * 1.6;
    const s = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 3.5, delta);
    ref.current.scale.set(s, s, s);
    mat.current.opacity = THREE.MathUtils.damp(
      mat.current.opacity,
      0.0 + glowRef.current * 0.35,
      3.5,
      delta
    );
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.0, 2]} />
      <meshBasicMaterial
        ref={mat}
        color={GOLD}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

/* -----------------------------  SCROLL DRIVER  -----------------------------
   Aligned to the text beats so the visual lock peaks while "Step 03 — Bound"
   is at ~50% opacity (which happens at scrollYProgress ≈ 0.66, midway through
   beat-3's [0.62, 0.7] fade-in window).

   - approachRef: 0 → 1 over scroll 0..0.62 (locks just as Step 03 begins)
   - glowRef:     0 → 1 over scroll 0.62..0.70 (peaks exactly at the lock moment)
*/
function ScrollDriver({
  progress,
  approachRef,
  glowRef,
}: {
  progress: MotionValue<number>;
  approachRef: React.MutableRefObject<number>;
  glowRef: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    const v = progress.get();
    const dockRaw = THREE.MathUtils.clamp(v / 0.62, 0, 1);
    // smoothstep — softens the start/end so motion feels weighted
    approachRef.current = dockRaw * dockRaw * (3 - 2 * dockRaw);
    // Glow ramps from 0.62 → 0.70 (centered on the visual handover)
    glowRef.current = THREE.MathUtils.clamp((v - 0.62) / 0.08, 0, 1);
  });
  return null;
}

export default function BindingScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const approachRef = useRef(0);
  const glowRef = useRef(0);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute !inset-0"
    >
      <ScrollDriver
        progress={progress}
        approachRef={approachRef}
        glowRef={glowRef}
      />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} color={GOLD} />
      <pointLight position={[0, 0, 2]} intensity={1.4} color={GOLD} distance={6} />

      <ResponsiveOffset>
        <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.25}>
          <Antigen positionRef={approachRef} glowRef={glowRef} />
          <Antibody positionRef={approachRef} glowRef={glowRef} />
          <BindingAura glowRef={glowRef} />
        </Float>
      </ResponsiveOffset>

      <Environment preset="studio" environmentIntensity={0.3} />
    </Canvas>
  );
}
