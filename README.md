# E & P — Kişisel Web Uygulaması

Emir ve Pelin için geliştirilmiş, Firebase destekli, PWA uyumlu, AI entegrasyonlu kişisel web uygulaması.

**Canlı:** https://dumvivimosmyra.github.io/emir-pelin-site/  
**Stack:** Vanilla HTML/CSS/JS · Firebase Realtime DB · YouTube API · Groq AI (Llama 3.1) · PWA

---

## Dosya Yapısı

```
emir-pelin-site/
├── index.html              # SPA — tüm UI
├── style.css               # Stiller + 4 tema sistemi + animasyonlar
├── script.js               # Ana uygulama mantığı
├── firebase-api.js         # Firebase senkronizasyon
├── youtube-music.js        # YouTube müzik sistemi
├── gemini.js               # Groq AI — Keşfet & Merak
├── quiz.js                 # Quiz sistemi — birbirini tanıma
├── tarcin.js               # Tarçın AI kedi asistanı
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # PWA manifest
└── OneSignalSDKWorker.js   # Bildirim altyapısı (hazır, aktif değil)
```

---

## Özellikler

### Navigasyon (4 sekme)
- **Ana** — Canlı sayaç (gün/saat/dk/sn), günlük mesaj, istatistikler
- **Köşemiz** — Hub grid: Müzik, Notlar, Hayaller, Anılar, Mektup, Quiz, Şiirler, Özel Günler
- **Mesaj** — WhatsApp tarzı gerçek zamanlı sohbet, 50+ emoji reaksiyon
- **Birlikte** — Hub grid: Duygu, Alışkanlık, Hedef, Keşfet & Merak

### Müzik Sistemi (`youtube-music.js`)
- YouTube Data API v3 ile şarkı arama
- Masaüstünde sayfada arka planda çalma (gizli IFrame player)
- Mobilde YouTube Music uygulamasına yönlendirme
- Mini player (nav üstünde, durdurulabilir)
- Şarkı düzenleme: açıklama + farklı şarkı seçme

### Mesajlaşma
- Firebase Realtime DB ile anlık senkronizasyon
- Emoji reaksiyonlar (uzun bas / sağ tıkla, 50+ emoji)
- Enter ile gönder, Shift+Enter yeni satır

### Köşemiz Bölümleri
- **Anılar** — Fotoğraflı anı kutusu, tam ekran galeri (swipe + klavye)
- **Şiirler** — Emir yazar, ikisi okur
- **Özel Günler** — Gelecek tarihler, geri sayım, müzik bağlama, tamamlanınca anı ekleme
- **Quiz** — Birbirini tanıma: profil doldurma (renkler, yemekler, istekler vb.), soru sor/cevapla, puan sistemi
- **Mektup** — Zaman kapsülü: yaz, açılma tarihi belirle, zarf animasyonu, kağıt efekti

### Birlikte Bölümleri
- **Duygu** — Küre sistemi, renk geçişleri (maks 3 duygu), arşiv
- **Alışkanlık** — Streak takibi, 30 günlük takvim görünümü
- **Hedef** — Müzik bağlama, tamamlanınca kutlama + konfeti + anı ekleme
- **Keşfet & Merak** — Groq AI ile INTP/INFP kişilik bazlı sorular, bilgi/yorum tipi, geçmiş

### Tarçın (AI Kedi Asistanı) (`tarcin.js`)
- CSS SVG kedi: oturan, uyuyan, gözleri kırpan, kuyruk sallayan animasyonlar
- Groq API (Llama 3.1) ile sohbet
- Projedeki verileri biliyor (müzik, duygular, alışkanlıklar, hedefler)
- Alışkanlık hatırlatması, hedef uyarısı, duygu analizi
- Sağ altta sabit, arada baloncuk çıkarır

### Tema Sistemi
4 tema, profil sayfasından seçilir, **kişiye özel** kaydedilir:

| Tema | Renkler | Animasyon |
|------|---------|-----------|
| 🌸 Sakura | Pembe/Krem | Düşen çiçek partikülleri |
| 🌿 Forest | Koyu Yeşil | Köşe dekorasyonu + yaprak |
| 🌌 Cosmos | Lacivert/Mor | Yıldızlar + partiküller |
| 🤍 Minimal | Beyaz/Gri | Kalp yağmuru (yağmur modunda) |

Yağmur modu: her 60 saniyede 7 saniyelik yoğun animasyon.

### PWA
- Telefona uygulama olarak kurulabilir
- Offline çalışma (service worker cache)
- Android: Chrome → Ana ekrana ekle
- iOS: Safari → Paylaş → Ana Ekrana Ekle

### Firebase
- Realtime Database, gerçek zamanlı senkronizasyon
- Offline-first: localStorage fallback
- Proje: `emir-pelin-site-d4508`

---

## Firebase Veri Yapısı

```
music[]             → şarkılar (videoId, title, description, thumbnail)
dreams[]            → hayaller
notes[]             → notlar
chatMessages[]      → mesajlar (reactions dahil)
memories[]          → anılar (base64 fotoğraf)
poems[]             → şiirler
specialDates[]      → özel günler
profilePhotos{}     → profil fotoğrafları (base64)
userCredentials{}   → şifreler
theme_emir          → Emir'in teması
theme_pelin         → Pelin'in teması
emotionEntries[]    → duygu kayıtları
habitList[]         → alışkanlık tanımları
habitLogs[]         → günlük işaretlemeler
goalList[]          → hedefler
quizQuestions[]     → quiz soruları
quizProfile_emir{}  → Emir'in profil cevapları
quizProfile_pelin{} → Pelin'in profil cevapları
letterList[]        → mektuplar
kesfeHistory[]      → Keşfet & Merak geçmişi
```

---

## API Anahtarları

```js
// YouTube Data API v3
YT_API_KEY = 'AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU'

// Groq AI (Llama 3.1-8b-instant)
GROQ_API_KEY = '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'
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
# GitHub Pages ~1-2 dk güncellenir
```

---

## Z-Index Hiyerarşisi

```
Tema partikülleri:  0
Normal içerik:      1
Full page:          9000
Modallar:           9500
Zarf overlay:       9600
```

---

**Versiyon:** 5.0.0  
**Son Güncelleme:** Nisan 2026  
**Durum:** Aktif geliştirme
