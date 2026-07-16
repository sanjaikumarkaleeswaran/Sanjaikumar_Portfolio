import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

// ─── AI NEURAL SPHERE SHADER ────────────────────────────────────────────────
class NeuralSphereMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime:       { value: 0 },
        uMouse:      { value: new THREE.Vector2(0, 0) },
        uPulse:      { value: 0 },
        uScroll:     { value: 0 },
        uColorA:     { value: new THREE.Color('#00f0ff') },
        uColorB:     { value: new THREE.Color('#9d4edd') },
        uColorC:     { value: new THREE.Color('#ff007f') },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2  uMouse;
        uniform float uPulse;
        uniform float uScroll;
        varying vec3  vPosition;
        varying float vNoise;
        varying float vPulse;

        // Fast 3-D noise
        vec3 hash3(vec3 p) {
          p = vec3(dot(p,vec3(127.1,311.7,74.7)),
                   dot(p,vec3(269.5,183.3,246.1)),
                   dot(p,vec3(113.5,271.9,124.6)));
          return -1.0 + 2.0*fract(sin(p)*43758.5453123);
        }
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          vec3 u = f*f*(3.0-2.0*f);
          return mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),
                             dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                         mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),
                             dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
                     mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),
                             dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                         mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),
                             dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
        }

        void main() {
          vPosition = position;

          // Animated noise-deformed sphere
          float n  = noise(position * 2.2 + vec3(uTime * 0.18));
          float n2 = noise(position * 4.5 - vec3(uTime * 0.09, 0.0, uTime * 0.12));
          float totalNoise = n * 0.12 + n2 * 0.06;
          vNoise = totalNoise;

          // Breathing scale
          float breathe = 1.0 + sin(uTime * 1.2) * 0.025;

          // Mouse-driven tilt
          float angleY = uMouse.x * 0.6;
          float angleX = -uMouse.y * 0.4;
          mat2 rotY = mat2(cos(angleY), -sin(angleY), sin(angleY), cos(angleY));
          mat2 rotX = mat2(cos(angleX), -sin(angleX), sin(angleX), cos(angleX));

          vec3 displaced = normalize(position) * (1.0 + totalNoise) * breathe;
          displaced.xz = rotY * displaced.xz;
          displaced.yz = rotX * displaced.yz;

          // Scroll-based dispersal
          float disperse = uScroll * 0.5;
          displaced += normalize(position) * disperse;

          // Outward pulse wave
          float dist   = length(position);
          float pWave  = sin(dist * 6.0 - uTime * 3.5) * 0.5 + 0.5;
          vPulse = pWave;

          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_Position     = projectionMatrix * mvPosition;
          gl_PointSize    = (6.0 / -mvPosition.z) * (1.0 + abs(totalNoise) * 1.5 + pWave * 0.4);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3  uColorA;
        uniform vec3  uColorB;
        uniform vec3  uColorC;
        varying vec3  vPosition;
        varying float vNoise;
        varying float vPulse;

        void main() {
          // Circular soft point
          vec2 uv = gl_PointCoord - 0.5;
          float d  = length(uv);
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.0, d);

          // Tri-color gradient driven by position + pulse
          float t1 = vNoise * 0.5 + 0.5;
          float t2 = vPulse;
          float lat = (vPosition.y + 1.0) * 0.5;

          vec3 col = mix(uColorA, uColorB, t1);
          col      = mix(col, uColorC, t2 * 0.4);
          col      = mix(col, uColorA, lat * 0.3);

          // Proximity highlight (brighter equator)
          float eq  = 1.0 - abs(vPosition.y);
          col += eq * 0.15;

          float alpha = soft * (0.55 + vPulse * 0.3 + abs(vNoise) * 0.4);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
  }
}
extend({ NeuralSphereMaterial });

