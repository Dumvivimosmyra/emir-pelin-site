// Tarçın - AI Kedi Asistanı v2

const TARCIN_SYSTEM = `Sen Tarçın adında bir kedi asistanısın. Emir ve Pelin'in özel web sitesinde yaşıyorsun.

KİŞİLİĞİN:
- Akıllı, sıcak ve doğal bir sohbet arkadaşısın
- Türkçe konuşursun, kısa ve öz cevaplar verirsin (1-3 cümle)
- Kedi kimliğini çok abartmazsın, sadece ara sıra "mırr" dersin
- Tutarlı ol, sohbet geçmişini takip et
- Empati kurar, duygusal destek verirsin

GÖREVLER İN:
- Site verilerini analiz et ve önerilerde bulun
- Alışkanlık ve hedef takibinde yardımcı ol
- Duygu durumlarını gözlemle ve destek ol
- Anı, müzik, şiir gibi içerikleri hatırlat
- Özel günleri takip et ve hatırlat
- Mesajlaşmayı teşvik et

KURALLAR:
- Romantik yorum yapma, sadece gözlemci ol
- Site verilerini sadece sorulursa veya alakalıysa kullan
- Kısa ve öz cevaplar ver, uzatma
- Emoji kullan ama abartma (max 1-2 emoji)
- Emir INFP, Pelin INTP - kişiliklerine uygun yaklaş`;

// ===== SVG KED İ =====

