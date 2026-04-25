// Groq AI Entegrasyonu (Llama 3.1)
// API key'i localStorage'dan al (güvenlik için kodda saklanmıyor)
const GROQ_API_KEY = localStorage.getItem('groq_api_key') || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

// İlk kurulum: API key yoksa kullanıcıdan al
function checkGroqApiKey() {
    if (!GROQ_API_KEY) {
        const key = prompt('Groq API Key girin (AI özellikleri için gerekli):\n\nAPI key almak için: https://console.groq.com/keys');
        if (key) {
            localStorage.setItem('groq_api_key', key.trim());
            location.reload();
        }
    }
}

async function groqRequest(prompt, systemPrompt = '') {
    try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const res = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                max_tokens: 512,
                temperature: 0.8
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices?.[0]?.message?.content || '';
    } catch (err) {
        console.error('Groq hatası:', err);
        return null;
    }
}

// Kullanıcı context'i oluştur - zengin veri
function buildUserContext() {
    const musicTitles = appData.music.slice(1, 8).map(m => m.title).join(', '); // en son eklenen hariç
    const dreams = appData.dreams.slice(1, 5).map(d => d.title).join(', ');
    const notes = appData.notes.slice(1, 4).map(n => n.title).join(', ');

    // Duygu geçmişi
    const recentEmotions = typeof emotionData !== 'undefined'
        ? emotionData.entries.slice(0, 5).map(e => e.emotions.join('+')).join(', ')
        : '';

    // Alışkanlık streakları
    const habitStreaks = typeof habitData !== 'undefined'
        ? habitData.habits.slice(0, 3).map(h => `${h.title}`).join(', ')
        : '';

    // Hedefler
    const goals = typeof goalData !== 'undefined'
        ? goalData.goals.filter(g => !g.done).slice(0, 3).map(g => g.title).join(', ')
        : '';

    // Kim giriş yapmış
    const personality = currentUser === 'pelin' ? 'INTP' : 'INFP';
    const otherPersonality = currentUser === 'pelin' ? 'INFP' : 'INTP';

    return `Soru sorulan kişi: ${currentUser === 'pelin' ? 'Pelin' : 'Emir'} (${personality} kişilik tipi)
Diğer kişi: ${currentUser === 'pelin' ? 'Emir' : 'Pelin'} (${otherPersonality} kişilik tipi)
Müzik zevkleri: ${musicTitles || 'belirtilmemiş'}
Hayalleri: ${dreams || 'belirtilmemiş'}
Notları: ${notes || 'belirtilmemiş'}
Son duygular: ${recentEmotions || 'belirtilmemiş'}
Alışkanlıkları: ${habitStreaks || 'belirtilmemiş'}
Aktif hedefleri: ${goals || 'belirtilmemiş'}`;
}

// ===== KEŞFet & MERAK =====

const kesfeData = {
    history: JSON.parse(localStorage.getItem('kesfeHistory') || '[]')
};

let currentKesfeQuestion = null;

function openKesfeSection() {
    openFullPage('🔭 Keşfet & Merak', (body) => {
        renderKesfePage(body);
    });
}

