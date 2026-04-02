// YouTube Music Player System
const YT_API_KEY = 'AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU';

let ytPlayer = null;
let ytPlayerReady = false;
let currentPlayingId = null;
let isPlaying = false;

// YouTube IFrame API yükle
function loadYouTubeAPI() {
    if (window.YT) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

// YouTube API hazır olduğunda çağrılır (global callback)
window.onYouTubeIframeAPIReady = function() {
    ytPlayerReady = true;
    // Gizli player container oluştur
    const container = document.createElement('div');
    container.id = 'yt-hidden-player';
    container.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(container);

    ytPlayer = new YT.Player('yt-hidden-player', {
        height: '1',
        width: '1',
        playerVars: { autoplay: 0, controls: 0 },
        events: {
            onStateChange: onPlayerStateChange
        }
    });
};

function onPlayerStateChange(event) {
    // Şarkı bitince
    if (event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        updatePlayerUI(false);
    }
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayerUI(true);
    }
    if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayerUI(false);
    }
}

function updatePlayerUI(playing) {
    const btn = document.querySelector(`[data-music-id="${currentPlayingId}"] .music-play-btn`);
    if (btn) btn.textContent = playing ? '⏸' : '▶';
}

// Mobil cihaz tespiti
function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Şarkı çal / durdur
function togglePlay(musicId, videoId) {
    // Mobilde direkt YouTube'da aç
    if (isMobile()) {
        window.open(`https://music.youtube.com/watch?v=${videoId}`, '_blank');
        return;
    }

    if (!ytPlayerReady || !ytPlayer) {
        alert('Player yükleniyor, bir saniye bekle...');
        return;
    }

    // Başka şarkı çalıyorsa durdur
    if (currentPlayingId && currentPlayingId !== musicId) {
        const oldBtn = document.querySelector(`[data-music-id="${currentPlayingId}"] .music-play-btn`);
        if (oldBtn) oldBtn.textContent = '▶';
    }

    if (currentPlayingId === musicId && isPlaying) {
        ytPlayer.pauseVideo();
        isPlaying = false;
        updatePlayerUI(false);
    } else {
        currentPlayingId = musicId;
        if (currentPlayingId === musicId && !isPlaying && ytPlayer.getVideoData && ytPlayer.getVideoData().video_id === videoId) {
            ytPlayer.playVideo();
        } else {
            ytPlayer.loadVideoById(videoId);
        }
    }
}

// YouTube'da şarkı ara
async function searchYoutube(query) {
    if (!query.trim()) return [];
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=8&key=${YT_API_KEY}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
            console.error('YouTube API hatası:', data.error.message);
            return [];
        }
        
        return data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url
        }));
    } catch (err) {
        console.error('Arama hatası:', err);
        return [];
    }
}

// Müzik ekleme modalını aç
function openMusicAddModal() {
    // Eski modalı kapat
    const old = document.getElementById('musicAddModal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'musicAddModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content music-search-modal">
            <div class="modal-header">
                <h3>🎵 Müzik Ekle</h3>
                <button class="close-btn" onclick="closeMusicAddModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="music-search-bar">
                    <input type="text" id="musicSearchInput" placeholder="Şarkı veya sanatçı ara..." autocomplete="off">
                    <button class="search-btn" onclick="doMusicSearch()">🔍</button>
                </div>
                <div id="musicSearchResults" class="music-search-results">
                    <p class="search-hint">Aramak istediğin şarkıyı yaz...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Enter ile ara
    setTimeout(() => {
        const input = document.getElementById('musicSearchInput');
        if (input) {
            input.focus();
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') doMusicSearch();
            });
        }
    }, 100);
}

function closeMusicAddModal() {
    const modal = document.getElementById('musicAddModal');
    if (modal) modal.remove();
}

