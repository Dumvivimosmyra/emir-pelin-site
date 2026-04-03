# Nerede Kaldık

## Son Durum (Nisan 2026)

Site canlıda: https://dumvivimosmyra.github.io/emir-pelin-site/

## Tamamlananlar

- PWA - telefona kurulabilir, offline çalışıyor
- Gün sayacı - 07.12.2024'ten itibaren
- YouTube müzik sistemi - arama, ekleme, çalma, düzenleme
- Fotoğraf galerisi - tam ekran, swipe, klavye desteği
- Emoji reaksiyonlar - 50 emoji, uzun bas/sağ tıkla
- Firebase gerçek zamanlı senkronizasyon
- Dark/Light tema

## Bekleyen / Yarım Kalanlar

- **OneSignal bildirimleri** - onesignal.com'da hesap aç, App ID ve REST API Key al, sonra devam et. (Şu an site sorunu var, sonra dene)
- Firebase Functions yolu denendi, Blaze planı (kart) gerektiriyor, bırakıldı
- Mobil küçük kusurlar - test edilecek
- Genel tasarım/UX düzenlemesi - mobil için özellikle

## Bilinen Sorunlar

- Mobilde YouTube embed reklam gösteriyor → çözüm: mobilde YouTube Music'e yönlendirme aktif
- PWA'da postMessage hatası → lokal'de normal, canlıda sorun yok

## Sonraki Adımlar

- FCM bildirimleri
- Mobil kusur düzeltmeleri
- Yeni özellik kararı

## Git

```bash
git add .
git commit -m "açıklama"
git push
```
