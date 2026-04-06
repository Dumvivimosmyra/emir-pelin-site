// App State
let currentUser = null;
let selectedUser = null;
let currentSection = 'home';
let currentModalType = null;
let editingItem = null;

// User credentials
const userCredentials = {
    emir: { password: '123456', name: 'Emir Kağan' },
    pelin: { password: '123456', name: 'Pelin' }
};

// Photo upload system for profiles
let profilePhotos = {
    emir: {
        photo: null,
        defaultEmoji: '👨'
    },
    pelin: {
        photo: null,
        defaultEmoji: '👩'
    }
};

// Data Storage
const appData = {
    music: JSON.parse(localStorage.getItem('appData_music') || '[]'),
    dreams: JSON.parse(localStorage.getItem('appData_dreams') || '[]'),
    notes: JSON.parse(localStorage.getItem('appData_notes') || '[]'),
    pelinMessages: JSON.parse(localStorage.getItem('appData_pelinMessages') || '[]')
};

// WhatsApp tarzı mesajlaşma sistemi - erken tanımla
const chatData = {
    messages: JSON.parse(localStorage.getItem('chatMessages') || '[]')
};

// Load saved user settings
function loadUserSettings() {
    const savedCredentials = localStorage.getItem('userCredentials');
    if (savedCredentials) {
        Object.assign(userCredentials, JSON.parse(savedCredentials));
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        setTimeout(() => startThemeAnimation(savedTheme), 500);
    } else {
        setTimeout(() => startThemeAnimation('sakura'), 500);
    }
}

// Save user settings
function saveUserSettings() {
    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
}

// Theme functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'default' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('theme', theme);
    }
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    startThemeAnimation(theme);
}

// Tema animasyonları
function startThemeAnimation(theme) {
    document.querySelectorAll('.sakura-particle, .forest-corner, .cosmos-star, .theme-particle').forEach(el => el.remove());
    if (window._themeAnimInterval) clearInterval(window._themeAnimInterval);

    if (theme === 'sakura') {
        spawnSakura();
        window._themeAnimInterval = setInterval(spawnSakura, 1500);
    } else if (theme === 'forest') {
        spawnForestDeco();
        spawnForestParticles();
        window._themeAnimInterval = setInterval(spawnForestParticles, 3000);
    } else if (theme === 'cosmos') {
        spawnCosmosStars();
        spawnCosmosParticles();
        window._themeAnimInterval = setInterval(spawnCosmosParticles, 2500);
    }
    // minimal: animasyon yok
}

function spawnSakura() {
    for (let i = 0; i < 3; i++) {
        const p = document.createElement('div');
        p.className = 'sakura-particle';
        const size = Math.random() * 8 + 5;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random() * 100}vw;
            top:-10px;
            animation-duration:${Math.random() * 8 + 8}s;
            animation-delay:${Math.random() * 2}s;
            opacity:0.4;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 18000);
    }
}

function spawnForestDeco() {
    ['tl','tr','bl','br'].forEach(pos => {
        const el = document.createElement('div');
        el.className = `forest-corner ${pos}`;
        document.body.appendChild(el);
    });
}

function spawnForestParticles() {
    for (let i = 0; i < 4; i++) {
        const p = document.createElement('div');
        p.className = 'theme-particle';
        const size = Math.random() * 5 + 3;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            bottom:${Math.random() * 40 + 10}vh;
            left:${Math.random() * 100}vw;
            --drift:${(Math.random() - 0.5) * 60}px;
            animation-duration:${Math.random() * 5 + 5}s;
            animation-delay:${Math.random() * 2}s;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 12000);
    }
}

function spawnCosmosStars() {
    for (let i = 0; i < 70; i++) {
        const star = document.createElement('div');
        star.className = 'cosmos-star';
        const size = Math.random() * 2 + 0.5;
        star.style.cssText = `
            width:${size}px; height:${size}px;
            top:${Math.random() * 100}vh;
            left:${Math.random() * 100}vw;
            animation-duration:${Math.random() * 4 + 2}s;
            animation-delay:${Math.random() * 5}s;
        `;
        document.body.appendChild(star);
    }
}

function spawnCosmosParticles() {
    for (let i = 0; i < 4; i++) {
        const p = document.createElement('div');
        p.className = 'theme-particle';
        const size = Math.random() * 4 + 2;
        const colors = ['rgba(128,112,248,0.7)','rgba(167,139,250,0.6)','rgba(232,121,249,0.5)','rgba(99,102,241,0.6)'];
        p.style.cssText = `
            width:${size}px; height:${size}px;
            bottom:${Math.random() * 70 + 5}vh;
            left:${Math.random() * 100}vw;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            --drift:${(Math.random() - 0.5) * 80}px;
            animation-duration:${Math.random() * 6 + 5}s;
            animation-delay:${Math.random() * 2}s;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 14000);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadUserSettings();
    
    // Load profile photos
    const savedPhotos = localStorage.getItem('profilePhotos');
    if (savedPhotos) {
        Object.assign(profilePhotos, JSON.parse(savedPhotos));
    }
    
    // Load chat messages
    const savedChat = localStorage.getItem('chatMessages');
    if (savedChat) {
        chatData.messages = JSON.parse(savedChat);
    }
    
    // Setup event listeners
    setupMessageKeyListener();
    setupKeyboardShortcuts();
    
    // YouTube API yükle
    loadYouTubeAPI();
    
    // Update login avatars
    updateLoginAvatars();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && userCredentials[savedUser]) {
        currentUser = savedUser;
        showMainApp();
    }
    
    updateStats();
    renderAllSections();
    
    // Setup modal event listeners
    setupModalEventListeners();
});

// Modal event listeners - ayrı fonksiyon
function setupModalEventListeners() {
    const addModal = document.getElementById('addModal');
    const editModal = document.getElementById('editModal');
    
    if (addModal) {
        addModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    if (editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeEditModal();
            }
        });
    }
}

// Update login screen avatars
function updateLoginAvatars() {
    const emirAvatar = document.getElementById('emirAvatar');
    const pelinAvatar = document.getElementById('pelinAvatar');
    
    if (emirAvatar) {
        if (profilePhotos.emir.photo) {
            emirAvatar.innerHTML = `<img src="${profilePhotos.emir.photo}" alt="Emir" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            emirAvatar.innerHTML = `<div style="font-size: 3rem;">${profilePhotos.emir.defaultEmoji}</div>`;
        }
    }
    
    if (pelinAvatar) {
        if (profilePhotos.pelin.photo) {
            pelinAvatar.innerHTML = `<img src="${profilePhotos.pelin.photo}" alt="Pelin" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            pelinAvatar.innerHTML = `<div style="font-size: 3rem;">${profilePhotos.pelin.defaultEmoji}</div>`;
        }
    }
}

// Avatar Designer Functions - REMOVED
// Avatar system has been replaced with photo upload system

// User selection
function selectUser(user) {
    selectedUser = user;
    document.querySelectorAll('.user-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[onclick="selectUser('${user}')"]`).classList.add('selected');
    document.getElementById('passwordInput').focus();
}

