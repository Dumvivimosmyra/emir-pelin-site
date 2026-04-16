# E & P — Kişisel Web Uygulaması

Emir ve Pelin için geliştirilmiş, Firebase destekli, PWA uyumlu kişisel web uygulaması.

**Canlı URL:** https://dumvivimosmyra.github.io/emir-pelin-site/  
**Teknoloji:** Vanilla HTML/CSS/JS + Firebase Realtime Database + YouTube Data API v3  
**Hosting:** GitHub Pages (ücretsiz, HTTPS)

---

## Proje Genel Bakış

İki kullanıcı (Emir ve Pelin) arasında paylaşılan özel bir alan. Mesajlaşma, müzik listesi, anı kutusu, hayaller, notlar, şiirler ve özel günler gibi içerikleri gerçek zamanlı olarak paylaşmalarını sağlar. Tamamen ücretsiz altyapı üzerinde çalışır.

---

## Dosya Yapısı

```
emir-pelin-site/
├── index.html              # Tek sayfa uygulama (SPA) — tüm UI burada
├── style.css               # Tüm stiller, 4 tema sistemi, animasyonlar
├── script.js               # Ana uygulama mantığı (~2500 satır)
├── firebase-api.js         # Firebase Realtime Database entegrasyonu
├── youtube-music.js        # YouTube Data API v3 müzik sistemi
├── sw.js                   # Service Worker (PWA, offline cache)
├── manifest.json           # PWA manifest (uygulama adı, ikon, renk)
├── OneSignalSDKWorker.js   # Bildirim altyapısı (hazır, aktif değil)
├── firebase-messaging-sw.js # Firebase Messaging SW (hazır, aktif değil)
├── firebase.json           # Firebase CLI konfigürasyonu
├── .firebaserc             # Firebase proje bağlantısı
└── functions/
    └── index.js            # Firebase Cloud Functions (deploy edilmedi)
```

---

## Kullanıcı Sistemi

- **İki kullanıcı:** Emir Kağan ve Pelin
- **Giriş:** Kullanıcı seçimi + şifre (varsayılan: `123456`)
- **Şifreler:** localStorage'da saklanıyor, Firebase'e de senkronize ediliyor
- **Oturum:** localStorage'da `currentUser` key'i ile tutulur, sayfa yenilenince otomatik giriş yapılır
- **Profil fotoğrafı:** Base64 olarak localStorage + Firebase'e kaydedilir, canvas ile 200x200px'e crop edilir

---

## Navigasyon Yapısı

Alt navigasyonda 4 ana sekme:

### 🏠 Ana Sayfa
- Canlı sayaç: 07.12.2024'ten itibaren gün/saat/dakika/saniye (her saniye güncellenir)
- Günlük mesaj: 365 günlük mesaj listesi, özel günlere duyarlı (14 Şubat, 8 Mart, 1 Ocak vb.)
- İstatistik kutuları: Müzik/Hayal/Not sayıları, tıklayınca ilgili bölüm açılır

### 📚 Köşemiz
Hub grid yapısı, 8 kart:
- **Müzik** — YouTube API ile şarkı arama ve oynatma
- **Notlar** — Kişisel notlar, CRUD
- **Hayaller** — Paylaşılan hayaller listesi, CRUD
- **Anılar** — Fotoğraflı anı kutusu, tam ekran galeri
- **Mektup** — Yakında (placeholder)
- **Quiz** — Yakında (placeholder)
- **Şiirler** — Emir yazar, ikisi okur
- **Özel Günler** — Gelecek tarihler takvimi

### 💬 Mesaj
- WhatsApp tarzı gerçek zamanlı mesajlaşma
- Firebase Realtime Database ile anlık senkronizasyon
- 50+ emoji reaksiyon (uzun bas veya sağ tıkla)
- Enter ile gönder, Shift+Enter yeni satır