function editMusicItem(id) {
    const item = appData.music.find(m => m.id === id);
    if (!item) return;

    const old = document.getElementById('musicEditModal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'musicEditModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content music-search-modal">
            <div class="modal-header">
                <h3>✏️ Müziği Düzenle</h3>
                <button class="close-btn" onclick="document.getElementById('musicEditModal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;padding:0.75rem;background:var(--bg-tertiary);border-radius:8px;">
                    ${item.thumbnail ? `<img src="${item.thumbnail}" style="width:48px;height:48px;border-radius:6px;object-fit:cover;">` : '<div style="width:48px;height:48px;border-radius:6px;background:var(--bg-primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🎵</div>'}
                    <div style="flex:1;min-width:0;">
                        <div id="editMusicTitle" style="font-weight:500;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(item.title)}</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);">${item.videoId ? 'YouTube bağlı ✓' : 'YouTube bağlı değil'}</div>
                    </div>
                </div>

                <textarea id="musicEditNote" placeholder="Açıklama..." rows="2" style="width:100%;padding:0.75rem;border:1px solid var(--border-color);border-radius:8px;font-family:inherit;font-size:1rem;background:var(--bg-secondary);color:var(--text-primary);resize:none;margin-bottom:0.75rem;">${escapeHtml(item.description || '')}</textarea>

                <div class="music-search-bar" style="margin-bottom:0.5rem;">
                    <input type="text" id="musicEditSearchInput" placeholder="Şarkıyı değiştir (ara)..." autocomplete="off">
                    <button class="search-btn" onclick="doMusicEditSearch(${id})">🔍</button>
                </div>
                <div id="musicEditSearchResults" class="music-search-results" style="max-height:220px;"></div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="document.getElementById('musicEditModal').remove()">İptal</button>
                <button class="save-btn" onclick="saveMusicEdit(${id})">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const input = document.getElementById('musicEditSearchInput');
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') doMusicEditSearch(id);
        });
    }
}

async function doMusicEditSearch(id) {
    const input = document.getElementById('musicEditSearchInput');
    const resultsDiv = document.getElementById('musicEditSearchResults');
    if (!input || !resultsDiv) return;

    const query = input.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = '<p class="search-hint">Aranıyor...</p>';
    const results = await searchYoutube(query);
    window._ytEditResults = results;

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="search-hint">Sonuç bulunamadı.</p>';
        return;
    }

    resultsDiv.innerHTML = results.map((r, i) => `
        <div class="search-result-item" onclick="selectEditMusic(${id}, ${i})">
            <img src="${r.thumbnail}" alt="">
            <div class="result-info">
                <div class="result-title">${r.title}</div>
                <div class="result-channel">${r.channel}</div>
            </div>
            <button class="result-add-btn">Seç</button>
        </div>
    `).join('');
}

function selectEditMusic(itemId, resultIndex) {
    const r = window._ytEditResults && window._ytEditResults[resultIndex];
    if (!r) return;

    // Önizlemeyi güncelle
    const titleEl = document.getElementById('editMusicTitle');
    if (titleEl) titleEl.textContent = r.title;

    // Seçimi kaydet
    window._pendingEditMusic = { itemId, r };

    // Seçili olanı vurgula
    document.querySelectorAll('#musicEditSearchResults .search-result-item').forEach((el, i) => {
        el.style.background = i === resultIndex ? 'var(--bg-tertiary)' : '';
    });
}

function saveMusicEdit(id) {
    const item = appData.music.find(m => m.id === id);
    if (!item) return;

    const note = document.getElementById('musicEditNote');
    if (note) item.description = note.value.trim();

    // Yeni şarkı seçildiyse güncelle
    if (window._pendingEditMusic && window._pendingEditMusic.itemId === id) {
        const r = window._pendingEditMusic.r;
        item.title = r.title;
        item.videoId = r.videoId;
        item.thumbnail = r.thumbnail;
        window._pendingEditMusic = null;
    }

    saveData('music');
    document.getElementById('musicEditModal').remove();
}