// Login attempt
function attemptLogin() {
    const password = document.getElementById('passwordInput').value;
    
    if (!selectedUser) {
        showError('Lütfen bir kullanıcı seçin');
        return;
    }
    
    if (!password) {
        showError('Lütfen şifrenizi girin');
        return;
    }
    
    if (userCredentials[selectedUser].password === password) {
        login(selectedUser);
    } else {
        showError('Yanlış şifre!');
        document.getElementById('passwordInput').value = '';
    }
}

// Show error message
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.password-section').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// User Authentication
function login(user) {
    currentUser = user;
    localStorage.setItem('currentUser', user);

    // OneSignal bildirim sistemi başlat - devre dışı
    // if (typeof initOneSignal === 'function') {
    //     setTimeout(() => initOneSignal(user), 2000);
    // }

    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');

    loginScreen.style.transform = 'translateY(-100%)';
    loginScreen.style.opacity = '0';

    setTimeout(() => {
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        showMainApp();
    }, 300);
}

function logout() {
    currentUser = null;
    selectedUser = null;
    localStorage.removeItem('currentUser');
    
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    
    mainApp.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginScreen.style.transform = 'translateY(0)';
    loginScreen.style.opacity = '1';
    
    // Reset login form
    document.getElementById('passwordInput').value = '';
    document.querySelectorAll('.user-option').forEach(option => {
        option.classList.remove('selected');
    });
}

function showMainApp() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Hoş Geldin ${userCredentials[currentUser].name} 💕`;
    
    // Setup profile section
    setupProfileSection();
    
    // Setup surprise section
    setupSurpriseSection();
}

// Profile Section Setup
function setupProfileSection() {
    const profileName = document.getElementById('profileName');
    const avatarGrid = document.getElementById('profileAvatarGrid');

    updateProfileAvatar();
    if (profileName) profileName.textContent = userCredentials[currentUser].name;

    const user = profilePhotos[currentUser];
    if (avatarGrid) {
        avatarGrid.innerHTML = `
            <div class="photo-upload-section">
                <button class="add-btn" onclick="openPhotoUpload()" style="width:100%;margin-bottom:0.5rem;">
                    📸 Fotoğraf Yükle
                </button>
                ${user.photo ? `<button class="remove-btn" onclick="removePhoto()" style="width:100%;background:#ef4444;color:white;">🗑️ Kaldır</button>` : ''}
            </div>
        `;
    }

    // Aktif temayı işaretle
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'default';
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });

    updateProfileStats();
}

// WhatsApp tarzı mesajlaşma fonksiyonları

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        messageInput.focus();
        return;
    }
    
    const newMessage = {
        id: Date.now(),
        text: message,
        sender: currentUser,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    chatData.messages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatData.messages));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('chatMessages', chatData.messages);
    }


    messageInput.value = '';
    loadMessages();
    
    // Scroll to bottom
    const messagesArea = document.getElementById('messagesArea');
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

function loadMessages() {
    const messagesArea = document.getElementById('messagesArea');
    if (!messagesArea) return;
    
    if (chatData.messages.length === 0) {
        messagesArea.innerHTML = `
            <div class="empty-chat">
                <p>💕 Henüz mesaj yok. İlk mesajı sen gönder!</p>
            </div>
        `;
        return;
    }
    
    messagesArea.innerHTML = chatData.messages.map(msg => {
        const reactions = msg.reactions || {};
        const reactionHtml = Object.entries(reactions).map(([emoji, users]) =>
            users.length > 0 ? `<span class="reaction-badge ${users.includes(currentUser) ? 'reacted' : ''}" onclick="toggleReaction(${msg.id}, '${emoji}')">${emoji} ${users.length}</span>` : ''
        ).join('');

        return `
        <div class="message ${msg.sender === currentUser ? 'my-message' : 'other-message'}" id="msg-${msg.id}">
            <div class="message-content" oncontextmenu="showReactionPicker(event, ${msg.id})" ontouchstart="handleMsgTouchStart(event, ${msg.id})" ontouchend="handleMsgTouchEnd()">
                <p>${escapeHtml(msg.text)}</p>
                <small class="message-time">${new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
            ${reactionHtml ? `<div class="reaction-row">${reactionHtml}</div>` : ''}
        </div>
    `}).join('');
    
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Emoji reaksiyon sistemi
const REACTION_EMOJIS = [
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍','💕','💞',
    '😂','😍','🥰','😘','😊','😎','🤩','😏','😢','😭',
    '😮','😱','🤯','😡','🤬','🥺','😴','🤔','🙄','😅',
    '👍','👎','👏','🙌','🤝','🫶','💪','🤞','✌️','🫠',
    '🔥','✨','💫','⭐','🎉','🎊','🎁','🏆','💯','❗'
];
let touchTimer = null;

function showReactionPicker(e, msgId) {
    e.preventDefault();
    openReactionPicker(msgId);
}

function handleMsgTouchStart(e, msgId) {
    touchTimer = setTimeout(() => openReactionPicker(msgId), 500);
}

function handleMsgTouchEnd() {
    clearTimeout(touchTimer);
}

function openReactionPicker(msgId) {
    closeReactionPicker();
    const msgEl = document.getElementById(`msg-${msgId}`);
    if (!msgEl) return;

    const picker = document.createElement('div');
    picker.className = 'reaction-picker';
    picker.id = 'reactionPicker';
    picker.innerHTML = `
        <div class="reaction-picker-grid">
            ${REACTION_EMOJIS.map(e =>
                `<button class="reaction-option" onclick="toggleReaction(${msgId}, '${e}'); closeReactionPicker();">${e}</button>`
            ).join('')}
        </div>
    `;

    msgEl.appendChild(picker);
    setTimeout(() => document.addEventListener('click', closeReactionPicker, { once: true }), 100);
}

function closeReactionPicker() {
    const p = document.getElementById('reactionPicker');
    if (p) p.remove();
}

function toggleReaction(msgId, emoji) {
    const msg = chatData.messages.find(m => m.id === msgId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const idx = msg.reactions[emoji].indexOf(currentUser);
    if (idx === -1) {
        msg.reactions[emoji].push(currentUser);
    } else {
        msg.reactions[emoji].splice(idx, 1);
    }

    // Firebase'e kaydet
    localStorage.setItem('chatMessages', JSON.stringify(chatData.messages));
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('chatMessages', chatData.messages);
    }
    loadMessages();
}

// Enter tuşu ile mesaj gönderme - sadece bir kez tanımla
function setupMessageKeyListener() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const messageInput = document.getElementById('messageInput');
            if (messageInput && document.activeElement === messageInput) {
                e.preventDefault();
                sendMessage();
            }
        }
    });
}

function sendMessageToPelin() {
    // Eski fonksiyon - artık kullanılmıyor
    sendMessage();
}

function sendPoemToPelin() {
    // Bu fonksiyon artık sadece sürpriz bölümünde kullanılıyor
    // Profil bölümünden kaldırıldı
    console.log('Şiir yazma sadece sürpriz bölümünde mevcut');
}

function changeAvatar(avatar) {
    // This function is now replaced by photo upload
    openPhotoUpload();
}

// Photo upload functions
function openPhotoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Fotoğraf boyutu çok büyük! Maksimum 5MB olmalı.');
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Lütfen sadece resim dosyası seçin!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Resize and crop image for profile
            resizeAndCropImage(e.target.result, (croppedImage) => {
                profilePhotos[currentUser].photo = croppedImage;
                localStorage.setItem('profilePhotos', JSON.stringify(profilePhotos));
                
                // Firebase'e kaydet
                if (window.firebaseAPI) {
                    window.firebaseAPI.saveData('profilePhotos', profilePhotos);
                }
                
                updateProfileAvatar();
                updateLoginAvatars();
                setupProfileSection(); // Refresh profile section
                alert('Profil fotoğrafı başarıyla güncellendi! 📸');
            });
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function removePhoto() {
    if (confirm('Profil fotoğrafını kaldırmak istediğinizden emin misiniz?')) {
        profilePhotos[currentUser].photo = null;
        localStorage.setItem('profilePhotos', JSON.stringify(profilePhotos));
        
        // Firebase'e kaydet
        if (window.firebaseAPI) {
            window.firebaseAPI.saveData('profilePhotos', profilePhotos);
        }
        
        updateProfileAvatar();
        updateLoginAvatars();
        setupProfileSection(); // Refresh profile section
        alert('Profil fotoğrafı kaldırıldı.');
    }
}

function updateProfileAvatar() {
    const currentAvatar = document.getElementById('currentAvatar');
    if (!currentAvatar) return;
    
    const user = profilePhotos[currentUser];
    if (user.photo) {
        currentAvatar.innerHTML = `<img src="${user.photo}" alt="${userCredentials[currentUser].name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
        currentAvatar.innerHTML = `<div style="font-size: 4rem;">${user.defaultEmoji}</div>`;
    }
}

