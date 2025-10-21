"use client";
import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Gender } from './FittingRoom';
import { ClothingItem } from './ClothingItem';

interface CharacterProps {
  bodyWeight: number;
  gender: Gender;
  wornClothes: {
    top: string | null;
    bottom: string | null;
  };
}

interface ModelConfigInfo {
  path: string;
  nodeName: string;
  scale: number;
  rotation: [number, number, number];
}

const modelConfig: Record<Gender, ModelConfigInfo> = {
  male: {
    path: '/akilli_model.glb',
    nodeName: '0',
    scale: 0.01,
    rotation: [-Math.PI / 2, 0, 0],
  },
};

/*
const modelConfig: Record<Gender, ModelConfigInfo> = {
  male: {
    path: '/akilli_model.glb',
    nodeName: '0',
    scale: 0.01,
    rotation: [-Math.PI / 2, 0, 0],
  },
  female: {
    path: '/akilli_model_female.glb',
    nodeName: '0',
    scale: 0.01,
    rotation: [-Math.PI / 2, 0, 0],
  }
}; */
// -------------------------------------------------------------

const clothingInventory = {
  tops: [
    { id: 'sweatshirt', path: '/clothes/ust_kiyafet1.glb' },
  ],
  bottoms: [
    { id: 'sweatpants', path: '/clothes/alt_kiyafet1.glb' },
  ],
};

export const Character = ({ bodyWeight, gender, wornClothes }: CharacterProps) => {
  const selectedModelInfo = modelConfig[gender];
  const { nodes, materials } = useGLTF(selectedModelInfo.path);
  const modelNode = nodes[selectedModelInfo.nodeName] as THREE.Object3D;

  console.log('Model Node:', modelNode); // Vücut Özelliklerini gösteren Log

  useEffect(() => {
    // console.log("Modelin materyalleri:", materials); 
    
    // Model yüklendiğinde ve materyaller mevcut olduğunda çalışır
    if (modelNode) {
      const skinMaterial = materials['lambert1.002'] as THREE.MeshStandardMaterial;

      if (skinMaterial) {
        skinMaterial.color.set('#C68642'); // Örnek bir ten rengi
      }
    }
  }, [modelNode, materials, gender]); 

  // Vücut şekli useEffect'i
  useEffect(() => {
    if (gender === 'male' && modelNode) {
      const mesh = modelNode as THREE.Mesh;
      if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        const kiloIndex = mesh.morphTargetDictionary['Kilo'];
        const zayifIndex = mesh.morphTargetDictionary['Zayıf'];
        
        if (bodyWeight >= 0) {
          if (kiloIndex !== undefined) mesh.morphTargetInfluences[kiloIndex] = bodyWeight;
          if (zayifIndex !== undefined) mesh.morphTargetInfluences[zayifIndex] = 0;
        } else {
          if (kiloIndex !== undefined) mesh.morphTargetInfluences[kiloIndex] = 0;
          if (zayifIndex !== undefined) mesh.morphTargetInfluences[zayifIndex] = Math.abs(bodyWeight);
        }
        console.log('Morph Influences:', mesh.morphTargetInfluences); // Vücut şekline göre (0,1) Log
      }
    }
  }, [bodyWeight, modelNode, gender]);

  const topPath = clothingInventory.tops.find(item => item.id === wornClothes.top)?.path;
  const bottomPath = clothingInventory.bottoms.find(item => item.id === wornClothes.bottom)?.path;

  if (!modelNode) return null;

  return (
    // Bu ana grup artık sadece genel pozisyonu ayarlar, scale ve rotation içermez.
    <group 
      dispose={null} 
      position={[0, -1, 0]} 
    >
      {/* Ana Vücut Modeli, kendi dönüşüm (transform) ayarlarını alır */}
      <group
        rotation={selectedModelInfo.rotation}
        scale={selectedModelInfo.scale}
      >
        <primitive object={modelNode} castShadow receiveShadow />
      </group>
      {topPath && <ClothingItem path={topPath} />}
      {bottomPath && <ClothingItem path={bottomPath} />}

      {/* Giyilen Kıyafetler, kendi varsayılan dönüşüm ayarlarında kalır */}
    </group>
  );
};

// Modelleri ve kıyafetleri önceden yükle
useGLTF.preload(modelConfig.male.path);
//useGLTF.preload(modelConfig.female.path);
clothingInventory.tops.forEach(item => useGLTF.preload(item.path));
clothingInventory.bottoms.forEach(item => useGLTF.preload(item.path));

