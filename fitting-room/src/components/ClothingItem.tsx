"use client";
import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ClothingItemProps {
  path: string;
}

export const ClothingItem = ({ path }: ClothingItemProps) => {
  const { scene } = useGLTF(path);
  scene.traverse(child => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
    }
  });
  return <primitive object={scene} />;
};
