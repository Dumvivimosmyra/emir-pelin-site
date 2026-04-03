importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAfqolr1y1INNeseEg2GviuP6bKrvgcdRE",
    authDomain: "emir-pelin-site-d4508.firebaseapp.com",
    databaseURL: "https://emir-pelin-site-d4508-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "emir-pelin-site-d4508",
    storageBucket: "emir-pelin-site-d4508.firebasestorage.app",
    messagingSenderId: "220690164116",
    appId: "1:220690164116:web:f04f3e50ef740aaebcc781"
});

const messaging = firebase.messaging();

// Arka planda bildirim al
messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
        body,
        icon: "/icon.png",
        badge: "/icon.png",
        vibrate: [200, 100, 200],
        data: { url: "https://dumvivimosmyra.github.io/emir-pelin-site/" }
    });
});

// Bildirime tıklanınca aç
self.addEventListener("notificationclick", (e) => {
    e.notification.close();
    e.waitUntil(clients.openWindow(e.notification.data.url));
});
