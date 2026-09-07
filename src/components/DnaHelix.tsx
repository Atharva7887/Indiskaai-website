"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ── Brand colours ─────────────────────────────────────────────── */
const NAVY = "#1E5BA8";
const GOLD = "#F4C430";

/* ══════════════════════════════════════════════════════════════════
   Helper: Fibonacci sphere distribution
   Distributes N points evenly on the surface of a sphere of given
   radius, using the golden-angle method.
   ══════════════════════════════════════════════════════════════════ */
function fibonacciSphere(
  count: number,
  radius: number,
  center: THREE.Vector3
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;
    points.push(
      new THREE.Vector3(
        center.x + radius * Math.sin(theta) * Math.cos(phi),
        center.y + radius * Math.sin(theta) * Math.sin(phi),
        center.z + radius * Math.cos(theta)
      )
    );
  }
  return points;
}

/* ══════════════════════════════════════════════════════════════════
   Organic sphere — reusable atom / node component
   Uses sphereGeometry(24,24) + meshPhysicalMaterial with low
   metalness for a soft, wet biological appearance.
   ══════════════════════════════════════════════════════════════════ */
function OrganicSphere({
  position,
  radius,
  color,
  emissiveIntensity = 0.04,
  opacity = 1,
  transparent = false,
}: {
  position: [number, number, number] | THREE.Vector3;
  radius: number;
  color: string;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
}) {
  const pos = position instanceof THREE.Vector3
    ? position.toArray() as [number, number, number]
    : position;

  return (
    <mesh position={pos}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.4}
        metalness={0.08}
        clearcoat={0.2}
        clearcoatRoughness={0.35}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent={transparent}
        opacity={opacity}
        depthWrite={!transparent}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Antigen — globular cluster (NAVY)
   A central large sphere + ~22 surface bumps on a Fibonacci
   distribution, wrapped in a translucent outer shell.
   ══════════════════════════════════════════════════════════════════ */
function Antigen({ center }: { center: [number, number, number] }) {
  const centerVec = useMemo(() => new THREE.Vector3(...center), [center]);

  /* Surface bumps — Fibonacci distribution */
  const surfaceNodes = useMemo(
    () => fibonacciSphere(22, 0.7, centerVec),
    [centerVec]
  );

  return (
    <group>
      {/* Core sphere */}
      <OrganicSphere
        position={center}
        radius={0.55}
        color={NAVY}
        emissiveIntensity={0.03}
      />

      {/* Surface bumps with slight colour variation */}
      {surfaceNodes.map((pos, i) => {
        const r = 0.08 + (i % 5) * 0.01; // radius 0.08-0.12
        // Subtle colour variation — darken or lighten slightly
        const shade = i % 3 === 0 ? "#1952A0" : i % 3 === 1 ? "#2264B2" : NAVY;
        return (
          <OrganicSphere
            key={`ag-${i}`}
            position={pos}
            radius={r}
            color={shade}
            emissiveIntensity={0.025}
          />
        );
      })}

      {/* Translucent outer shell — molecular surface feel */}
      <OrganicSphere
        position={center}
        radius={0.85}
        color={NAVY}
        emissiveIntensity={0.01}
        opacity={0.08}
        transparent
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Antibody — Y-shaped structure (GOLD)
   Stem tube going up, splitting at a hinge node into two arms
   angled outward ~35°. Each arm tip has a cluster of small binding
   spheres. Built with CatmullRomCurve3 + TubeGeometry for smooth
   organic tubes.
   ══════════════════════════════════════════════════════════════════ */
function Antibody({
  origin,
  breathOffset,
}: {
  origin: [number, number, number];
  breathOffset: number;
}) {
  const ox = origin[0];
  const oy = origin[1];
  const oz = origin[2];

  /* Hinge point — where the stem splits into two arms */
  const hinge: [number, number, number] = [ox, oy + 0.95, oz];

  /* Arm angle: ~35 degrees outward from vertical */
  const armAngleRad = (35 * Math.PI) / 180;
  const armLength = 0.85;
  const dx = Math.sin(armAngleRad) * armLength;
  const dy = Math.cos(armAngleRad) * armLength;

  /* Left arm tip (reaches toward the antigen — slightly right/up) */
  const leftTip: [number, number, number] = [
    hinge[0] - dx + breathOffset * 0.3,
    hinge[1] + dy + breathOffset * 0.15,
    hinge[2],
  ];

  /* Right arm tip */
  const rightTip: [number, number, number] = [
    hinge[0] + dx + breathOffset * 0.3,
    hinge[1] + dy + breathOffset * 0.15,
    hinge[2],
  ];

  /* Stem curve: bottom → hinge */
  const stemCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(ox, oy - 0.7, oz),
        new THREE.Vector3(ox - 0.02, oy - 0.2, oz),
        new THREE.Vector3(ox, oy + 0.3, oz),
        new THREE.Vector3(...hinge),
      ],
      false,
      "catmullrom",
      0.5
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ox, oy, oz]);

  /* Left arm curve: hinge → left tip */
  const leftArmCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(...hinge),
        new THREE.Vector3(
          hinge[0] - dx * 0.45,
          hinge[1] + dy * 0.45,
          hinge[2]
        ),
        new THREE.Vector3(...leftTip),
      ],
      false,
      "catmullrom",
      0.5
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathOffset]);

  /* Right arm curve: hinge → right tip */
  const rightArmCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(...hinge),
        new THREE.Vector3(
          hinge[0] + dx * 0.45,
          hinge[1] + dy * 0.45,
          hinge[2]
        ),
        new THREE.Vector3(...rightTip),
      ],
      false,
      "catmullrom",
      0.5
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathOffset]);

  /* Pre-build tube geometries */
  const stemGeo = useMemo(
    () => new THREE.TubeGeometry(stemCurve, 64, 0.06, 16, false),
    [stemCurve]
  );
  const leftArmGeo = useMemo(
    () => new THREE.TubeGeometry(leftArmCurve, 48, 0.06, 16, false),
    [leftArmCurve]
  );
  const rightArmGeo = useMemo(
    () => new THREE.TubeGeometry(rightArmCurve, 48, 0.06, 16, false),
    [rightArmCurve]
  );

  /* Binding-tip sphere offsets (small cluster at each arm end) */
  const tipCluster = (
    tip: [number, number, number],
    keyPrefix: string
  ) => {
    const offsets: [number, number, number][] = [
      [0, 0, 0],
      [0.07, 0.05, 0.03],
      [-0.05, 0.06, -0.04],
      [0.02, -0.04, 0.06],
    ];
    return offsets.map((off, i) => (
      <OrganicSphere
        key={`${keyPrefix}-${i}`}
        position={[tip[0] + off[0], tip[1] + off[1], tip[2] + off[2]]}
        radius={0.08}
        color={GOLD}
        emissiveIntensity={0.06}
      />
    ));
  };

  /* Shared tube material props */
  const tubeMaterial = (
    <meshPhysicalMaterial
      color={GOLD}
      roughness={0.38}
      metalness={0.1}
      clearcoat={0.2}
      clearcoatRoughness={0.3}
      emissive={GOLD}
      emissiveIntensity={0.04}
    />
  );

  return (
    <group>
      {/* Stem tube */}
      <mesh geometry={stemGeo}>{tubeMaterial}</mesh>

      {/* Left arm tube */}
      <mesh geometry={leftArmGeo}>{tubeMaterial}</mesh>

      {/* Right arm tube */}
      <mesh geometry={rightArmGeo}>{tubeMaterial}</mesh>

      {/* Hinge node — sphere at the Y-split */}
      <OrganicSphere
        position={hinge}
        radius={0.12}
        color={GOLD}
        emissiveIntensity={0.05}
      />

      {/* Stem bottom cap sphere */}
      <OrganicSphere
        position={[ox, oy - 0.7, oz]}
        radius={0.09}
        color={GOLD}
        emissiveIntensity={0.04}
      />

      {/* Binding-tip clusters */}
      {tipCluster(leftTip, "ltip")}
      {tipCluster(rightTip, "rtip")}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AntibodyAntigenInner — the main scene group.
   Combines antibody + antigen in a docking pose with continuous
   rotation, mouse parallax tilt, and a subtle breathing animation
   that oscillates the antibody position via refs for 60 fps updates.
   ══════════════════════════════════════════════════════════════════ */
function AntibodyAntigenInner({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const breathRef = useRef(0);
  const breathValRef = useRef(0);

  useFrame((_state, delta) => {
    if (!group.current) return;

    /* Continuous slow rotation of the whole complex */
    group.current.rotation.y += delta * 0.12;

    /* Mouse parallax — model tilts gently toward cursor */
    const targetRotX = -pointer.current.y * 0.22;
    const targetRotZ = pointer.current.x * 0.1;

    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetRotX,
      3.2,
      delta
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      targetRotZ,
      3.2,
      delta
    );

    /* Breathing oscillation — subtle pulsing of the gap */
    breathRef.current += delta * 1.4;
    breathValRef.current = Math.sin(breathRef.current) * 0.035;
  });

  return (
    <group ref={group}>
      {/* Antigen — globular cluster, positioned right and up */}
      <Antigen center={[0.65, 0.55, 0]} />

      {/* Antibody — Y-shape, positioned left and down, tips reaching up-right */}
      <BreathingAntibody breathRef={breathValRef} />
    </group>
  );
}

/* Antibody wrapper that reads from a ref each frame for smooth breathing */
function BreathingAntibody({
  breathRef,
}: {
  breathRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  /* We need to drive the antibody position each frame based on breathRef */
  useFrame(() => {
    if (!groupRef.current) return;
    // The breathing effect is encoded in the antibody's x position offset
    groupRef.current.position.x = breathRef.current * 0.3;
    groupRef.current.position.y = breathRef.current * 0.15;
  });

  return (
    <group ref={groupRef}>
      <Antibody origin={[-0.45, -0.65, 0]} breathOffset={0} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Canvas wrapper — public API matches original DnaHelix component.
   Exported as default for backward compatibility with Hero.tsx.
   ══════════════════════════════════════════════════════════════════ */
export default function DnaHelix() {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.8], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* ── Lighting rig ─────────────────────────────────────── */}
        {/* Ambient fill */}
        <ambientLight intensity={0.5} />
        {/* Key light — main illumination from upper-right */}
        <directionalLight position={[5, 6, 5]} intensity={1.2} color="#ffffff" />
        {/* Fill light — warm gold tint from the left */}
        <directionalLight position={[-3, 0, 3]} intensity={0.3} color={GOLD} />
        {/* Rim / back light — cool blue accent from behind */}
        <directionalLight position={[0, -2, -4]} intensity={0.2} color="#8ab4f8" />

        {/* Gentle floating via drei Float */}
        <Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.45}>
          <AntibodyAntigenInner pointer={pointer} />
        </Float>

        {/* Soft city environment for subtle reflections */}
        <Environment preset="city" environmentIntensity={0.25} />
      </Canvas>
    </div>
  );
}
