import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useOS } from '../../context/OSContext';

// ─── AI NEURAL SPHERE SHADER ────────────────────────────────────────────────
class NeuralSphereMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime:       { value: 0 },
        uMouse:      { value: new THREE.Vector2(0, 0) },
        uPulse:      { value: 1.0 },
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

          // Animated noise-deformed sphere, influenced by uPulse
          float n  = noise(position * 2.0 + vec3(uTime * 0.22));
          float n2 = noise(position * 4.0 - vec3(uTime * 0.1, 0.0, uTime * 0.15));
          float totalNoise = n * 0.15 + n2 * 0.08;
          vNoise = totalNoise;

          // Breathing scale + thinking burst spikes
          float breathe = 1.0 + sin(uTime * 1.5) * 0.03 * uPulse;

          // Mouse-driven tilt
          float angleY = uMouse.x * 0.5;
          float angleX = -uMouse.y * 0.35;
          mat2 rotY = mat2(cos(angleY), -sin(angleY), sin(angleY), cos(angleY));
          mat2 rotX = mat2(cos(angleX), -sin(angleX), sin(angleX), cos(angleX));

          vec3 displaced = normalize(position) * (1.0 + totalNoise) * breathe;
          displaced.xz = rotY * displaced.xz;
          displaced.yz = rotX * displaced.yz;

          // Scroll-based dispersal
          float disperse = uScroll * 0.6;
          displaced += normalize(position) * disperse;

          // Outward pulse wave
          float dist   = length(position);
          float pWave  = sin(dist * 5.0 - uTime * 4.0) * 0.5 + 0.5;
          vPulse = pWave;

          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_Position     = projectionMatrix * mvPosition;
          gl_PointSize    = (6.5 / -mvPosition.z) * (1.0 + abs(totalNoise) * 2.0 + pWave * 0.5) * uPulse;
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
          col      = mix(col, uColorC, t2 * 0.45);
          col      = mix(col, uColorA, lat * 0.25);

          // Proximity highlight (brighter equator)
          float eq  = 1.0 - abs(vPosition.y);
          col += eq * 0.2;

          float alpha = soft * (0.50 + vPulse * 0.35 + abs(vNoise) * 0.4);
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
          float fresnel    = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.5);
          float scanline   = sin(vPosition.y * 30.0 + uTime * 2.0) * 0.05 + 0.95;
          vec3  rimColor   = mix(vec3(0.0, 0.94, 1.0), vec3(0.61, 0.31, 0.93), fresnel);
          float alpha      = fresnel * 0.22 * scanline;
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
          float pulse = sin(vAngle * 3.0 - uTime * 2.5) * 0.5 + 0.5;
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
function NeuralSphere({ scroll, pulseIntensity, isMobile }: { scroll: number; pulseIntensity: number; isMobile: boolean }) {
  const pointsRef   = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef     = useRef(0);

  // Quality settings: cap particle counts based on mobile detection
  const particleCount = useMemo(() => (isMobile ? 800 : 3000), [isMobile]);

  const positions = useMemo(() => {
    const count = 3000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr[i * 3]     = Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = Math.cos(phi);
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value   = t;
      materialRef.current.uniforms.uScroll.value = scroll;
      materialRef.current.uniforms.uPulse.value  = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uPulse.value,
        pulseIntensity,
        0.08
      );
      materialRef.current.uniforms.uMouse.value.set(_.pointer.x, _.pointer.y);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0035;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x, _.pointer.y * -0.15, 0.05
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={particleCount} />
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
  const timeRef     = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0018;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.15, 24, 24]} />
      {/* @ts-ignore */}
      <glassShellMaterial ref={materialRef} />
    </mesh>
  );
}

// ─── ORBITING ENERGY RINGS ────────────────────────────────────────────────────
function EnergyRings({ isMobile }: { isMobile: boolean }) {
  const rings = useMemo(() => {
    const base = [
      { radius: 1.65, tube: 0.008, color: '#00f0ff', speed: 0.35, tiltX: Math.PI / 2.8,  tiltZ: 0 },
      { radius: 1.90, tube: 0.006, color: '#9d4edd', speed: -0.20, tiltX: Math.PI / 4.5, tiltZ: 0.6 }
    ];
    if (!isMobile) {
      base.push({ radius: 2.15, tube: 0.005, color: '#ff007f', speed: 0.12, tiltX: 0.2, tiltZ: Math.PI / 3 });
    }
    return base;
  }, [isMobile]);

  const refs = rings.map(() => useRef<THREE.Mesh>(null));
  const matRefs = rings.map(() => useRef<THREE.ShaderMaterial>(null));

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
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
          <torusGeometry args={[ring.radius, ring.tube, 6, 64]} />
          {/* @ts-ignore */}
          <pulseRingMaterial ref={matRefs[i]} args={[ring.color]} uColor-value={new THREE.Color(ring.color)} uOpacity-value={0.45} />
        </mesh>
      ))}
    </group>
  );
}