// Image resize and crop function
function resizeAndCropImage(imageSrc, callback, size = 200) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // Set canvas size to desired output size
        canvas.width = size;
        canvas.height = size;
        
        // Calculate crop dimensions (square crop from center)
        const minDimension = Math.min(img.width, img.height);
        const cropX = (img.width - minDimension) / 2;
        const cropY = (img.height - minDimension) / 2;
        
        // Draw cropped and resized image
        ctx.drawImage(img, cropX, cropY, minDimension, minDimension, 0, 0, size, size);
        
        // Convert to JPEG with compression
        const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
        callback(croppedImage);
    };
    
    img.src = imageSrc;
}

function updateProfileStats() {
    // İstatistik elementleri HTML'den kaldırıldı, sessizce geç
    const m = document.getElementById('profileMusicCount');
    const d = document.getElementById('profileDreamCount');
    const n = document.getElementById('profileNoteCount');
    if (m) m.textContent = appData.music.filter(item => item.createdBy === currentUser).length;
    if (d) d.textContent = appData.dreams.filter(item => item.createdBy === currentUser).length;
    if (n) n.textContent = appData.notes.filter(item => item.createdBy === currentUser).length;
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    if (!currentPassword || !newPassword) {
        showProfileMessage('Lütfen tüm alanları doldurun', 'error');
        return;
    }
    
    if (userCredentials[currentUser].password !== currentPassword) {
        showProfileMessage('Mevcut şifre yanlış', 'error');
        return;
    }
    
    if (newPassword.length < 4) {
        showProfileMessage('Yeni şifre en az 4 karakter olmalı', 'error');
        return;
    }
    
    userCredentials[currentUser].password = newPassword;
    saveUserSettings();
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('userCredentials', userCredentials);
    }
    
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    
    showProfileMessage('Şifre başarıyla değiştirildi', 'success');
}