// ─── GLASS OUTER SHELL SHADER ────────────────────────────────────────────────
class GlassShellMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime:   { value: 0 },
        uMouse:  { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2  uMouse;
        varying vec3  vNormal;
        varying vec3  vPosition;
        void main() {
          vNormal   = normalMatrix * normal;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2  uMouse;
        varying vec3  vNormal;
        varying vec3  vPosition;
        void main() {
          vec3  viewDir    = normalize(cameraPosition - vPosition);
          float fresnel    = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 3.0);
          float scanline   = sin(vPosition.y * 40.0 + uTime * 1.5) * 0.04 + 0.96;
          vec3  rimColor   = mix(vec3(0.0, 0.94, 1.0), vec3(0.61, 0.31, 0.93), fresnel);
          float alpha      = fresnel * 0.25 * scanline;
          gl_FragColor = vec4(rimColor, alpha);
        }
      `,
      transparent: true,
      depthWrite:  false,
      side:        THREE.FrontSide,
      blending:    THREE.AdditiveBlending,
    });
  }
}
extend({ GlassShellMaterial });

// ─── ENERGY PULSE RING SHADER ────────────────────────────────────────────────
class PulseRingMaterial extends THREE.ShaderMaterial {
  constructor(color: string) {
    super({
      uniforms: {
        uTime:    { value: 0 },
        uColor:   { value: new THREE.Color(color) },
        uOpacity: { value: 0.5 },
      },
      vertexShader: `
        uniform float uTime;
        varying float vAngle;
        void main() {
          vAngle = atan(position.y, position.x);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3  uColor;
        uniform float uOpacity;
        varying float vAngle;
        void main() {
          float pulse = sin(vAngle * 3.0 - uTime * 2.0) * 0.5 + 0.5;
          gl_FragColor = vec4(uColor, pulse * uOpacity);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      side:        THREE.DoubleSide,
    });
  }
}
extend({ PulseRingMaterial });

// ─── NEURAL SPHERE ────────────────────────────────────────────────────────────
function NeuralSphere({ scroll }: { scroll: number }) {
  const pointsRef   = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const count = 6000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution for uniform coverage
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr[i * 3]     = Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = Math.cos(phi);
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value   = t;
      materialRef.current.uniforms.uScroll.value = scroll;
      materialRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0025;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x, state.pointer.y * -0.18, 0.04
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* @ts-ignore */}
      <neuralSphereMaterial ref={materialRef} />
    </points>
  );
}

// ─── GLASS SHELL ─────────────────────────────────────────────────────────────
function GlassShell() {
  const meshRef     = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.15, 64, 64]} />
      {/* @ts-ignore */}
      <glassShellMaterial ref={materialRef} />
    </mesh>
  );
}

// ─── ORBITING ENERGY RINGS ────────────────────────────────────────────────────
function EnergyRings() {
  const rings = [
    { radius: 1.65, tube: 0.008, color: '#00f0ff', speed: 0.38, tiltX: Math.PI / 2.8,  tiltZ: 0 },
    { radius: 1.90, tube: 0.006, color: '#9d4edd', speed: -0.22, tiltX: Math.PI / 4.5, tiltZ: 0.6 },
    { radius: 2.15, tube: 0.005, color: '#ff007f', speed: 0.15, tiltX: 0.2,            tiltZ: Math.PI / 3 },
  ];

  const refs = rings.map(() => useRef<THREE.Mesh>(null));
  const matRefs = rings.map(() => useRef<THREE.ShaderMaterial>(null));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.forEach((ref, i) => {
      if (ref.current) ref.current.rotation.z = t * rings[i].speed;
    });
    matRefs.forEach((ref) => {
      if (ref.current) ref.current.uniforms.uTime.value = t;
    });
  });

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={refs[i]}
          rotation={[ring.tiltX, 0, ring.tiltZ]}
        >
          <torusGeometry args={[ring.radius, ring.tube, 8, 160]} />
          {/* @ts-ignore */}
          <pulseRingMaterial ref={matRefs[i]} args={[ring.color]} uColor-value={new THREE.Color(ring.color)} uOpacity-value={0.55} />
        </mesh>
      ))}
    </group>
  );
}

