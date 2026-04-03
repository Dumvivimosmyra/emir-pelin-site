# Emir & Pelin - Web Sitesi

Gerçek zamanlı senkronizasyonlu, PWA destekli kişisel web uygulaması.

## Özellikler

### Kullanıcı Sistemi
- Çift kullanıcı: Emir Kağan & Pelin
- Şifre korumalı giriş
- Profil fotoğrafı yükleme, şifre değiştirme

### Mesajlaşma
- WhatsApp tarzı gerçek zamanlı mesajlaşma
- Emoji reaksiyonlar (50+ emoji, uzun bas veya sağ tıkla)
- Firebase ile anlık senkronizasyon

### Müzik
- YouTube API ile şarkı arama ve ekleme
- Masaüstünde sayfada çalma, mobilde YouTube Music'te açma
- Şarkı düzenleme (açıklama, şarkı değiştirme)

### İçerik Yönetimi
- Müzikler, Hayaller, Notlar - CRUD işlemleri
- Tüm veriler Firebase'e kaydediliyor

### Sürpriz Bölümü
- Anı Kutusu - fotoğraflı anılar, tam ekran galeri (swipe destekli)
- Sevgi Şiirleri
- Özel Günler takvimi
- Kalp Yağmuru animasyonu
- 365 günlük özel mesajlar

### PWA
- Telefona uygulama olarak kurulabilir
- Offline çalışma desteği
- Ana ekrana ekle (Android & iOS)

### Diğer
- Dark/Light tema
- Gün sayacı (07.12.2024'ten itibaren)
- Responsive tasarım

## Dosya Yapısı

```
emir-pelin-site/
├── index.html          # Ana sayfa
├── style.css           # Stiller
├── script.js           # Ana JavaScript
├── firebase-api.js     # Firebase entegrasyonu
├── youtube-music.js    # YouTube müzik sistemi
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
└── README.md
```

## Firebase Veritabanı

```json
{
  "music": [...],
  "dreams": [...],
  "notes": [...],
  "chatMessages": [...],
  "memories": [...],
  "poems": [...],
  "specialDates": [...],
  "profilePhotos": {},
  "userCredentials": {},
  "theme": "light/dark"
}
```

## Lokal Geliştirme

```bash
npx serve .
# http://localhost:3000
```

## Deploy

```bash
git add .
git commit -m "açıklama"
git push
# GitHub Pages otomatik güncellenir
```

**Versiyon**: 3.0.0  
**Son Güncelleme**: Nisan 2026  
**Durum**: Aktif geliştirme