function showProfileMessage(message, type) {
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    document.querySelector('.password-change').appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Surprise Section Setup
function setupSurpriseSection() {
    const surpriseContent = document.getElementById('surpriseContent');
    
    // Hem Pelin hem Emir sürprizleri görebilir
    surpriseContent.innerHTML = `
        <div class="surprise-welcome">
            <h2>💕 Pelin'e Özel Sürprizler</h2>
            <p>${currentUser === 'pelin' ? 'Bu bölüm sadece senin için hazırlandı!' : 'Pelin için hazırladığın özel bölüm'} ❤️</p>
        </div>
        
        <div class="love-counter-card">
            <div class="counter-display">
                <span class="counter-label">Nerdeyse bir yıldır birlikteyiz ❤️</span>
            </div>
        </div>
        
        <div class="daily-message-card">
            <h3>💌 Bugünün Özel Mesajı</h3>
            <div class="message-content">
                <p id="dailyMessage">Sen benim hayatımın en güzel hediyesisin 💕</p>
            </div>
        </div>
        
        <div class="surprise-actions">
            <button class="heart-rain-btn" onclick="startHeartRain()">
                💖 Kalp Yağmuru Başlat 💖
            </button>
        </div>
        
        <div class="surprise-grid">
            <div class="surprise-card" onclick="openMemorySection()">
                <div class="surprise-icon">📸</div>
                <div class="surprise-title">Anı Kutusu</div>
                <div class="surprise-description">Güzel anılarımızı ekle ve görüntüle</div>
            </div>
            
            <div class="surprise-card" onclick="openPoemSection()">
                <div class="surprise-icon">📝</div>
                <div class="surprise-title">Sevgi Şiiri</div>
                <div class="surprise-description">${currentUser === 'emir' ? 'Pelin için şiir yaz' : 'Emir\'in yazdığı şiirler'}</div>
            </div>
            
            <div class="surprise-card" onclick="openSpecialDatesSection()">
                <div class="surprise-icon">📅</div>
                <div class="surprise-title">Özel Günler</div>
                <div class="surprise-description">Özel günleri planla ve görüntüle</div>
            </div>
        </div>
    `;
    
    updateLoveCounter();
    updateDailyMessage();
}

// Surprise Functions - setupSurpriseSection artık HTML'de statik
function updateLoveCounter() {
    const startDate = new Date('2024-12-07');
    const today = new Date();
    const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    const counter = document.getElementById('loveCounter');
    if (counter) {
        counter.textContent = daysTogether;
    }
}

function updateDailyMessage() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Özel günler - ay/gün bazlı
    const special = {
        "1/1":   "Yeni yıl, yeni başlangıçlar. Seninle geçireceğim bu yıla çok şey bekliyorum.",
        "2/14":  "Sevgililer Günü bugün ama ben her gün seni düşünüyorum zaten.",
        "3/8":   "Bugün Dünya Kadınlar Günü. Güçlü, zeki ve güzel olduğun için şanslıyım.",
        "3/20":  "Bahar bugün başlıyor. Seninle her mevsim güzel ama bahar biraz daha özel.",
        "4/23":  "Bugün çocukların günü. Seninle bazen çocuklar gibi gülüp eğleniyoruz, bu çok güzel.",
        "5/1":   "1 Mayıs. Bugün dinlen, hak ettin.",
        "5/19":  "Bugün gençlik ve spor günü. Seninle her gün enerjik hissediyorum.",
        "6/21":  "Yaz bugün başlıyor. Seninle geçirecek planlar yapmak istiyorum.",
        "7/4":   "Yaz ortası. Seninle bir yerlere gitmek, bir şeyler keşfetmek istiyorum.",
        "8/30":  "Bugün Zafer Bayramı. Seninle olmak da benim için bir zafer gibi hissettiriyor.",
        "9/22":  "Sonbahar başlıyor. Yapraklar dökülüyor ama seninle her şey yerli yerinde.",
        "10/29": "Cumhuriyet Bayramı. Bugün özel bir gün, seninle kutlamak güzel olurdu.",
        "11/10": "Bugün Atatürk'ü anıyoruz. Saygıyla.",
        "12/7":  "Bugün bizim için özel bir gün. Bir yıl önce başladı her şey.",
        "12/21": "Kış bugün başlıyor. Seninle sıcak bir yerde olmak istiyorum.",
        "12/24": "Yılbaşı arifesi. Bu yılı seninle geçirdiğim için mutluyum.",
        "12/31": "Yılın son günü. Seninle geçen bu yıl için teşekkür ederim."
    };

    const key = `${month}/${day}`;
    if (special[key]) {
        const el = document.getElementById('dailyMessage');
        if (el) el.textContent = special[key];
        return;
    }

    // Günlük mesajlar - 365 gün için
    const messages = [
        // Ocak
        "Bugün nasılsın? Umarım güzel bir gün geçiriyorsundur.",
        "Seninle konuşmak her zaman iyi geliyor.",
        "Bugün aklıma geldin, iyi misin?",
        "Küçük şeyler bazen en güzel olanlar.",
        "Seninle geçen zamanı seviyorum.",
        "Bugün bir şey güldürdü mü seni?",
        "Umarım bugün her şey yolunda gider.",
        "Seninle olmak rahatlatıcı.",
        "Bugün kendine iyi bak.",
        "Birlikte güldüğümüz anları özlüyorum.",
        "Seninle her şey biraz daha kolay.",
        "Bugün nasıl geçti?",
        "Seninle vakit geçirmek istiyorum.",
        "Küçük bir mesaj, büyük bir his.",
        "Umarım bugün güzel bir şey olmuştur.",
        "Seninle olmak güzel.",
        "Bugün seni düşündüm.",
        "Her şey yolunda mı?",
        "Seninle gülmek en sevdiğim şeylerden.",
        "Bugün kendine nazik ol.",
        "Seninle geçen her an değerli.",
        "Umarım bugün enerjin yerindedir.",
        "Seninle konuşmak istiyorum.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle olmak huzur veriyor.",
        "Bugün nasıl hissediyorsun?",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün güldün.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün iyi şeyler olsun.",
        "Seninle olmak güzel bir his.",
        // Şubat
        "Bugün soğuk ama seninle sıcak.",
        "Umarım bugün güzel geçiyor.",
        "Seninle konuşmak her zaman iyi.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle olmak rahatlatıcı.",
        "Bugün nasılsın?",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha kolay.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak güzel.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak rahatlatıcı.",
        // Mart
        "Bahar geliyor, seninle güzel olacak.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle her şey daha kolay.",
        // Nisan
        "Nisan yağmurları güzel, seninle daha da güzel.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        // Mayıs
        "Mayıs güzel, seninle daha da güzel.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle her şey daha kolay.",
        // Haziran
        "Yaz geliyor, seninle güzel olacak.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        // Temmuz
        "Yaz ortası, seninle her şey daha güzel.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle her şey daha kolay.",
        // Ağustos
        "Yaz bitmeden seninle güzel anlar yaşayalım.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle her şey daha kolay.",
        // Eylül
        "Sonbahar geliyor, seninle her mevsim güzel.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        // Ekim
        "Sonbahar ortası, yapraklar dökülüyor ama seninle her şey yerli yerinde.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle her şey daha kolay.",
        // Kasım
        "Kasım soğuğu var ama seninle sıcak.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        // Aralık
        "Aralık geldi, yıl bitmek üzere. Seninle güzel geçti.",
        "Bugün nasılsın?",
        "Seninle konuşmak iyi geliyor.",
        "Umarım bugün güzel geçiyor.",
        "Seninle olmak güzel.",
        "Bugün kendine iyi bak.",
        "Seninle gülmek güzel.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün güzel bir şey olsun.",
        "Seninle her şey daha anlamlı.",
        "Umarım bugün iyi geçiyor.",
        "Seninle olmak rahatlatıcı.",
        "Bugün seni düşündüm.",
        "Seninle konuşmak istiyorum.",
        "Umarım bugün güldün.",
        "Seninle geçen zaman değerli.",
        "Bugün nasıl hissediyorsun?",
        "Seninle olmak huzur veriyor.",
        "Bugün iyi şeyler olsun.",
        "Seninle her an özel.",
        "Umarım bugün güzel geçti.",
        "Seninle olmak güzel bir his.",
        "Bugün kendine nazik ol.",
        "Seninle gülmek en güzel şey.",
        "Umarım bugün enerjin yerinde.",
        "Seninle vakit geçirmek istiyorum.",
        "Bugün nasılsın?",
        "Seninle olmak güzel.",
        "Bugün güzel bir şey fark ettin mi?",
        "Seninle her şey daha kolay."
    ];

    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) - 1;

    const el = document.getElementById('dailyMessage');
    if (el) el.textContent = messages[dayOfYear % messages.length];
}
function startHeartRain() {
    const hearts = ['💕', '💖', '💗', '💝', '💞', '❤️', '💙', '💜'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-rain';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }, i * 200);
    }
}

function showLoveMessage() {
    alert('💕 Sen benim hayatımın en güzel parçasısın. Her gün seni biraz daha çok seviyorum. Seninle geçirdiğim her an benim için çok değerli. Seni çok ama çok seviyorum Pelin! 💕');
}

function showMemoryBox() {
    alert('📸 Burada ileride güzel anılarımızın fotoğraflarını saklayacağız. İlk buluşmamız, birlikte gittiğimiz yerler, güzel anlarımız... Hepsi burada olacak! 💕');
}

function showLovePoem() {
    const poem = `💝 Sana Özel Şiir 💝

Gözlerin yıldız gibi parlıyor,
Gülüşün kalbimi çalıyor.
Sen benim hayallerimin kraliçesi,
Aşkımın en güzel hikayesi.

Seninle her gün bayram,
Sensiz geçen her an haram.
Sen benim dünyamın güneşi,
Kalbimin tek sahibesi.

Seni seviyorum Pelin 💕`;
    
    alert(poem);
}

// Tam ekran sayfa açma sistemi
function openFullPage(title, contentFn) {
    const page = document.getElementById('fullPage');
    const titleEl = document.getElementById('fullPageTitle');
    const body = document.getElementById('fullPageBody');
    if (!page) return;
    titleEl.textContent = title;
    body.innerHTML = '';
    page.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    contentFn(body);
}

function closeSectionModal() {
    const page = document.getElementById('fullPage');
    if (page) page.classList.add('hidden');
    document.body.style.overflow = '';
    document.querySelectorAll('.section-modal').forEach(m => m.remove());
}

