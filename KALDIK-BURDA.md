# Nerede Kaldık

**Canlı:** https://dumvivimosmyra.github.io/emir-pelin-site/

---

## Tamamlanan Özellikler

### Temel Sistem
- Giriş (Emir / Pelin, şifre korumalı)
- Firebase gerçek zamanlı senkronizasyon
- PWA (telefona kurulabilir, offline)
- 4 tema: Sakura, Forest, Cosmos, Minimal (CSS partikül animasyonları + yağmur modu)
- Canlı sayaç (gün/saat/dk/sn, 07.12.2024'ten)
- Günlük mesaj (özel günlere duyarlı, 365 mesaj)
- Mini player (şarkı çalarken nav üstünde çıkar, durdurulabilir)

### Navigasyon (4 sekme)
- Ana / Köşemiz / Mesaj / Birlikte
- Üst bar: profil fotoğrafı + isim + dropdown

### Köşemiz
- Müzik: YouTube API arama, masaüstünde sayfada çalma, mobilde YouTube Music
- Notlar, Hayaller: CRUD
- Anılar: fotoğraf + tam ekran galeri (swipe)
- Şiirler: Emir yazar, ikisi okur
- Özel Günler: takvim, geri sayım
- Quiz: birbirini tanı modu, soru sor/cevapla, puan sistemi
- Mektup: zaman kapsülü, zarf animasyonu, kağıt efekti, ilerleme çubuğu

### Birlikte
- Duygu: küre sistemi, renk geçişleri, arşiv, Firebase sync
- Alışkanlık: streak, 30 günlük takvim, Firebase sync
- Hedef: müzik bağlama, tamamlanınca kutlama + konfeti + anı ekleme, Firebase sync
- Keşfet & Merak: Gemini API altyapısı hazır (rate limit sorunu, bekliyor)

---

## Bekleyen / Yapılacaklar

### Gemini API (Keşfet & Merak)
- Key: `AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU` (rate limit doldu, birkaç saat bekle)
- `gemini.js` hazır, `gemini-2.0-flash` modeli kullanıyor
- Çalışınca test et: Birlikte → Keşfet & Merak → kategori seç

### Kedi AI Asistanı (Sonraki Büyük Özellik)
- Gemini API ile sayfanın köşesinde oturan kedi karakteri
- Projedeki tüm verileri context olarak alır
- "İkiniz" perspektifinden konuşur, analitik ve doğal ton
- Arada baloncuk çıkarır, tıklayınca sohbet açılır
- İsim: sonra belirlenecek
- **Önce Keşfet & Merak çalışsın, sonra kedi yapılacak**

### Quiz AI Entegrasyonu
- Gemini, ikisinin profilini okuyup kişiselleştirilmiş sorular üretecek
- Cevap değerlendirmesi anlam bazlı olacak (tam eşleşme değil)
- Mevcut quiz sistemi üzerine inşa edilecek

### Bildirimler
- OneSignal: GitHub Pages subdirectory sorunu var
- Custom domain alınırsa (~100-150TL/yıl) çözülür
- Altyapı hazır: `OneSignalSDKWorker.js`

### Teknik İyileştirmeler
- Fotoğrafları Firebase Storage'a taşı (şu an base64)
- Mobil UX ince ayarları

---

## Teknik Notlar

### Z-Index Hiyerarşisi
```
Tema partikülleri: 0
Normal içerik: 1
Full page: 9000
Modallar: 9500
Zarf overlay / letter: 9600
```

### Gemini API
```js
// gemini.js
const GEMINI_API_KEY = 'AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
```

### Firebase Veri Yapısı (Yeni Eklenenler)
```
emotionEntries[]  → duygu kayıtları
habitList[]       → alışkanlık tanımları
habitLogs[]       → günlük işaretlemeler
goalList[]        → hedefler
quizQuestions[]   → quiz soruları
letterList[]      → mektuplar
kesfeHistory[]    → keşfet & merak geçmişi
```

### Deploy
```bash
git add .
git commit -m "açıklama"
git push
```