// ─── ORBITING SATELLITE NODES ─────────────────────────────────────────────────
function SatelliteNodes() {
  const groupRef = useRef<THREE.Group>(null);

  const satellites = useMemo(() => [
    { orbit: 2.6,  speed: 0.4,  phase: 0,             color: '#00f0ff', size: 0.075, label: 'React'    },
    { orbit: 2.4,  speed: -0.28, phase: Math.PI / 2,  color: '#9d4edd', size: 0.060, label: 'TypeScript' },
    { orbit: 2.8,  speed: 0.18, phase: Math.PI,       color: '#ff007f', size: 0.065, label: 'Python'    },
    { orbit: 2.5,  speed: -0.35, phase: Math.PI * 1.5, color: '#39ff14', size: 0.055, label: 'Docker'   },
    { orbit: 3.0,  speed: 0.22, phase: Math.PI * 0.7, color: '#00f0ff', size: 0.045, label: 'WebGL'    },
  ], []);

  // Individual satellite refs for glow animation
  const lightRefs = satellites.map(() => useRef<THREE.PointLight>(null));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
    }
    lightRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.intensity = 2 + Math.sin(t * 1.8 + i) * 0.8;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {satellites.map((sat, i) => {
        const x = Math.cos(sat.phase) * sat.orbit;
        const z = Math.sin(sat.phase) * sat.orbit;
        const y = Math.sin(sat.phase * 1.3) * 0.6;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[sat.size, 12, 12]} />
              <meshBasicMaterial
                color={sat.color}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Outer glow halo */}
            <mesh>
              <sphereGeometry args={[sat.size * 2.2, 8, 8]} />
              <meshBasicMaterial
                color={sat.color}
                transparent
                opacity={0.08}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight
              ref={lightRefs[i]}
              color={sat.color}
              intensity={2}
              distance={2.5}
            />
          </group>
        );
      })}
    </group>
  );
}

// ─── ENERGY PULSE WAVES (expanding rings from center) ─────────────────────────
function EnergyPulseWaves() {
  // 3 staggered expanding pulse rings
  const pulseRefs = [0, 1, 2].map(() => useRef<THREE.Mesh>(null));
  const matRefs   = [0, 1, 2].map(() => useRef<THREE.ShaderMaterial>(null));
  const phases    = [0, 2.1, 4.2];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    pulseRefs.forEach((ref, i) => {
      if (ref.current && matRefs[i].current) {
        const progress = ((t * 0.35 + phases[i]) % 1.0);
        const scale    = 1.1 + progress * 2.5;
        ref.current.scale.setScalar(scale);
        matRefs[i].current!.uniforms.uOpacity.value = (1.0 - progress) * 0.25;
        matRefs[i].current!.uniforms.uTime.value    = t;
      }
    });
  });

  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={pulseRefs[i]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.0, 64]} />
          {/* @ts-ignore */}
          <pulseRingMaterial ref={matRefs[i]} args={['#00f0ff']} uColor-value={new THREE.Color('#00f0ff')} uOpacity-value={0.25} />
        </mesh>
      ))}
    </>
  );
}

// ─── CORE INNER GLOW ──────────────────────────────────────────────────────────
function CoreGlow() {
  const meshRef     = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.opacity = 0.06 + Math.sin(t * 1.4) * 0.025;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.72, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00f0ff"
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── SCENE WRAPPER ────────────────────────────────────────────────────────────
function AICore() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScroll(window.scrollY / total);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 4, 4]}   intensity={1.2} color="#00f0ff" />
      <pointLight position={[-4, -4, -3]} intensity={0.8} color="#9d4edd" />
      <pointLight position={[0, -5, 2]}  intensity={0.5} color="#ff007f" />

      <CoreGlow />
      <NeuralSphere scroll={scroll} />
      <GlassShell />
      <EnergyRings />
      <SatelliteNodes />
      <EnergyPulseWaves />
    </>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const HologramCore: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[500px] relative flex items-center justify-center">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <AICore />
        </Canvas>
      </div>

      {/* Decorative CSS halos behind the canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[260px] h-[260px] md:w-[380px] md:h-[380px] rounded-full border border-cyber-cyan/10 animate-pulse"
             style={{ boxShadow: '0 0 80px 10px rgba(0,240,255,0.04)' }} />
        <div className="absolute w-[320px] h-[320px] md:w-[460px] md:h-[460px] rounded-full border border-cyber-purple/8"
             style={{ animation: 'spin 30s linear infinite' }} />
      </div>
    </div>
  );
};
