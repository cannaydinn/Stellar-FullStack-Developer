# 🛍️ Sanal Deneme Kabini (Virtual Fitting Room)

Modern, blockchain tabanlı sanal deneme kabini uygulaması. Stellar ağı üzerinde güvenli ve şeffaf alışveriş deneyimi sunar.

## 📋 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kullanım](#-kullanım)
- [Smart Contract](#-smart-contract)
- [Mimari](#-mimari)
- [Gelecek Planları](#-gelecek-planları)

## 🎯 Genel Bakış

Sanal Deneme Kabini, kullanıcıların 3D ortamda kıyafetleri deneyip Stellar blockchain üzerinden güvenli bir şekilde satın almalarını sağlayan yenilikçi bir e-ticaret platformudur.

### Ana Özellikler

- **3D Görselleştirme**: Gerçekçi 3D karakter modeli ve kıyafet önizlemesi
- **Blockchain Entegrasyonu**: Stellar ağı üzerinde güvenli ödemeler
- **Cüzdan Desteği**: Freighter wallet entegrasyonu
- **Sepet Yönetimi**: Gelişmiş sepet ve ödeme sistemi
- **Modern UI/UX**: Indigo renk teması ile profesyonel arayüz

## ✨ Özellikler

### Kullanıcı Özellikleri
- ✅ 3D karakter modelinde kıyafet deneme
- ✅ Erkek cinsiyet seçeneği
- ✅ Üst ve alt giyim kategorileri
- ✅ Sepete ekleme ve sepet yönetimi
- ✅ Gerçek zamanlı XLM fiyat gösterimi
- ✅ Tek tıkla satın alma
- ✅ İşlem geçmişi ve durum bildirimleri

### Teknik Özellikler
- ✅ Blockchain tabanlı ödeme sistemi
- ✅ Smart contract entegrasyonu (Soroban)
- ✅ LocalStorage ile sepet persistance
- ✅ Responsive tasarım
- ✅ Error handling ve loading states
- ✅ TypeScript tip güvenliği

## 🛠️ Teknolojiler

### Frontend

#### Core
- **Next.js 15.1.4** - React framework
- **React 19.0.0** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **TailwindCSS** - Utility-first CSS framework

#### 3D Görselleştirme
- **Three.js (r170)** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Yardımcı Three.js bileşenleri
- **@react-three/postprocessing** - Post-processing efektleri

#### Blockchain
- **stellar-sdk** - Stellar network SDK
- **soroban-client** - Soroban smart contract client
- **@stellar/freighter-api** - Freighter wallet entegrasyonu

#### State Management & Utils
- **React Hooks** - State yönetimi
- **LocalStorage API** - Sepet persistance

### Backend / Smart Contract

- **Rust** - Smart contract dili
- **Soroban SDK 23.0.1** - Stellar smart contract framework
- **Stellar CLI 23.1.4** - Contract deployment aracı

### Development Tools

- **ESLint** - Code linting
- **Turbopack** - Hızlı bundler (Next.js 15)
- **PostCSS** - CSS processing
- **Git** - Version control


## 🚀 Kullanım

### 1. Freighter Wallet Bağlama

- Freighter eklentisini tarayıcınıza yükleyin
- Testnet moduna geçin
- "Freighter ile Bağlan" butonuna tıklayın

### 2. Kıyafet Seçimi

- Sol panelden cinsiyet seçin
- Üst ve alt giyim kategorilerinden kıyafet seçin
- 3D karakterde önizleyin

### 3. Satın Alma

**Tek Ürün:**
- Kıyafet seçin
- "Seçili Kıyafetleri Satın Al" butonuna tıklayın

**Sepet:**
- Kıyafetleri "Sepete Ekle" ile ekleyin
- "Sepeti Satın Al" ile topluca satın alın

### 4. Ödeme

- İşlem Freighter wallet'ta onaylanır
- XLM ücreti cüzdanınızdan düşülür
- Başarılı işlem bildirimi alırsınız

## 📜 Smart Contract

### Deployed Contract Bilgileri

- **Contract ID**: `CCTR33G5M5QLPD7IKFANMCRRYT6REBY4CR6UXVA5EPISXPEYT27RVPNI`
- **Deployer (Public Key)**: `GBV3DPBCSR2RWV4GGY4JMWGI4VU4A5U7B3TJA2BQ7UCZY5GQ72QGZ5DX`
- **Network**: Stellar Testnet
- **Explorer**: [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCTR33G5M5QLPD7IKFANMCRRYT6REBY4CR6UXVA5EPISXPEYT27RVPNI)

## 🏗️ Mimari

```
fitting-room/
├── fitting-room/                  # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── page.tsx           # Ana sayfa
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── globals.css        # Global stiller
│   │   ├── components/            # React bileşenleri
│   │   │   ├── FittingRoom.tsx    # Ana uygulama
│   │   │   ├── Login.tsx          # Login ekranı
│   │   │   ├── Character.tsx      # 3D karakter
│   │   │   └── ClothingItem.tsx   # Kıyafet bileşeni
│   │   └── services/              # Servis katmanı
│   │       ├── wallet.ts          # Wallet yönetimi
│   │       ├── contract.ts        # Contract entegrasyonu
│   │       ├── clothingService.ts # İş mantığı
│   │       └── paymentService.ts  # Ödeme işlemleri
│   └── public/                    # Static dosyalar
│       ├── clothes/               # 3D kıyafet modelleri (.glb)
│       └── *.glb                  # 3D karakter modelleri
│
├── fitting-room-contract/         # Smart Contract (Rust/Soroban)
    ├── src/
    │   └── lib.rs                 # Contract kodu
    ├── Cargo.toml                 # Rust dependencies
    └── target/                    # Build artifacts


```

### Veri Akışı

```
User → Login (Freighter) → FittingRoom
                              ↓
                    ClothingService ← LocalStorage
                              ↓
                    PaymentService → Stellar SDK
                              ↓
                    Contract Service → Soroban Contract
                              ↓
                    Stellar Network (Testnet)
```


## 🔮 Gelecek Planları

### Kısa Vadeli (1-3 Ay)

#### Kullanıcı Özellikleri
- [ ] **Kadın karakter modeli** ekleme
- [ ] **Boy/kilo ayarlaması** ile kişiselleştirme
- [ ] **Daha fazla kıyafet seçeneği** (10+ yeni model)
- [ ] **Renk varyasyonları** ekleme
- [ ] **Yakınlaştırma/döndürme** kontrolleri

#### Teknik İyileştirmeler
- [ ] **Mainnet deployment** (Testnet → Mainnet geçiş)
- [ ] **Performance optimizasyonu** (3D model lazy loading)
- [ ] **PWA** desteği (offline çalışma)
- [ ] **Unit testler** ekleme (Jest + React Testing Library)
- [ ] **E2E testler** (Playwright)

### Orta Vadeli (3-6 Ay)

#### Yeni Özellikler
- [ ] **Kullanıcı hesabı sistemi** (profil, geçmiş siparişler)
- [ ] **Sipariş takibi** (on-chain transaction tracking)
- [ ] **Wishlist/Favoriler** sistemi
- [ ] **Ürün yorumları** ve derecelendirme
- [ ] **Sanal deneme geçmişi** kaydetme
- [ ] **Sosyal paylaşım** (Twitter, Facebook)
- [ ] **QR kod ile hızlı ödeme**

#### AI & ML Entegrasyonu
- [ ] **AI önerileri** (kullanıcı tercihlerine göre)
- [ ] **Beden tahmini** (fotoğraftan)
- [ ] **Stil önerileri** (kombinasyon önerileri)

#### Blockchain Özellikleri
- [ ] **NFT entegrasyonu** (dijital sahiplik)
- [ ] **Sadakat puanları** (token reward sistemi)
- [ ] **Multi-chain destek** (Ethereum, Polygon)
- [ ] **DAO yönetimi** (topluluk kararları)

### Uzun Vadeli (6-12 Ay)

#### Platform Genişlemesi
- [ ] **Marka ortaklıkları** (gerçek markalarla entegrasyon)
- [ ] **Marketplace** (kullanıcılar arası ticaret)
- [ ] **Mobile app** (React Native)
- [ ] **AR özelliği** (telefonla gerçek ortamda deneme)
- [ ] **VR desteği** (sanal mağaza deneyimi)
- [ ] **Metaverse entegrasyonu**

#### Enterprise Özellikler
- [ ] **B2B panel** (marka yönetim sistemi)
- [ ] **Analytics dashboard** (satış istatistikleri)
- [ ] **Envanter yönetimi**
- [ ] **CRM entegrasyonu**
- [ ] **Toplu ödeme sistemi**

#### Ölçeklenebilirlik
- [ ] **Microservices mimarisi**
- [ ] **CDN entegrasyonu** (3D model dağıtımı)
- [ ] **Load balancing**
- [ ] **Database sharding**
- [ ] **Real-time analytics** (BigQuery, Elasticsearch)

### Araştırma & Geliştirme

- [ ] **Gerçekçi kumaş fiziği** simülasyonu
- [ ] **Photorealistic rendering** (ray tracing)
- [ ] **Sesli asistan** entegrasyonu
- [ ] **Blockchain interoperability** araştırması
- [ ] **Zero-knowledge proofs** (gizlilik)

## 📞 İletişim

- **Email**: canaydinn6@gmail.com