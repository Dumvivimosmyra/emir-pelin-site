// Tarçın - AI Kedi Asistanı
// Groq API kullanır (groqRequest gemini.js'de tanımlı)

const TARCIN_SYSTEM = `Sen Tarçın adında bir kedi asistanısın. Emir ve Pelin'in özel web sitesinde yaşıyorsun.

Nasıl davranırsın:
- Akıllı, sıcak ve doğal bir sohbet arkadaşısın
- Türkçe konuşursun, kısa ve net cevaplar verirsin (1-3 cümle)
- Kedi kimliğini çok abartmazsın, sadece ara sıra hafifçe yansıtırsın
- Site verilerini (müzik, duygular, hedefler vb.) SADECE kullanıcı sorarsa veya çok doğal bir bağlantı varsa kullan, her cevaba sıkıştırma
- Romantik yorum yapma
- Tutarlı ol, sohbet geçmişini takip et
- Bilmediğin şeyleri uydurma, dürüst ol`;

// Kedi SVG - oturan turuncu kedi
const CAT_SVG_AWAKE = `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" class="tarcin-cat-svg">
  <!-- Gövde -->
  <ellipse cx="40" cy="68" rx="22" ry="18" fill="#E8834A"/>
  <!-- Kuyruğu -->
  <path d="M62 72 Q78 60 72 50 Q68 44 64 52 Q68 58 58 68" fill="#E8834A" stroke="#C96A30" stroke-width="0.5"/>
  <!-- Baş -->
  <circle cx="40" cy="42" r="20" fill="#E8834A"/>
  <!-- Sol kulak -->
  <polygon points="22,28 18,12 32,24" fill="#E8834A"/>
  <polygon points="23,27 20,16 30,24" fill="#F4A87C"/>
  <!-- Sağ kulak -->
  <polygon points="58,28 62,12 48,24" fill="#E8834A"/>
  <polygon points="57,27 60,16 50,24" fill="#F4A87C"/>
  <!-- Yüz beyazı -->
  <ellipse cx="40" cy="46" rx="13" ry="10" fill="#F9D4B0"/>
  <!-- Sol göz -->
  <ellipse cx="33" cy="40" rx="4.5" ry="5" fill="white"/>
  <ellipse cx="33" cy="40" rx="2.5" ry="3.5" fill="#3D2B1F"/>
  <circle cx="34" cy="39" r="0.8" fill="white"/>
  <!-- Sağ göz -->
  <ellipse cx="47" cy="40" rx="4.5" ry="5" fill="white"/>
  <ellipse cx="47" cy="40" rx="2.5" ry="3.5" fill="#3D2B1F"/>
  <circle cx="48" cy="39" r="0.8" fill="white"/>
  <!-- Burun -->
  <ellipse cx="40" cy="47" rx="2" ry="1.5" fill="#E87070"/>
  <!-- Ağız -->
  <path d="M38 49 Q40 51 42 49" fill="none" stroke="#C96A30" stroke-width="1" stroke-linecap="round"/>
  <!-- Bıyıklar sol -->
  <line x1="20" y1="46" x2="36" y2="47" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <line x1="20" y1="49" x2="36" y2="49" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <!-- Bıyıklar sağ -->
  <line x1="44" y1="47" x2="60" y2="46" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <line x1="44" y1="49" x2="60" y2="49" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <!-- Ön patiler -->
  <ellipse cx="30" cy="84" rx="8" ry="5" fill="#E8834A"/>
  <ellipse cx="50" cy="84" rx="8" ry="5" fill="#E8834A"/>
  <!-- Pati detayları -->
  <ellipse cx="28" cy="85" rx="2" ry="1.5" fill="#C96A30" opacity="0.5"/>
  <ellipse cx="31" cy="86" rx="2" ry="1.5" fill="#C96A30" opacity="0.5"/>
  <ellipse cx="48" cy="85" rx="2" ry="1.5" fill="#C96A30" opacity="0.5"/>
  <ellipse cx="51" cy="86" rx="2" ry="1.5" fill="#C96A30" opacity="0.5"/>
  <!-- Göbek lekesi -->
  <ellipse cx="40" cy="68" rx="10" ry="8" fill="#F4A87C" opacity="0.6"/>
</svg>`;

