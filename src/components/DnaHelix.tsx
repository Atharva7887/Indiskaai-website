"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NAVY = "#1E5BA8";
const GOLD = "#F4C430";

type Atom = {
  position: [number, number, number];
  color: string;
  scale: number;
};

type Bond = {
  start: [number, number, number];
  end: [number, number, number];
};

function buildHelix(turns = 4, perTurn = 18, radius = 1.05, height = 6) {
  const atomsA: Atom[] = [];
  const atomsB: Atom[] = [];
  const bonds: Bond[] = [];

  const total = turns * perTurn;
  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const angle = t * turns * Math.PI * 2;
    const y = (t - 0.5) * height;

    const a: [number, number, number] = [
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius,
    ];
    const b: [number, number, number] = [
      Math.cos(angle + Math.PI) * radius,
      y,
      Math.sin(angle + Math.PI) * radius,
    ];

    atomsA.push({ position: a, color: NAVY, scale: 0.085 });
    atomsB.push({ position: b, color: GOLD, scale: 0.085 });

    // Cross bonds (rungs of the ladder) — only every few atoms so it doesn't get noisy.
    if (i % 2 === 0) {
      bonds.push({ start: a, end: b });
    }
  }

  return { atomsA, atomsB, bonds };
}

function Bond({ start, end }: Bond) {
  const ref = useRef<THREE.Mesh>(null);

  const { position, quaternion, length } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(e, s);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    return { position: mid, quaternion: q, length: len };
  }, [start, end]);

  return (
    <mesh ref={ref} position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.012, 0.012, length, 8]} />
      <meshStandardMaterial
        color="#1A1A1A"
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function BackboneTube({
  atoms,
  color,
}: {
  atoms: Atom[];
  color: string;
}) {
  const curve = useMemo(() => {
    const points = atoms.map((a) => new THREE.Vector3(...a.position));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, [atoms]);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 240, 0.025, 12, false),
    [curve]
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.4}
        emissive={color}
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}

function Helix({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  const { atomsA, atomsB, bonds } = useMemo(
    () => buildHelix(4, 22, 1.05, 6.2),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    // Continuous slow rotation
    group.current.rotation.y += delta * 0.18;

    // Pointer parallax — invert Y so the model leans toward the cursor.
    // pointer.y is -1 at top of canvas, +1 at bottom; negating it makes the
    // top of the helix tilt toward the cursor when the cursor is high.
    const targetRotX = -pointer.current.y * 0.22;
    const targetRotZ = pointer.current.x * 0.1;

    // Frame-rate-independent damping for a "weighted" feel.
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
  });

  return (
    <group ref={group}>
      <BackboneTube atoms={atomsA} color={NAVY} />
      <BackboneTube atoms={atomsB} color={GOLD} />

      {atomsA.map((a, i) => (
        <mesh key={`a-${i}`} position={a.position}>
          <icosahedronGeometry args={[a.scale, 1]} />
          <meshStandardMaterial
            color={NAVY}
            roughness={0.25}
            metalness={0.55}
            emissive={NAVY}
            emissiveIntensity={0.18}
            flatShading
          />
        </mesh>
      ))}
      {atomsB.map((a, i) => (
        <mesh key={`b-${i}`} position={a.position}>
          <icosahedronGeometry args={[a.scale, 1]} />
          <meshStandardMaterial
            color={GOLD}
            roughness={0.2}
            metalness={0.65}
            emissive={GOLD}
            emissiveIntensity={0.22}
            flatShading
          />
        </mesh>
      ))}

      {bonds.map((b, i) => (
        <Bond key={`bond-${i}`} start={b.start} end={b.end} />
      ))}
    </group>
  );
}

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
        camera={{ position: [0, 0, 5.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-3, -2, 2]} intensity={0.35} color={GOLD} />
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.55}>
          <Helix pointer={pointer} />
        </Float>
        <Environment preset="studio" environmentIntensity={0.35} />
      </Canvas>
    </div>
  );
}
