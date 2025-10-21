// components/Login.tsx (veya sizin dosya yapınıza göre)

"use client";
import React from 'react';

// Bu bileşenin dışarıdan alacağı özellikleri (props) tanımlıyoruz
interface LoginProps {
  handleConnect: () => Promise<void>;
  isLoading: boolean;
  error: string;
}

const Login: React.FC<LoginProps> = ({ handleConnect, isLoading, error }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-indigo-900">
      <div className="w-full max-w-md mx-4">
        {/* Ana Kart */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8 space-y-6">
          {/* Logo/İkon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <svg className="w-10 h-10 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          {/* Başlık */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Sanal Deneme Kabini
            </h1>
            <p className="text-gray-400 text-sm">
              Stellar blockchain üzerinde güvenli alışveriş deneyimi
            </p>
          </div>

          {/* Bilgi Kutusu */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-gray-300 text-sm text-center">
              Devam etmek için <span className="text-indigo-400 font-semibold">Freighter</span> cüzdanınızı bağlayın
            </p>
          </div>

          {/* Bağlan Butonu */}
          <button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bağlanıyor...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Freighter ile Bağlan
              </span>
            )}
          </button>

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-shake">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-400 font-semibold text-sm">Bağlantı Hatası</p>
                  <p className="text-red-300 text-xs mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alt Bilgi */}
          <div className="text-center pt-4 border-t border-gray-700/50">
            <p className="text-gray-500 text-xs">
              Freighter yüklü değil mi?{' '}
              <a 
                href="https://www.freighter.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Buradan indir
              </a>
            </p>
          </div>
        </div>

        {/* Alt Dekoratif Metin */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Powered by <span className="text-indigo-400 font-semibold">Stellar Network</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;