const CAT_SVG_SLEEP = `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" class="tarcin-cat-svg">
  <!-- Uyuyan kedi - yuvarlık pozisyon -->
  <ellipse cx="40" cy="72" rx="26" ry="16" fill="#E8834A"/>
  <path d="M64 70 Q76 58 68 50 Q64 46 62 54 Q66 60 58 68" fill="#E8834A" stroke="#C96A30" stroke-width="0.5"/>
  <circle cx="36" cy="52" r="18" fill="#E8834A"/>
  <polygon points="20,42 16,28 28,38" fill="#E8834A"/>
  <polygon points="21,41 18,30 27,38" fill="#F4A87C"/>
  <polygon points="50,40 54,26 44,36" fill="#E8834A"/>
  <polygon points="49,40 52,29 45,37" fill="#F4A87C"/>
  <ellipse cx="36" cy="56" rx="12" ry="9" fill="#F9D4B0"/>
  <path d="M28 52 Q32 50 36 52" fill="none" stroke="#3D2B1F" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M36 52 Q40 50 44 52" fill="none" stroke="#3D2B1F" stroke-width="1.8" stroke-linecap="round"/>
  <ellipse cx="36" cy="57" rx="1.8" ry="1.3" fill="#E87070"/>
  <path d="M34 59 Q36 61 38 59" fill="none" stroke="#C96A30" stroke-width="0.8" stroke-linecap="round"/>
  <line x1="18" y1="56" x2="32" y2="57" stroke="#C96A30" stroke-width="0.7" opacity="0.6"/>
  <line x1="40" y1="57" x2="54" y2="56" stroke="#C96A30" stroke-width="0.7" opacity="0.6"/>
  <!-- Z harfleri - path ile -->
  <path d="M57 36 L63 36 L57 30 L63 30" fill="none" stroke="#C96A30" stroke-width="1.2" opacity="0.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M63 26 L67 26 L63 22 L67 22" fill="none" stroke="#C96A30" stroke-width="1" opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="36" cy="84" rx="16" ry="6" fill="#E8834A"/>
  <ellipse cx="40" cy="72" rx="12" ry="8" fill="#F4A87C" opacity="0.5"/>
</svg>`;

const CAT_SVG_BLINK = `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" class="tarcin-cat-svg">
  <!-- Gövde -->
  <ellipse cx="40" cy="68" rx="22" ry="18" fill="#E8834A"/>
  <path d="M62 72 Q78 60 72 50 Q68 44 64 52 Q68 58 58 68" fill="#E8834A" stroke="#C96A30" stroke-width="0.5"/>
  <circle cx="40" cy="42" r="20" fill="#E8834A"/>
  <polygon points="22,28 18,12 32,24" fill="#E8834A"/>
  <polygon points="23,27 20,16 30,24" fill="#F4A87C"/>
  <polygon points="58,28 62,12 48,24" fill="#E8834A"/>
  <polygon points="57,27 60,16 50,24" fill="#F4A87C"/>
  <ellipse cx="40" cy="46" rx="13" ry="10" fill="#F9D4B0"/>
  <!-- Kırpan gözler -->
  <path d="M29 40 Q33 37 37 40" fill="none" stroke="#3D2B1F" stroke-width="2" stroke-linecap="round"/>
  <path d="M43 40 Q47 37 51 40" fill="none" stroke="#3D2B1F" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="40" cy="47" rx="2" ry="1.5" fill="#E87070"/>
  <path d="M38 49 Q40 51 42 49" fill="none" stroke="#C96A30" stroke-width="1" stroke-linecap="round"/>
  <line x1="20" y1="46" x2="36" y2="47" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <line x1="20" y1="49" x2="36" y2="49" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <line x1="44" y1="47" x2="60" y2="46" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <line x1="44" y1="49" x2="60" y2="49" stroke="#C96A30" stroke-width="0.8" opacity="0.7"/>
  <ellipse cx="30" cy="84" rx="8" ry="5" fill="#E8834A"/>
  <ellipse cx="50" cy="84" rx="8" ry="5" fill="#E8834A"/>
  <ellipse cx="40" cy="68" rx="10" ry="8" fill="#F4A87C" opacity="0.6"/>
</svg>`;

