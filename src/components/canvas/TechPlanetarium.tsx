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
  isFocused: boolean;
  onFocus: () => void;
}

function Planet({ name, color, size, orbitRadius, orbitSpeed, yOffset = 0, moons, onSelect, isFocused, onFocus }: SkillPlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { playAudioCue } = useOS();

  // Keep track of moon positions to draw connecting lines
  const moonPositions = useRef<THREE.Vector3[]>(moons.map(() => new THREE.Vector3()));

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!planetRef.current) return;
    timeRef.current += delta;
    const time = timeRef.current;
    const speedMultiplier = (hovered || isFocused) ? 0.08 : 1.0;
    const angle = time * orbitSpeed * speedMultiplier;
    const x = Math.sin(angle) * orbitRadius;
    const z = Math.cos(angle) * orbitRadius;
    const y = Math.sin(time * 0.8 + orbitRadius) * 0.4 + yOffset;
    planetRef.current.position.set(x, y, z);
    moons.forEach((_, idx) => {
      const moonRadius = size * 1.8 + idx * 0.18;
      const moonSpeed = 1.8 + idx * 0.7;
      const moonAngle = time * moonSpeed * speedMultiplier;
      const mx = Math.sin(moonAngle) * moonRadius;
      const mz = Math.cos(moonAngle) * moonRadius;
      if (moonPositions.current[idx]) {
        moonPositions.current[idx].set(mx, 0, mz);
      }
    });
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
        onFocus();
        onSelect(name, moons);
      }}
    >
      {/* Glow mesh ring around planet */}
      {(hovered || isFocused) && (
        <mesh>
          <torusGeometry args={[size * 1.4, 0.015, 8, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {/* Main Planet Sphere */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={hovered || isFocused ? 0.75 : 0.2}
        />
      </mesh>

      {/* Orbiting Satellites / Moons */}
      {moons.map((moonName, index) => {
        const moonRadius = size * 1.8 + index * 0.18;
        const moonSpeed = 1.8 + index * 0.7;
        return (
          <group key={index}>
            <Moon 
              radius={moonRadius}
              speed={moonSpeed}
              color={color}
              parentHovered={hovered || isFocused}
              name={moonName}
            />
            {/* Connecting line to moon */}
            {(hovered || isFocused) && (
              <LineToCenter color={color} index={index} positionsRef={moonPositions} />
            )}
          </group>
        );
      })}

      {/* Planet Label HTML Overlay */}
      <Html distanceFactor={10} position={[0, size + 0.35, 0]} center>
        <div className={`px-2 py-0.5 rounded border text-[9px] font-mono whitespace-nowrap backdrop-blur-md transition-all select-none ${
          hovered || isFocused 
            ? 'bg-black border-cyber-cyan text-cyber-cyan scale-110 shadow-[0_0_10px_rgba(0,240,255,0.4)] z-50' 
            : 'bg-black/60 border-white/10 text-slate-400'
        }`}>
          {name}
        </div>
      </Html>
    </group>
  );
}

// Subcomponent to draw dynamic connecting lines
const LineToCenter: React.FC<{ color: string; index: number; positionsRef: React.RefObject<THREE.Vector3[]> }> = ({ color, index, positionsRef }) => {
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (!lineRef.current || !positionsRef.current || !positionsRef.current[index]) return;
    const target = positionsRef.current[index];
    const geometry = lineRef.current.geometry;
    
    // Draw line from [0,0,0] to moon [x,y,z]
    const points = [new THREE.Vector3(0, 0, 0), target];
    geometry.setFromPoints(points);
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </line>
  );
};

function Moon({ radius, speed, color, parentHovered, name }: { radius: number; speed: number; color: string; parentHovered: boolean; name: string }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!moonRef.current) return;
    timeRef.current += delta;
    const speedMult = parentHovered ? 0.08 : 1.0;
    const angle = timeRef.current * speed * speedMult;
    moonRef.current.position.x = Math.sin(angle) * radius;
    moonRef.current.position.z = Math.cos(angle) * radius;
  });

  return (
    <mesh 
      ref={moonRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={parentHovered ? 0.8 : 0.3} />
      
      {/* Show technology label on moon hover */}
      {(hovered || (parentHovered && name.length < 9)) && (
        <Html distanceFactor={8} position={[0, 0.18, 0]} center>
          <div className="px-1.5 py-0.5 rounded border border-cyber-cyan/35 bg-slate-950/90 text-white font-mono text-[7.5px] whitespace-nowrap shadow-md pointer-events-none select-none z-50">
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Cinematic orbital camera controller component that targets selected planets
interface TechCameraCtrlProps {
  focusedPlanet: string | null;
  planetsData: Array<{ name: string; orbitRadius: number; yOffset: number; orbitSpeed: number }>;
}

function TechCameraController({ focusedPlanet, planetsData }: TechCameraCtrlProps) {
  const timeRef = useRef(0);
  useFrame((state, delta) => {
    timeRef.current += delta;
    let targetPos = new THREE.Vector3(0, 5, 8);
    let targetLook = new THREE.Vector3(0, 0, 0);
    if (focusedPlanet) {
      const data = planetsData.find((p) => p.name === focusedPlanet);
      if (data) {
        const time = timeRef.current;
        const speedMultiplier = 0.08;
        const angle = time * data.orbitSpeed * speedMultiplier;
        const px = Math.sin(angle) * data.orbitRadius;
        const pz = Math.cos(angle) * data.orbitRadius;
        const py = Math.sin(time * 0.8 + data.orbitRadius) * 0.4 + data.yOffset;

        // Position camera to focus close up on the planet and its moons
        targetPos.set(px * 1.1, py + 1.6, pz * 1.1 + 2.0);
        targetLook.set(px, py, pz);
      }
    }

    // Smoothly LERP camera position and rotation
    state.camera.position.lerp(targetPos, 0.05);
    
    // Smoothly orient camera lookAt
    const currentLook = new THREE.Vector3(0, 0, 0);
    state.camera.getWorldDirection(currentLook);
    // Add current camera position to direction to find where camera is currently pointing
    currentLook.add(state.camera.position);
    
    const intermediateLook = new THREE.Vector3().lerpVectors(currentLook, targetLook, 0.05);
    state.camera.lookAt(intermediateLook);
  });

  return null;
}

interface TechPlanetariumProps {
  onSelectTech: (category: string, list: string[]) => void;
}

export const TechPlanetarium: React.FC<TechPlanetariumProps> = ({ onSelectTech }) => {
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);

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
        🪐 Tech Stack Planetarium // Click planet to lock zoom
      </div>

      {focusedPlanet && (
        <button
          onClick={() => setFocusedPlanet(null)}
          className="absolute bottom-4 right-4 z-20 px-2.5 py-1.5 border border-cyber-cyan/30 rounded bg-black/80 hover:bg-cyber-cyan/10 text-cyber-cyan font-mono text-[9px] cursor-pointer transition-all"
        >
          Reset Orbit View
        </button>
      )}

      <Canvas camera={{ position: [0, 5, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={4.5} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff007f" />

        {/* Central Core Sun (Software Systems Core) */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh onClick={() => setFocusedPlanet(null)}>
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#00f0ff"
              emissiveIntensity={1.3}
              roughness={0.1}
            />
          </mesh>
          <Html distanceFactor={8} position={[0, 0, 0]} center>
            <div className="px-2 py-0.5 rounded bg-black/90 border border-cyber-green/50 text-cyber-green text-[9px] font-mono font-bold tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.3)] select-none">
              SANJAI_OS
            </div>
          </Html>
        </Float>

        {/* Planet orbits visual rings */}
        {planetsData.map((p, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[p.orbitRadius - 0.015, p.orbitRadius + 0.015, 64]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.06} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Cinematic Camera Control */}
        {/* @ts-ignore */}
        <TechCameraController focusedPlanet={focusedPlanet} planetsData={planetsData} />

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
            isFocused={focusedPlanet === planet.name}
            onFocus={() => setFocusedPlanet(planet.name)}
          />
        ))}
      </Canvas>
    </div>
  );
};
