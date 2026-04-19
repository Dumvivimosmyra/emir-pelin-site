# Nerede Kaldık

**Canlı:** https://dumvivimosmyra.github.io/emir-pelin-site/

---

## Mevcut Durum

Site çalışıyor. Tüm temel özellikler aktif.

---

## Tamamlanan Özellikler

### Temel Sistem
- Giriş (Emir / Pelin, şifre korumalı)
- Firebase gerçek zamanlı senkronizasyon
- PWA (telefona kurulabilir, offline)
- Tema kişiye özel: her kullanıcı kendi temasını seçer, `theme_emir` / `theme_pelin` olarak saklanır
- 4 tema: Sakura, Forest, Cosmos, Minimal (CSS partikül animasyonları + yağmur modu her 60sn)
- Canlı sayaç (gün/saat/dk/sn, 07.12.2024'ten)
- Günlük mesaj (özel günlere duyarlı, 365 mesaj)
- Mini player (şarkı çalarken nav üstünde çıkar)

### Navigasyon (4 sekme)
- Ana / Köşemiz / Mesaj / Birlikte
- Üst bar: profil fotoğrafı + isim + dropdown

### Köşemiz
- Müzik: YouTube API arama, masaüstünde sayfada çalma, mobilde YouTube Music
- Notlar, Hayaller: CRUD
- Anılar: fotoğraf + tam ekran galeri (swipe)
- Şiirler: Emir yazar, ikisi okur
- Özel Günler: takvim, geri sayım, müzik bağlama, tamamlanınca anı ekleme
- Quiz: birbirini tanıma sistemi — profil doldurma (renkler, yemekler, istekler vb.), soru sor/cevapla, puan sistemi
- Mektup: zaman kapsülü, zarf animasyonu, kağıt efekti, ilerleme çubuğu

### Birlikte
- Duygu: küre sistemi, renk geçişleri, arşiv
- Alışkanlık: streak, 30 günlük takvim
- Hedef: müzik bağlama, kutlama + konfeti + anı ekleme
- Keşfet & Merak: Groq AI (Llama 3.1), INTP/INFP kişilik bazlı sorular, bilgi/yorum tipi, geçmiş

### Tarçın (AI Kedi)
- CSS SVG kedi: oturan, uyuyan, gözleri kırpan animasyonlar
- Groq API ile sohbet
- Sağ altta sabit, arada baloncuk çıkarır
- Giriş sonrası aktif olur

---

## Bekleyen / Yapılacaklar

### Tarçın İşlevsellik
- Alışkanlık hatırlatması ("3 gündür ders çalışmadınız")
- Hedef yaklaşınca uyarı
- Duygu analizi ("Bu hafta çoğunlukla yorgun görünüyorsunuz")

### Bildirimler
- OneSignal: GitHub Pages subdirectory sorunu
- Custom domain alınırsa (~100-150TL/yıl) çözülür

### Bilinen Küçük Sorunlar
- Login ekranında scroll yapınca sol altta küçük görsel bozukluk (SVG path)
- Mobil ince ayarlar (test edilecek)

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

### Groq API
```js
// gemini.js
const GROQ_API_KEY = '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';
const GROQ_MODEL = 'llama-3.1-8b-instant';
```

### Tema Sistemi
- Kişiye özel: `localStorage.getItem('theme_emir')` / `localStorage.getItem('theme_pelin')`
- Firebase: `theme_emir` / `theme_pelin` path'leri

### Firebase Veri Yapısı (Tüm Anahtarlar)
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

### Deploy
```bash
git add .
git commit -m "açıklama"
git push
```
