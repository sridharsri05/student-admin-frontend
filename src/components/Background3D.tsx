
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, Box, Torus } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingShape = ({ position, geometry, color }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00D4FF" />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color="#8B5CF6" />
      
      <FloatingShape 
        position={[-3, 2, -5]} 
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#00D4FF"
      />
      
      <FloatingShape 
        position={[4, -1, -8]} 
        geometry={<sphereGeometry args={[0.8, 32, 32]} />}
        color="#8B5CF6"
      />
      
      <FloatingShape 
        position={[2, 3, -6]} 
        geometry={<torusGeometry args={[1, 0.3, 16, 32]} />}
        color="#EC4899"
      />
      
      <FloatingShape 
        position={[-4, -2, -7]} 
        geometry={<octahedronGeometry args={[1]} />}
        color="#10B981"
      />
    </>
  );
};

export const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
