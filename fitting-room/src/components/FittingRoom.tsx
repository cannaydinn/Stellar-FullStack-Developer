"use client";
import { Character } from '@/components/Character';
import { ContactShadows, PresentationControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import React, { useState, Suspense } from 'react';
import { ClothingService, ClothingItem } from '../services/clothingService';

// Vücut ağırlığı ayarları kaldırıldı - şimdilik sabit değer kullanılıyor

function FittingRoomScene() {
  return (
    <>
      {/* Genel ortam aydınlatması - daha yumuşak */}
      <ambientLight intensity={0.8} />
      
      {/* Ana ışık - daha yumuşak ve doğal */}
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Dolgu ışığı - gölgeleri yumuşatır */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
      />
      
      {/* Zemindeki yumuşak gölgeler */}
      <ContactShadows
        resolution={1024}
        scale={6}
        position={[0, -1, 0]}
        blur={1.2}
        opacity={0.5}
        far={10}
      />
      
      {/* Arka duvar - zeminden tavana kadar */}
      <mesh position={[0, 1.75, -2.5]} castShadow receiveShadow>
        <planeGeometry args={[5, 5.5]} />
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.8}
        />
      </mesh>
      
      {/* Arka duvar çerçevesi - üst */}
      <mesh position={[0, 3.5, -2.48]}>
        <boxGeometry args={[5.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>
      
      {/* Arka duvar çerçevesi - sol */}
      <mesh position={[-2.55, 1.75, -2.48]}>
        <boxGeometry args={[0.15, 5.5, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>
      
      {/* Arka duvar çerçevesi - sağ */}
      <mesh position={[2.55, 1.75, -2.48]}>
        <boxGeometry args={[0.15, 5.5, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>
      
      {/* Sol duvar - zeminden tavana kadar */}
      <mesh position={[-2.5, 1.75, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[5, 5.5]} />
        <meshStandardMaterial 
          color="#fafafa"
          roughness={0.8}
        />
      </mesh>

      {/* Sol duvar çerçevesi - üst */}
      <mesh position={[-2.48, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#fafafa" roughness={0.8} />
      </mesh>

      {/* Sağ duvar - zeminden tavana kadar */}
      <mesh position={[2.5, 1.75, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[5, 5.5]} />
        <meshStandardMaterial 
          color="#fafafa"
          roughness={0.8}
        />
      </mesh>

      {/* Sağ duvar çerçevesi - üst */}
      <mesh position={[2.48, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[5.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#fafafa" roughness={0.8} />
      </mesh>

      {/* Parke zemin - ana taban */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial 
          color="#8B6F47"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Parke tahtaları - dikey uzun tahtalar */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={`parke-v-${i}`}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[-2 + i * 0.57, -0.99, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.55, 5]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#9B7E5C" : "#8B6F47"}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
      ))}
      
      {/* Parke arası derz çizgileri - koyu çizgiler */}
      {[...Array(9)].map((_, i) => (
        <mesh 
          key={`derz-${i}`}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[-2.285 + i * 0.57, -0.98, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.02, 5]} />
          <meshStandardMaterial 
            color="#5C4A3A"
            roughness={1}
          />
        </mesh>
      ))}
      
      {/* Ahşap damarları - yatay ince çizgiler (rastgele) */}
      {[...Array(20)].map((_, i) => {
        const randomX = -2 + Math.random() * 4;
        const randomZ = -2 + Math.random() * 4;
        const randomWidth = 0.3 + Math.random() * 0.4;
        return (
          <mesh 
            key={`damar-${i}`}
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[randomX, -0.975, randomZ]}
            receiveShadow
          >
            <planeGeometry args={[randomWidth, 0.008]} />
            <meshStandardMaterial 
              color="#6B5338"
              roughness={0.95}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
      
      {/* Tavan - kabin hissi için */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.7}
        />
      </mesh>
      
      {/* Tavan lambası efekti */}
      <pointLight position={[0, 3.2, 0]} intensity={1.5} color="#fffaee" />
      
      {/* Kiriş - arka duvar üstü */}
      <mesh position={[0, 4.45, -2.45]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - sol duvar üstü */}
      <mesh position={[-2.45, 4.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - sağ duvar üstü */}
      <mesh position={[2.45, 4.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - ön duvar üstü */}
      <mesh position={[0, 4.45, 2.45]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - arka duvar altı */}
      <mesh position={[0, -0.95, -2.45]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - sol duvar altı */}
      <mesh position={[-2.45, -0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - sağ duvar altı */}
      <mesh position={[2.45, -0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Kiriş - ön duvar altı */}
      <mesh position={[0, -0.95, 2.45]}>
        <boxGeometry args={[5, 0.1, 0.15]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Ön duvar - yarı şeffaf cam, zeminden tavana */}
      <mesh position={[0, 1.75, 2.5]} castShadow receiveShadow>
        <planeGeometry args={[5, 5.5]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      
      {/* Ön duvar çerçevesi - sol */}
      <mesh position={[-2.55, 1.75, 2.48]}>
        <boxGeometry args={[0.15, 5.5, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>
      
      {/* Ön duvar çerçevesi - sağ */}
      <mesh position={[2.55, 1.75, 2.48]}>
        <boxGeometry args={[0.15, 5.5, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>
      
      {/* Ön duvar çerçevesi - üst */}
      <mesh position={[0, 3.5, 2.48]}>
        <boxGeometry args={[5.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>
      
      {/* Ek aydınlatma - önden */}
      <directionalLight
        position={[0, 2, 4]}
        intensity={0.8}
        color="#ffffff"
      />
      
      {/* ASKILIK SİSTEMİ - Arka Duvar */}
      
      {/* Ana askılık paneli - ahşap arka panel */}
      <mesh position={[0, 1.0, -2.42]}>
        <boxGeometry args={[3.5, 1.2, 0.08]} />
        <meshStandardMaterial 
          color="#8B6F47"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Askılık çerçevesi - üst */}
      <mesh position={[0, 1.6, -2.38]}>
        <boxGeometry args={[3.6, 0.08, 0.12]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Askılık çerçevesi - alt */}
      <mesh position={[0, 0.4, -2.38]}>
        <boxGeometry args={[3.6, 0.08, 0.12]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Askılık çerçevesi - sol */}
      <mesh position={[-1.75, 1.0, -2.38]}>
        <boxGeometry args={[0.08, 1.28, 0.12]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Askılık çerçevesi - sağ */}
      <mesh position={[1.75, 1.0, -2.38]}>
        <boxGeometry args={[0.08, 1.28, 0.12]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Metal askı çubukları - 3 sıra */}
      {/* Üst sıra - 6 kanca */}
      {[...Array(6)].map((_, i) => (
        <group key={`hook-top-${i}`} position={[-1.4 + i * 0.56, 1.5, -2.35]}>
          {/* Kanca gövdesi */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Kanca ucu - vidalı görünüm */}
          <mesh position={[0, -0.05, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
      
      {/* Orta sıra - 6 kanca */}
      {[...Array(6)].map((_, i) => (
        <group key={`hook-mid-${i}`} position={[-1.4 + i * 0.56, 1.0, -2.35]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.05, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
      
      {/* Alt sıra - 6 kanca */}
      {[...Array(6)].map((_, i) => (
        <group key={`hook-bot-${i}`} position={[-1.4 + i * 0.56, 0.5, -2.35]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.05, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
      
      {/* Dekoratif metal şeritler - dikey */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`stripe-${i}`} position={[-1.05 + i * 1.05, 1.0, -2.37]}>
          <boxGeometry args={[0.015, 1.1, 0.02]} />
          <meshStandardMaterial 
            color="#8B7355"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
      
    </>
  );
}

export type Gender = 'male' ;
// export type Gender = 'male' | 'female';

const clothingInventory = {
  tops: [
    { 
      id: 'sweatshirt', 
      name: 'Sweatshirt', 
      path: '/clothes/ust_kiyafet1.glb',
      price: '5',
      category: 'top' as const
    },
  ],
  bottoms: [
    { 
      id: 'sweatpants', 
      name: 'Eşofman Altı', 
      path: '/clothes/alt_kiyafet1.glb',
      price: '5',
      category: 'bottom' as const
    },
  ],
};

interface FittingRoomProps {
  publicKey: string;
  handleDisconnect: () => void;
}

const FittingRoom: React.FC<FittingRoomProps> = ({ publicKey, handleDisconnect}) => {
  const [selectedGender, setSelectedGender] = useState<Gender>('male');
  const [wornClothes, setWornClothes] = useState<{top: string | null, bottom: string | null}>({
    top: null,
    bottom: null,
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string>("");
  const [basketCount, setBasketCount] = useState(0);
  const [basketItems, setBasketItems] = useState<(ClothingItem & { quantity: number })[]>([]);

  const clothingService = ClothingService.getInstance();

  // Update basket count and items when component mounts or basket changes
  React.useEffect(() => {
    const updateBasketData = () => {
      const count = clothingService.getBasketItemCount();
      const items = clothingService.getBasketItems();
      setBasketCount(count);
      setBasketItems(items);
    };
    
    updateBasketData();
    
    // Listen for storage changes (when basket is updated in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fitting_room_basket') {
        updateBasketData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [clothingService]);

  const handleWear = (category: 'top' | 'bottom', itemId: string) => {
    setWornClothes(prev => ({
      ...prev,
      [category]: prev[category] === itemId ? null : itemId,
    }));
  };
  
  const handlePurchase = async () => {
    setIsPurchasing(true);
    setPurchaseMessage("");
    
    try {
      const selectedItems: ClothingItem[] = [];
      
      if (wornClothes.top) {
        const topItem = clothingInventory.tops.find(item => item.id === wornClothes.top);
        if (topItem) selectedItems.push(topItem);
      }
      
      if (wornClothes.bottom) {
        const bottomItem = clothingInventory.bottoms.find(item => item.id === wornClothes.bottom);
        if (bottomItem) selectedItems.push(bottomItem);
      }

      if (selectedItems.length === 0) {
        setPurchaseMessage("Lütfen satın almak için bir kıyafet seçin.");
        return;
      }

      let successCount = 0;
      for (const item of selectedItems) {
        const success = await clothingService.purchaseClothing(item);
        if (success) successCount++;
      }

      if (successCount === selectedItems.length) {
        setPurchaseMessage("Satın alma işlemi başarılı!");
      } else {
        setPurchaseMessage("Bazı kıyafetler satın alınamadı.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchaseMessage("Satın alma işleminde hata oluştu.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePurchaseBasket = async () => {
    setIsPurchasing(true);
    setPurchaseMessage("");
    
    try {
      const result = await clothingService.purchaseBasket();
      setPurchaseMessage(result.message);
      
      if (result.success) {
        // Update basket count after successful purchase
        setBasketCount(0);
      }
    } catch (error) {
      console.error("Basket purchase error:", error);
      setPurchaseMessage("Sepet satın alma işleminde hata oluştu.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleAddToBasket = async () => {
    try {
      const selectedItems: ClothingItem[] = [];
      
      if (wornClothes.top) {
        const topItem = clothingInventory.tops.find(item => item.id === wornClothes.top);
        if (topItem) selectedItems.push(topItem);
      }
      
      if (wornClothes.bottom) {
        const bottomItem = clothingInventory.bottoms.find(item => item.id === wornClothes.bottom);
        if (bottomItem) selectedItems.push(bottomItem);
      }

      if (selectedItems.length === 0) {
        setPurchaseMessage("Lütfen sepete eklemek için bir kıyafet seçin.");
        return;
      }

      for (const item of selectedItems) {
        await clothingService.addToBasket(item);
      }

      // Update basket count after adding items
      const newCount = clothingService.getBasketItemCount();
      const newItems = clothingService.getBasketItems();
      setBasketCount(newCount);
      setBasketItems(newItems);
      
      setPurchaseMessage("Kıyafetler sepete eklendi!");
    } catch (error) {
      console.error("Basket error:", error);
      setPurchaseMessage("Sepete ekleme işleminde hata oluştu.");
    }
  };

  const handleRemoveFromBasket = async (itemId: string) => {
    try {
      const success = await clothingService.removeFromBasket(itemId);
      if (success) {
        // Update basket data
        const newCount = clothingService.getBasketItemCount();
        const newItems = clothingService.getBasketItems();
        setBasketCount(newCount);
        setBasketItems(newItems);
        
        setPurchaseMessage("Ürün sepetten çıkarıldı!");
    } else {
        setPurchaseMessage("Ürün sepetten çıkarılamadı.");
      }
    } catch (error) {
      console.error("Remove from basket error:", error);
      setPurchaseMessage("Sepetten çıkarma işleminde hata oluştu.");
    }
  };

  
  const bodyWeightForModel = 0; // Default normal weight

  const buttonStyle = (gender: Gender) => 
    `px-4 py-2 rounded-lg transition-colors w-full ${
      selectedGender === gender 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;

  return (
    <div className='h-screen w-screen flex flex-col bg-gray-900 text-white'>
      {/* SOL PANEL */}
      <div className='absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm p-4 rounded-lg w-72'>
        <h2 className='font-bold text-lg mb-3 border-b border-gray-600 pb-2'>Model Seçimi</h2>
        <div className='flex justify-between gap-2 mb-4'>
          <button onClick={() => setSelectedGender('male')} className={buttonStyle('male')}>
            Erkek
          </button>
          {/* FEMALE KARAKTER
          <button onClick={() => setSelectedGender('female')} className={buttonStyle('female')}>
            Kadın
          </button>
          */}
        </div>
        
        {/* VÜCUT ÖLÇÜLERİ AYARLAMA ALANI
        <h2 className='font-bold text-lg mb-3 border-b border-gray-600 pb-2'>Vücut Ölçüleri</h2>
        <div className='mb-2'>
          <label className='block mb-1'>Kilonuzu Girin (kg):</label>
          <input 
            type="number" min={MIN_WEIGHT} max={MAX_WEIGHT}
            value={userWeight} onChange={(e) => setUserWeight(parseFloat(e.target.value))} 
            className='w-full p-2 rounded bg-gray-700 text-white'
          />
          <input
            type="range" min={MIN_WEIGHT} max={MAX_WEIGHT} step="1"
            value={userWeight} onChange={(e) => setUserWeight(parseFloat(e.target.value))}
            className="w-full mt-2 cursor-pointer"
          />
        </div>
        */}
      </div>

      {/* SAĞ PANEL */}
      <div className='absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm p-4 rounded-lg w-72'>
        <div className='mb-4 pb-4 border-b border-gray-600'>
          <div className="flex justify-between items-center">
          <p className="font-semibold">Cüzdan Bağlı!</p>
            <button 
              onClick={handleDisconnect}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              (Çıkış Yap)
            </button>
          </div>
          <p>
            <code className="text-sm text-gray-400">{`${publicKey.substring(0, 8)}...${publicKey.substring(
              publicKey.length - 8
            )}`}</code>
          </p>
        </div>
        
        <h2 className='font-bold text-lg mb-3 border-b border-gray-600 pb-2'>Kıyafetler</h2>
        <h3 className='font-semibold text-md mb-2'>Üst Giyim</h3>
        <div className='grid grid-cols-2 gap-2 mb-4'>
          {clothingInventory.tops.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleWear('top', item.id)}
              className={`p-2 rounded-lg transition-colors ${
                wornClothes.top === item.id 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <h3 className='font-semibold text-md mb-2'>Alt Giyim</h3>
        <div className='grid grid-cols-2 gap-2'>
          {clothingInventory.bottoms.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleWear('bottom', item.id)}
              className={`p-2 rounded-lg transition-colors ${
                wornClothes.bottom === item.id 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <button 
          className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-500 transition-colors shadow-sm"
          onClick={handlePurchase}
          disabled={isPurchasing}
        >
          {isPurchasing ? "Satın Alınıyor..." : "Seçili Kıyafetleri Satın Al"}
        </button>
        <button 
          className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          onClick={handleAddToBasket}
        >
             Sepete Ekle
        </button>
        {basketCount > 0 && (
          <button 
            className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-500 transition-colors shadow-sm"
            onClick={handlePurchaseBasket}
            disabled={isPurchasing}
          >
            {isPurchasing ? "Sepet Satın Alınıyor..." : `Sepeti Satın Al (${basketCount} ürün)`}
          </button>
        )}
        {purchaseMessage && (
          <div className={`mt-2 p-2 rounded text-sm ${
            purchaseMessage.includes("başarılı") || purchaseMessage.includes("eklendi") 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {purchaseMessage}
          </div>
        )}

        {/* Sepet İçeriği */}
        {basketItems.length > 0 && (
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-sm mb-2 text-white">Sepet İçeriği</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {basketItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-600/50 p-2 rounded">
                  <div className="flex-1">
                    <span className="text-xs text-white">{item.name}</span>
                    <span className="text-xs text-gray-300 ml-2">x{item.quantity}</span>
                    <span className="text-xs text-indigo-400 ml-2">{item.price} XLM</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFromBasket(item.id)}
                    className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors shadow-sm"
                    title="1 adet çıkar"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-300">
              Toplam: {basketItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2)} XLM
            </div>
          </div>
        )}

      </div>


      <div className='grow' style={{ backgroundColor: '#e5e5e5' }}>
        <Canvas shadows camera={{ position: [0, 0.8, 3.5], fov: 45 }}>
          
          {/* Prova Kabini Sahnesi */}
          <FittingRoomScene />
          <Suspense fallback={null}>
            {/* Karakter kontrolleri - döndürme ve yakınlaştırma */}
            <PresentationControls
              global
              speed={2.5}
              zoom={0.9}
              rotation={[0, 0, 0]}
              polar={[-0, 0]}
              azimuth={[-Infinity, Infinity]}
            >
              <Character 
                gender={selectedGender}
                bodyWeight={bodyWeightForModel}
                wornClothes={wornClothes} 
              />
            </PresentationControls>
          </Suspense>

          {/* Görsel efektler - daha yumuşak */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.9} intensity={0.3} mipmapBlur />
            <ToneMapping />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

export default FittingRoom;