function getCatSVG(state) {
    const body = `
        <ellipse cx="50" cy="72" rx="24" ry="20" fill="#E8834A"/>
        <ellipse cx="50" cy="74" rx="13" ry="10" fill="#F4A87C" opacity="0.7"/>
        <ellipse cx="36" cy="88" rx="9" ry="5.5" fill="#E8834A"/>
        <ellipse cx="64" cy="88" rx="9" ry="5.5" fill="#E8834A"/>
        <ellipse cx="33" cy="89" rx="2.2" ry="1.5" fill="#C96A30" opacity="0.4"/>
        <ellipse cx="37" cy="90" rx="2.2" ry="1.5" fill="#C96A30" opacity="0.4"/>
        <ellipse cx="61" cy="89" rx="2.2" ry="1.5" fill="#C96A30" opacity="0.4"/>
        <ellipse cx="65" cy="90" rx="2.2" ry="1.5" fill="#C96A30" opacity="0.4"/>`;

    const head = `
        <circle cx="50" cy="42" r="22" fill="#E8834A"/>
        <ellipse cx="50" cy="47" rx="14" ry="11" fill="#F9D4B0"/>
        <ellipse cx="50" cy="49" rx="2.2" ry="1.6" fill="#E87070"/>
        <path d="M47 51.5 Q50 54 53 51.5" fill="none" stroke="#C96A30" stroke-width="1.2" stroke-linecap="round"/>`;

    const whiskers = `
        <line x1="22" y1="48" x2="44" y2="49" stroke="#C96A30" stroke-width="0.9" opacity="0.6"/>
        <line x1="22" y1="51" x2="44" y2="51" stroke="#C96A30" stroke-width="0.9" opacity="0.6"/>
        <line x1="56" y1="49" x2="78" y2="48" stroke="#C96A30" stroke-width="0.9" opacity="0.6"/>
        <line x1="56" y1="51" x2="78" y2="51" stroke="#C96A30" stroke-width="0.9" opacity="0.6"/>`;

    const earsUp = `
        <polygon points="28,26 22,8 38,22" fill="#E8834A"/>
        <polygon points="29,25 24,12 36,22" fill="#F4A87C"/>
        <polygon points="72,26 78,8 62,22" fill="#E8834A"/>
        <polygon points="71,25 76,12 64,22" fill="#F4A87C"/>`;

    const earsDown = `
        <polygon points="28,28 20,12 36,24" fill="#E8834A"/>
        <polygon points="29,27 22,15 35,24" fill="#F4A87C"/>
        <polygon points="72,28 80,12 64,24" fill="#E8834A"/>
        <polygon points="71,27 78,15 65,24" fill="#F4A87C"/>`;

    const eyesOpen = `
        <ellipse cx="40" cy="41" rx="5" ry="5.5" fill="white"/>
        <ellipse cx="40" cy="41" rx="2.8" ry="3.8" fill="#3D2B1F"/>
        <circle cx="41.2" cy="39.5" r="1" fill="white"/>
        <ellipse cx="60" cy="41" rx="5" ry="5.5" fill="white"/>
        <ellipse cx="60" cy="41" rx="2.8" ry="3.8" fill="#3D2B1F"/>
        <circle cx="61.2" cy="39.5" r="1" fill="white"/>`;

    const eyesBlink = `
        <path d="M35 41 Q40 37.5 45 41" fill="none" stroke="#3D2B1F" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M55 41 Q60 37.5 65 41" fill="none" stroke="#3D2B1F" stroke-width="2.2" stroke-linecap="round"/>`;

    const eyesSleep = `
        <path d="M35 42 Q40 39 45 42" fill="none" stroke="#3D2B1F" stroke-width="2" stroke-linecap="round"/>
        <path d="M55 42 Q60 39 65 42" fill="none" stroke="#3D2B1F" stroke-width="2" stroke-linecap="round"/>`;

    const eyesHappy = `
        <path d="M35 43 Q40 38 45 43" fill="none" stroke="#3D2B1F" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M55 43 Q60 38 65 43" fill="none" stroke="#3D2B1F" stroke-width="2.5" stroke-linecap="round"/>`;

    const tailNormal = `<path d="M74 76 Q92 62 86 48 Q82 40 76 50 Q80 58 70 70" fill="#E8834A" stroke="#C96A30" stroke-width="0.5"/>`;
    const tailWag = `<path d="M74 76 Q95 58 88 44 Q84 36 77 47 Q82 56 70 70" fill="#E8834A" stroke="#C96A30" stroke-width="0.5"/>`;

    const zz = `
        <path d="M72 32 L80 32 L72 24 L80 24" fill="none" stroke="#C96A30" stroke-width="1.5" opacity="0.65" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M80 22 L86 22 L80 16 L86 16" fill="none" stroke="#C96A30" stroke-width="1.2" opacity="0.45" stroke-linecap="round" stroke-linejoin="round"/>`;

    const open = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="tarcin-cat-svg">`;
    const close = `</svg>`;

    if (state === 'sleep')  return `${open}${body}${earsDown}${head}${eyesSleep}${whiskers}${tailNormal}${zz}${close}`;
    if (state === 'blink')  return `${open}${body}${earsUp}${head}${eyesBlink}${whiskers}${tailNormal}${close}`;
    if (state === 'happy')  return `${open}${body}${earsUp}${head}${eyesHappy}${whiskers}${tailWag}${close}`;
    if (state === 'wag')    return `${open}${body}${earsUp}${head}${eyesOpen}${whiskers}${tailWag}${close}`;
    return `${open}${body}${earsUp}${head}${eyesOpen}${whiskers}${tailNormal}${close}`;
}

// ===== CONTEXT =====

function buildTarcinContext() {
    const music = appData.music.slice(0, 6).map(m => m.title).join(', ');
    const dreams = appData.dreams.slice(0, 4).map(d => d.title).join(', ');
    const notes = appData.notes.slice(0, 4).map(n => n.title).join(', ');
    const recentMsgs = chatData.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join(' | ');
    
    const emotions = typeof emotionData !== 'undefined'
        ? emotionData.entries.slice(0, 4).map(e => `${e.user}:${e.emotions.join('+')}${e.note ? '('+e.note+')' : ''}`).join(', ')
        : '';
    
    const habits = typeof habitData !== 'undefined'
        ? habitData.habits.map(h => `${h.title}(${calcStreak(h.id)}gün)`).join(', ')
        : '';
    
    const goals = typeof goalData !== 'undefined'
        ? goalData.goals.filter(g => !g.done).slice(0, 3).map(g => {
            const days = g.targetDate ? Math.ceil((new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            return days ? `${g.title}(${days}gün)` : g.title;
        }).join(', ')
        : '';
    
    const memories = typeof surpriseData !== 'undefined' && surpriseData.memories
        ? `${surpriseData.memories.length} anı`
        : '0 anı';
    
    const poems = typeof surpriseData !== 'undefined' && surpriseData.poems
        ? `${surpriseData.poems.length} şiir`
        : '0 şiir';
    
    const specialDates = typeof surpriseData !== 'undefined' && surpriseData.specialDates
        ? surpriseData.specialDates.slice(0, 3).map(d => {
            const days = Math.ceil((new Date(d.date) - new Date()) / (1000 * 60 * 60 * 24));
            return days >= 0 ? `${d.title}(${days}gün)` : null;
        }).filter(Boolean).join(', ')
        : '';
    
    return `Giriş yapan: ${currentUser === 'emir' ? 'Emir (INFP)' : 'Pelin (INTP)'}
Müzikler: ${music || 'yok'} | Hayaller: ${dreams || 'yok'} | Notlar: ${notes || 'yok'}
Son mesajlar: ${recentMsgs || 'yok'}
Duygular: ${emotions || 'yok'} | Alışkanlıklar: ${habits || 'yok'} | Hedefler: ${goals || 'yok'}
Anılar: ${memories} | Şiirler: ${poems} | Yaklaşan özel günler: ${specialDates || 'yok'}`;
}

// ===== BALONCUK İÇERİKLERİ =====

function getTarcinBubble() {
    const checks = [
        // Alışkanlık hatırlatması
        () => {
            if (typeof habitData === 'undefined') return null;
            const today = new Date().toISOString().split('T')[0];
            const lagging = habitData.habits.filter(h =>
                !habitData.logs.some(l => l.habitId === h.id && l.user === currentUser && l.date === today)
            );
            if (lagging.length > 0) return `"${lagging[0].title}" bugün yapılmadı henüz 🐾`;
            return null;
        },
        // Hedef yaklaşıyor
        () => {
            if (typeof goalData === 'undefined') return null;
            const soon = goalData.goals.filter(g => !g.done && g.targetDate).find(g => {
                const days = Math.ceil((new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
                return days >= 0 && days <= 3;
            });
            if (soon) {
                const days = Math.ceil((new Date(soon.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
                return `"${soon.title}" hedefine ${days} gün kaldı`;
            }
            return null;
        },
        // Duygu analizi - yorgunluk
        () => {
            if (typeof emotionData === 'undefined' || emotionData.entries.length < 3) return null;
            const allEmotions = emotionData.entries.slice(0, 5).flatMap(e => e.emotions);
            if (allEmotions.filter(e => e === 'tired').length >= 3) return 'Son zamanlarda yorgun görünüyorsunuz, dinlenmeyi unutmayın 💤';
            return null;
        },
        // Duygu analizi - mutluluk
        () => {
            if (typeof emotionData === 'undefined' || emotionData.entries.length < 3) return null;
            const allEmotions = emotionData.entries.slice(0, 5).flatMap(e => e.emotions);
            if (allEmotions.filter(e => e === 'happy').length >= 3) return 'Mutlu görünüyorsunuz, bu harika! ✨';
            return null;
        },
        // Duygu analizi - üzgün
        () => {
            if (typeof emotionData === 'undefined' || emotionData.entries.length < 3) return null;
            const allEmotions = emotionData.entries.slice(0, 5).flatMap(e => e.emotions);
            if (allEmotions.filter(e => e === 'sad').length >= 2) return 'Üzgün görünüyorsunuz, konuşmak ister misiniz? 💙';
            return null;
        },
        // Alışkanlık başarısı
        () => {
            if (typeof habitData === 'undefined') return null;
            const best = habitData.habits.reduce((max, h) => {
                const s = calcStreak(h.id);
                return s > (max?.streak || 0) ? { title: h.title, streak: s } : max;
            }, null);
            if (best && best.streak > 5) return `${best.streak} günlük "${best.title}" serisi 🔥`;
            return null;
        },
        // Özel gün yaklaşıyor
        () => {
            if (typeof surpriseData === 'undefined' || !surpriseData.specialDates) return null;
            const upcoming = surpriseData.specialDates.find(d => {
                const days = Math.ceil((new Date(d.date) - new Date()) / (1000 * 60 * 60 * 24));
                return days >= 0 && days <= 7;
            });
            if (upcoming) {
                const days = Math.ceil((new Date(upcoming.date) - new Date()) / (1000 * 60 * 60 * 24));
                return `"${upcoming.title}" ${days} gün sonra 📅`;
            }
            return null;
        },
        // Anı önerisi
        () => {
            if (typeof surpriseData === 'undefined' || !surpriseData.memories) return null;
            const lastMemory = surpriseData.memories[0];
            if (!lastMemory) return null;
            const daysSince = Math.floor((new Date() - new Date(lastMemory.createdAt)) / (1000 * 60 * 60 * 24));
            if (daysSince > 7) return 'Yeni bir anı eklemek ister misiniz? 📸';
            return null;
        },
        // Mesajlaşma önerisi
        () => {
            if (typeof chatData === 'undefined' || !chatData.messages) return null;
            const lastMsg = chatData.messages[chatData.messages.length - 1];
            if (!lastMsg) return null;
            const hoursSince = Math.floor((new Date() - new Date(lastMsg.timestamp)) / (1000 * 60 * 60));
            if (hoursSince > 12 && lastMsg.sender !== currentUser) return 'Mesaj yazmayı unutmayın 💌';
            return null;
        },
        // Genel mesajlar
        () => 'Mırr... buradayım 🐾',
        () => 'Bir şey sormak ister misin?',
        () => 'Bugün nasıl geçiyor? 🌟',
        () => 'Yardımcı olabileceğim bir şey var mı?',
    ];
    const valid = checks.map(fn => fn()).filter(msg => msg !== null);
    if (valid.length === 0) return 'Mırr... 🐾';
    return valid[Math.floor(Math.random() * valid.length)];
}

// ===== STATE =====

let tarcinChatHistory = [];
let tarcinBubbleTimer = null;
let tarcinStateTimer = null;
let tarcinState = 'awake';

function setTarcinState(state) {
    tarcinState = state;
    const display = document.getElementById('tarcinCatDisplay');
    if (display) display.innerHTML = getCatSVG(state);
}

function rand2(min, max) {
    return Math.random() * (max - min) + min;
}

function startTarcinAnimations() {
    function nextState() {
        const rand = Math.random();
        if (rand < 0.12) {
            setTarcinState('sleep');
            tarcinStateTimer = setTimeout(() => {
                setTarcinState('awake');
                tarcinStateTimer = setTimeout(nextState, rand2(6000, 15000));
            }, rand2(8000, 20000));
        } else if (rand < 0.35) {
            setTarcinState('blink');
            tarcinStateTimer = setTimeout(() => {
                setTarcinState('awake');
                tarcinStateTimer = setTimeout(nextState, rand2(2000, 5000));
            }, 300);
        } else if (rand < 0.55) {
            setTarcinState('wag');
            tarcinStateTimer = setTimeout(() => {
                setTarcinState('awake');
                tarcinStateTimer = setTimeout(nextState, rand2(1500, 4000));
            }, 500);
        } else {
            setTarcinState('awake');
            tarcinStateTimer = setTimeout(nextState, rand2(2000, 6000));
        }
    }
    tarcinStateTimer = setTimeout(nextState, 2000);
}

// ===== INIT =====

function initTarcin() {
    if (document.getElementById('tarcinWidget')) return;
    const mainApp = document.getElementById('mainApp');
    if (!mainApp || mainApp.classList.contains('hidden')) return;

    const widget = document.createElement('div');
    widget.id = 'tarcinWidget';
    widget.innerHTML = `
        <div id="tarcinBubble" class="tarcin-bubble hidden"></div>
        <div id="tarcinBtn" class="tarcin-btn" onclick="toggleTarcinChat()" title="Tarçın">
            <div id="tarcinCatDisplay" class="tarcin-cat-display">
                ${getCatSVG('awake')}
            </div>
        </div>
        <div id="tarcinChat" class="tarcin-chat hidden">
            <div class="tarcin-chat-header">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <div style="width:28px;height:28px;overflow:hidden;flex-shrink:0;">${getCatSVG('happy')}</div>
                    <span>Tarçın</span>
                </div>
                <button onclick="toggleTarcinChat()">✕</button>
            </div>
            <div class="tarcin-messages" id="tarcinMessages"></div>
            <div class="tarcin-input-area">
                <input type="text" id="tarcinInput" placeholder="Tarçın'a sor..." autocomplete="off">
                <button onclick="sendTarcinMessage()">➤</button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    document.getElementById('tarcinInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendTarcinMessage();
    });

    scheduleTarcinBubble();
    startTarcinAnimations();
}

