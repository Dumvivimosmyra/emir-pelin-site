# API Key Kurulumu

## Groq API Key Ekleme

AI özellikleri (Tarçın sohbet, Quiz AI soru üretme, Keşfet) için Groq API key gereklidir.

### Adımlar:

1. **API Key Al:**
   - https://console.groq.com/keys adresine git
   - Ücretsiz hesap oluştur
   - Yeni API key oluştur

2. **API Key'i Ekle:**
   - Tarayıcı konsolunu aç (F12)
   - Console sekmesine şunu yaz:
   ```javascript
   localStorage.setItem('groq_api_key', 'BURAYA_API_KEY_YAPISTIR');
   ```
   - Sayfayı yenile

3. **Test Et:**
   - Tarçın'a bir şey sor
   - Quiz'de "AI Soru Üret" butonuna bas
   - Keşfet bölümünde bir şey sor

### Mevcut API Key:
```
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
```

### Hızlı Kurulum (Tarayıcı Konsoluna Yapıştır):
```javascript
localStorage.setItem('groq_api_key', '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');
location.reload();
```

## Notlar:
- API key localStorage'da saklanır (güvenli değil ama basit)
- Her cihazda ayrı ayrı eklenmeli
- Ücretsiz limit: 30 istek/dakika, 14.400 istek/gün
