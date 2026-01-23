// Firebase API Integration
class FirebaseAPI {
    constructor() {
        // Firebase config - buraya kopyaladığın config'i yapıştır
        const firebaseConfig = {
            apiKey: "AIzaSyAfqolr1y1INNeseEg2GviuP6bKrvgcdRE",
            authDomain: "emir-pelin-site-d4508.firebaseapp.com",
            databaseURL: "https://emir-pelin-site-d4508-default-rtdb.europe-west1.firebasedatabase.app/",
            projectId: "emir-pelin-site-d4508",
            storageBucket: "emir-pelin-site-d4508.firebasestorage.app",
            messagingSenderId: "220690164116",
            appId: "1:220690164116:web:f04f3e50ef740aaebcc781"
        };

        // Firebase'i başlat
        if (!window.firebase) {
            console.error('Firebase SDK yüklenmedi!');
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.database = firebase.database();
        this.isOnline = navigator.onLine;
        
        // Online/offline durumunu takip et
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showSyncStatus('🌐 Online - Senkronize');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showSyncStatus('📴 Offline - Yerel');
        });
    }

    // Veri kaydet
    async saveData(path, data) {
        try {
            await this.database.ref(path).set(data);
            console.log('✅ Veri Firebase\'e kaydedildi:', path);
            this.showSyncStatus('✅ Kaydedildi');
            return true;
        } catch (error) {
            console.error('❌ Firebase kaydetme hatası:', error);
            this.showSyncStatus('❌ Hata');
            return false;
        }
    }

    // Veri yükle
    async loadData(path) {
        try {
            const snapshot = await this.database.ref(path).once('value');
            const data = snapshot.val();
            console.log('✅ Veri Firebase\'ten yüklendi:', path);
            return data || [];
        } catch (error) {
            console.error('❌ Firebase yükleme hatası:', error);
            return null;
        }
    }

    // Gerçek zamanlı dinleme
    listenToData(path, callback) {
        this.database.ref(path).on('value', (snapshot) => {
            const data = snapshot.val();
            callback(data || []);
        });
    }

    // Senkronizasyon durumu göster
    showSyncStatus(message) {
        // Eski status varsa kaldır
        const oldStatus = document.getElementById('syncStatus');
        if (oldStatus) oldStatus.remove();

        const status = document.createElement('div');
        status.id = 'syncStatus';
        status.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: var(--accent-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        
        status.textContent = message;
        
        if (message.includes('Online')) {
            status.style.background = '#10b981';
        } else if (message.includes('Offline')) {
            status.style.background = '#f59e0b';
        } else if (message.includes('Hata')) {
            status.style.background = '#ef4444';
        }
        
        document.body.appendChild(status);
        
        // 3 saniye sonra gizle
        setTimeout(() => {
            status.style.opacity = '0';
            setTimeout(() => status.remove(), 300);
        }, 3000);
    }
}

// Global Firebase instance
let firebaseAPI;
window.firebaseAPI = null; // Global erişim için

// Firebase SDK yüklendikten sonra başlat
function initFirebase() {
    firebaseAPI = new FirebaseAPI();
    window.firebaseAPI = firebaseAPI; // Global erişim için
    
    // Sayfa yüklendiğinde verileri senkronize et
    syncAllDataFromFirebase();
    
    // Gerçek zamanlı dinleme başlat
    startRealtimeListeners();
    
    // Veri kaydetme fonksiyonlarını güçlendir
    enhanceSaveData();
}

