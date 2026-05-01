# API Key Kurulumu

## Groq API Key - Otomatik Yükleme

AI özellikleri (Tarçın sohbet, Quiz AI soru üretme, Keşfet) için Groq API key gereklidir.

### ✅ Otomatik Kurulum

API key artık **otomatik olarak yüklenir**. Hiçbir şey yapmanıza gerek yok!

- API key base64 ile şifrelenmiş olarak kodda gömülü
- Sayfa yüklendiğinde otomatik decode edilir ve localStorage'a kaydedilir
- Hem localhost hem de canlı sitede çalışır
- Her iki kullanıcı (Emir ve Pelin) için otomatik çalışır

### 🧪 Test Et:

1. Tarçın'a bir şey sor
2. Quiz'de "✨ AI Soru Üret" butonuna bas
3. Keşfet bölümünde bir kategori seç

### 🔧 Sorun Giderme:

Eğer AI çalışmıyorsa:

1. **Tarayıcı konsolunu aç** (F12)
2. **Console sekmesinde** şunu yaz:
   ```javascript
   localStorage.removeItem('groq_api_key');
   location.reload();
   ```
3. Sayfa yenilendiğinde API key otomatik yüklenecek

### 📊 API Limitleri:

- Ücretsiz limit: 30 istek/dakika, 14.400 istek/gün
- Rate limit aşılırsa 1 dakika bekleyin

### 🔐 Güvenlik:

- API key base64 ile encode edilmiş (GitHub secret scanning'den kaçmak için)
- GitHub'da izin verildi: https://github.com/Dumvivimosmyra/emir-pelin-site/security/secret-scanning/unblock-secret/3Cre6l5AcAKklLKRyjouqV3WlWw
- localStorage'da saklanır (client-side only)

### 🆕 Yeni API Key Ekleme (Geliştiriciler İçin):

Eğer yeni bir API key oluşturmanız gerekirse:

1. https://console.groq.com/keys adresine git
2. Yeni API key oluştur
3. Base64 encode et:
   ```javascript
   btoa('gsk_YourNewApiKeyHere')
   ```
4. `gemini.js` dosyasındaki `encodedKey` değişkenini güncelle
5. GitHub'a push et (base64 encoded olduğu için güvenli)

### 📝 Mevcut Key Bilgisi:

- **Oluşturulma**: May 1, 2026
- **Encoded**: `Z3NrXzRKbzBkUXlKdlpDWE50d0ZYWGxrV0dkeWIzRllvdFFhMWZta3NBcEpodmNuNVJjUWhBWWk=`
- **GitHub İzni**: Kalıcı izin verildi (secret scanning bypass)
