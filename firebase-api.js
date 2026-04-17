// Firebase API Integration
class FirebaseAPI {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyAfqolr1y1INNeseEg2GviuP6bKrvgcdRE",
            authDomain: "emir-pelin-site-d4508.firebaseapp.com",
            databaseURL: "https://emir-pelin-site-d4508-default-rtdb.europe-west1.firebasedatabase.app/",
            projectId: "emir-pelin-site-d4508",
            storageBucket: "emir-pelin-site-d4508.firebasestorage.app",
            messagingSenderId: "220690164116",
            appId: "1:220690164116:web:f04f3e50ef740aaebcc781"
        };

        if (!window.firebase) {
            console.error('Firebase SDK yuklenemedi!');
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.database = firebase.database();
        this.isOnline = navigator.onLine;

        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showSyncStatus('Online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showSyncStatus('Offline');
        });
    }

    async saveData(path, data) {
        try {
            await this.database.ref(path).set(data);
            return true;
        } catch (error) {
            console.error('Firebase kaydetme hatasi:', error);
            return false;
        }
    }

    async loadData(path) {
        try {
            const snapshot = await this.database.ref(path).once('value');
            return snapshot.val() || [];
        } catch (error) {
            console.error('Firebase yukleme hatasi:', error);
            return null;
        }
    }

    listenToData(path, callback) {
        this.database.ref(path).on('value', (snapshot) => {
            callback(snapshot.val() || []);
        });
    }

    showSyncStatus(message) {
        const oldStatus = document.getElementById('syncStatus');
        if (oldStatus) oldStatus.remove();

        const status = document.createElement('div');
        status.id = 'syncStatus';
        status.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        if (message === 'Online') {
            status.style.background = '#10b981';
            status.textContent = 'Online';
        } else if (message === 'Offline') {
            status.style.background = '#f59e0b';
            status.textContent = 'Offline';
        }

        document.body.appendChild(status);
        setTimeout(() => {
            status.style.opacity = '0';
            setTimeout(() => status.remove(), 300);
        }, 3000);
    }
}

// Global Firebase instance
let firebaseAPI;
window.firebaseAPI = null;

function initFirebase() {
    firebaseAPI = new FirebaseAPI();
    window.firebaseAPI = firebaseAPI;
    syncAllDataFromFirebase();
    startRealtimeListeners();
}

async function syncAllDataFromFirebase() {
    if (!firebaseAPI) return;

    console.log('Firebase veriler yukleniyor...');

    const [music, dreams, notes, pelinMessages, memories, poems, specialDates,
           chatMessages, profilePhotos, userCredentials, theme] = await Promise.all([
        firebaseAPI.loadData('music'),
        firebaseAPI.loadData('dreams'),
        firebaseAPI.loadData('notes'),
        firebaseAPI.loadData('pelinMessages'),
        firebaseAPI.loadData('memories'),
        firebaseAPI.loadData('poems'),
        firebaseAPI.loadData('specialDates'),
        firebaseAPI.loadData('chatMessages'),
        firebaseAPI.loadData('profilePhotos'),
        firebaseAPI.loadData('userCredentials'),
        firebaseAPI.loadData('theme')
    ]);

    if (music)  { appData.music = music; localStorage.setItem('appData_music', JSON.stringify(music)); }
    if (dreams) { appData.dreams = dreams; localStorage.setItem('appData_dreams', JSON.stringify(dreams)); }
    if (notes)  { appData.notes = notes; localStorage.setItem('appData_notes', JSON.stringify(notes)); }
    if (pelinMessages) { appData.pelinMessages = pelinMessages; localStorage.setItem('appData_pelinMessages', JSON.stringify(pelinMessages)); }
    if (memories)     { surpriseData.memories = memories; localStorage.setItem('surpriseData_memories', JSON.stringify(memories)); }
    if (poems)        { surpriseData.poems = poems; localStorage.setItem('surpriseData_poems', JSON.stringify(poems)); }
    if (specialDates) { surpriseData.specialDates = specialDates; localStorage.setItem('surpriseData_specialDates', JSON.stringify(specialDates)); }

    if (chatMessages && typeof chatData !== 'undefined') {
        chatData.messages = chatMessages;
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }

    if (profilePhotos && typeof profilePhotos === 'object') {
        if (window.profilePhotos) Object.assign(window.profilePhotos, profilePhotos);
        localStorage.setItem('profilePhotos', JSON.stringify(profilePhotos));
    }

    if (userCredentials && typeof userCredentials === 'object') {
        if (window.userCredentials) Object.assign(window.userCredentials, userCredentials);
        localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
    }
    if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (typeof setTheme === 'function') setTheme(theme);
    }

    console.log('Firebase veriler yuklendi!');
    renderAllSections();
    updateStats();
}