function renderKesfePage(body) {
    if (!body) body = document.getElementById('fullPageBody');
    if (!body) return;

    body.innerHTML = `
        <div class="kesfe-page">
            <div class="kesfe-intro">
                <p>AI size özel sorular üretiyor. Cevapla, öğren, keşfet.</p>
            </div>
            <div class="kesfe-categories">
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('film')">🎬 Film</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('kitap')">📚 Kitap</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('müzik')">🎵 Müzik</button>
                <button class="kesfe-cat-btn kesfe-lucky-btn" onclick="generateKesfeQuestion('sürpriz')">🍀 Şanslı</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('bilim')">🔬 Bilim</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('sanat')">🎨 Sanat</button>
            </div>
            <div id="kesfeQuestionArea" class="kesfe-question-area"></div>
            ${kesfeData.history.length > 0 ? `
                <div class="kesfe-history">
                    <h3>Geçmiş Sorular</h3>
                    ${kesfeData.history.slice(0, 15).map((h, i) => `
                        <div class="kesfe-history-item ${h.correct === true ? 'correct' : h.correct === false ? 'wrong' : 'yorum'}">
                            <div class="kesfe-history-meta">
                                <span class="kesfe-cat-tag">${getCategoryEmoji(h.category)} ${h.category || ''}</span>
                                <span class="kesfe-who">${h.answeredByName || ''}</span>
                                <span class="kesfe-date">${h.date || ''}</span>
                                <button class="kesfe-delete-btn" onclick="deleteKesfeHistory(${h.id || i})">🗑️</button>
                            </div>
                            <div class="kesfe-history-q">${escapeHtml(h.question)}</div>
                            <div class="kesfe-history-a">
                                <span>${h.correct === true ? '✓' : h.correct === false ? '✗' : '💭'} ${escapeHtml(h.userAnswer)}</span>
                                ${h.correct === false ? `<span class="kesfe-correct-ans">→ ${escapeHtml(h.correctAnswer)}</span>` : ''}
                                ${h.aiComment ? `<span class="kesfe-ai-comment">${escapeHtml(h.aiComment)}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

async function generateKesfeQuestion(category) {
    const area = document.getElementById('kesfeQuestionArea');
    if (!area) return;

    area.innerHTML = `<div class="kesfe-loading"><div class="kesfe-spinner"></div><p>Soru hazırlanıyor...</p></div>`;

    const context = buildUserContext();
    const system = `Sen Türkçe konuşan bir soru asistanısın.
Soru sorulan kişinin kişilik tipine göre soru üret:
- INTP için: mantık, sistem, analiz, teori, "neden böyle çalışır" tarzı sorular
- INFP için: değerler, anlam, empati, "bu sana ne hissettiriyor" tarzı derin sorular
Her iki tip için de düşündürücü, derin konuşma başlatacak sorular sor.
Romantik, aşk veya ilişki temalı sorulardan kesinlikle kaçın.
Soru tipini belirle: bilgi sorusu ise net bir doğru cevap var, yorum sorusu ise kişisel görüş isteniyor.
Sadece istenen formatta yanıt ver, başka hiçbir şey yazma.`;

    const recentQ = kesfeData.history.slice(0, 5).map(h => h.question).join(' | ');
    const categoryPrompt = category === 'sürpriz'
        ? `Kişinin verilerinden (müzik, hayaller, duygular, hedefler) ilham alarak tamamen sürpriz bir kategori ve soru seç. Kişilik tipine çok uygun olsun.`
        : `${category} kategorisinde bu kişiye uygun, düşündürücü bir soru sor.`;

    const prompt = `${context}
${recentQ ? `\nSon sorulan sorular (bunları tekrarlama): ${recentQ}\n` : ''}
${categoryPrompt}
Eğer bilgi sorusu ise TIP: bilgi yaz, yorum sorusu ise TIP: yorum yaz.

Tam olarak bu formatta yaz:
TIP: [bilgi veya yorum]
SORU: [soru]
CEVAP: [bilgi sorusu için kısa doğru cevap, yorum sorusu için "yorum" yaz]
AÇIKLAMA: [bilgi sorusu için 1 cümle açıklama, yorum sorusu için boş bırak]`;

    const response = await groqRequest(prompt, system);

    if (!response) {
        area.innerHTML = `<div class="kesfe-error">Soru üretilemedi, tekrar dene.</div>`;
        return;
    }

    const tipMatch = response.match(/TIP:\s*(.+)/i);
    const soruMatch = response.match(/SORU:\s*(.+)/);
    const cevapMatch = response.match(/CEVAP:\s*(.+)/);
    const aciklamaMatch = response.match(/AÇIKLAMA:\s*(.+)/);

    if (!soruMatch) {
        area.innerHTML = `<div class="kesfe-error">Format hatası, tekrar dene.</div>`;
        return;
    }

    const isYorum = tipMatch && tipMatch[1].toLowerCase().includes('yorum');

    currentKesfeQuestion = {
        question: soruMatch[1].trim(),
        answer: cevapMatch ? cevapMatch[1].trim() : '',
        explanation: aciklamaMatch ? aciklamaMatch[1].trim() : '',
        category,
        isYorum
    };

    area.innerHTML = `
        <div class="kesfe-question-card" id="kesfeCard">
            <div class="kesfe-cat-badge">${getCategoryEmoji(category)} ${category} ${isYorum ? '· yorum' : '· bilgi'}</div>
            <div class="kesfe-question-text">${escapeHtml(currentKesfeQuestion.question)}</div>
            <div class="kesfe-answer-form" id="kesfeAnswerForm">
                <input type="text" id="kesfeAnswerInput" placeholder="${isYorum ? 'Görüşün...' : 'Cevabın...'}" autocomplete="off">
                <button class="kesfe-submit-btn" onclick="submitKesfeAnswer()">Gönder</button>
            </div>
            <button class="kesfe-skip-btn" onclick="generateKesfeQuestion('${category}')">Başka soru →</button>
        </div>
    `;
    setTimeout(() => document.getElementById('kesfeAnswerInput')?.focus(), 100);
}

async function submitKesfeAnswer() {
    const input = document.getElementById('kesfeAnswerInput');
    const userAnswer = input?.value.trim();
    if (!userAnswer || !currentKesfeQuestion) return;

    const submitBtn = document.querySelector('.kesfe-submit-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '...'; }

    let isCorrect = null;
    let aiComment = '';

    if (currentKesfeQuestion.isYorum) {
        // Yorum sorusu: AI yorum yapsın, doğru/yanlış yok
        const commentPrompt = `Soru: "${currentKesfeQuestion.question}"
Kullanıcının görüşü: "${userAnswer}"
Bu görüşe 1-2 cümle kısa, düşündürücü bir yorum yap. Türkçe yaz.`;
        aiComment = await groqRequest(commentPrompt) || '';
        isCorrect = null;
    } else {
        // Bilgi sorusu: doğru/yanlış değerlendir
        const evalPrompt = `Soru: "${currentKesfeQuestion.question}"
Doğru cevap: "${currentKesfeQuestion.answer}"
Kullanıcı cevabı: "${userAnswer}"
Anlam olarak aynı veya çok yakınsa doğru say. Sadece "DOĞRU" veya "YANLIŞ" yaz.`;
        const evalResult = await groqRequest(evalPrompt);
        isCorrect = evalResult?.trim().toUpperCase().includes('DOĞRU');
    }

    // Geçmişe kaydet
    kesfeData.history.unshift({
        id: Date.now(),
        question: currentKesfeQuestion.question,
        userAnswer,
        correctAnswer: currentKesfeQuestion.answer,
        correct: isCorrect,
        isYorum: currentKesfeQuestion.isYorum,
        aiComment,
        category: currentKesfeQuestion.category,
        answeredBy: currentUser,
        answeredByName: currentUser === 'emir' ? 'Emir' : 'Pelin',
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    localStorage.setItem('kesfeHistory', JSON.stringify(kesfeData.history));
    if (window.firebaseAPI) window.firebaseAPI.saveData('kesfeHistory', kesfeData.history);

    // Sonucu kartın altına ekle, form kaybolmasın
    const card = document.getElementById('kesfeCard');
    if (card) {
        const resultDiv = document.createElement('div');
        resultDiv.className = `kesfe-result ${currentKesfeQuestion.isYorum ? 'yorum' : (isCorrect ? 'correct' : 'wrong')}`;
        resultDiv.innerHTML = `
            ${!currentKesfeQuestion.isYorum ? `
                <div class="kesfe-result-icon">${isCorrect ? '✓' : '✗'}</div>
                <div class="kesfe-result-text">${isCorrect ? 'Doğru!' : 'Yanlış'}</div>
                <div class="kesfe-result-answer">
                    <span>Cevabın: <strong>${escapeHtml(userAnswer)}</strong></span>
                    ${!isCorrect ? `<span>Doğrusu: <strong>${escapeHtml(currentKesfeQuestion.answer)}</strong></span>` : ''}
                </div>
                ${currentKesfeQuestion.explanation ? `<div class="kesfe-explanation">${escapeHtml(currentKesfeQuestion.explanation)}</div>` : ''}
            ` : `
                <div class="kesfe-result-text">💭 AI Yorumu</div>
                <div class="kesfe-explanation">${escapeHtml(aiComment)}</div>
            `}
            <button class="kesfe-next-btn" onclick="generateKesfeQuestion('${currentKesfeQuestion.category}')">Sonraki Soru →</button>
        `;
        card.appendChild(resultDiv);
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Formu devre dışı bırak
    const form = document.getElementById('kesfeAnswerForm');
    if (form) form.style.opacity = '0.4', form.style.pointerEvents = 'none';

    currentKesfeQuestion = null;
}

function getCategoryEmoji(cat) {
    const map = { film: '🎬', kitap: '📚', müzik: '🎵', sürpriz: '🍀', bilim: '🔬', sanat: '🎨', genel: '🌍' };
    return map[cat] || '❓';
}

function deleteKesfeHistory(id) {
    kesfeData.history = kesfeData.history.filter((h, i) => (h.id || i) !== id);
    localStorage.setItem('kesfeHistory', JSON.stringify(kesfeData.history));
    if (window.firebaseAPI) window.firebaseAPI.saveData('kesfeHistory', kesfeData.history);
    renderKesfePage();
}
