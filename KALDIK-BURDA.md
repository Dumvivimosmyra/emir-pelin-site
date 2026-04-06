# Nerede Kaldık — Nisan 2026

## Canlı Site
https://dumvivimosmyra.github.io/emir-pelin-site/

---

## Son Yapılanlar (Bu Oturum)

- Canlı sayaç eklendi (gün/saat/dk/sn, gerçek zamanlı)
- Günlük mesaj sistemi yenilendi (özel günlere duyarlı, 365 mesaj)
- 4 yeni tema: Sakura, Forest, Cosmos, Minimal (CSS partikül animasyonları)
- Tüm hardcoded renkler tema değişkenlerine bağlandı
- Mesajlaşma ayrı nav butonuna taşındı
- Profil sadeleştirildi (istatistikler kaldırıldı)
- Anılar/Şiirler/Özel Günler ana sayfadan tam ekran açılıyor
- Galeri scroll kilidi düzeltildi
- Firebase null check hataları giderildi
- Gereksiz Firebase agent dosyaları temizlendi

---

## Çalışan Özellikler

- Giriş sistemi (Emir / Pelin, şifre korumalı)
- Gerçek zamanlı mesajlaşma + emoji reaksiyon
- YouTube müzik arama ve oynatma
- Hayaller, Notlar CRUD
- Anı kutusu (fotoğraf + galeri)
- Şiirler (Emir yazar, ikisi okur)
- Özel günler takvimi
- Profil fotoğrafı yükleme
- 4 tema sistemi
- PWA (telefona kurulabilir, offline çalışır)
- Firebase gerçek zamanlı senkronizasyon

---

## Bekleyen / Yarım Kalanlar

### Bildirimler
- OneSignal denendi, GitHub Pages subdirectory sorunu nedeniyle çalışmadı
- Firebase Functions denendi, Blaze planı (kart) gerekiyor
- **Çözüm:** Custom domain alınırsa (yılda ~100-150TL) OneSignal çalışır
- Altyapı hazır: `OneSignalSDKWorker.js`, `firebase-messaging-sw.js` dosyaları mevcut

### Müzik (Mobil)
- Masaüstünde sayfada çalıyor
- Mobilde YouTube Music'e yönlendiriyor (YouTube politikası nedeniyle arka planda çalamıyor)

### Güvenlik (Düşük Öncelik)
- Şifreler localStorage'da plain text
- Firebase Auth entegrasyonu yapılabilir ama karmaşık

---

## Gelecek Planlar

### Kısa Vadeli
- Mobil UX iyileştirmeleri (devam ediyor)
- Tema animasyonlarını ince ayar
- Anı galerisi iyileştirme

### Orta Vadeli
- Custom domain → bildirimler aktif olur
- Fotoğrafları Firebase Storage'a taşı (base64 yerine URL)
- Ses mesajı

### Uzun Vadeli
- Firebase Auth ile güvenli giriş
- Spotify entegrasyonu (müzik için)

---

## Deploy

```bash
git add .
git commit -m "açıklama"
git push
```

GitHub Pages ~1-2 dakikada güncellenir.