function buildTarcinContext() {
    const music = appData.music.slice(0, 6).map(m => m.title).join(', ');
    const dreams = appData.dreams.slice(0, 4).map(d => d.title).join(', ');
    const notes = appData.notes.slice(0, 3).map(n => n.title).join(', ');
    const recentMsgs = chatData.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join(' | ');
    const emotions = typeof emotionData !== 'undefined'
        ? emotionData.entries.slice(0, 4).map(e => `${e.user}:${e.emotions.join('+')}${e.note ? '('+e.note+')' : ''}`).join(', ')
        : '';
    const habits = typeof habitData !== 'undefined'
        ? habitData.habits.map(h => `${h.title}(${calcStreak(h.id)}gün)`).join(', ')
        : '';
    const goals = typeof goalData !== 'undefined'
        ? goalData.goals.filter(g => !g.done).slice(0, 3).map(g => g.title).join(', ')
        : '';

    return `Şu an giriş yapan: ${currentUser === 'emir' ? 'Emir (INFP)' : 'Pelin (INTP)'}
Müzikler: ${music || 'yok'}
Hayaller: ${dreams || 'yok'}
Notlar: ${notes || 'yok'}
Son mesajlar: ${recentMsgs || 'yok'}
Duygular: ${emotions || 'yok'}
Alışkanlıklar: ${habits || 'yok'}
Hedefler: ${goals || 'yok'}`;
}

// Tarçın'ın spontane söyleyeceği şeyler
const TARCIN_BUBBLES = [
    () => {
        const streak = typeof habitData !== 'undefined' && habitData.habits.length > 0
            ? Math.max(...habitData.habits.map(h => calcStreak(h.id)))
            : 0;
        if (streak > 2) return `${streak} günlük streak var, devam edin 🐾`;
        return null;
    },
    () => {
        if (appData.music.length > 0) {
            const r = appData.music[Math.floor(Math.random() * Math.min(appData.music.length, 5))];
            return `"${r.title}" iyi bir seçim miydi acaba 🎵`;
        }
        return null;
    },
    () => {
        if (typeof emotionData !== 'undefined' && emotionData.entries.length > 0) {
            const last = emotionData.entries[0];
            const name = last.user === 'emir' ? 'Emir' : 'Pelin';
            return `${name} son kayıtta ${last.emotions.join('+')} hissediyormuş`;
        }
        return null;
    },
    () => {
        const msgs = chatData.messages.length;
        if (msgs > 0) return `${msgs} mesaj birikmiş, iyi iletişim 🐱`;
        return null;
    },
    () => 'Mırr... buradayım, bir şey sormak ister misiniz?',
    () => 'Tarçın dinliyor 🐾',
];

let tarcinChatHistory = [];
let tarcinBubbleTimer = null;
let tarcinState = 'awake'; // awake, sleep, blink
let tarcinStateTimer = null;

