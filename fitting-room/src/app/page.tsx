// app/page.tsx (veya sizin ana sayfa dosyanız)

"use client";
import React, { useState, useEffect } from 'react';
import { WalletService } from "../services/wallet"; // wallet.ts dosyanızın yolu
import Login from '../components/Login'; // Login.tsx dosyanızın yolu
import FittingRoom from '../components/FittingRoom'; // FittingRoom.tsx dosyanızın yolu

export default function Page() {
  
  // Cüzdan state'lerini burada yönetiyoruz
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // WalletService'in singleton örneğini al
  const walletService = WalletService.getInstance();

  // Bağlantı Kontrolü (Sayfa yüklendiğinde)
  useEffect(() => {
    const checkWallet = async () => {
      try {
        const isConnected = await walletService.checkConnection();
        if (isConnected) {
          setPublicKey(walletService.getUserPublicKey());
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Bilinmeyen bir hata oluştu.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    setTimeout(checkWallet, 200); // freighter-api'nin yüklenmesi için
  }, [walletService]); // walletService değişmeyeceği için bu effect bir kez çalışır

  // Cüzdan Bağlama Fonksiyonu
  const handleConnect = async () => {
    setError("");
    setIsLoading(true);
    try {
      const pubKey = await walletService.connect(); // 'login' işlemini tetikle
      setPublicKey(pubKey);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message || "Cüzdan bağlanamadı. Lütfen tekrar deneyin.");
      } else {
        setError("Cüzdan bağlanırken bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await walletService.disconnect();
    setPublicKey(null);
    setError("");
  };


  // --- RENDER MANTIĞI ---

  // 1. Yükleniyor...
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        <div>Cüzdan durumu kontrol ediliyor...</div>
      </div>
    );
  }

  // 2. Cüzdan bağlıysa -> FittingRoom'u göster
  //    publicKey'i prop olarak gönder
  if (publicKey) {
    return <FittingRoom publicKey={publicKey} handleDisconnect={handleDisconnect} />;
  }

  // 3. Cüzdan bağlı DEĞİLSE -> Login ekranını göster
  //    Gerekli fonksiyon ve state'leri prop olarak gönder
  return (
    <Login 
      handleConnect={handleConnect} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}