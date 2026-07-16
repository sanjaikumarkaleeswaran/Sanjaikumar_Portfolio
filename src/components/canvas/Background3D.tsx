import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random particle positions
  const count = 400;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 25;     // X
      arr[i * 3 + 1] = (Math.random() - 0.5) * 25; // Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20; // Z
    }
    return arr;
  }, []);

  // Animation frame drift
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.005;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function SpaceGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    // Slow breathing oscillation tilt
    const time = state.clock.getElapsedTime();
    gridRef.current.rotation.x = Math.sin(time * 0.2) * 0.05 + 1.4;
    gridRef.current.rotation.y = Math.cos(time * 0.1) * 0.03;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, '#ff007f', '#00f0ff']}
      position={[0, -2, 0]}
      rotation={[1.4, 0, 0]}
    >
      <lineBasicMaterial attach="material" opacity={0.07} transparent />
    </gridHelper>
  );
}

export const Background3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 15;
      const y = (clientY / window.innerHeight - 0.5) * 15;
      container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div 
        ref={containerRef} 
        className="w-[102vw] h-[102vh] -left-[1vw] -top-[1vh] absolute transition-transform duration-300 ease-out"
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ff007f" />
          
          <StarField />
          <SpaceGrid />
        </Canvas>
      </div>
      
      {/* Dynamic atmospheric ambient gradients overlay */}
      <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#030014]/60 to-[#030014] mix-blend-multiply" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyber-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyber-cyan/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};