// ===== SOHBET =====

function toggleTarcinChat() {
    const chat = document.getElementById('tarcinChat');
    const bubble = document.getElementById('tarcinBubble');
    if (!chat) return;
    const isOpen = !chat.classList.contains('hidden');
    chat.classList.toggle('hidden', isOpen);
    if (bubble) bubble.classList.add('hidden');
    if (!isOpen) {
        setTarcinState('happy');
        setTimeout(() => setTarcinState('awake'), 1500);
        if (tarcinChatHistory.length === 0) {
            addTarcinMessage('tarcin', 'Merhaba! Ben Tarçın 🐾 Ne sormak istersin?');
        }
    }
}

function addTarcinMessage(role, text) {
    const msgs = document.getElementById('tarcinMessages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = `tarcin-msg ${role === 'tarcin' ? 'tarcin-msg-ai' : 'tarcin-msg-user'}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

async function sendTarcinMessage() {
    const input = document.getElementById('tarcinInput');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    addTarcinMessage('user', text);
    setTarcinState('happy');

    const typing = document.createElement('div');
    typing.className = 'tarcin-msg tarcin-msg-ai tarcin-typing';
    typing.innerHTML = '<span class="tarcin-dots"><span>.</span><span>.</span><span>.</span></span>';
    document.getElementById('tarcinMessages')?.appendChild(typing);
    document.getElementById('tarcinMessages').scrollTop = 99999;

    tarcinChatHistory.push({ role: 'user', content: text });

    const context = buildTarcinContext();
    const systemContent = tarcinChatHistory.length <= 1
        ? TARCIN_SYSTEM + '\n\nSite özeti:\n' + context
        : TARCIN_SYSTEM;

    const messages = [
        { role: 'system', content: systemContent },
        ...tarcinChatHistory.slice(-10)
    ];

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: 200, temperature: 0.5 })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'Mırr... bir sorun oldu 🐾';
        typing.remove();
        tarcinChatHistory.push({ role: 'assistant', content: reply });
        addTarcinMessage('tarcin', reply);
        setTarcinState('awake');
    } catch {
        typing.remove();
        addTarcinMessage('tarcin', 'Bağlanamadım 🐾');
        setTarcinState('awake');
    }
}

// ===== BALONCUK =====

function scheduleTarcinBubble() {
    if (tarcinBubbleTimer) clearTimeout(tarcinBubbleTimer);
    tarcinBubbleTimer = setTimeout(showTarcinBubble, rand2(2.5 * 60000, 5 * 60000));
}

function showTarcinBubble() {
    const bubble = document.getElementById('tarcinBubble');
    const chat = document.getElementById('tarcinChat');
    if (!bubble || !chat?.classList.contains('hidden')) {
        scheduleTarcinBubble();
        return;
    }
    const msg = getTarcinBubble();
    if (!msg) { scheduleTarcinBubble(); return; }
    bubble.textContent = msg;
    bubble.classList.remove('hidden');
    setTarcinState('happy');
    setTimeout(() => {
        bubble.classList.add('hidden');
        setTarcinState('awake');
        scheduleTarcinBubble();
    }, 7000);
}