function openMemorySection() {
    openFullPage('📸 Anılar', (body) => {
        body.innerHTML = `
            <div class="memory-upload" style="margin-bottom:1rem;">
                <button class="add-btn" onclick="addMemory()">📷 Anı Ekle</button>
            </div>
            <div class="memories-grid" id="memoriesGrid"></div>
        `;
        loadMemories();
    });
}

function openPoemSection() {
    openFullPage('📝 Şiirler', (body) => {
        body.innerHTML = `
            ${currentUser === 'emir' ? `
                <div class="poem-editor">
                    <textarea id="poemInput" placeholder="Bir şiir yaz..."></textarea>
                    <button class="add-btn" onclick="savePoem()" style="width:100%;margin-top:0.5rem;">Kaydet</button>
                </div>
            ` : `<p style="text-align:center;color:var(--text-secondary);margin-bottom:1.5rem;">Emir'in yazdığı şiirler</p>`}
            <div class="poems-list" id="poemsList"></div>
        `;
        loadPoems();
    });
}

function openSpecialDatesSection() {
    openFullPage('📅 Özel Günler', (body) => {
        body.innerHTML = `
            <div style="margin-bottom:1rem;">
                <button class="add-btn" onclick="addSpecialDate()">➕ Özel Gün Ekle</button>
            </div>
            <div class="calendar-view" id="calendarView"></div>
        `;
        loadSpecialDates();
    });
}

// Data management for new sections
const surpriseData = {
    memories: JSON.parse(localStorage.getItem('surpriseData_memories') || '[]'),
    poems: JSON.parse(localStorage.getItem('surpriseData_poems') || '[]'),
    specialDates: JSON.parse(localStorage.getItem('surpriseData_specialDates') || '[]')
};

function saveMemory(title, description, photo) {
    const newMemory = {
        id: Date.now(),
        title: title,
        description: description,
        photo: photo,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    surpriseData.memories.unshift(newMemory);
    localStorage.setItem('surpriseData_memories', JSON.stringify(surpriseData.memories));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('memories', surpriseData.memories);
    }
    
    loadMemories();
}

function savePoem() {
    const poemInput = document.getElementById('poemInput');
    const poem = poemInput.value.trim();
    
    if (!poem) {
        alert('Lütfen bir şiir yazın!');
        return;
    }
    
    const newPoem = {
        id: Date.now(),
        content: poem,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    surpriseData.poems.unshift(newPoem);
    localStorage.setItem('surpriseData_poems', JSON.stringify(surpriseData.poems));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('poems', surpriseData.poems);
    }
    
    poemInput.value = '';
    loadPoems();
    alert('Şiir başarıyla kaydedildi! 💕');
}

function loadMemories() {
    const grid = document.getElementById('memoriesGrid');
    if (!grid) return;
    
    if (surpriseData.memories.length === 0) {
        grid.innerHTML = '<div class="empty-message">Henüz anı eklenmemiş. İlk anıyı sen ekle! 📸</div>';
        return;
    }
    
    grid.innerHTML = surpriseData.memories.map((memory, index) => `
        <div class="memory-card">
            ${memory.photo 
                ? `<img src="${memory.photo}" alt="${memory.title}" class="memory-img" onclick="openGallery(${index})">`
                : '<div class="no-photo">📷</div>'}
            <div class="memory-info">
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
                <small>${memory.createdAtFormatted} - ${getUserName(memory.createdBy)}</small>
                <div class="memory-actions">
                    <button class="edit-btn" onclick="editMemory(${memory.id})" title="Düzenle">✏️</button>
                    <button class="delete-btn" onclick="deleteMemory(${memory.id})" title="Sil">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Galeri sistemi
let galleryIndex = 0;

function openGallery(index) {
    const photos = surpriseData.memories.filter(m => m.photo);
    if (photos.length === 0) return;

    const clickedMemory = surpriseData.memories[index];
    galleryIndex = photos.findIndex(m => m.id === clickedMemory.id);
    if (galleryIndex === -1) galleryIndex = 0;

    const old = document.getElementById('galleryOverlay');
    if (old) old.remove();

    // Scroll'u kilitle
    document.body.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'galleryOverlay';
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
        <button class="gallery-close" onclick="closeGallery()">✕</button>
        <button class="gallery-nav gallery-prev" onclick="galleryNav(-1)">‹</button>
        <div class="gallery-content">
            <img id="galleryImg" src="${photos[galleryIndex].photo}" alt="">
            <div class="gallery-caption">
                <strong id="galleryTitle">${photos[galleryIndex].title}</strong>
                <span id="galleryDesc">${photos[galleryIndex].description || ''}</span>
                <small id="galleryMeta">${photos[galleryIndex].createdAtFormatted}</small>
            </div>
            <div class="gallery-dots" id="galleryDots"></div>
        </div>
        <button class="gallery-nav gallery-next" onclick="galleryNav(1)">›</button>
    `;
    document.body.appendChild(overlay);
    updateGalleryDots(photos);

    let touchStartX = 0;
    overlay.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) galleryNav(diff > 0 ? 1 : -1);
    });

    document.addEventListener('keydown', galleryKeyHandler);
}

function galleryKeyHandler(e) {
    if (e.key === 'ArrowRight') galleryNav(1);
    if (e.key === 'ArrowLeft') galleryNav(-1);
    if (e.key === 'Escape') closeGallery();
}

function galleryNav(dir) {
    const photos = surpriseData.memories.filter(m => m.photo);
    galleryIndex = (galleryIndex + dir + photos.length) % photos.length;
    document.getElementById('galleryImg').src = photos[galleryIndex].photo;
    document.getElementById('galleryTitle').textContent = photos[galleryIndex].title;
    document.getElementById('galleryDesc').textContent = photos[galleryIndex].description || '';
    document.getElementById('galleryMeta').textContent = photos[galleryIndex].createdAtFormatted;
    updateGalleryDots(photos);
}

function updateGalleryDots(photos) {
    const dots = document.getElementById('galleryDots');
    if (!dots) return;
    dots.innerHTML = photos.map((_, i) => 
        `<span class="gallery-dot ${i === galleryIndex ? 'active' : ''}" onclick="galleryNav(${i - galleryIndex})"></span>`
    ).join('');
}

function closeGallery() {
    const overlay = document.getElementById('galleryOverlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', galleryKeyHandler);
}

function loadPoems() {
    const list = document.getElementById('poemsList');
    if (!list) return;
    
    // Sadece Emir'in yazdığı şiirleri göster
    const emirPoems = surpriseData.poems.filter(poem => poem.createdBy === 'emir');
    
    if (emirPoems.length === 0) {
        list.innerHTML = '<div class="empty-message">Henüz şiir yazılmamış. Emir profilinden şiir yazabilir! 📝</div>';
        return;
    }
    
    list.innerHTML = emirPoems.map(poem => `
        <div class="poem-card">
            <div class="poem-content">${poem.content.replace(/\n/g, '<br>')}</div>
            <div class="poem-info">
                <small>${poem.createdAtFormatted} - ${getUserName(poem.createdBy)}</small>
                ${currentUser === 'emir' ? `
                    <div class="poem-actions">
                        <button class="edit-btn" onclick="editPoem(${poem.id})" title="Düzenle">✏️</button>
                        <button class="delete-btn" onclick="deletePoem(${poem.id})" title="Sil">🗑️</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function loadSpecialDates() {
    const view = document.getElementById('calendarView');
    if (!view) return;
    
    // Tüm tarihleri göster (geçmiş ve gelecek)
    const allEvents = surpriseData.specialDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (allEvents.length === 0) {
        view.innerHTML = '<div class="empty-message">Henüz özel gün eklenmemiş. İlk özel günü ekle! 📅</div>';
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    view.innerHTML = allEvents.map(event => {
        const eventDate = new Date(event.date);
        const isPast = eventDate < today;
        const isToday = eventDate.getTime() === today.getTime();
        
        return `
            <div class="date-card ${isPast ? 'past-event' : ''} ${isToday ? 'today-event' : ''}">
                <div class="date-info">
                    <div class="date-day">${eventDate.getDate()}</div>
                    <div class="date-month">${eventDate.toLocaleDateString('tr-TR', { month: 'long' })}</div>
                    <div class="date-year">${eventDate.getFullYear()}</div>
                </div>
                <div class="event-info">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="event-actions">
                        <button class="edit-btn" onclick="editSpecialDate(${event.id})" title="Düzenle">✏️</button>
                        <button class="delete-btn" onclick="deleteSpecialDate(${event.id})" title="Sil">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Add Memory function - opens photo upload modal
function addMemory() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📸 Yeni Anı Ekle</h3>
                <button class="close-btn" onclick="closeMemoryModal()">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" id="memoryTitle" placeholder="Anı başlığı...">
                <textarea id="memoryDescription" placeholder="Bu anıyı anlat..."></textarea>
                <div class="photo-upload-area">
                    <input type="file" id="memoryPhoto" accept="image/*" style="display: none;">
                    <button class="add-btn" onclick="document.getElementById('memoryPhoto').click()">
                        📷 Fotoğraf Seç
                    </button>
                    <div id="photoPreview" style="margin-top: 1rem;"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeMemoryModal()">İptal</button>
                <button class="save-btn" onclick="saveMemoryFromModal()">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Handle photo selection
    const memoryPhotoInput = document.getElementById('memoryPhoto');
    if (memoryPhotoInput) {
        memoryPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Fotoğraf boyutu çok büyük! Maksimum 5MB olmalı.');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Lütfen sadece resim dosyası seçin!');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('photoPreview');
                if (preview) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Önizleme" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                        <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Fotoğraf seçildi ✓</p>
                    `;
                }
            };
            reader.readAsDataURL(file);
        });
    }
}

function closeMemoryModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function saveMemoryFromModal() {
    const title = document.getElementById('memoryTitle').value.trim();
    const description = document.getElementById('memoryDescription').value.trim();
    const photoInput = document.getElementById('memoryPhoto');
    
    if (!title) {
        alert('Lütfen anı başlığı girin!');
        return;
    }
    
    if (photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Resize and crop image for memory
            resizeAndCropImage(e.target.result, (croppedImage) => {
                saveMemory(title, description, croppedImage);
                closeMemoryModal();
                alert('Anı başarıyla eklendi! 📸');
            });
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        // Save without photo
        saveMemory(title, description, null);
        closeMemoryModal();
        alert('Anı başarıyla eklendi! 📸');
    }
}

// Add Special Date function - opens date picker modal
function addSpecialDate() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📅 Özel Gün Ekle</h3>
                <button class="close-btn" onclick="closeDateModal()">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" id="eventTitle" placeholder="Özel gün başlığı...">
                <textarea id="eventDescription" placeholder="Bu özel günü anlat..."></textarea>
                <input type="date" id="eventDate" min="${new Date().toISOString().split('T')[0]}">
                <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                    * Sadece gelecekteki tarihler seçilebilir
                </small>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeDateModal()">İptal</button>
                <button class="save-btn" onclick="saveDateFromModal()">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeDateModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function saveDateFromModal() {
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const date = document.getElementById('eventDate').value;
    
    if (!title) {
        alert('Lütfen özel gün başlığı girin!');
        return;
    }
    
    if (!date) {
        alert('Lütfen tarih seçin!');
        return;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
        alert('Lütfen gelecekteki bir tarih seçin!');
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        title: title,
        description: description,
        date: date,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    surpriseData.specialDates.push(newEvent);
    // Sort by date
    surpriseData.specialDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem('surpriseData_specialDates', JSON.stringify(surpriseData.specialDates));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('specialDates', surpriseData.specialDates);
    }
    
    loadSpecialDates();
    closeDateModal();
    alert('Özel gün başarıyla eklendi! 📅');
}

// Edit and Delete functions for surprise sections

// Memory functions
function editMemory(id) {
    const memory = surpriseData.memories.find(m => m.id === id);
    if (!memory) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📸 Anıyı Düzenle</h3>
                <button class="close-btn" onclick="closeEditMemoryModal()">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" id="editMemoryTitle" placeholder="Anı başlığı..." value="${memory.title}">
                <textarea id="editMemoryDescription" placeholder="Bu anıyı anlat...">${memory.description}</textarea>
                <div class="photo-upload-area">
                    <input type="file" id="editMemoryPhoto" accept="image/*" style="display: none;">
                    <button class="add-btn" onclick="document.getElementById('editMemoryPhoto').click()">
                        📷 Fotoğraf Değiştir
                    </button>
                    <div id="editPhotoPreview" style="margin-top: 1rem;">
                        ${memory.photo ? `<img src="${memory.photo}" alt="Mevcut fotoğraf" style="max-width: 100%; max-height: 200px; border-radius: 8px;">` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeEditMemoryModal()">İptal</button>
                <button class="save-btn" onclick="saveEditedMemory(${id})">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Handle photo selection
    const editMemoryPhotoInput = document.getElementById('editMemoryPhoto');
    if (editMemoryPhotoInput) {
        editMemoryPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Fotoğraf boyutu çok büyük! Maksimum 5MB olmalı.');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                alert('Lütfen sadece resim dosyası seçin!');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('editPhotoPreview');
                if (preview) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Yeni fotoğraf" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                        <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Yeni fotoğraf seçildi ✓</p>
                    `;
                }
            };
            reader.readAsDataURL(file);
        });
    }
}

function closeEditMemoryModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

function saveEditedMemory(id) {
    const title = document.getElementById('editMemoryTitle').value.trim();
    const description = document.getElementById('editMemoryDescription').value.trim();
    const photoInput = document.getElementById('editMemoryPhoto');
    
    if (!title) {
        alert('Lütfen anı başlığı girin!');
        return;
    }
    
    const memory = surpriseData.memories.find(m => m.id === id);
    if (!memory) return;
    
    if (photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            resizeAndCropImage(e.target.result, (croppedImage) => {
                memory.title = title;
                memory.description = description;
                memory.photo = croppedImage;
                localStorage.setItem('surpriseData_memories', JSON.stringify(surpriseData.memories));
                
                // Firebase'e kaydet
                if (window.firebaseAPI) {
                    window.firebaseAPI.saveData('memories', surpriseData.memories);
                }
                
                loadMemories();
                closeEditMemoryModal();
                alert('Anı başarıyla güncellendi! 📸');
            });
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        memory.title = title;
        memory.description = description;
        localStorage.setItem('surpriseData_memories', JSON.stringify(surpriseData.memories));
        
        // Firebase'e kaydet
        if (window.firebaseAPI) {
            window.firebaseAPI.saveData('memories', surpriseData.memories);
        }
        
        loadMemories();
        closeEditMemoryModal();
        alert('Anı başarıyla güncellendi! 📸');
    }
}

