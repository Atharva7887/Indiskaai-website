"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { type MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NAVY = "#1E5BA8";
const GOLD = "#F4C430";

/* ─── Organic material presets (low metalness, moderate roughness) ─── */
const ORGANIC_NAVY = {
  color: NAVY,
  roughness: 0.4,
  metalness: 0.08,
  clearcoat: 0.2,
  clearcoatRoughness: 0.4,
  emissive: NAVY,
  emissiveIntensity: 0.03,
};

const ORGANIC_GOLD = {
  color: GOLD,
  roughness: 0.35,
  metalness: 0.1,
  clearcoat: 0.25,
  clearcoatRoughness: 0.35,
  emissive: GOLD,
  emissiveIntensity: 0.04,
};

/* ─────────────────────────── ANTIGEN ─────────────────────────── */
/* Globular cluster — central sphere + Fibonacci-distributed surface atoms */
function Antigen({
  positionRef,
  glowRef,
}: {
  positionRef: React.MutableRefObject<number>;
  glowRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const matCore = useRef<THREE.MeshPhysicalMaterial>(null);

  const spikes = useMemo(() => {
    const out: { p: [number, number, number]; s: number }[] = [];
    const N = 26;
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.78;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      out.push({ p: [x, y, z], s: 0.075 + Math.random() * 0.04 });
    }
    return out;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetY = 3.5 - 3.3 * positionRef.current;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      4.5,
      delta
    );
    group.current.rotation.y += delta * 0.15;
    group.current.rotation.x += delta * 0.04;

    if (matCore.current) {
      matCore.current.emissiveIntensity = THREE.MathUtils.damp(
        matCore.current.emissiveIntensity,
        0.03 + glowRef.current * 0.2,
        3.5,
        delta
      );
    }
  });

  return (
    <group ref={group} position={[0, 3.5, 0]}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial ref={matCore} {...ORGANIC_NAVY} />
      </mesh>

      {/* Surface atoms */}
      {spikes.map((sp, i) => (
        <mesh key={i} position={sp.p}>
          <sphereGeometry args={[sp.s, 20, 20]} />
          <meshPhysicalMaterial {...ORGANIC_NAVY} />
        </mesh>
      ))}

      {/* Translucent molecular surface */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial
          color={NAVY}
          roughness={0.5}
          metalness={0.0}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────── ANTIBODY ─────────────────────────── */
/* Y-shaped: smooth tube stem + two angled arms with binding-tip clusters */
function Antibody({
  positionRef,
  glowRef,
}: {
  positionRef: React.MutableRefObject<number>;
  glowRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const tipMatL = useRef<THREE.MeshPhysicalMaterial>(null);
  const tipMatR = useRef<THREE.MeshPhysicalMaterial>(null);

  /* Build tube geometries for the Y-shape */
  const { stemGeo, leftArmGeo, rightArmGeo } = useMemo(() => {
    const stemPts = [
      new THREE.Vector3(0, -1.1, 0),
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(0, -0.1, 0),
      new THREE.Vector3(0, 0.0, 0),
    ];
    const stemCurve = new THREE.CatmullRomCurve3(stemPts, false, "catmullrom", 0.5);
    const stem = new THREE.TubeGeometry(stemCurve, 40, 0.075, 12, false);

    const leftPts = [
      new THREE.Vector3(0, 0.0, 0),
      new THREE.Vector3(-0.15, 0.3, 0),
      new THREE.Vector3(-0.45, 0.7, 0),
      new THREE.Vector3(-0.65, 1.05, 0),
    ];
    const leftCurve = new THREE.CatmullRomCurve3(leftPts, false, "catmullrom", 0.5);
    const left = new THREE.TubeGeometry(leftCurve, 40, 0.06, 12, false);

    const rightPts = [
      new THREE.Vector3(0, 0.0, 0),
      new THREE.Vector3(0.15, 0.3, 0),
      new THREE.Vector3(0.45, 0.7, 0),
      new THREE.Vector3(0.65, 1.05, 0),
    ];
    const rightCurve = new THREE.CatmullRomCurve3(rightPts, false, "catmullrom", 0.5);
    const right = new THREE.TubeGeometry(rightCurve, 40, 0.06, 12, false);

    return { stemGeo: stem, leftArmGeo: left, rightArmGeo: right };
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetY = -3.5 + 3.3 * positionRef.current;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      4.5,
      delta
    );
    const targetRotZ = (1 - positionRef.current) * -0.2;
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      targetRotZ,
      3.0,
      delta
    );
    group.current.rotation.y += delta * 0.1;

    const glow = 0.04 + glowRef.current * 0.25;
    if (tipMatL.current)
      tipMatL.current.emissiveIntensity = THREE.MathUtils.damp(
        tipMatL.current.emissiveIntensity,
        glow,
        3.5,
        delta
      );
    if (tipMatR.current)
      tipMatR.current.emissiveIntensity = THREE.MathUtils.damp(
        tipMatR.current.emissiveIntensity,
        glow,
        3.5,
        delta
      );
  });

  return (
    <group ref={group} position={[0, -3.5, 0]} rotation={[0, 0, -0.2]}>
      {/* Stem */}
      <mesh geometry={stemGeo}>
        <meshPhysicalMaterial {...ORGANIC_GOLD} />
      </mesh>

      {/* Hinge sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshPhysicalMaterial {...ORGANIC_GOLD} />
      </mesh>

      {/* Left arm */}
      <mesh geometry={leftArmGeo}>
        <meshPhysicalMaterial {...ORGANIC_GOLD} />
      </mesh>

      {/* Left binding tip cluster */}
      {[
        [-0.65, 1.05, 0] as [number, number, number],
        [-0.72, 1.15, 0.06] as [number, number, number],
        [-0.58, 1.15, -0.06] as [number, number, number],
        [-0.65, 1.18, 0] as [number, number, number],
      ].map((pos, i) => (
        <mesh key={`tl-${i}`} position={pos}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshPhysicalMaterial ref={i === 0 ? tipMatL : undefined} {...ORGANIC_GOLD} />
        </mesh>
      ))}

      {/* Right arm */}
      <mesh geometry={rightArmGeo}>
        <meshPhysicalMaterial {...ORGANIC_GOLD} />
      </mesh>

      {/* Right binding tip cluster */}
      {[
        [0.65, 1.05, 0] as [number, number, number],
        [0.72, 1.15, 0.06] as [number, number, number],
        [0.58, 1.15, -0.06] as [number, number, number],
        [0.65, 1.18, 0] as [number, number, number],
      ].map((pos, i) => (
        <mesh key={`tr-${i}`} position={pos}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshPhysicalMaterial ref={i === 0 ? tipMatR : undefined} {...ORGANIC_GOLD} />
        </mesh>
      ))}

      {/* Stem base bulb (Fc region) */}
      <mesh position={[0, -1.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial {...ORGANIC_GOLD} />
      </mesh>
    </group>
  );
}

/* ─────────────── RESPONSIVE OFFSET ─────────────── */
function ResponsiveOffset({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const xOffset = THREE.MathUtils.clamp(viewport.aspect - 1.0, 0, 1) * 1.5;
  return <group position={[xOffset, 0, 0]}>{children}</group>;
}

/* ─────────────── BINDING GLOW AURA ─────────────── */
function BindingAura({ glowRef }: { glowRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!ref.current || !mat.current) return;
    const targetScale = 1 + glowRef.current * 1.4;
    const s = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 3.5, delta);
    ref.current.scale.set(s, s, s);
    mat.current.opacity = THREE.MathUtils.damp(
      mat.current.opacity,
      glowRef.current * 0.18,
      3.5,
      delta
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.0, 24, 24]} />
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

/* ─────────────── SCROLL DRIVER ─────────────── */
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
    approachRef.current = dockRaw * dockRaw * (3 - 2 * dockRaw);
    glowRef.current = THREE.MathUtils.clamp((v - 0.62) / 0.08, 0, 1);
  });
  return null;
}

/* ─────────────── MAIN EXPORT ─────────────── */
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

      {/* Soft, warm lighting for organic feel */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-3, 0, 3]} intensity={0.3} color={GOLD} />
      <pointLight position={[0, 0, 3]} intensity={0.8} color={GOLD} distance={8} />

      <ResponsiveOffset>
        <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.25}>
          <Antigen positionRef={approachRef} glowRef={glowRef} />
          <Antibody positionRef={approachRef} glowRef={glowRef} />
          <BindingAura glowRef={glowRef} />
        </Float>
      </ResponsiveOffset>

      <Environment preset="city" environmentIntensity={0.25} />
    </Canvas>
  );
}