### 🌱 Birlikte
Hub grid yapısı, 3 kart (hepsi yakında):
- **Duygu** — Günlük duygu takibi
- **Alışkanlık** — Ortak alışkanlık takibi
- **Hedef** — Ortak hedefler

---

## Tema Sistemi

Profil sayfasından seçilir, Firebase'e kaydedilir, her iki cihazda senkronize olur.

### 4 Tema

| Tema | Renkler | Animasyon |
|------|---------|-----------|
| 🌸 Sakura | Pembe/Krem | Düşen çiçek partikülleri |
| 🌿 Forest | Koyu Yeşil | Köşe dekorasyonu + yaprak partiküller |
| 🌌 Cosmos | Lacivert/Mor | Yıldızlar + parlayan partiküller |
| 🤍 Minimal | Beyaz/Gri | Yok (sade) |

**Yağmur Modu:** Her 60 saniyede bir 7 saniyelik yoğun animasyon tetiklenir. Minimal temada küçük kalpler düşer.

**CSS Değişkenleri:** Her tema `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--text-primary`, `--text-secondary`, `--border-color`, `--accent-color`, `--accent-hover`, `--accent-gradient`, `--shadow`, `--shadow-hover`, `--login-bg`, `--particle-color` değişkenlerini override eder. Tüm UI elementleri bu değişkenleri kullanır, hardcoded renk yoktur.

---

## Müzik Sistemi

**Dosya:** `youtube-music.js`

- YouTube Data API v3 ile şarkı arama (`videoCategoryId=10` = müzik)
- API Key: `AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU`
- **Masaüstü:** YouTube IFrame API ile gizli player, sayfada arka planda çalar
- **Mobil:** `isMobile()` tespiti ile YouTube Music uygulamasına yönlendirir (`youtube.com/watch?v=...`)
- Şarkı ekleme: Arama → sonuç seç → açıklama ekle → kaydet
- Şarkı düzenleme: Açıklama değiştirme + farklı şarkı seçme
- Firebase'e kaydedilir: `videoId`, `title`, `description`, `thumbnail`, `createdBy`, `createdAt`

---

## Firebase Entegrasyonu

**Dosya:** `firebase-api.js`

**Proje:** `emir-pelin-site-d4508`  
**Database URL:** `https://emir-pelin-site-d4508-default-rtdb.europe-west1.firebasedatabase.app/`

### Veri Yapısı (Realtime Database)

```
/music[]
  - id, title, description, videoId, thumbnail, createdBy, createdAt, createdAtFormatted

/dreams[]
  - id, title, description, createdBy, createdAt, createdAtFormatted

/notes[]
  - id, title, description, createdBy, createdAt, createdAtFormatted

/chatMessages[]
  - id, text, sender, timestamp, date
  - reactions: { "❤️": ["emir"], "😂": ["pelin"] }

/memories[]
  - id, title, description, photo (base64), createdBy, createdAt, createdAtFormatted

/poems[]
  - id, content, createdBy, createdAt, createdAtFormatted

/specialDates[]
  - id, title, description, date, createdBy, createdAt, createdAtFormatted

/profilePhotos
  - emir: { photo: "data:image/jpeg;base64,...", defaultEmoji: "👨" }
  - pelin: { photo: "data:image/jpeg;base64,...", defaultEmoji: "👩" }

/userCredentials
  - emir: { password: "...", name: "Emir Kağan" }
  - pelin: { password: "...", name: "Pelin" }

/theme
  - "sakura" | "forest" | "cosmos" | "minimal"
```

### Senkronizasyon Stratejisi

1. Sayfa yüklenince `syncAllDataFromFirebase()` tüm veriyi çeker, localStorage'a yazar
2. `startRealtimeListeners()` her veri tipi için `on('value')` listener başlatır
3. Herhangi bir değişiklik olunca listener tetiklenir, localStorage güncellenir, UI yeniden render edilir
4. Veri kaydedilirken önce localStorage'a, sonra Firebase'e yazılır (offline-first)