// Tüm verileri Firebase'den yükle
async function syncAllDataFromFirebase() {
    if (!firebaseAPI) return;
    
    console.log('🔄 Firebase\'den veriler yükleniyor...');
    
    // Ana veriler
    const music = await firebaseAPI.loadData('music');
    const dreams = await firebaseAPI.loadData('dreams');
    const notes = await firebaseAPI.loadData('notes');
    const pelinMessages = await firebaseAPI.loadData('pelinMessages');
    
    // Sürpriz verileri
    const memories = await firebaseAPI.loadData('memories');
    const poems = await firebaseAPI.loadData('poems');
    const specialDates = await firebaseAPI.loadData('specialDates');
    
    // Yeni mesajlaşma sistemi
    const chatMessages = await firebaseAPI.loadData('chatMessages');
    
    // Kullanıcı verileri
    const profilePhotos = await firebaseAPI.loadData('profilePhotos');
    const userCredentials = await firebaseAPI.loadData('userCredentials');
    const theme = await firebaseAPI.loadData('theme');
    
    // Local storage'a kaydet
    if (music) {
        appData.music = music;
        localStorage.setItem('appData_music', JSON.stringify(music));
    }
    
    if (dreams) {
        appData.dreams = dreams;
        localStorage.setItem('appData_dreams', JSON.stringify(dreams));
    }
    
    if (notes) {
        appData.notes = notes;
        localStorage.setItem('appData_notes', JSON.stringify(notes));
    }
    
    if (pelinMessages) {
        appData.pelinMessages = pelinMessages;
        localStorage.setItem('appData_pelinMessages', JSON.stringify(pelinMessages));
    }
    
    if (memories) {
        surpriseData.memories = memories;
        localStorage.setItem('surpriseData_memories', JSON.stringify(memories));
    }
    
    if (poems) {
        surpriseData.poems = poems;
        localStorage.setItem('surpriseData_poems', JSON.stringify(poems));
    }
    
    if (specialDates) {
        surpriseData.specialDates = specialDates;
        localStorage.setItem('surpriseData_specialDates', JSON.stringify(specialDates));
    }
    
    if (chatMessages) {
        if (typeof chatData !== 'undefined') {
            chatData.messages = chatMessages;
            localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        } else {
            localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        }
    }
    
    // Kullanıcı verileri
    if (profilePhotos) {
        window.profilePhotos = profilePhotos;
        localStorage.setItem('profilePhotos', JSON.stringify(profilePhotos));
    }
    
    if (userCredentials && typeof userCredentials === 'object') {
        if (window.userCredentials && typeof window.userCredentials === 'object') {
            Object.assign(window.userCredentials, userCredentials);
        } else {
            window.userCredentials = userCredentials;
        }
        localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
    }
    
    if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (typeof updateThemeToggle === 'function') {
            updateThemeToggle();
        }
    }
    
    console.log('✅ Tüm veriler Firebase\'den yüklendi!');
}

// Gerçek zamanlı dinleme başlat
function startRealtimeListeners() {
    if (!firebaseAPI) return;
    
    // Müzik değişikliklerini dinle
    firebaseAPI.listenToData('music', (data) => {
        appData.music = data;
        localStorage.setItem('appData_music', JSON.stringify(data));
        renderSection('music');
        updateStats();
    });
    
    // Hayaller değişikliklerini dinle
    firebaseAPI.listenToData('dreams', (data) => {
        appData.dreams = data;
        localStorage.setItem('appData_dreams', JSON.stringify(data));
        renderSection('dreams');
        updateStats();
    });
    
    // Notlar değişikliklerini dinle
    firebaseAPI.listenToData('notes', (data) => {
        appData.notes = data;
        localStorage.setItem('appData_notes', JSON.stringify(data));
        renderSection('notes');
        updateStats();
    });
    
    // Pelin mesajları değişikliklerini dinle
    firebaseAPI.listenToData('pelinMessages', (data) => {
        appData.pelinMessages = data;
        localStorage.setItem('appData_pelinMessages', JSON.stringify(data));
        if (currentUser === 'pelin') {
            setupProfileSection(); // Pelin'in profilini güncelle
        }
    });
    
    // Chat mesajları değişikliklerini dinle - YENİ
    firebaseAPI.listenToData('chatMessages', (data) => {
        if (typeof chatData !== 'undefined') {
            chatData.messages = data || [];
            localStorage.setItem('chatMessages', JSON.stringify(chatData.messages));
            if (typeof loadMessages === 'function') {
                loadMessages(); // Mesajları güncelle
            }
        } else {
            localStorage.setItem('chatMessages', JSON.stringify(data || []));
        }
    });
    
    // Anılar değişikliklerini dinle
    firebaseAPI.listenToData('memories', (data) => {
        surpriseData.memories = data;
        localStorage.setItem('surpriseData_memories', JSON.stringify(data));
        loadMemories(); // Anı kutusunu güncelle
    });
    
    // Şiirler değişikliklerini dinle
    firebaseAPI.listenToData('poems', (data) => {
        surpriseData.poems = data;
        localStorage.setItem('surpriseData_poems', JSON.stringify(data));
        loadPoems(); // Şiir listesini güncelle
    });
    
    // Özel günler değişikliklerini dinle
    firebaseAPI.listenToData('specialDates', (data) => {
        surpriseData.specialDates = data;
        localStorage.setItem('surpriseData_specialDates', JSON.stringify(data));
        loadSpecialDates(); // Takvimi güncelle
    });
    
    // Kullanıcı verileri değişikliklerini dinle
    firebaseAPI.listenToData('profilePhotos', (data) => {
        if (data) {
            window.profilePhotos = data;
            localStorage.setItem('profilePhotos', JSON.stringify(data));
            if (typeof updateLoginAvatars === 'function') {
                updateLoginAvatars();
            }
            if (typeof updateProfileAvatar === 'function') {
                updateProfileAvatar();
            }
        }
    });
    
    firebaseAPI.listenToData('userCredentials', (data) => {
        if (data && typeof data === 'object') {
            if (window.userCredentials && typeof window.userCredentials === 'object') {
                Object.assign(window.userCredentials, data);
            } else {
                window.userCredentials = data;
            }
            localStorage.setItem('userCredentials', JSON.stringify(data));
        }
    });
    
    firebaseAPI.listenToData('theme', (data) => {
        if (data) {
            document.documentElement.setAttribute('data-theme', data);
            localStorage.setItem('theme', data);
            if (typeof updateThemeToggle === 'function') {
                updateThemeToggle();
            }
        }
    });
}