// ─── ORBITING SATELLITE NODES + SYNAPSE LINES ─────────────────────────────────
function SatelliteNodes({ isMobile, pulseIntensity }: { isMobile: boolean; pulseIntensity: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const satellites = useMemo(() => {
    const list = [
      { id: 'fe', orbit: 2.5,  speed: 0.38,  phase: 0,             color: '#00f0ff', size: 0.075, label: 'React'    },
      { id: 'ts', orbit: 2.3,  speed: -0.25, phase: Math.PI / 2,  color: '#9d4edd', size: 0.060, label: 'TypeScript' },
      { id: 'py', orbit: 2.7,  speed: 0.16,  phase: Math.PI,       color: '#ff007f', size: 0.065, label: 'Python'    }
    ];
    if (!isMobile) {
      list.push(
        { id: 'dk', orbit: 2.4,  speed: -0.32, phase: Math.PI * 1.5, color: '#39ff14', size: 0.055, label: 'Docker'   },
        { id: 'gl', orbit: 2.9,  speed: 0.20,  phase: Math.PI * 0.7, color: '#00f0ff', size: 0.045, label: 'WebGL'    }
      );
    }
    return list;
  }, [isMobile]);

  const lightRefs = satellites.map(() => useRef<THREE.PointLight>(null));

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.14;
    }
    lightRefs.forEach((ref, idx) => {
      if (ref.current) {
        ref.current.intensity = (2 + Math.sin(t * 2.0 + idx) * 0.7) * pulseIntensity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {satellites.map((sat, i) => {
        const x = Math.cos(sat.phase) * sat.orbit;
        const z = Math.sin(sat.phase) * sat.orbit;
        const y = Math.sin(sat.phase * 1.2) * 0.55;

        // Render line coordinates
        const linePos = new Float32Array([0, 0, 0, x, y, z]);

        return (
          <group key={sat.id}>
            {/* Dynamic neural connection line */}
            <line>
              <bufferGeometry attach="geometry">
                <float32BufferAttribute
                  attach="attributes-position"
                  args={[linePos, 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={sat.color}
                transparent
                opacity={isMobile ? 0.15 : 0.35 * (pulseIntensity > 1 ? 1.5 : 1)}
                blending={THREE.AdditiveBlending}
              />
            </line>

            {/* Satellite Node mesh */}
            <group position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[sat.size, 10, 10]} />
                <meshBasicMaterial
                  color={sat.color}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              {/* Volumetric glow mesh */}
              <mesh>
                <sphereGeometry args={[sat.size * 2.2, 6, 6]} />
                <meshBasicMaterial
                  color={sat.color}
                  transparent
                  opacity={0.06}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              {!isMobile && (
                <pointLight
                  ref={lightRefs[i]}
                  color={sat.color}
                  intensity={1.8}
                  distance={2.0}
                />
              )}
            </group>
          </group>
        );
      })}
    </group>
  );
}

// ─── ENERGY PULSE WAVES ──────────────────────────────────────────────────────
function EnergyPulseWaves() {
  const pulseRefs = [0, 1].map(() => useRef<THREE.Mesh>(null));
  const matRefs   = [0, 1].map(() => useRef<THREE.ShaderMaterial>(null));
  const phases    = [0, 0.5];

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    pulseRefs.forEach((ref, i) => {
      if (ref.current && matRefs[i].current) {
        const progress = ((t * 0.38 + phases[i]) % 1.0);
        const scale    = 1.15 + progress * 2.2;
        ref.current.scale.setScalar(scale);
        matRefs[i].current!.uniforms.uOpacity.value = (1.0 - progress) * 0.22;
        matRefs[i].current!.uniforms.uTime.value    = t;
      }
    });
  });

  return (
    <>
      {[0, 1].map((i) => (
        <mesh key={i} ref={pulseRefs[i]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.96, 1.0, 48]} />
          {/* @ts-ignore */}
          <pulseRingMaterial ref={matRefs[i]} args={['#00f0ff']} uColor-value={new THREE.Color('#00f0ff')} uOpacity-value={0.2} />
        </mesh>
      ))}
    </>
  );
}

