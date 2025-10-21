"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

// Modeli yükleyip gösteren iç bileşen
function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  // Modelin boyutunu ve pozisyonunu thumbnail'e sığacak şekilde ayarlayın
  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />; 
}

interface ThumbnailProps {
  path: string;
}

const ClothingThumbnail: React.FC<ThumbnailProps> = ({ path }) => {
  return (
    <div className="w-full h-full object-cover aspect-square bg-gray-800 cursor-pointer">
      <Canvas shadows camera={{ position: [0, 0, 2], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="studio" /> 
          <Model path={path} />
          <OrbitControls 
            enableZoom={false} // Yakınlaştırma kapalı
            enablePan={false}  // Kaydırma kapalı
            autoRotate // Kendi kendine dönsün
            autoRotateSpeed={4} // Dönüş hızı
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// React.memo, gereksiz yeniden render'ları engeller (performans için önemli)
export default React.memo(ClothingThumbnail);