// Veri kaydetme fonksiyonlarını güncelle
function enhanceSaveData() {
    const originalSaveData = window.saveData;
    window.saveData = function(type) {
        // Önce local'e kaydet
        if (originalSaveData) {
            originalSaveData(type);
        } else {
            // Fallback: Manuel localStorage kaydetme
            localStorage.setItem(`appData_${type}`, JSON.stringify(appData[type]));
            updateStats();
            renderSection(type);
        }
        
        // Sonra Firebase'e gönder
        if (firebaseAPI) {
            firebaseAPI.saveData(type, appData[type]);
        }
    };
}

// Sayfa yüklendikten sonra enhance et
setTimeout(enhanceSaveData, 2000);

// Sürpriz veri kaydetme fonksiyonları
const originalSaveMemory = window.saveMemory;
window.saveMemory = function(title, description, photo) {
    originalSaveMemory(title, description, photo);
    if (firebaseAPI) {
        firebaseAPI.saveData('memories', surpriseData.memories);
    }
};

const originalSavePoem = window.savePoem;
window.savePoem = function() {
    originalSavePoem();
    if (firebaseAPI) {
        firebaseAPI.saveData('poems', surpriseData.poems);
    }
};

const originalSendPoemToPelin = window.sendPoemToPelin;
window.sendPoemToPelin = function() {
    originalSendPoemToPelin();
    if (firebaseAPI) {
        firebaseAPI.saveData('poems', surpriseData.poems);
    }
};

const originalSaveDateFromModal = window.saveDateFromModal;
window.saveDateFromModal = function() {
    originalSaveDateFromModal();
    if (firebaseAPI) {
        firebaseAPI.saveData('specialDates', surpriseData.specialDates);
    }
};

const originalSendMessageToPelin = window.sendMessageToPelin;
window.sendMessageToPelin = function() {
    originalSendMessageToPelin();
    if (firebaseAPI) {
        firebaseAPI.saveData('pelinMessages', appData.pelinMessages);
    }
};

// Düzenleme fonksiyonları için Firebase güncellemesi
const originalSaveEditedItem = window.saveEditedItem;
window.saveEditedItem = function() {
    originalSaveEditedItem();
    if (firebaseAPI && editingItem) {
        firebaseAPI.saveData(editingItem.type, appData[editingItem.type]);
    }
};

// Silme fonksiyonları için Firebase güncellemesi
const originalDeleteItem = window.deleteItem;
window.deleteItem = function(type, id) {
    originalDeleteItem(type, id);
    if (firebaseAPI) {
        firebaseAPI.saveData(type, appData[type]);
    }
};