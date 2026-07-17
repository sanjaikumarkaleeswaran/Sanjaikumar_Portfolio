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
function NeuralSphere({ scroll, pulseIntensity, isMobile, mousePos }: { scroll: number; pulseIntensity: number; isMobile: boolean; mousePos: { x: number; y: number } }) {
  const pointsRef   = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef     = useRef(0);

  const particleCount = useMemo(() => (isMobile ? 800 : 3000), [isMobile]);

  const positions = useMemo(() => {
    const count = isMobile ? 800 : 3000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr[i * 3]     = Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = Math.cos(phi);
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [isMobile]);

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
      materialRef.current.uniforms.uMouse.value.set(mousePos.x, mousePos.y);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0035;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x, mousePos.y * -0.15, 0.05
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
function GlassShell({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef     = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef     = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uMouse.value.set(mousePos.x, mousePos.y);
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

        const linePos = new Float32Array([0, 0, 0, x, y, z]);

        return (
          <group key={sat.id}>
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

            <group position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[sat.size, 10, 10]} />
                <meshBasicMaterial
                  color={sat.color}
                  transparent
                  opacity={0.9}
                />
              </mesh>
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
function AICore({ pulseIntensity, isMobile, mousePos }: { pulseIntensity: number; isMobile: boolean; mousePos: { x: number; y: number } }) {
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

      <NeuralSphere scroll={scroll} pulseIntensity={pulseIntensity} isMobile={isMobile} mousePos={mousePos} />
      <GlassShell mousePos={mousePos} />
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

  // Scanner interactive states
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchStyle, setGlitchStyle] = useState<React.CSSProperties>({});
  
  // Real-time fluctuating HUD metrics
  const [hudStats, setHudStats] = useState({ temp: '33.2°C', load: '94.2%', speed: '5.20 GHz' });
  
  // Smoothly interpolated transforms for the avatar photo
  const [avatarTransform, setAvatarTransform] = useState('');
  const transformRef = useRef({ rotX: 0, rotY: 0, floatY: 0, breatheScale: 1 });

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

  // RequestAnimationFrame driven smooth animation updates for UI elements
  useEffect(() => {
    let animId: number;
    let time = 0;

    const update = () => {
      time += 0.016;

      // 1. Floating offset (sine wave)
      const floatY = Math.sin(time * 2.0) * 3; // 3px delta

      // 2. Breathing scale oscillation
      const breatheScale = 1.0 + Math.sin(time * 1.2) * 0.01;

      // 3. Head/Eye rotation looking towards cursor
      const targetRotX = mousePos.y * -14; 
      const targetRotY = mousePos.x * 16; 
      const slowTiltZ = Math.sin(time * 0.6) * 1.5; // ±1.5° slow rotation

      // Smooth interpolation (lerp)
      transformRef.current.rotX += (targetRotX - transformRef.current.rotX) * 0.08;
      transformRef.current.rotY += (targetRotY - transformRef.current.rotY) * 0.08;
      transformRef.current.floatY = floatY;
      transformRef.current.breatheScale = breatheScale;

      // Compose final transform statement
      const scaleMultiplier = isHovered ? 1.08 : 1.0;
      setAvatarTransform(
        `translateY(${transformRef.current.floatY}px) scale(${transformRef.current.breatheScale * scaleMultiplier}) rotateX(${transformRef.current.rotX}deg) rotateY(${transformRef.current.rotY}deg) rotateZ(${slowTiltZ}deg)`
      );

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isHovered]);

  // Mouse move listener to map viewport coordinates to container space
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1 range
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1 range
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Periodic simulated thinking neural animation
  useEffect(() => {
    const triggerPulse = () => {
      setPulseIntensity(2.4);
      playAudioCue('sparkle');
      setTimeout(() => setPulseIntensity(1.0), 1200);
    };
    const timer = setInterval(triggerPulse, 6200);
    return () => clearInterval(timer);
  }, [playAudioCue]);

  // Eyelid blink simulator via clip-path
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);

      const nextBlink = 3000 + Math.random() * 3000;
      setTimeout(triggerBlink, nextBlink);
    };
    const timer = setTimeout(triggerBlink, 4200);
    return () => clearTimeout(timer);
  }, []);

  // Occasional random digital glitches + RGB channel shift simulation
  useEffect(() => {
    const triggerGlitch = () => {
      if (isMobile) return; // Disable expensive glitch effects on mobile

      setGlitchActive(true);
      const shiftX = (Math.random() - 0.5) * 6;
      const shiftY = (Math.random() - 0.5) * 4;
      const hue = Math.floor(Math.random() * 360);

      setGlitchStyle({
        transform: `translate(${shiftX}px, ${shiftY}px) scale(1.05)`,
        filter: `hue-rotate(${hue}deg) saturate(2) contrast(1.4)`,
        opacity: 0.85
      });

      setTimeout(() => {
        setGlitchActive(false);
        setGlitchStyle({});
      }, 130);

      const nextGlitch = 5000 + Math.random() * 6000;
      setTimeout(triggerGlitch, nextGlitch);
    };
    const timer = setTimeout(triggerGlitch, 5500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Modulate HUD diagnostic variables
  useEffect(() => {
    const interval = setInterval(() => {
      setHudStats({
        temp: `${(32.8 + Math.random() * 2.5).toFixed(1)}°C`,
        load: `${(92.1 + Math.random() * 6.8).toFixed(1)}%`,
        speed: `${(5.12 + Math.random() * 0.16).toFixed(2)} GHz`
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[300px] md:min-h-[420px] relative flex items-center justify-center select-none cursor-crosshair"
    >
      
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 5.0], fov: 42 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={isMobile ? 1.0 : [1, 1.2]}
          frameloop={isVisible ? 'always' : 'never'}
        >
          <AICore pulseIntensity={pulseIntensity} isMobile={isMobile} mousePos={mousePos} />
        </Canvas>
      </div>

      {/* Holographic scanner profile identity card (z-20) */}
      <div className="absolute z-20 w-36 h-36 md:w-48 md:h-48 flex items-center justify-center pointer-events-none">
        
        {/* Animated HUD SVG overlays rotating around the profile */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70">
          <svg className="absolute w-full h-full animate-[spin_45s_linear_infinite]" viewBox="0 0 200 200">
            {/* Outer dotted tracking track */}
            <circle cx="100" cy="100" r="92" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="3,7" fill="none" opacity="0.35" />
            {/* Inner secondary solid rings */}
            <circle cx="100" cy="100" r="80" stroke="#9d4edd" strokeWidth="0.75" fill="none" opacity="0.2" />
            {/* Hexagonal coordinate frame */}
            <polygon points="100,15 174,58 174,142 100,185 26,142 26,58" stroke="#ff007f" strokeWidth="0.4" fill="none" opacity="0.15" className="animate-[spin_30s_linear_infinite_reverse]" />
          </svg>
          <svg className="absolute w-[86%] h-[86%] animate-[spin_18s_linear_infinite_reverse]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="88" stroke="#00f0ff" strokeWidth="1.2" strokeDasharray="1,15" fill="none" opacity="0.5" />
          </svg>
        </div>

        {/* Futuristic circular scan shell */}
        <div 
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border bg-black/75 transition-all duration-300 z-10"
          style={{ 
            borderColor: isHovered ? 'var(--color-cyber-cyan)' : 'rgba(0,240,255,0.4)',
            boxShadow: isHovered 
              ? '0 0 25px rgba(0,240,255,0.5), inset 0 0 15px rgba(0,240,255,0.2)' 
              : '0 0 15px rgba(0,240,255,0.2)'
          }}
        >
          {/* Holographic scanner screen static overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,4px_100%]" />

          {/* Core Profile Photo */}
          <img 
            src="/sanjai_hologram.png" 
            alt="Sanjai P K Hologram Scan" 
            style={{ 
              transform: avatarTransform,
              clipPath: isBlinking ? 'inset(50% 0 50% 0)' : 'inset(0% 0 0% 0)',
              transition: isBlinking ? 'clip-path 80ms ease-out' : 'clip-path 120ms ease-in',
              filter: `contrast(130%) brightness(${pulseIntensity > 1 ? 1.45 : isHovered ? 1.2 : 1.05}) saturate(${pulseIntensity > 1 ? 1.5 : 1.1})`,
            }}
            className="w-full h-full object-cover mix-blend-screen opacity-85 select-none transition-all duration-300" 
          />

          {/* Glitch Overlay copy */}
          {glitchActive && (
            <img 
              src="/sanjai_hologram.png" 
              alt="Sanjai P K Glitch" 
              style={glitchStyle}
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen select-none z-10"
            />
          )}

          {/* Circular scanner reticle crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
            <div className="w-1 h-1 rounded-full bg-cyber-cyan" />
            <div className="absolute w-8 h-[0.5px] bg-cyber-cyan/35" />
            <div className="absolute h-8 w-[0.5px] bg-cyber-cyan/35" />
            <div className="absolute w-12 h-12 rounded-full border border-dashed border-cyber-cyan/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-16 h-16 rounded-full border border-cyber-cyan/15 animate-[pulse_2s_infinite]" />
          </div>

          {/* Laser scanning sweep line */}
          <div 
            className="absolute inset-x-0 h-[2.5px] bg-cyber-cyan/90 z-20 shadow-[0_0_10px_rgba(0,240,255,0.95)]"
            style={{
              animation: pulseIntensity > 1 
                ? 'scannerSweep 1.2s infinite linear' 
                : 'scannerSweep 3.2s infinite linear'
            }}
          />
          {/* Rotating dashed ring */}
          <div className="absolute inset-1 rounded-full border border-dashed border-cyber-cyan/20 animate-[spin_8s_linear_infinite] z-20" />
        </div>

        {/* Outer tech scan frame and status indicators */}
        <div className="absolute inset-2 rounded-full border border-dashed border-cyber-purple/35 animate-[spin_24s_linear_infinite] z-0" />
        <div className="absolute -inset-1 rounded-full border border-cyber-cyan/20 animate-[spin_32s_linear_infinite_reverse] z-0" />

        {/* HUD system tag */}
        <div className="absolute -bottom-4 text-[7px] font-mono text-cyber-cyan font-bold tracking-widest bg-black/95 px-2.5 py-0.5 border border-cyber-cyan/30 rounded-md shadow-[0_0_10px_rgba(0,240,255,0.25)] z-20">
          SYS_ID: SANJAI_PK
        </div>

        {/* Pop-out Dynamic HUD Diagnostic panel */}
        <div 
          className="absolute left-[110%] top-2 w-32 p-2.5 bg-black/90 border border-cyber-cyan/30 rounded-lg text-[7px] font-mono text-cyber-cyan space-y-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] z-30 transition-all duration-300 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.95)',
          }}
        >
          <div className="text-white font-bold border-b border-cyber-cyan/25 pb-0.5 uppercase tracking-widest flex items-center justify-between">
            <span>AI_CORE</span>
            <span className="text-cyber-green animate-pulse">● ACTIVE</span>
          </div>
          <div className="flex justify-between"><span>NEURAL_LOAD:</span><span className="text-white">{hudStats.load}</span></div>
          <div className="flex justify-between"><span>CORE_TEMP:</span><span className="text-white">{hudStats.temp}</span></div>
          <div className="flex justify-between"><span>CLOCK_SPEED:</span><span className="text-white">{hudStats.speed}</span></div>
          <div className="text-cyber-green text-[6.5px] font-bold border-t border-white/5 pt-1 mt-1 flex items-center gap-1">
            <span>✓ IDENTITY VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Ambient glow backing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div 
          className="rounded-full border transition-all duration-500"
          style={{ 
            width: isMobile ? '200px' : '320px',
            height: isMobile ? '200px' : '320px',
            borderColor: isHovered ? 'rgba(0,240,255,0.18)' : 'rgba(0,240,255,0.06)',
            boxShadow: isHovered 
              ? '0 0 80px 20px rgba(0,240,255,0.07)' 
              : '0 0 60px 10px rgba(0,240,255,0.03)' 
          }} 
        />
      </div>

    </div>
  );
};
