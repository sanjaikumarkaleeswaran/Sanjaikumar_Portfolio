import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CoreMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.4;
      meshRef.current.rotation.x = elapsed * 0.2;
      // Pulse animation
      const scale = 1 + Math.sin(elapsed * 2.5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -elapsed * 0.2;
      outerRef.current.rotation.z = elapsed * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * 0.6;
      ringRef.current.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Central Hologram Core (Sphere) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer abstract cage */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[2.0, 1]} />
        <meshBasicMaterial
          color="#ff007f"
          wireframe
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glowing Energy Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.5, 0.03, 8, 64]} />
        <meshBasicMaterial
          color="#9d4edd"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function FloatingLogoNodes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  // Position of orbiting tech satellites
  const nodes = [
    { pos: [3.2, 0, 0] as const, color: '#39ff14', name: 'React' },
    { pos: [-2.2, 2, -2] as const, color: '#00f0ff', name: 'TS' },
    { pos: [0, -2.5, 2.2] as const, color: '#ff007f', name: 'Python' },
    { pos: [-1.5, -2, -2.5] as const, color: '#9d4edd', name: 'Docker' }
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight distance={3} intensity={2} color={node.color} />
        </group>
      ))}
    </group>
  );
}

export const HologramCore: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[450px] relative flex items-center justify-center">
      {/* 3D R3F Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
          
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <CoreMesh />
            <FloatingLogoNodes />
          </Float>
        </Canvas>
      </div>

      {/* Decorative scanline overlay ring */}
      <div className="absolute w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full border border-cyber-cyan/10 animate-pulse pointer-events-none z-0 shadow-[0_0_50px_rgba(0,240,255,0.05)] flex items-center justify-center">
        <div className="w-[85%] h-[85%] rounded-full border border-cyber-purple/5 border-dashed animate-spin duration-30000" />
      </div>
    </div>
  );
};