function deleteMemory(id) {
    if (confirm('Bu anıyı silmek istediğinizden emin misiniz?')) {
        surpriseData.memories = surpriseData.memories.filter(m => m.id !== id);
        localStorage.setItem('surpriseData_memories', JSON.stringify(surpriseData.memories));
        
        // Firebase'e kaydet
        if (window.firebaseAPI) {
            window.firebaseAPI.saveData('memories', surpriseData.memories);
        }
        
        loadMemories();
        alert('Anı silindi.');
    }
}

// Poem functions
function editPoem(id) {
    const poem = surpriseData.poems.find(p => p.id === id);
    if (!poem) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📝 Şiiri Düzenle</h3>
                <button class="close-btn" onclick="closeEditPoemModal()">&times;</button>
            </div>
            <div class="modal-body">
                <textarea id="editPoemContent" placeholder="Şiiri düzenle..." style="min-height: 200px;">${poem.content}</textarea>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeEditPoemModal()">İptal</button>
                <button class="save-btn" onclick="saveEditedPoem(${id})">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeEditPoemModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

function saveEditedPoem(id) {
    const content = document.getElementById('editPoemContent').value.trim();
    
    if (!content) {
        alert('Lütfen şiir içeriği girin!');
        return;
    }
    
    const poem = surpriseData.poems.find(p => p.id === id);
    if (!poem) return;
    
    poem.content = content;
    localStorage.setItem('surpriseData_poems', JSON.stringify(surpriseData.poems));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('poems', surpriseData.poems);
    }
    
    loadPoems();
    closeEditPoemModal();
    alert('Şiir başarıyla güncellendi! 📝');
}

function deletePoem(id) {
    if (confirm('Bu şiiri silmek istediğinizden emin misiniz?')) {
        surpriseData.poems = surpriseData.poems.filter(p => p.id !== id);
        localStorage.setItem('surpriseData_poems', JSON.stringify(surpriseData.poems));
        
        // Firebase'e kaydet
        if (window.firebaseAPI) {
            window.firebaseAPI.saveData('poems', surpriseData.poems);
        }
        
        loadPoems();
        alert('Şiir silindi.');
    }
}

// Special Date functions
function editSpecialDate(id) {
    const event = surpriseData.specialDates.find(e => e.id === id);
    if (!event) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📅 Özel Günü Düzenle</h3>
                <button class="close-btn" onclick="closeEditDateModal()">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" id="editEventTitle" placeholder="Özel gün başlığı..." value="${event.title}">
                <textarea id="editEventDescription" placeholder="Bu özel günü anlat...">${event.description}</textarea>
                <input type="date" id="editEventDate" value="${event.date}">
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeEditDateModal()">İptal</button>
                <button class="save-btn" onclick="saveEditedDate(${id})">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeEditDateModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

function saveEditedDate(id) {
    const title = document.getElementById('editEventTitle').value.trim();
    const description = document.getElementById('editEventDescription').value.trim();
    const date = document.getElementById('editEventDate').value;
    
    if (!title) {
        alert('Lütfen özel gün başlığı girin!');
        return;
    }
    
    if (!date) {
        alert('Lütfen tarih seçin!');
        return;
    }
    
    const event = surpriseData.specialDates.find(e => e.id === id);
    if (!event) return;
    
    event.title = title;
    event.description = description;
    event.date = date;
    
    surpriseData.specialDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem('surpriseData_specialDates', JSON.stringify(surpriseData.specialDates));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData('specialDates', surpriseData.specialDates);
    }
    
    loadSpecialDates();
    closeEditDateModal();
    alert('Özel gün başarıyla güncellendi! 📅');
}

function deleteSpecialDate(id) {
    if (confirm('Bu özel günü silmek istediğinizden emin misiniz?')) {
        surpriseData.specialDates = surpriseData.specialDates.filter(e => e.id !== id);
        localStorage.setItem('surpriseData_specialDates', JSON.stringify(surpriseData.specialDates));
        
        // Firebase'e kaydet
        if (window.firebaseAPI) {
            window.firebaseAPI.saveData('specialDates', surpriseData.specialDates);
        }
        
        loadSpecialDates();
        alert('Özel gün silindi.');
    }
}

// Navigation
function showSection(sectionName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const navBtn = document.querySelector(`[data-section="${sectionName}"]`);
    if (navBtn) navBtn.classList.add('active');

    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    const section = document.getElementById(`${sectionName}Section`);
    if (section) section.classList.add('active');

    currentSection = sectionName;

    // Chat açılınca mesajları yükle ve scroll'a git
    if (sectionName === 'chat') {
        loadMessages();
    }
}

// Data Management
function saveData(type) {
    localStorage.setItem(`appData_${type}`, JSON.stringify(appData[type]));
    
    // Firebase'e kaydet
    if (window.firebaseAPI) {
        window.firebaseAPI.saveData(type, appData[type]);
    }
    
    updateStats();
    renderSection(type);
}

function updateStats() {
    document.getElementById('musicCount').textContent = appData.music.length;
    document.getElementById('dreamCount').textContent = appData.dreams.length;
    document.getElementById('noteCount').textContent = appData.notes.length;
    startLiveCounter();
    updateDailyMessage();
}

// Canlı sayaç - 07.12.2024'ten itibaren gerçek zamanlı
let liveCounterInterval = null;

function startLiveCounter() {
    function update() {
        const start = new Date('2024-12-07T00:00:00');
        const now = new Date();
        const diff = now - start;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('counterDays');
        const hEl = document.getElementById('counterHours');
        const mEl = document.getElementById('counterMinutes');
        const sEl = document.getElementById('counterSeconds');

        if (dEl) dEl.textContent = days;
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) {
            const newVal = String(seconds).padStart(2, '0');
            if (sEl.textContent !== newVal) {
                sEl.classList.add('tick');
                sEl.textContent = newVal;
                setTimeout(() => sEl.classList.remove('tick'), 300);
            }
        }
    }
    update();
    if (liveCounterInterval) clearInterval(liveCounterInterval);
    liveCounterInterval = setInterval(update, 1000);
}

// Eski fonksiyon - geriye dönük uyumluluk
function updateDaysCounter() { startLiveCounter(); }

