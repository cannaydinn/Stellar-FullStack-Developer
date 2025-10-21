import React, { useState, useEffect } from "react";
import { WalletService } from "../services/wallet"; // wallet.ts dosyanızın yolu

const ConnectWallet: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // WalletService'in singleton örneğini al
  const walletService = WalletService.getInstance();

  // Bileşen ilk yüklendiğinde cüzdanın zaten bağlı olup olmadığını kontrol et
  useEffect(() => {
    const checkWallet = async () => {
      try {
        const isConnected = await walletService.checkConnection();
        if (isConnected) {
          setPublicKey(walletService.getUserPublicKey());
        }
      } catch (e: unknown) { // <-- 1. DÜZELTME: 'any' yerine 'unknown'
        // Hatanın bir 'Error' nesnesi olup olmadığını kontrol et
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Bilinmeyen bir hata oluştu.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // freighter-api'nin yüklenmesi için kısa bir gecikme gerekebilir
    setTimeout(checkWallet, 200); 
  }, [walletService]);

  // "Cüzdan Bağla" butonuna tıklandığında
  const handleConnect = async () => {
    setError("");
    setIsLoading(true);
    try {
      const pubKey = await walletService.connect(); // 'login' işlemini tetikle
      setPublicKey(pubKey);
    } catch (e: unknown) { // <-- 2. DÜZELTME: 'any' yerine 'unknown'
      console.error(e);
      // Hatanın bir 'Error' nesnesi olup olmadığını kontrol et
      if (e instanceof Error) {
        setError(e.message || "Cüzdan bağlanamadı. Lütfen tekrar deneyin.");
      } else {
        setError("Cüzdan bağlanırken bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render (Görünüm) ---

  if (isLoading) {
    return <div>Cüzdan durumu kontrol ediliyor...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Hata: {error}</div>;
  }

  // Cüzdan bağlıysa
  if (publicKey) {
    return (
      <div>
        <p>Cüzdan Bağlı!</p>
        <p>
          Adresiniz:{" "}
          <code>{`${publicKey.substring(0, 6)}...${publicKey.substring(
            publicKey.length - 6
          )}`}</code>
        </p>
        <button 
          onClick={async () => {
            await walletService.disconnect();
            setPublicKey(null);
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Bağlantıyı Kes
        </button>
      </div>
    );
  }

  // Cüzdan bağlı değilse
  return (
    <button onClick={handleConnect} disabled={isLoading}>
      Freighter ile Bağlan
    </button>
  );
};

export default ConnectWallet;