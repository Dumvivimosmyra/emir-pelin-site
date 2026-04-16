# Nerede Kaldık — Nisan 2026

## Canlı Site
https://dumvivimosmyra.github.io/emir-pelin-site/

---

## Mevcut Durum

Site çalışıyor, tüm temel özellikler aktif.

---

## Son Yapılanlar

### Yapısal Değişiklikler
- Alt nav 7 sekmeden 4 sekmeye indirildi: Ana / Köşemiz / Mesaj / Birlikte
- Köşemiz: Müzik, Notlar, Hayaller, Anılar, Mektup*, Quiz*, Şiirler, Özel Günler (hub grid)
- Birlikte: Duygu*, Alışkanlık*, Hedef* (hub grid, yakında)
- Üst bar: "Hoş Geldin" yazısı kaldırıldı, profil fotoğrafı + isim + dropdown geldi
- Profil dropdown: Profil & Ayarlar / Çıkış Yap

### Tema Sistemi
- 4 tema: Sakura (pembe), Forest (koyu yeşil), Cosmos (lacivert/mor), Minimal (beyaz/gri)
- Her tema CSS değişkenleri ile tam renk tutarlılığı
- CSS partikül animasyonları (emoji yok)
- Yağmur modu: Her 60 sn'de 7 sn yoğun animasyon

### Diğer
- Canlı sayaç: gün/saat/dk/sn gerçek zamanlı
- Günlük mesaj: özel günlere duyarlı 365 mesaj
- Full page sistemi: kartlara basınca tam ekran açılır, scroll kilitlenir
- Duplicate ID sorunu çözüldü (dreamsList, notesList, musicList)
- Modal z-index düzeltildi (full page üzerinde açılıyor)

---

## Çalışan Özellikler

- Giriş (Emir / Pelin, şifre korumalı)
- Gerçek zamanlı mesajlaşma + 50+ emoji reaksiyon
- YouTube müzik arama/oynatma (masaüstü: sayfada, mobil: YouTube Music)
- Hayaller, Notlar CRUD
- Anı kutusu (fotoğraf + tam ekran galeri + swipe)
- Şiirler (Emir yazar, ikisi okur)
- Özel günler takvimi
- Profil fotoğrafı yükleme
- 4 tema + yağmur modu animasyonları
- PWA (telefona kurulabilir, offline çalışır)
- Firebase gerçek zamanlı senkronizasyon

---

## Bekleyen / Yarım Kalanlar

### Bildirimler (Bloke)
- OneSignal: GitHub Pages subdirectory sorunu, worker path uyuşmuyor
- Firebase Functions: Blaze planı (kart) gerekiyor
- **Çözüm:** Custom domain alınırsa (~100-150TL/yıl) OneSignal çalışır
- Altyapı hazır: `OneSignalSDKWorker.js`, `firebase-messaging-sw.js`

### Yakında Eklenecek Özellikler
- **Mektup:** Birbirine özel uzun form mektup
- **Quiz:** İkisi hakkında sorular
- **Duygu:** Günlük duygu takibi
- **Alışkanlık:** Ortak alışkanlık + streak
- **Hedef:** Ortak hedefler listesi

### Teknik İyileştirmeler
- Fotoğrafları Firebase Storage'a taşı (şu an base64, verimsiz)
- Firebase Auth ile güvenli giriş (şu an localStorage plain text)
- Mobil UX ince ayarları

---

## Önemli Teknik Notlar

### Duplicate ID Sorunu
`dreamsList`, `notesList`, `musicList` ID'leri sadece full page içinde olmalı. HTML'de bu ID'lere sahip başka element olursa `getElementById` yanlış olanı bulur ve veri görünmez.

### Full Page Sistemi
`openFullPage(title, fn)` → `#fullPage` gösterir, scroll kilitler  
`closeSectionModal()` → kapatır, scroll serbest bırakır  
`openSubSection(type)` → Müzik/Notlar/Hayaller için

### Modal Z-Index Hiyerarşisi
- Tema partikülleri: z-index 0
- Normal içerik: z-index 1
- Full page: z-index 9000
- Modallar: z-index 9500
- Galeri overlay: z-index 9999

### Tema Değişkeni Listesi
Her temada tanımlanması gereken değişkenler:
`--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--text-primary`, `--text-secondary`, `--border-color`, `--accent-color`, `--accent-hover`, `--accent-gradient`, `--shadow`, `--shadow-hover`, `--login-bg`, `--particle-color`

---

## Deploy

```bash
git add .
git commit -m "açıklama"
git push
```

GitHub Pages ~1-2 dakikada güncellenir.
