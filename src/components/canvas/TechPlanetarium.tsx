import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useOS } from '../../context/OSContext';

interface SkillPlanetProps {
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  yOffset?: number;
  moons: string[];
  onSelect: (name: string, details: string[]) => void;
}

function Planet({ name, color, size, orbitRadius, orbitSpeed, yOffset = 0, moons, onSelect }: SkillPlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { playAudioCue } = useOS();

  useFrame((state) => {
    if (!planetRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow down rotation/orbit speed when hovered
    const speedMultiplier = hovered ? 0.15 : 1.0;
    const angle = time * orbitSpeed * speedMultiplier;
    
    planetRef.current.position.x = Math.sin(angle) * orbitRadius;
    planetRef.current.position.z = Math.cos(angle) * orbitRadius;
    planetRef.current.position.y = Math.sin(time * 0.8 + orbitRadius) * 0.4 + yOffset;
  });

  return (
    <group 
      ref={planetRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        playAudioCue('hover');
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        playAudioCue('click');
        onSelect(name, moons);
      }}
    >
      {/* Glow mesh ring around planet */}
      {hovered && (
        <mesh>
          <torusGeometry args={[size * 1.5, 0.02, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Main Planet Sphere */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
      </mesh>

      {/* Orbiting Satellites / Moons */}
      {moons.map((_, index) => {
        const moonRadius = size * 1.8 + index * 0.15;
        const moonSpeed = 2 + index * 0.8;
        return (
          <Moon 
            key={index}
            radius={moonRadius}
            speed={moonSpeed}
            color={color}
            parentHovered={hovered}
          />
        );
      })}

      {/* Planet Label HTML Overlay */}
      <Html distanceFactor={10} position={[0, size + 0.4, 0]} center>
        <div className={`px-2 py-0.5 rounded border text-[9px] font-mono whitespace-nowrap backdrop-blur-md transition-all ${
          hovered 
            ? 'bg-black border-cyber-cyan text-cyber-cyan scale-110 shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
            : 'bg-black/60 border-white/10 text-slate-400'
        }`}>
          {name}
        </div>
      </Html>
    </group>
  );
}

function Moon({ radius, speed, color, parentHovered }: { radius: number; speed: number; color: string; parentHovered: boolean }) {
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!moonRef.current) return;
    const time = state.clock.getElapsedTime();
    const speedMult = parentHovered ? 0.2 : 1.0;
    const angle = time * speed * speedMult;
    
    moonRef.current.position.x = Math.sin(angle) * radius;
    moonRef.current.position.z = Math.cos(angle) * radius;
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={parentHovered ? 0.8 : 0.4} />
    </mesh>
  );
}

interface TechPlanetariumProps {
  onSelectTech: (category: string, list: string[]) => void;
}

export const TechPlanetarium: React.FC<TechPlanetariumProps> = ({ onSelectTech }) => {
  const planetsData = [
    {
      name: 'FRONTEND',
      color: '#00f0ff', // Cyan
      size: 0.6,
      orbitRadius: 2.8,
      orbitSpeed: 0.25,
      yOffset: 0.2,
      moons: ['React.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Framer Motion']
    },
    {
      name: 'BACKEND',
      color: '#9d4edd', // Purple
      size: 0.55,
      orbitRadius: 4.4,
      orbitSpeed: 0.16,
      yOffset: -0.2,
      moons: ['Python', 'FastAPI', 'Django', 'SQL (MySQL/PG)', 'MongoDB']
    },
    {
      name: 'DEVOPS & CLOUD',
      color: '#39ff14', // Green
      size: 0.45,
      orbitRadius: 6.0,
      orbitSpeed: 0.11,
      yOffset: 0.3,
      moons: ['Docker', 'AWS Infrastructure', 'Linux Admin', 'Git Pipelines']
    },
    {
      name: 'UI/UX & COLLAB',
      color: '#ff007f', // Pink/Magenta
      size: 0.5,
      orbitRadius: 7.4,
      orbitSpeed: 0.08,
      yOffset: -0.4,
      moons: ['Wireframing', 'User Flows', 'Usability Testing', 'Agile / Jira']
    }
  ];

  return (
    <div className="w-full h-[400px] md:h-[480px] relative border border-white/10 rounded-2xl bg-black/50 backdrop-blur-md overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
      {/* Instruction text overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-slate-500 uppercase tracking-widest pointer-events-none">
        🪐 Tech Stack Planetarium // Hover to inspect // Click to lock data
      </div>

      <Canvas camera={{ position: [0, 5, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={4} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff007f" />

        {/* Central Core Sun (Software Systems Core) */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#00f0ff"
              emissiveIntensity={1.2}
              roughness={0.1}
            />
          </mesh>
          <Html distanceFactor={8} position={[0, 0, 0]} center>
            <div className="px-2 py-0.5 rounded bg-black/90 border border-cyber-green/50 text-cyber-green text-[9px] font-mono font-bold tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.3)]">
              SANJAI_OS
            </div>
          </Html>
        </Float>

        {/* Planet orbits visual rings */}
        {planetsData.map((p, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[p.orbitRadius - 0.01, p.orbitRadius + 0.01, 64]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.06} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Planets */}
        {planetsData.map((planet, index) => (
          <Planet
            key={index}
            name={planet.name}
            color={planet.color}
            size={planet.size}
            orbitRadius={planet.orbitRadius}
            orbitSpeed={planet.orbitSpeed}
            yOffset={planet.yOffset}
            moons={planet.moons}
            onSelect={onSelectTech}
          />
        ))}
      </Canvas>
    </div>
  );
};