// ─── SCENE WRAPPER ────────────────────────────────────────────────────────────
function AICore({ pulseIntensity, isMobile }: { pulseIntensity: number; isMobile: boolean }) {
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
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]}   intensity={1.0} color="#00f0ff" />
      <pointLight position={[-3, -3, -2]} intensity={0.7} color="#9d4edd" />

      <NeuralSphere scroll={scroll} pulseIntensity={pulseIntensity} isMobile={isMobile} />
      <GlassShell />
      <EnergyRings isMobile={isMobile} />
      <SatelliteNodes isMobile={isMobile} pulseIntensity={pulseIntensity} />
      {!isMobile && <EnergyPulseWaves />}
    </>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const HologramCore: React.FC = () => {
  const { playAudioCue } = useOS();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Thinking pulse bursts simulation
  const [pulseIntensity, setPulseIntensity] = useState(1);

  // Monitor visibility & screen size responsive bounds
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);

    const onVis = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('resize', checkSize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Periodic simulated thinking neural animation
  useEffect(() => {
    const triggerPulse = () => {
      setPulseIntensity(2.4);
      playAudioCue('sparkle');
      setTimeout(() => setPulseIntensity(1.0), 1000);
    };
    const timer = setInterval(triggerPulse, 5500);
    return () => clearInterval(timer);
  }, [playAudioCue]);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[420px] relative flex items-center justify-center select-none">
      
      {/* 3D Neural Canvas layer (z-10) */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 5.0], fov: 42 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.2]}
          frameloop={isVisible ? 'always' : 'never'}
        >
          <AICore pulseIntensity={pulseIntensity} isMobile={isMobile} />
        </Canvas>
      </div>

      {/* Holographic scanner profile identity card (z-20) */}
      <div className="absolute z-20 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center pointer-events-none">
        
        {/* Futuristic circular scan shell */}
        <div className="relative w-24 h-24 md:w-30 md:h-30 rounded-full overflow-hidden border border-cyber-cyan/40 bg-black/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          <img 
            src="/sanjai_hologram.png" 
            alt="Sanjai P K Hologram Scan" 
            className="w-full h-full object-cover filter contrast-125 brightness-105 mix-blend-screen opacity-85 select-none" 
          />
          {/* Circular scanner reticle crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Center target dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
            <div className="w-1 h-1 rounded-full bg-cyber-cyan" />
            
            {/* Crosshair lines */}
            <div className="absolute w-8 h-[0.5px] bg-cyber-cyan/30" />
            <div className="absolute h-8 w-[0.5px] bg-cyber-cyan/30" />
            
            {/* Secondary rings */}
            <div className="absolute w-12 h-12 rounded-full border border-dashed border-cyber-cyan/25 animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-16 h-16 rounded-full border border-cyber-cyan/15 animate-[pulse_2s_infinite]" />
          </div>
          {/* Scanning sweep line */}
          <div className="absolute inset-x-0 h-[2px] bg-cyber-cyan/90 shadow-[0_0_8px_rgba(0,240,255,0.9)] animate-[scannerSweep_3s_infinite_linear]" />
          {/* Radar HUD circular line */}
          <div className="absolute inset-0 rounded-full border border-dashed border-cyber-cyan/30 animate-[spin_6s_linear_infinite]" />
        </div>

        {/* Outer Tech scan decorations */}
        <div className="absolute inset-0 rounded-full border border-dashed border-cyber-purple/35 animate-[spin_16s_linear_infinite]" />
        <div className="absolute -inset-2 rounded-full border border-cyber-cyan/20 animate-[spin_24s_linear_infinite_reverse]" />

        {/* HUD system tag */}
        <div className="absolute -bottom-3 text-[7px] font-mono text-cyber-cyan font-bold tracking-widest bg-black/90 px-2 py-0.5 border border-cyber-cyan/25 rounded-md shadow-md">
          SYS_ID: SANJAI_PK
        </div>
      </div>

      {/* Outer ambient glow backing rings (z-0) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          className="w-[240px] h-[240px] md:w-[350px] md:h-[350px] rounded-full border border-cyber-cyan/10 animate-pulse"
          style={{ boxShadow: '0 0 60px 10px rgba(0,240,255,0.03)' }} 
        />
      </div>

    </div>
  );
};
