// Gemini API Entegrasyonu
const GEMINI_API_KEY = 'AIzaSyAZPOXe4ycPDZy7UvgFSagoCPiqoEtVnZU';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function geminiRequest(prompt) {
    try {
        const res = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 1024
                }
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
        console.error('Gemini hatası:', err);
        return null;
    }
}

// Kullanıcı context'i oluştur
function buildUserContext() {
    const musicTitles = appData.music.slice(0, 10).map(m => m.title).join(', ');
    const dreams = appData.dreams.slice(0, 5).map(d => d.title).join(', ');
    const notes = appData.notes.slice(0, 3).map(n => n.title).join(', ');

    return `İki kişi hakkında bilgi:
- Müzik zevkleri: ${musicTitles || 'belirtilmemiş'}
- Hayalleri: ${dreams || 'belirtilmemiş'}
- Notları: ${notes || 'belirtilmemiş'}`;
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
                <p>Gemini size özel sorular üretiyor. Cevapla, öğren, keşfet.</p>
            </div>

            <div class="kesfe-categories">
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('film')">🎬 Film</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('kitap')">📚 Kitap</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('müzik')">🎵 Müzik</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('genel')">🌍 Genel</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('bilim')">🔬 Bilim</button>
                <button class="kesfe-cat-btn" onclick="generateKesfeQuestion('sanat')">🎨 Sanat</button>
            </div>

            <div id="kesfeQuestionArea" class="kesfe-question-area"></div>

            ${kesfeData.history.length > 0 ? `
                <div class="kesfe-history">
                    <h3>Geçmiş Sorular</h3>
                    ${kesfeData.history.slice(0, 10).map(h => `
                        <div class="kesfe-history-item ${h.correct ? 'correct' : 'wrong'}">
                            <div class="kesfe-history-q">${escapeHtml(h.question)}</div>
                            <div class="kesfe-history-a">
                                <span>Cevabın: ${escapeHtml(h.userAnswer)}</span>
                                ${!h.correct ? `<span class="kesfe-correct-ans">Doğrusu: ${escapeHtml(h.correctAnswer)}</span>` : ''}
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
    const prompt = `${context}

Bu iki kişiye uygun, ${category} kategorisinde ilgi çekici bir soru sor. 
Soru kısa ve net olsun (1-2 cümle).
Cevap da kısa olsun (1-5 kelime ideal).

Şu formatta yanıt ver (başka hiçbir şey yazma):
SORU: [soru metni]
CEVAP: [doğru cevap]
AÇIKLAMA: [1-2 cümle kısa açıklama]`;

    const response = await geminiRequest(prompt);

    if (!response) {
        area.innerHTML = `<div class="kesfe-error">Soru üretilemedi, tekrar dene.</div>`;
        return;
    }

    // Parse response
    const soruMatch = response.match(/SORU:\s*(.+)/);
    const cevapMatch = response.match(/CEVAP:\s*(.+)/);
    const aciklamaMatch = response.match(/AÇIKLAMA:\s*(.+)/);

    if (!soruMatch || !cevapMatch) {
        area.innerHTML = `<div class="kesfe-error">Format hatası, tekrar dene.</div>`;
        return;
    }

    currentKesfeQuestion = {
        question: soruMatch[1].trim(),
        answer: cevapMatch[1].trim(),
        explanation: aciklamaMatch ? aciklamaMatch[1].trim() : '',
        category
    };

    area.innerHTML = `
        <div class="kesfe-question-card">
            <div class="kesfe-cat-badge">${getCategoryEmoji(category)} ${category}</div>
            <div class="kesfe-question-text">${escapeHtml(currentKesfeQuestion.question)}</div>
            <div class="kesfe-answer-form">
                <input type="text" id="kesfeAnswerInput" placeholder="Cevabın..." autocomplete="off">
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

    const area = document.getElementById('kesfeQuestionArea');
    area.innerHTML = `<div class="kesfe-loading"><div class="kesfe-spinner"></div><p>Değerlendiriliyor...</p></div>`;

    // Gemini ile anlam bazlı değerlendirme
    const evalPrompt = `Soru: "${currentKesfeQuestion.question}"
Doğru cevap: "${currentKesfeQuestion.answer}"
Kullanıcının cevabı: "${userAnswer}"

Bu cevap doğru mu? Anlam olarak aynı veya çok yakınsa doğru say.
Sadece "DOĞRU" veya "YANLIŞ" yaz, başka hiçbir şey yazma.`;

    const evalResult = await geminiRequest(evalPrompt);
    const isCorrect = evalResult?.trim().toUpperCase().includes('DOĞRU');

    // Geçmişe ekle
    kesfeData.history.unshift({
        question: currentKesfeQuestion.question,
        userAnswer,
        correctAnswer: currentKesfeQuestion.answer,
        correct: isCorrect,
        category: currentKesfeQuestion.category,
        date: new Date().toLocaleDateString('tr-TR')
    });
    localStorage.setItem('kesfeHistory', JSON.stringify(kesfeData.history));
    if (window.firebaseAPI) window.firebaseAPI.saveData('kesfeHistory', kesfeData.history);

    area.innerHTML = `
        <div class="kesfe-result ${isCorrect ? 'correct' : 'wrong'}">
            <div class="kesfe-result-icon">${isCorrect ? '✓' : '✗'}</div>
            <div class="kesfe-result-text">${isCorrect ? 'Doğru!' : 'Yanlış'}</div>
            <div class="kesfe-result-answer">
                <span>Senin cevabın: <strong>${escapeHtml(userAnswer)}</strong></span>
                ${!isCorrect ? `<span>Doğru cevap: <strong>${escapeHtml(currentKesfeQuestion.answer)}</strong></span>` : ''}
            </div>
            ${currentKesfeQuestion.explanation ? `<div class="kesfe-explanation">${escapeHtml(currentKesfeQuestion.explanation)}</div>` : ''}
            <button class="kesfe-next-btn" onclick="generateKesfeQuestion('${currentKesfeQuestion.category}')">Sonraki Soru →</button>
        </div>
    `;

    currentKesfeQuestion = null;
}

function getCategoryEmoji(cat) {
    const map = { film: '🎬', kitap: '📚', müzik: '🎵', genel: '🌍', bilim: '🔬', sanat: '🎨' };
    return map[cat] || '❓';
}