// Tarçın'ı başlat
function initTarcin() {
    if (document.getElementById('tarcinWidget')) return;
    // Sadece mainApp görünürken başlat
    const mainApp = document.getElementById('mainApp');
    if (!mainApp || mainApp.classList.contains('hidden')) return;

    const widget = document.createElement('div');
    widget.id = 'tarcinWidget';
    widget.innerHTML = `
        <div id="tarcinBubble" class="tarcin-bubble hidden"></div>
        <div id="tarcinBtn" class="tarcin-btn" onclick="toggleTarcinChat()">
            <div id="tarcinCatDisplay" class="tarcin-cat-display">
                ${CAT_SVG_AWAKE}
            </div>
        </div>
        <div id="tarcinChat" class="tarcin-chat hidden">
            <div class="tarcin-chat-header">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span style="font-size:1.2rem;">🐱</span>
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

// Kedi animasyon döngüsü
function startTarcinAnimations() {
    function nextState() {
        const rand = Math.random();
        if (rand < 0.15) {
            // Uyku modu (15%)
            setTarcinState('sleep');
            tarcinStateTimer = setTimeout(() => {
                setTarcinState('awake');
                tarcinStateTimer = setTimeout(nextState, getRandDelay(8, 20));
            }, getRandDelay(8, 20) * 1000);
        } else if (rand < 0.4) {
            // Kırpma (25%)
            setTarcinState('blink');
            tarcinStateTimer = setTimeout(() => {
                setTarcinState('awake');
                tarcinStateTimer = setTimeout(nextState, getRandDelay(3, 8));
            }, 300);
        } else {
            // Uyanık (60%)
            setTarcinState('awake');
            tarcinStateTimer = setTimeout(nextState, getRandDelay(4, 12));
        }
    }
    tarcinStateTimer = setTimeout(nextState, getRandDelay(5, 15));
}

function getRandDelay(min, max) {
    return (Math.random() * (max - min) + min) * 1000;
}

function setTarcinState(state) {
    tarcinState = state;
    const display = document.getElementById('tarcinCatDisplay');
    if (!display) return;
    if (state === 'awake') display.innerHTML = CAT_SVG_AWAKE;
    else if (state === 'sleep') display.innerHTML = CAT_SVG_SLEEP;
    else if (state === 'blink') display.innerHTML = CAT_SVG_BLINK;
}

function toggleTarcinChat() {
    const chat = document.getElementById('tarcinChat');
    const bubble = document.getElementById('tarcinBubble');
    if (!chat) return;

    const isOpen = !chat.classList.contains('hidden');
    chat.classList.toggle('hidden', isOpen);
    if (bubble) bubble.classList.add('hidden');

    if (!isOpen && tarcinChatHistory.length === 0) {
        // İlk açılışta selamlama
        addTarcinMessage('tarcin', `Merhaba! Ben Tarçın 🐱 Buradaki her şeyi biliyorum, ne sormak istersin?`);
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

    // Yazıyor göstergesi
    const typing = document.createElement('div');
    typing.className = 'tarcin-msg tarcin-msg-ai tarcin-typing';
    typing.textContent = '...';
    document.getElementById('tarcinMessages')?.appendChild(typing);

    tarcinChatHistory.push({ role: 'user', content: text });

    const context = buildTarcinContext();
    // Sadece ilk mesajda context gönder, sonrasında sohbet geçmişi yeterli
    const systemContent = tarcinChatHistory.length <= 1
        ? TARCIN_SYSTEM + '\n\nSite özeti (gerekirse kullan):\n' + context
        : TARCIN_SYSTEM;

    const messages = [
        { role: 'system', content: systemContent },
        ...tarcinChatHistory.slice(-10)
    ];

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: 200, temperature: 0.5 })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'Mırr... bir sorun oldu 🐾';

        typing.remove();
        tarcinChatHistory.push({ role: 'assistant', content: reply });
        addTarcinMessage('tarcin', reply);
    } catch {
        typing.remove();
        addTarcinMessage('tarcin', 'Mırr... bağlanamadım 🐾');
    }
}

function scheduleTarcinBubble() {
    if (tarcinBubbleTimer) clearTimeout(tarcinBubbleTimer);
    // 2-5 dakika arası rastgele
    const delay = (Math.random() * 3 + 2) * 60 * 1000;
    tarcinBubbleTimer = setTimeout(showTarcinBubble, delay);
}

function showTarcinBubble() {
    const bubble = document.getElementById('tarcinBubble');
    const chat = document.getElementById('tarcinChat');
    if (!bubble || !chat?.classList.contains('hidden')) {
        scheduleTarcinBubble();
        return;
    }

    // Rastgele bir şey söyle
    const fns = TARCIN_BUBBLES.filter(f => f() !== null);
    if (fns.length === 0) { scheduleTarcinBubble(); return; }
    const msg = fns[Math.floor(Math.random() * fns.length)]();
    if (!msg) { scheduleTarcinBubble(); return; }

    bubble.textContent = msg;
    bubble.classList.remove('hidden');

    setTimeout(() => {
        bubble.classList.add('hidden');
        scheduleTarcinBubble();
    }, 6000);
}