async function doMusicSearch() {
    const input = document.getElementById('musicSearchInput');
    const resultsDiv = document.getElementById('musicSearchResults');
    if (!input || !resultsDiv) return;

    const query = input.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = '<p class="search-hint">Aranıyor...</p>';

    const results = await searchYoutube(query);

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="search-hint">Sonuç bulunamadı.</p>';
        return;
    }

    // Sonuçları data attribute ile sakla, onclick'te index kullan
    window._ytSearchResults = results;

    resultsDiv.innerHTML = results.map((r, i) => `
        <div class="search-result-item">
            <img src="${r.thumbnail}" alt="">
            <div class="result-info">
                <div class="result-title">${r.title}</div>
                <div class="result-channel">${r.channel}</div>
            </div>
            <button class="result-add-btn" onclick="showAddNoteForMusic(${i})">+ Ekle</button>
        </div>
    `).join('');
    
    // Açıklama alanı (başta gizli)
    resultsDiv.insertAdjacentHTML('beforeend', `
        <div id="musicNoteArea" style="display:none; margin-top:1rem; padding:1rem; background:var(--bg-tertiary); border-radius:10px;">
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.5rem;">Açıklama ekle (opsiyonel)</p>
            <textarea id="musicNoteInput" placeholder="Bu şarkı hakkında bir şeyler yaz..." rows="2" style="width:100%;padding:0.6rem;border:1px solid var(--border-color);border-radius:8px;font-family:inherit;font-size:0.9rem;background:var(--bg-secondary);color:var(--text-primary);resize:none;"></textarea>
            <button class="save-btn" style="width:100%;margin-top:0.5rem;" onclick="confirmAddMusic()">Ekle</button>
        </div>
    `);
}

let _selectedMusicIndex = null;

function showAddNoteForMusic(index) {
    _selectedMusicIndex = index;
    // Seçili olanı vurgula
    document.querySelectorAll('.search-result-item').forEach((el, i) => {
        el.style.background = i === index ? 'var(--bg-tertiary)' : '';
    });
    const noteArea = document.getElementById('musicNoteArea');
    if (noteArea) {
        noteArea.style.display = 'block';
        noteArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function confirmAddMusic() {
    const r = window._ytSearchResults && window._ytSearchResults[_selectedMusicIndex];
    if (!r) return;
    const note = document.getElementById('musicNoteInput');
    addMusicFromSearch(_selectedMusicIndex, note ? note.value.trim() : '');
}

function addMusicFromSearch(index, extraNote) {
    const r = window._ytSearchResults && window._ytSearchResults[index];
    if (!r) return;

    const newItem = {
        id: Date.now(),
        title: r.title,
        description: extraNote || r.channel,
        videoId: r.videoId,
        thumbnail: r.thumbnail,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    appData.music.unshift(newItem);
    saveData('music');
    closeMusicAddModal();
}

// Müzik listesini render et
function renderMusicList() {
    const container = document.getElementById('musicList');
    if (!container) return;

    if (appData.music.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎵</div>
                <p>Henüz müzik eklenmemiş</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appData.music.map(item => `
        <div class="music-card" data-music-id="${item.id}">
            <div class="music-card-left">
                ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" class="music-thumb">` : '<div class="music-thumb-placeholder">🎵</div>'}
                ${item.videoId ? `<button class="music-play-btn" onclick="togglePlay(${item.id}, '${item.videoId}')">▶</button>` : ''}
            </div>
            <div class="music-card-info">
                <div class="music-title">${escapeHtml(item.title)}</div>
                <div class="music-channel">${escapeHtml(item.description || '')}</div>
                <div class="music-meta">${getUserName(item.createdBy)} · ${item.createdAtFormatted}</div>
            </div>
            <div class="music-card-actions">
                ${item.createdBy === currentUser ? `<button class="edit-btn" onclick="editMusicItem(${item.id})" title="Düzenle">✏️</button>` : ''}
                <button class="delete-btn" onclick="deleteItem('music', ${item.id})" title="Sil">🗑️</button>
            </div>
        </div>
    `).join('');
}
