# E & P

Emir ve Pelin için yapılmış kişisel web uygulaması. Firebase ile gerçek zamanlı senkronizasyon, PWA desteği.

**Canlı:** https://dumvivimosmyra.github.io/emir-pelin-site/

---

## Özellikler

### Bölümler
- **Ana Sayfa** — Canlı gün/saat/dk/sn sayacı, günlük mesaj (özel günlere duyarlı), istatistikler
- **Mesajlaşma** — WhatsApp tarzı gerçek zamanlı sohbet, 50+ emoji reaksiyon
- **Müzik** — YouTube API ile şarkı arama, masaüstünde sayfada çalma, mobilde YouTube Music'e açma
- **Hayaller** — Paylaşılan hayal listesi, CRUD
- **Notlar** — Kişisel notlar, CRUD
- **Profil** — Fotoğraf yükleme, tema seçimi, şifre değiştirme
- **Anılar** — Fotoğraflı anı kutusu (tam ekran galeri, swipe), şiirler, özel günler takvimi

### Tema Sistemi
4 tema, profil sayfasından seçilir, Firebase'e kaydedilir:
- 🌸 **Sakura** — Açık pembe, düşen partikül animasyonu
- 🌿 **Forest** — Koyu yeşil, köşe dekorasyonu
- 🌌 **Cosmos** — Lacivert/mor, yıldız ve partikül animasyonu
- 🤍 **Minimal** — Beyaz/gri, animasyon yok

### PWA
- Telefona uygulama olarak kurulabilir (Android: Chrome → Ana ekrana ekle, iOS: Safari → Paylaş → Ana Ekrana Ekle)
- Offline çalışma (service worker cache)
- Tam ekran standalone mod

### Firebase
- Realtime Database ile gerçek zamanlı senkronizasyon
- Tüm veriler iki cihaz arasında anlık paylaşılır
- Offline backup: localStorage fallback

---

## Dosya Yapısı

```
emir-pelin-site/
├── index.html              # UI
├── style.css               # Stiller + 4 tema
├── script.js               # Ana mantık
├── firebase-api.js         # Firebase senkronizasyon
├── youtube-music.js        # YouTube müzik sistemi
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # PWA manifest
├── OneSignalSDKWorker.js   # Bildirim altyapısı (hazır, aktif değil)
└── firebase-messaging-sw.js
```

---

## Geliştirme

```bash
# Lokal test
npx serve .
# → http://localhost:3000

# Deploy
git add .
git commit -m "açıklama"
git push
# GitHub Pages otomatik güncellenir (~1-2 dk)
```

---

## Firebase Veritabanı Yapısı

```
music[]         → şarkılar (videoId, title, description)
dreams[]        → hayaller
notes[]         → notlar
chatMessages[]  → mesajlar (reactions dahil)
memories[]      → anılar (base64 fotoğraf)
poems[]         → şiirler
specialDates[]  → özel günler
profilePhotos{} → profil fotoğrafları (base64)
userCredentials{} → şifreler
theme           → aktif tema
```

---

**Versiyon:** 4.0.0  
**Son Güncelleme:** Nisan 2026
