import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Custom Shader for the Morphing AI Digital Twin Bust
class AIOSCoreMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uHover: { value: 0 },
        uBreatheSpeed: { value: 1.5 },
        uBreatheAmp: { value: 0.08 },
        uPulseSpeed: { value: 2.0 },
        uBaseColor: { value: new THREE.Color('#00f0ff') }, // Cyan
        uPulseColor: { value: new THREE.Color('#9d4edd') }, // Purple
        uScroll: { value: 0 },
        uBlink: { value: 1.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uHover;
        uniform float uBreatheSpeed;
        uniform float uBreatheAmp;
        uniform float uScroll;
        uniform float uBlink;
        
        varying vec3 vPosition;
        varying float vNoise;
        varying float vDistanceToMouse;

        // Simplex 3D Noise Generator
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        
        float snoise(vec3 v){
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;
        
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
        
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - D.yyy;
        
          i = mod(i, 289.0 );
          vec4 p = permute( permute( permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
        
          vec4 j = p - 49.0 * floor(p * ns.z);
        
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
        
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
        
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
        
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
        
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
        
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
        
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
          vPosition = position;
          
          // Generate 3D simplex noise based on coordinates and time
          float noise = snoise(position * 1.8 + vec3(0.0, 0.0, uTime * 0.4));
          vNoise = noise;
          
          vec3 morphed = position;
          
          // Breathing modulation
          float breathe = 1.0 + sin(uTime * uBreatheSpeed) * uBreatheAmp;
          morphed *= breathe;
          
          // Scroll-based twist dispersion
          float angle = position.y * uScroll * 1.5;
          float cosAngle = cos(angle);
          float sinAngle = sin(angle);
          morphed.x = position.x * cosAngle - position.z * sinAngle;
          morphed.z = position.x * sinAngle + position.z * cosAngle;
          
          // Outward dispersion based on scroll
          vec3 dirNormal = normalize(position);
          morphed += dirNormal * uScroll * 0.45;
          
          // Noise deformation
          morphed += dirNormal * noise * (0.08 + uHover * 0.08);
          
          // Mouse interaction (pull/push vector)
          float dist = distance(morphed, uMouse);
          vDistanceToMouse = dist;
          
          if (dist < 2.5) {
            float strength = (1.0 - (dist / 2.5)) * 0.35 * (1.0 + uHover * 0.4);
            vec3 pullDir = normalize(morphed - uMouse);
            morphed += pullDir * strength;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = (14.0 / -mvPosition.z) * (1.0 + abs(noise) * 0.6 + uHover * 0.4);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulseSpeed;
        uniform vec3 uBaseColor;
        uniform vec3 uPulseColor;
        uniform float uBlink;
        
        varying vec3 vPosition;
        varying float vNoise;
        varying float vDistanceToMouse;

        void main() {
          // Circular point geometry
          vec2 center = gl_PointCoord - vec2(0.5);
          float distToCenter = length(center);
          
          if (distToCenter > 0.5) {
            discard;
          }
          
          // Blink Simulation for Eye node ranges
          // Left Eye region around [-0.22, 0.45, 0.45]
          // Right Eye region around [0.22, 0.45, 0.45]
          float distToLeftEye = length(vPosition - vec3(-0.22, 0.45, 0.45));
          float distToRightEye = length(vPosition - vec3(0.22, 0.45, 0.45));
          float isEye = step(0.12, min(distToLeftEye, distToRightEye)); // 0.0 if inside eyes, 1.0 if outside
          
          // Pulse propagation
          float pulse = sin(length(vPosition) * 3.2 - uTime * uPulseSpeed) * 0.5 + 0.5;
          
          vec3 finalColor = mix(uBaseColor, uPulseColor, pulse + vNoise * 0.25);
          
          // Highlights for cursor hover overlay
          if (vDistanceToMouse < 1.2) {
            float highlight = 1.0 - (vDistanceToMouse / 1.2);
            finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), highlight * 0.5);
          }
          
          // Blinking modifier
          float alpha = mix(uBlink, 1.0, isEye) * smoothstep(0.5, 0.1, distToCenter) * (0.65 + pulse * 0.35);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }
}

extend({ AIOSCoreMaterial });

function CustomCoreParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const blinkValRef = useRef(1.0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate procedural point cloud bust (Head, Shoulders, Neck)
  const count = 4200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;
      const rand = Math.random();

      if (rand < 0.55) {
        // Head (Oval Ellipsoid centered at y=0.45)
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.8 + Math.random() * 0.15;
        x = r * 0.65 * Math.sin(phi) * Math.cos(theta);
        y = r * 0.85 * Math.sin(phi) * Math.sin(theta) + 0.45;
        z = r * 0.6 * Math.cos(phi);

        // Mold facial attributes on front facade (+Z)
        if (z > 0.2 && y > 0.25 && y < 0.6) {
          // Nose bridge extrusion
          if (Math.abs(x) < 0.12) {
            z += 0.16 - Math.abs(x);
          }
        }
      } else if (rand < 0.85) {
        // Shoulders (ELLIPSOID Cape at y = -0.7)
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI * 0.45; // top hemisphere
        const r = 1.25 + Math.random() * 0.25;
        x = r * 1.4 * Math.sin(phi) * Math.cos(theta);
        y = -0.65 - Math.random() * 0.35;
        z = r * 0.6 * Math.sin(phi) * Math.sin(theta);
      } else {
        // Connecting Cylindrical Neck (y from -0.45 to 0.1)
        const theta = Math.random() * 2 * Math.PI;
        const r = 0.21 + Math.random() * 0.04;
        const h = -0.45 + Math.random() * 0.55;
        x = r * Math.cos(theta);
        y = h;
        z = r * Math.sin(theta);
      }

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Random Blinking Cycle Simulation
    if (Math.random() < 0.006 && blinkValRef.current >= 1.0) {
      blinkValRef.current = 0.05; // Blink!
    }
    if (blinkValRef.current < 1.0) {
      blinkValRef.current += 0.12; // Restore eyelids
      if (blinkValRef.current > 1.0) blinkValRef.current = 1.0;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uScroll.value = scrollProgress;
      materialRef.current.uniforms.uBlink.value = blinkValRef.current;
      
      const mouseX = (state.pointer.x * 2.2);
      const mouseY = (state.pointer.y * 2.2);
      materialRef.current.uniforms.uMouse.value.set(mouseX, mouseY, 0);
    }
    
    if (pointsRef.current) {
      // Smoothly orient head to look at mouse pointer
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, state.pointer.x * 0.45, 0.06);
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, -state.pointer.y * 0.35, 0.06);
      // Breathing vertical offset drift
      pointsRef.current.position.y = Math.sin(t * 1.4) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      {/* @ts-ignore */}
      <aIOSCoreMaterial ref={materialRef} />
    </points>
  );
}

function TechOrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = elapsed * 0.45;
      ring1Ref.current.rotation.x = Math.sin(elapsed * 0.3) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -elapsed * 0.25;
      ring2Ref.current.rotation.y = Math.cos(elapsed * 0.2) * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = elapsed * 0.35;
      ring3Ref.current.rotation.x = Math.sin(elapsed * 0.4) * 0.25;
    }
  });

  return (
    <group>
      {/* Cyan Tech Orbit Ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Magenta Tech Outer Ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / -4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.3, 0.015, 8, 80]} />
        <meshBasicMaterial color="#ff007f" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Green Tech Orbit Line */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.7, 0.01, 8, 64]} />
        <meshBasicMaterial color="#39ff14" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function OrbitingTechNodes() {
  const nodesGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = elapsed * 0.18;
    }
  });

  const nodes = [
    { pos: [2.6, 0.4, 0] as const, color: '#39ff14', name: 'React' },
    { pos: [-2.0, 1.6, -1.8] as const, color: '#00f0ff', name: 'TS' },
    { pos: [0.5, -2.1, 1.8] as const, color: '#ff007f', name: 'Python' },
    { pos: [-1.8, -1.5, -2.0] as const, color: '#9d4edd', name: 'Docker' }
  ];

  return (
    <group ref={nodesGroupRef}>
      {nodes.map((node, i) => {
        return (
          <group key={i} position={node.pos}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight distance={3} intensity={3} color={node.color} />
          </group>
        );
      })}
    </group>
  );
}

export const HologramCore: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[450px] relative flex items-center justify-center">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
          
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
            <CustomCoreParticles />
            <TechOrbitRings />
            <OrbitingTechNodes />
          </Float>
        </Canvas>
      </div>

      {/* Decorative scanline overlay rings */}
      <div className="absolute w-[240px] h-[240px] md:w-[340px] md:h-[340px] rounded-full border border-cyber-cyan/15 animate-pulse pointer-events-none z-0 shadow-[0_0_60px_rgba(0,240,255,0.06)] flex items-center justify-center">
        <div className="w-[88%] h-[88%] rounded-full border border-cyber-purple/10 border-dashed animate-spin duration-30000" />
      </div>
    </div>
  );
};
