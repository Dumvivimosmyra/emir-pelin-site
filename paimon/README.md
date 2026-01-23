# 💕 Emir & Pelin - Web Sitesi

Modern, mobil uyumlu ve gerçek zamanlı senkronizasyonlu sevgi içerikli web uygulaması.

## 🌟 Özellikler

### 👥 Kullanıcı Sistemi
- **Çift Kullanıcı**: Emir Kağan & Pelin
- **Güvenli Giriş**: Şifre korumalı (varsayılan: 123456)
- **Profil Yönetimi**: Fotoğraf yükleme, şifre değiştirme

### 💬 WhatsApp Tarzı Mesajlaşma
- **Gerçek Zamanlı**: Anında mesaj senkronizasyonu
- **Modern Tasarım**: Mesaj baloncukları, animasyonlar
- **Mobil Uyumlu**: Dokunmatik optimizasyonu

### 🎵 İçerik Yönetimi
- **Müzikler**: Favori şarkıları ekle/düzenle/sil
- **Hayaller**: Gelecek planlarını paylaş
- **Notlar**: Özel notlar ve hatırlatmalar

### 🎁 Sürpriz Bölümü
- **Anı Kutusu**: Fotoğraflı anılar
- **Sevgi Şiirleri**: Emir'in Pelin için yazdığı şiirler
- **Özel Günler**: Takvim ve önemli tarihler
- **Kalp Yağmuru**: Romantik animasyon

### 🔥 Firebase Entegrasyonu
- **Gerçek Zamanlı Senkronizasyon**: İstanbul ↔ Bursa
- **Bulut Depolama**: Tüm veriler güvende
- **Offline Destek**: İnternet yokken yerel çalışma

### 🎨 Tasarım
- **Dark/Light Tema**: Göz dostu mod seçenekleri
- **Responsive**: Telefon, tablet, bilgisayar uyumlu
- **Modern UI**: Gradient renkler, animasyonlar

## 🚀 Kurulum

### 1. Projeyi İndir
```bash
git clone https://github.com/[kullanici-adi]/emir-pelin-site.git
cd emir-pelin-site
```

### 2. Firebase Kurulumu
1. [Firebase Console](https://console.firebase.google.com)'a git
2. Yeni proje oluştur
3. Realtime Database ekle
4. `firebase-api.js` dosyasındaki config'i güncelle

### 3. Çalıştır
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve .

# Live Server ile (VS Code)
Live Server uzantısını kullan
```

### 4. Erişim
- **Yerel**: http://localhost:8000
- **Canlı**: GitHub Pages üzerinden

## 👤 Kullanıcı Bilgileri

| Kullanıcı | Şifre | Rol |
|-----------|-------|-----|
| Emir Kağan | 123456 | Admin |
| Pelin | 123456 | Admin |

## 📱 Kullanım

### Giriş Yapma
1. Kullanıcı seç (Emir/Pelin)
2. Şifre gir (123456)
3. Giriş yap

### Mesajlaşma
- Profil → Mesajlaşma bölümü
- WhatsApp tarzı karşılıklı sohbet
- Enter ile mesaj gönder

### İçerik Ekleme
- Ana sayfa → İlgili bölüm
- ➕ butonuna tıkla
- Bilgileri doldur ve kaydet

### Sürpriz Özellikleri
- Sürpriz bölümü → İstediğin kartı seç
- Anı/şiir/tarih ekle
- Gerçek zamanlı paylaşım

## 🔧 Teknik Detaylar

### Teknolojiler
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Hosting**: GitHub Pages
- **Responsive**: CSS Grid, Flexbox

### Dosya Yapısı
```
emir-pelin-site/
├── index.html          # Ana sayfa
├── style.css           # Stil dosyası
├── script.js           # Ana JavaScript
├── firebase-api.js     # Firebase entegrasyonu
├── README.md           # Bu dosya
└── KALDIK-BURDA.md    # Geliştirme notları
```

### Firebase Veritabanı
```json
{
  "music": [...],
  "dreams": [...],
  "notes": [...],
  "chatMessages": [...],
  "memories": [...],
  "poems": [...],
  "specialDates": [...],
  "profilePhotos": {...},
  "userCredentials": {...},
  "theme": "light/dark"
}
```

## 🔒 Güvenlik

### Mevcut Durum
- Firebase test modunda (geliştirme için)
- Basit şifre koruması
- Kişisel kullanım için uygun

### Üretim Önerileri
- Firebase güvenlik kuralları güncelle
- Güçlü şifreler kullan
- HTTPS zorunlu kıl

## 🎯 Gelecek Planları

### Kısa Vadede (1-2 Hafta)
- [ ] **PWA Desteği**: Telefona kurulabilir uygulama
- [ ] **Bildirimler**: Yeni mesaj bildirimleri
- [ ] **Fotoğraf Galerisi**: Anı kutusunu genişlet
- [ ] **Ses Mesajları**: Sesli mesajlaşma
- [ ] **Emoji Reaksiyonları**: Mesajlara tepki verme

### Orta Vadede (1 Ay)
- [ ] **Spotify Entegrasyonu**: Müzik çalma
- [ ] **Harita Entegrasyonu**: Gittiğiniz yerler
- [ ] **Takvim Senkronizasyonu**: Google Calendar
- [ ] **Video Çağrı**: WebRTC ile görüntülü konuşma
- [ ] **Günlük Sistemi**: Kişisel günlükler

### Uzun Vadede (3+ Ay)
- [ ] **Mobil Uygulama**: React Native/Flutter
- [ ] **AI Önerileri**: Akıllı içerik önerileri
- [ ] **Çoklu Dil**: İngilizce desteği
- [ ] **Tema Editörü**: Özel renkler
- [ ] **Backup Sistemi**: Veri yedekleme

### Teknik İyileştirmeler
- [ ] **Performans**: Lazy loading, caching
- [ ] **SEO**: Meta taglar, sitemap
- [ ] **Analytics**: Kullanım istatistikleri
- [ ] **Testing**: Unit testler
- [ ] **CI/CD**: Otomatik deployment

## 🐛 Bilinen Sorunlar

- ~~JavaScript konsol hatası (satır 1777)~~ → Çözüldü ✅
- ~~Firebase senkronizasyon sorunları~~ → Çözüldü ✅
- ~~Avatar sistemi karışıklığı~~ → Kaldırıldı ✅

## 🤝 Katkıda Bulunma

Bu proje kişisel kullanım için geliştirilmiştir. Önerilerinizi Issues bölümünden paylaşabilirsiniz.

## 📄 Lisans

Bu proje kişisel kullanım içindir. Ticari kullanım yasaktır.

## 💖 Teşekkürler

Bu proje Emir Kağan ve Pelin'in sevgisine adanmıştır. 

---

**Son Güncelleme**: Ocak 2026  
**Versiyon**: 2.0.0 (Firebase Edition)  
**Durum**: Üretim Hazır ✅

## 📞 İletişim

Sorularınız için GitHub Issues kullanın.

---

*"Bu sevgi, iki kalbin tek ritimde atmasıdır." 💕*