// Modal Management
function openModal(type) {
    currentModalType = type;
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    const itemInput = document.getElementById('itemInput');
    const itemDescription = document.getElementById('itemDescription');
    const youtubeField = document.getElementById('itemYoutubeUrl');
    
    const titles = {
        music: 'Yeni Müzik Ekle',
        dreams: 'Yeni Hayal Ekle',
        notes: 'Yeni Not Ekle'
    };
    
    const placeholders = {
        music: 'Şarkı adı veya sanatçı...',
        dreams: 'Hayalini yaz...',
        notes: 'Notunu yaz...'
    };
    
    modalTitle.textContent = titles[type];
    itemInput.placeholder = placeholders[type];
    itemInput.value = '';
    itemDescription.value = '';
    
    // YouTube alanını sadece müzikte göster
    if (youtubeField) {
        youtubeField.style.display = type === 'music' ? 'block' : 'none';
        youtubeField.value = '';
    }
    
    modal.classList.remove('hidden');
    itemInput.focus();
}

function closeModal() {
    const modal = document.getElementById('addModal');
    modal.classList.add('hidden');
    currentModalType = null;
}

function saveItem() {
    const itemInput = document.getElementById('itemInput');
    const itemDescription = document.getElementById('itemDescription');
    const youtubeField = document.getElementById('itemYoutubeUrl');
    
    const title = itemInput.value.trim();
    const description = itemDescription.value.trim();
    const youtubeUrl = youtubeField ? youtubeField.value.trim() : '';
    
    if (!title) {
        itemInput.focus();
        return;
    }
    
    const newItem = {
        id: Date.now(),
        title: title,
        description: description,
        youtubeUrl: youtubeUrl || null,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    appData[currentModalType].unshift(newItem);
    saveData(currentModalType);
    closeModal();
}

// Add Functions
function addMusic() {
    openModal('music');
}

function addDream() {
    openModal('dreams');
}

function addNote() {
    openModal('notes');
}

// Delete Function
function deleteItem(type, id) {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
        appData[type] = appData[type].filter(item => item.id !== id);
        saveData(type);
    }
}

// Render Functions
function renderSection(type) {
    // Müzik için ayrı render sistemi
    if (type === 'music') {
        if (typeof renderMusicList === 'function') renderMusicList();
        return;
    }

    const container = document.getElementById(`${type}List`);
    const items = appData[type];
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${getEmptyIcon(type)}</div>
                <p>Henüz ${getTypeName(type)} eklenmemiş</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${escapeHtml(item.title)}</div>
                <div class="item-meta">
                    <div>${getUserName(item.createdBy)}</div>
                    <div>${item.createdAtFormatted}</div>
                    <div class="item-actions">
                        ${item.createdBy === currentUser ? `
                            <button class="edit-btn" onclick="editItem('${type}', ${item.id})" title="Düzenle">
                                ✏️
                            </button>
                        ` : ''}
                        <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})" title="Sil">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
            ${item.description ? `<div class="item-description">${escapeHtml(item.description)}</div>` : ''}
            ${type === 'music' && item.youtubeUrl ? `
                <div class="youtube-player" id="player-${item.id}">
                    <button class="play-btn" onclick="toggleYoutube(${item.id}, '${getYoutubeId(item.youtubeUrl)}')">
                        ▶ Çal
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Edit Functions
function editItem(type, id) {
    const item = appData[type].find(item => item.id === id);
    if (!item) return;
    
    editingItem = { type, id };
    
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalTitle');
    const itemInput = document.getElementById('editItemInput');
    const itemDescription = document.getElementById('editItemDescription');
    const youtubeField = document.getElementById('editItemYoutubeUrl');
    
    const titles = {
        music: 'Müziği Düzenle',
        dreams: 'Hayali Düzenle',
        notes: 'Notu Düzenle'
    };
    
    modalTitle.textContent = titles[type];
    itemInput.value = item.title;
    itemDescription.value = item.description || '';
    
    if (youtubeField) {
        youtubeField.style.display = type === 'music' ? 'block' : 'none';
        youtubeField.value = item.youtubeUrl || '';
    }
    
    modal.classList.remove('hidden');
    itemInput.focus();
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    editingItem = null;
}

function saveEditedItem() {
    const itemInput = document.getElementById('editItemInput');
    const itemDescription = document.getElementById('editItemDescription');
    const youtubeField = document.getElementById('editItemYoutubeUrl');
    
    const title = itemInput.value.trim();
    const description = itemDescription.value.trim();
    const youtubeUrl = youtubeField ? youtubeField.value.trim() : '';
    
    if (!title) {
        itemInput.focus();
        return;
    }
    
    const item = appData[editingItem.type].find(item => item.id === editingItem.id);
    if (item) {
        item.title = title;
        item.description = description;
        item.youtubeUrl = youtubeUrl || null;
        item.editedAt = new Date().toISOString();
        item.editedAtFormatted = new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        saveData(editingItem.type);
    }
    
    closeEditModal();
}

function renderAllSections() {
    renderSection('music');
    renderSection('dreams');
    renderSection('notes');
}

// Helper Functions
function getEmptyIcon(type) {
    const icons = {
        music: '🎵',
        dreams: '✨',
        notes: '💌'
    };
    return icons[type];
}

function getTypeName(type) {
    const names = {
        music: 'müzik',
        dreams: 'hayal',
        notes: 'not'
    };
    return names[type];
}

function getUserName(user) {
    const names = {
        'emir': 'Emir Kağan',
        'pelin': 'Pelin'
    };
    return names[user] || user;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// YouTube yardımcı fonksiyonları
function getYoutubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
}

function toggleYoutube(itemId, videoId) {
    const container = document.getElementById(`player-${itemId}`);
    if (!container) return;

    const existing = container.querySelector('iframe');
    if (existing) {
        // Zaten açıksa kapat
        existing.remove();
        container.querySelector('.play-btn').textContent = '▶ Çal';
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.width = '100%';
    iframe.height = '200';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '8px';
    iframe.style.marginTop = '0.75rem';
    iframe.style.display = 'block';

    container.querySelector('.play-btn').textContent = '⏹ Kapat';
    container.appendChild(iframe);
}

// Keyboard Shortcuts - güvenli versiyon
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC to close modals
        if (e.key === 'Escape') {
            const addModal = document.getElementById('addModal');
            const editModal = document.getElementById('editModal');
            
            if (addModal && !addModal.classList.contains('hidden')) {
                closeModal();
            }
            if (editModal && !editModal.classList.contains('hidden')) {
                closeEditModal();
            }
        }
        
        // Enter to save in modals
        if (e.key === 'Enter') {
            const addModal = document.getElementById('addModal');
            const editModal = document.getElementById('editModal');
            const passwordInput = document.getElementById('passwordInput');
            
            if (addModal && !addModal.classList.contains('hidden')) {
                if (e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    saveItem();
                }
            }
            if (editModal && !editModal.classList.contains('hidden')) {
                if (e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    saveEditedItem();
                }
            }
            if (passwordInput && document.activeElement === passwordInput) {
                attemptLogin();
            }
        }
    });
}

// Click outside modal to close - removed duplicate DOMContentLoaded

// Clear all localStorage data for fresh start
function clearAllData() {
    localStorage.clear();
    location.reload();
}

// Uncomment the line below to clear all data (run once then comment back)
// clearAllData();