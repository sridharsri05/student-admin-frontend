
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, geometry, color, speed = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.15}
          wireframe={true}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
};

const GlowingSphere = ({ position, color, size = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export const LoginBackground = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00D4FF" />
      <pointLight position={[-10, -10, 10]} intensity={0.6} color="#8B5CF6" />
      <pointLight position={[0, 10, -10]} intensity={0.4} color="#EC4899" />
      <pointLight position={[10, -10, -5]} intensity={0.5} color="#10B981" />
      
      {/* Floating Geometric Shapes */}
      <FloatingShape 
        position={[-8, 3, -12]} 
        geometry={<boxGeometry args={[2, 2, 2]} />}
        color="#00D4FF"
        speed={0.8}
      />
      
      <FloatingShape 
        position={[6, -2, -15]} 
        geometry={<sphereGeometry args={[1.5, 32, 32]} />}
        color="#8B5CF6"
        speed={1.2}
      />
      
      <FloatingShape 
        position={[4, 5, -10]} 
        geometry={<torusGeometry args={[2, 0.5, 16, 32]} />}
        color="#EC4899"
        speed={0.6}
      />
      
      <FloatingShape 
        position={[-6, -4, -8]} 
        geometry={<icosahedronGeometry args={[1.5]} />}
        color="#10B981"
        speed={1.4}
      />

      <FloatingShape 
        position={[8, 1, -18]} 
        geometry={<octahedronGeometry args={[1.8]} />}
        color="#F59E0B"
        speed={0.9}
      />

      <FloatingShape 
        position={[-4, 6, -14]} 
        geometry={<dodecahedronGeometry args={[1.2]} />}
        color="#EF4444"
        speed={1.1}
      />

      {/* Glowing Spheres for Ambiance */}
      <GlowingSphere position={[-10, 8, -20]} color="#00D4FF" size={0.5} />
      <GlowingSphere position={[12, -6, -16]} color="#8B5CF6" size={0.7} />
      <GlowingSphere position={[2, 8, -22]} color="#EC4899" size={0.4} />
      <GlowingSphere position={[-8, -8, -18]} color="#10B981" size={0.6} />
      <GlowingSphere position={[10, 4, -24]} color="#F59E0B" size={0.3} />

      {/* Particle-like Small Spheres */}
      {Array.from({ length: 20 }, (_, i) => (
        <GlowingSphere
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 20,
            -30 + Math.random() * 20
          ]}
          color={['#00D4FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)]}
          size={0.1 + Math.random() * 0.2}
        />
      ))}
    </>
  );
};