function startRealtimeListeners() {
    if (!firebaseAPI) return;

    firebaseAPI.listenToData('music', (data) => {
        appData.music = data;
        localStorage.setItem('appData_music', JSON.stringify(data));
        renderSection('music');
        updateStats();
    });

    firebaseAPI.listenToData('dreams', (data) => {
        appData.dreams = data;
        localStorage.setItem('appData_dreams', JSON.stringify(data));
        renderSection('dreams');
        updateStats();
    });

    firebaseAPI.listenToData('notes', (data) => {
        appData.notes = data;
        localStorage.setItem('appData_notes', JSON.stringify(data));
        renderSection('notes');
        updateStats();
    });

    firebaseAPI.listenToData('chatMessages', (data) => {
        if (typeof chatData !== 'undefined') {
            chatData.messages = data || [];
            localStorage.setItem('chatMessages', JSON.stringify(chatData.messages));
            if (typeof loadMessages === 'function') loadMessages();
        }
    });

    firebaseAPI.listenToData('memories', (data) => {
        surpriseData.memories = data || [];
        localStorage.setItem('surpriseData_memories', JSON.stringify(data));
        if (typeof loadMemories === 'function') loadMemories();
    });

    firebaseAPI.listenToData('poems', (data) => {
        surpriseData.poems = data || [];
        localStorage.setItem('surpriseData_poems', JSON.stringify(data));
        if (typeof loadPoems === 'function') loadPoems();
    });

    firebaseAPI.listenToData('specialDates', (data) => {
        surpriseData.specialDates = data || [];
        localStorage.setItem('surpriseData_specialDates', JSON.stringify(data));
        if (typeof loadSpecialDates === 'function') loadSpecialDates();
    });

    firebaseAPI.listenToData('profilePhotos', (data) => {
        if (data && typeof data === 'object') {
            if (window.profilePhotos) Object.assign(window.profilePhotos, data);
            localStorage.setItem('profilePhotos', JSON.stringify(data));
            if (typeof updateLoginAvatars === 'function') updateLoginAvatars();
            if (typeof updateProfileAvatar === 'function') updateProfileAvatar();
        }
    });

    firebaseAPI.listenToData('userCredentials', (data) => {
        if (data && typeof data === 'object') {
            if (window.userCredentials) Object.assign(window.userCredentials, data);
            localStorage.setItem('userCredentials', JSON.stringify(data));
        }
    });

    firebaseAPI.listenToData('theme', (data) => {
        if (data) {
            document.documentElement.setAttribute('data-theme', data);
            localStorage.setItem('theme', data);
            if (typeof setTheme === 'function') setTheme(data);
        }
    });

    firebaseAPI.listenToData('emotionEntries', (data) => {
        if (data && typeof emotionData !== 'undefined') {
            emotionData.entries = Array.isArray(data) ? data : Object.values(data);
            localStorage.setItem('emotionEntries', JSON.stringify(emotionData.entries));
            if (typeof renderEmotionArchive === 'function') renderEmotionArchive();
        }
    });

    firebaseAPI.listenToData('habitList', (data) => {
        if (data && typeof habitData !== 'undefined') {
            habitData.habits = Array.isArray(data) ? data : Object.values(data);
            localStorage.setItem('habitList', JSON.stringify(habitData.habits));
            if (typeof renderHabitList === 'function') renderHabitList();
        }
    });

    firebaseAPI.listenToData('habitLogs', (data) => {
        if (data && typeof habitData !== 'undefined') {
            habitData.logs = Array.isArray(data) ? data : Object.values(data);
            localStorage.setItem('habitLogs', JSON.stringify(habitData.logs));
            if (typeof renderHabitList === 'function') renderHabitList();
        }
    });

    firebaseAPI.listenToData('goalList', (data) => {
        if (data && typeof goalData !== 'undefined') {
            goalData.goals = Array.isArray(data) ? data : Object.values(data);
            localStorage.setItem('goalList', JSON.stringify(goalData.goals));
            if (typeof renderGoalList === 'function') renderGoalList();
        }
    });
}

// enhanceSaveData - artık gerekmiyor, script.js zaten Firebase'e kaydediyor
function enhanceSaveData() {}
