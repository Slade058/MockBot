# 🤖 MockBot

**MockBot** — React ile geliştirilmiş, üç farklı kişilikli karakterle sohbet edebileceğin eğlenceli ve akıllı bir chat simülatörü.

![MockBot Preview](src/assets/hero.png)

---

## ✨ Özellikler

- **3 Benzersiz Karakter**
  - 🏴‍☠️ **Kaptan Kanca** — Öfkeli, espirili bir korsan
  - 🤖 **R0-B0T** — Kafası karışık, hatalı bir robot
  - 🐸 **Kurbağa Pepe** — Sadece emoji ile konuşan sessiz kurbağa

- **Akıllı Cevap Motoru**
  - Matematiksel hesaplamalar (4 işlem, yüzde, KDV, karekök, üs)
  - Birim dönüşümleri (km/mil, kg/lb, cm/inç, °C/°F)
  - Gerçek zamanlı saat & tarih sorguları
  - Matematiksel sabitler (π, e, altın oran)

- **🌍 İki Dil Desteği** — Türkçe ve İngilizce arasında anlık geçiş

- **Typewriter Efekti** — Bot cevapları harfi harfine yazılır

- **Retro Ses Efektleri** — Her karakterin kendine özgü sesi (Web Audio API)

- **Tekrar Algılama** — Aynı mesajı tekrar gönderince karakterler fark eder

- **Mobil Uyumlu** — Responsive tasarım, mobilde sidebar menü

---

## 🛠️ Teknolojiler

| Araç | Versiyon |
|------|----------|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 |
| oxlint | 1.79 |

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build al
npm run build

# Build'i önizle
npm run preview
```

---

## 📁 Proje Yapısı

```
MockBot/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── App.tsx        # Tüm uygulama mantığı
│   ├── index.css      # Global stiller
│   └── main.tsx       # Uygulama giriş noktası
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎮 Kullanım

1. Sol panelden bir karakter seç (Korsan, Robot veya Kurbağa)
2. Mesaj kutusuna yaz ve **Enter**'a bas ya da gönder butonuna tıkla
3. Sağ üstteki **TR / EN** butonuyla dil değiştir
4. Çöp kutusu ikonuyla sohbet geçmişini temizle

### 💡 Akıllı Sorgular

| Sorgu Türü | Örnek |
|------------|-------|
| Matematik | `5 + 3 * 2`, `karekök 144`, `2^10` |
| Yüzde | `200'ün %18'i`, `18% of 200` |
| KDV | `1000 TL %18 KDV` |
| Birim | `100 km kaç mil`, `30°C to F` |
| Saat | `saat kaç`, `what time is it` |
| Tarih | `bugün hangi gün`, `what's today's date` |

---

## 📄 Lisans

MIT License — dilediğin gibi kullanabilirsin.
