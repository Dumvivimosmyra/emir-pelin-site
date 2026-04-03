const CACHE_NAME = 'emir-pelin-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './firebase-api.js',
  './youtube-music.js',
  './manifest.json'
];

// Kurulum - dosyaları cache'e al
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivasyon - eski cache'leri temizle
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - önce network, yoksa cache
self.addEventListener('fetch', e => {
  // Firebase isteklerini cache'leme
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Başarılı yanıtı cache'e de kaydet
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Push bildirimi al
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Emir & Pelin', body: 'Yeni bir mesaj var! 💕' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/emir-pelin-site/icon-192.png',
      badge: '/emir-pelin-site/icon-192.png',
      vibrate: [200, 100, 200]
    })
  );
});

// Bildirime tıklanınca siteyi aç
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/emir-pelin-site/'));
});