---

## PWA (Progressive Web App)

**Dosya:** `sw.js`, `manifest.json`

- **Kurulum:** Android Chrome → "Ana ekrana ekle" / iOS Safari → Paylaş → "Ana Ekrana Ekle"
- **Offline:** Service Worker cache-first stratejisi, tüm statik dosyalar cache'lenir
- **Standalone mod:** Adres çubuğu olmadan tam ekran açılır
- **Cache versiyonu:** `emir-pelin-v2` (güncelleme için bu değeri artır)
- **Bildirimler:** Altyapı hazır (`OneSignalSDKWorker.js`, `firebase-messaging-sw.js`) ama aktif değil — GitHub Pages subdirectory sorunu nedeniyle çalışmıyor

---

## Full Page Sistemi

Köşemiz ve Birlikte bölümlerindeki kartlara basınca tam ekran sayfa açılır:

- `openFullPage(title, contentFn)` — `#fullPage` elementini gösterir, body scroll'u kilitler
- `closeSectionModal()` — sayfayı kapatır, scroll'u serbest bırakır
- `openSubSection(type)` — Müzik/Notlar/Hayaller için full page açar, veriyi render eder
- `openMemorySection()`, `openPoemSection()`, `openSpecialDatesSection()` — özel full page'ler

**Önemli:** `dreamsList`, `notesList`, `musicList` ID'leri sadece full page içinde olmalı. HTML'de duplicate ID olursa `getElementById` yanlış elementi bulur.

---

## Galeri Sistemi

Anılar bölümündeki fotoğraflara tıklayınca tam ekran galeri açılır:

- Swipe (mobil) ve klavye ok tuşları ile gezinme
- Nokta indikatörü
- Scroll kilidi (body overflow hidden)
- `openGallery(index)`, `galleryNav(dir)`, `closeGallery()`

---

## Geliştirme

```bash
# Lokal test (PWA dahil)
npx serve .
# → http://localhost:3000

# Deploy
git add .
git commit -m "açıklama"
git push
# GitHub Pages ~1-2 dakikada güncellenir
```

---

## Bilinen Kısıtlamalar

1. **Bildirimler çalışmıyor:** GitHub Pages subdirectory (`/emir-pelin-site/`) nedeniyle OneSignal worker path uyuşmazlığı. Custom domain alınırsa çözülür.

2. **Mobilde müzik arka planda çalmıyor:** YouTube politikası. Mobilde YouTube Music uygulamasına yönlendirme yapılıyor.

3. **Şifreler güvensiz:** localStorage'da plain text. Firebase Auth entegrasyonu yapılabilir ama mevcut yapıyı değiştirir.

4. **Fotoğraflar base64:** Firebase Realtime Database'de base64 string olarak saklanıyor. Büyük fotoğraflarda performans sorunu olabilir. Firebase Storage'a geçiş önerilir.

5. **Firebase Functions deploy edilmedi:** Blaze (ücretli) plan gerekiyor. `functions/index.js` hazır ama aktif değil.

---

## Yakında Eklenecekler

- **Mektup:** Birbirine özel uzun form mektup yazma
- **Quiz:** İkisi hakkında sorular içeren eğlenceli quiz
- **Duygu:** Günlük duygu takibi (emoji + not)
- **Alışkanlık:** Ortak alışkanlık takibi (streak sistemi)
- **Hedef:** Ortak hedefler listesi (tamamlama yüzdesi)

---

## Versiyon Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| 1.0 | Ocak 2026 | İlk sürüm, temel özellikler |
| 2.0 | Ocak 2026 | Firebase entegrasyonu |
| 3.0 | Nisan 2026 | PWA, YouTube müzik, galeri, emoji reaksiyon |
| 4.0 | Nisan 2026 | Yeni nav yapısı, 4 tema, hub grid, profil dropdown |

**Son Güncelleme:** Nisan 2026
