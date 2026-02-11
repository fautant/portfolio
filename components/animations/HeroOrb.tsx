"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function GradientSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#FF5C93"
          emissive="#FF9357"
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
          distort={0.35}
          speed={2}
          envMapIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({
  radius,
  color,
  speed,
  opacity,
}: {
  radius: number;
  color: string;
  speed: number;
  opacity: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(radius, 0.008, 16, 100);
  }, [radius]);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x =
        Math.PI / 3 + Math.sin(clock.getElapsedTime() * speed * 0.5) * 0.15;
      ringRef.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });

  return (
    <mesh ref={ringRef} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#FF5C93"),
      new THREE.Color("#FF9357"),
      new THREE.Color("#E8B844"),
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)]!;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.03) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#FFF5F0" />
      <pointLight position={[-3, -3, 2]} intensity={0.6} color="#FF5C93" />
      <pointLight position={[3, 2, -2]} intensity={0.4} color="#E8B844" />

      <GradientSphere />

      <OrbitRing radius={3} color="#FF5C93" speed={0.3} opacity={0.2} />
      <OrbitRing radius={3.4} color="#FF9357" speed={-0.2} opacity={0.15} />
      <OrbitRing radius={3.8} color="#E8B844" speed={0.15} opacity={0.1} />

      <FloatingParticles count={60} />
    </>
  );
}

export function HeroOrb() {
  return (
    <div className="w-full h-full min-h-[350px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
