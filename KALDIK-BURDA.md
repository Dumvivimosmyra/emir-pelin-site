# Nerede Kaldık — Nisan 2026

**Canlı:** https://dumvivimosmyra.github.io/emir-pelin-site/

---

## Mevcut Durum

Site çalışıyor. Tüm temel özellikler aktif ve test edildi.

---

## Tamamlanan Özellikler

### Temel Altyapı
- Giriş sistemi (Emir / Pelin, şifre korumalı, oturum localStorage'da)
- Firebase Realtime DB gerçek zamanlı senkronizasyon
- Offline-first: localStorage fallback
- PWA: telefona kurulabilir, offline çalışır
- Service Worker cache (sw.js, cache versiyonu: emir-pelin-v2)

### Tema Sistemi
- 4 tema: Sakura, Forest, Cosmos, Minimal
- **Kişiye özel**: `theme_emir` / `theme_pelin` olarak ayrı saklanır
- CSS partikül animasyonları (emoji yok, saf CSS/SVG)
- Yağmur modu: her 60sn'de 7sn yoğun animasyon
- Login ekranında animasyon çalışmaz (performans)

### Navigasyon
- 4 sekme: Ana / Köşemiz / Mesaj / Birlikte
- Üst bar: profil fotoğrafı + isim + dropdown (Profil & Ayarlar / Çıkış)
- Full page sistemi: kartlara basınca tam ekran açılır, scroll kilitlenir

### Ana Sayfa
- Canlı sayaç: gün/saat/dk/sn, 07.12.2024'ten
- Günlük mesaj: özel günlere duyarlı (14 Şubat, 8 Mart vb.), 365 mesaj
- İstatistik kutuları: müzik/hayal/not sayıları, tıklayınca açılır

### Köşemiz
- **Müzik**: YouTube API arama, masaüstünde sayfada çalma, mobilde YouTube Music, mini player
- **Notlar / Hayaller**: CRUD, Firebase sync
- **Anılar**: fotoğraf yükleme, tam ekran galeri (swipe + klavye)
- **Şiirler**: Emir yazar, ikisi okur
- **Özel Günler**: takvim, geri sayım, müzik bağlama, tamamlanınca kutlama + anı ekleme
- **Quiz**: birbirini tanıma — profil doldurma (9 kategori), soru sor/cevapla, puan sistemi, profil görüntüleme
- **Mektup**: zaman kapsülü, zarf animasyonu, kağıt efekti, ilerleme çubuğu, gönderilme zamanı

### Birlikte
- **Duygu**: küre sistemi, renk geçişleri (maks 3 duygu), arşiv, Firebase sync
- **Alışkanlık**: streak takibi, 30 günlük takvim, Firebase sync
- **Hedef**: müzik bağlama, tamamlanınca kutlama + konfeti + anı ekleme, Firebase sync
- **Keşfet & Merak**: Groq AI (Llama 3.1), INTP/INFP kişilik bazlı, bilgi/yorum tipi, geçmiş, silme

### Tarçın (AI Kedi)
- CSS SVG kedi: 5 durum (awake, blink, wag, happy, sleep)
- Animasyon döngüsü: 2sn'de başlar, rastgele geçişler
- Groq API sohbet: site verilerini biliyor, tutarlı
- Baloncuk sistemi: alışkanlık hatırlatması, hedef uyarısı, duygu analizi
- Giriş sonrası aktif, çıkışta temizlenir
- Mini player açıkken yukarı kayar

### Mesajlaşma
- Firebase gerçek zamanlı
- 50+ emoji reaksiyon (uzun bas / sağ tıkla)
- Enter ile gönder

---

## Bekleyen / Yapılacaklar

### Bildirimler (Bloke)
- OneSignal: GitHub Pages subdirectory sorunu (`/emir-pelin-site/` path'i)
- Custom domain alınırsa (~100-150TL/yıl) çözülür
- Altyapı hazır: `OneSignalSDKWorker.js`

### Küçük Sorunlar
- Login ekranında scroll yapınca sol altta küçük görsel bozukluk (SVG path artığı)
- Mobil ince ayarlar (bazı elementler büyük görünebilir)

### Gelecek Özellikler
- Tarçın'ı daha işlevsel hale getirme (daha akıllı analiz)
- Quiz'e AI entegrasyonu (Groq ile otomatik soru üretme)
- Fotoğrafları Firebase Storage'a taşıma (şu an base64, verimsiz)
- Firebase Auth ile güvenli giriş

---

## Teknik Notlar

### Tema Kişiye Özel
```js
// Kaydetme
localStorage.setItem(`theme_${currentUser}`, theme);
firebaseAPI.saveData(`theme_${currentUser}`, theme);

// Yükleme (showMainApp'te)
const userTheme = localStorage.getItem(`theme_${currentUser}`) || 'sakura';
```

### Groq API
```js
// gemini.js
GROQ_API_KEY = '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'
GROQ_MODEL = 'llama-3.1-8b-instant'
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Limit: dakikada 30 istek, günde 14.400 (ücretsiz)
```

### YouTube API
```js
// youtube-music.js
YT_API_KEY = 'AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU'
// videoCategoryId=10 → müzik kategorisi
```

### Firebase Veri Anahtarları
```
music, dreams, notes, chatMessages
memories, poems, specialDates
profilePhotos, userCredentials
theme_emir, theme_pelin
emotionEntries
habitList, habitLogs
goalList
quizQuestions, quizProfile_emir, quizProfile_pelin
letterList
kesfeHistory
```

### Z-Index Hiyerarşisi
```
Tema partikülleri:  0
Normal içerik:      1
Full page:          9000
Modallar:           9500
Zarf overlay:       9600
```

### Script Yükleme Sırası (index.html)
```html
firebase-api.js → youtube-music.js → gemini.js → quiz.js → tarcin.js → script.js
```

### Deploy
```bash
git add .
git commit -m "açıklama"
git push
# GitHub Pages ~1-2 dk güncellenir
```
