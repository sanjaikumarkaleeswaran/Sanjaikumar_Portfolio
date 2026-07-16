import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom GLSL Shader for the flowing Cosmic Nebula background
class CosmicNebulaMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        // Fractional Brownian Motion (fbm) noise algorithms
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          
          // Shifting coordinate spaces
          vec2 p1 = uv * 1.5;
          p1.x += uTime * 0.025;
          p1.y += sin(uTime * 0.015) * 0.3;
          
          vec2 p2 = uv * 0.8;
          p2.x -= uTime * 0.015;
          p2.y += cos(uTime * 0.02) * 0.2;

          // Compute FBM values for flowing gas colors
          float n1 = fbm(p1 + fbm(p2));
          float n2 = fbm(p2 + n1);
          
          // Dark space theme base
          vec3 baseColor = vec3(0.012, 0.0, 0.078); // #030014
          
          // Glowing Neon accents
          vec3 cyanGlow = vec3(0.0, 0.941, 1.0);     // #00f0ff
          vec3 magentaGlow = vec3(1.0, 0.0, 0.498);  // #ff007f
          vec3 purpleGlow = vec3(0.615, 0.309, 0.866); // #9d4edd

          // Mix colors based on shifting noise fields
          vec3 finalColor = baseColor;
          finalColor = mix(finalColor, cyanGlow, n1 * 0.22);
          finalColor = mix(finalColor, magentaGlow, n2 * 0.18);
          finalColor = mix(finalColor, purpleGlow, (n1 + n2) * 0.12);

          // Add a soft circular vignette shadow
          float vignette = 1.0 - dot(uv, uv) * 0.25;
          vignette = clamp(vignette, 0.0, 1.0);
          finalColor *= vignette;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
  }
}

extend({ CosmicNebulaMaterial });

function NebulaQuad() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore */}
      <cosmicNebulaMaterial ref={materialRef} />
    </mesh>
  );
}

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random cosmic points
  const count = 600;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 35;     // X
      arr[i * 3 + 1] = (Math.random() - 0.5) * 35; // Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20; // Z
    }
    return arr;
  }, []);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current) return;
    timeRef.current += delta;
    ref.current.rotation.y = timeRef.current * 0.008;
    ref.current.rotation.x = timeRef.current * 0.003;
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function LivingSpaceGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!gridRef.current) return;
    timeRef.current += delta;
    const time = timeRef.current;
    gridRef.current.rotation.x = Math.sin(time * 0.15) * 0.06 + 1.35;
    gridRef.current.rotation.y = Math.cos(time * 0.08) * 0.04;
    const material = gridRef.current.material as THREE.LineBasicMaterial;
    if (material) {
      material.opacity = 0.05 + (Math.sin(time * 0.8) * 0.03);
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[45, 45, '#ff007f', '#00f0ff']}
      position={[0, -2.5, 0]}
      rotation={[1.35, 0, 0]}
    >
      <lineBasicMaterial attach="material" opacity={0.06} transparent />
    </gridHelper>
  );
}

// Cinematic Camera Controller component reacting to scroll + mouse movement
function CinematicCameraController() {
  const timeRef = useRef(0);
  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const targetX = state.pointer.x * 1.5;
    const targetY = state.pointer.y * 1.2;
    const driftY = Math.sin(t * 0.35) * 0.3;
    const driftX = Math.cos(t * 0.25) * 0.3;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX + driftX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY + driftY, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#030014]">
      {/* 3D Canvas Background */}
      <div className="w-full h-full absolute">
        <Canvas
          camera={{ position: [0, 0, 9], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: 'black' }}
        >
          <ambientLight intensity={0.4} />
          
          <CinematicCameraController />
          <NebulaQuad />
          <StarField />
          <LivingSpaceGrid />
        </Canvas>
      </div>
      
      {/* Fallback ambient gradients blending */}
      <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#030014]/50 to-[#030014] mix-blend-multiply pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-cyber-purple/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] bg-cyber-cyan/10 blur-[130px] rounded-full pointer-events-none" />
    </div>
  );
};
