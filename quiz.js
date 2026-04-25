// ===== QUIZ SİSTEMİ - Birbirini Tanıma =====

const QUIZ_CATEGORIES = {
    renkler:    { icon: '🎨', label: 'Renkler & Estetik' },
    yemekler:   { icon: '🍕', label: 'Yemekler & İçecekler' },
    istekler:   { icon: '✨', label: 'İstekler & Hayaller' },
    korkular:   { icon: '😨', label: 'Korkular & Kaygılar' },
    anlar:      { icon: '📸', label: 'Anlar & Anılar' },
    muzik:      { icon: '🎵', label: 'Müzik & Sanat' },
    film:       { icon: '🎬', label: 'Film & Dizi' },
    aliskanlik: { icon: '🔄', label: 'Alışkanlıklar' },
    kisilik:    { icon: '🧠', label: 'Kişilik & Düşünceler' },
};

const QUIZ_QUESTIONS_POOL = {
    renkler: [
        'En sevdiğin renk nedir?',
        'Hiç sevmediğin renk hangisi?',
        'Odanın duvarını hangi renge boyatırdın?',
        'Hangi renk seni mutlu hissettiriyor?',
    ],
    yemekler: [
        'En sevdiğin yemek nedir?',
        'Sabah kahvaltısında ne yemeyi seversin?',
        'Hiç yiyemediğin bir yemek var mı?',
        'En sevdiğin tatlı nedir?',
        'Dışarıda yemek yersen hangi mutfağı tercih edersin?',
    ],
    istekler: [
        'Hayatında bir kez yapmak istediğin şey nedir?',
        'Şu an en çok ne istiyorsun?',
        'Hangi ülkeye gitmek isterdin?',
        'Bir süper gücün olsaydı ne olurdu?',
    ],
    korkular: [
        'En büyük korkunun nedir?',
        'Hangi hayvan seni en çok korkutur?',
        'Karanlıktan korkar mısın?',
        'Gelecekle ilgili en çok neyi düşünürsün?',
    ],
    anlar: [
        'En mutlu anın hangisi?',
        'Çocukluğundan aklında kalan bir an var mı?',
        'Hayatında en çok pişman olduğun şey nedir?',
        'En güzel doğum günün hangisiydi?',
    ],
    muzik: [
        'Şu an en çok dinlediğin şarkı hangisi?',
        'Hangi müzik türünü hiç dinleyemezsin?',
        'Bir konser izleyebilseydin kim olurdu?',
        'Müzik olmadan yaşayabilir misin?',
    ],
    film: [
        'En sevdiğin film nedir?',
        'Hangi dizi seni en çok etkiledi?',
        'Korku filmi izler misin?',
        'Favori film karakterin kim?',
    ],
    aliskanlik: [
        'Sabah ilk ne yaparsın?',
        'Uyumadan önce ne yaparsın?',
        'Stres atma yöntemin nedir?',
        'Telefona günde kaç saat bakarsın?',
    ],
    kisilik: [
        'Kendini 3 kelimeyle nasıl tanımlarsın?',
        'İnsanlarda en çok neyi seversin?',
        'En büyük güçlü yönün nedir?',
        'Yalnız mı yoksa kalabalık mı tercih edersin?',
    ],
};

// Profil verisi
const quizProfile = {
    emir: JSON.parse(localStorage.getItem('quizProfile_emir') || '{}'),
    pelin: JSON.parse(localStorage.getItem('quizProfile_pelin') || '{}')
};

function openQuizSection() {
    openFullPage('🎯 Quiz', (body) => {
        renderQuizPage(body);
    });
}

function renderQuizPage(body) {
    if (!body) body = document.getElementById('fullPageBody');
    if (!body) return;

    const other = currentUser === 'emir' ? 'pelin' : 'emir';
    const otherName = currentUser === 'emir' ? 'Pelin' : 'Emir';
    const myName = currentUser === 'emir' ? 'Emir' : 'Pelin';

    const pending = quizData.questions.filter(q => q.askedBy === other && !q.userAnswer);
    const myQ = quizData.questions.filter(q => q.askedBy === currentUser);
    const myScore = quizData.questions.filter(q => q.askedBy === other && q.correct).length;
    const otherScore = quizData.questions.filter(q => q.askedBy === currentUser && q.correct).length;
    const myAnswered = Object.keys(quizProfile[currentUser]).length;
    const otherAnswered = Object.keys(quizProfile[other]).length;

    body.innerHTML = `
        <div class="quiz-page">
            <div class="quiz-scoreboard">
                <div class="quiz-score-item">
                    <span class="quiz-score-name">${myName}</span>
                    <span class="quiz-score-num">${myScore}</span>
                </div>
                <div class="quiz-score-vs">vs</div>
                <div class="quiz-score-item">
                    <span class="quiz-score-name">${otherName}</span>
                    <span class="quiz-score-num">${otherScore}</span>
                </div>
            </div>

            <div class="quiz-profile-bar">
                <div class="quiz-profile-info">
                    <span>Senin profilin: ${myAnswered} cevap</span>
                    <button class="quiz-profile-btn" onclick="openMyProfileQuiz()">Profili Doldur</button>
                </div>
                <div class="quiz-profile-info">
                    <span>${otherName}: ${otherAnswered} cevap</span>
                    <button class="quiz-profile-btn" onclick="openOtherProfileView('${other}')">Gör</button>
                </div>
            </div>

            ${pending.length > 0 ? `
                <div class="quiz-section">
                    <h3 class="quiz-section-title">📬 Sana Sorulan (${pending.length})</h3>
                    ${pending.map(q => `
                        <div class="quiz-card pending">
                            <div class="quiz-question">${escapeHtml(q.question)}</div>
                            <div class="quiz-answer-form">
                                <input type="text" class="quiz-answer-input" id="ans_${q.id}" placeholder="Cevabın...">
                                <button class="quiz-submit-btn" onclick="submitQuizAnswer(${q.id})">Gönder</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="quiz-section">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                    <h3 class="quiz-section-title" style="margin:0;">✏️ ${otherName}'e Soru Sor</h3>
                    <button class="add-btn" onclick="showAddQuizModal()">+ Soru Sor</button>
                </div>
                ${myQ.length === 0 ? `<p style="color:var(--text-secondary);font-size:0.875rem;">${otherName}'e henüz soru sormadın.</p>` : ''}
                ${myQ.map(q => `
                    <div class="quiz-card ${q.userAnswer ? (q.correct ? 'correct' : 'wrong') : 'waiting'}">
                        <div class="quiz-question">${escapeHtml(q.question)}</div>
                        ${q.userAnswer ? `
                            <div class="quiz-result">
                                <span class="quiz-user-answer">${otherName}: "${escapeHtml(q.userAnswer)}"</span>
                                <span class="quiz-correct-answer">Doğru: "${escapeHtml(q.answer)}"</span>
                                <span class="quiz-badge ${q.correct ? 'correct' : 'wrong'}">${q.correct ? '✓ Doğru' : '✗ Yanlış'}</span>
                            </div>
                        ` : `<div class="quiz-waiting">⏳ ${otherName} henüz cevaplamadı</div>`}
                        <button class="quiz-delete-btn" onclick="deleteQuizQuestion(${q.id})">🗑️</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openMyProfileQuiz() {
    const myProfile = quizProfile[currentUser];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'profileQuizModal';

    const allQuestions = Object.entries(QUIZ_QUESTIONS_POOL).flatMap(([cat, qs]) =>
        qs.map(q => ({ cat, q, key: cat + '_' + q.substring(0,15).replace(/\s/g,'_') }))
    );

    modal.innerHTML = `
        <div class="modal-content" style="max-width:480px;">
            <div class="modal-header">
                <h3>📝 Profilini Doldur</h3>
                <button class="close-btn" onclick="document.getElementById('profileQuizModal').remove()">&times;</button>
            </div>
            <div class="modal-body" style="max-height:60vh;overflow-y:auto;">
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">
                    Cevapların kaydedilir. Karşı taraf bunları bilerek sana soru soracak.
                </p>
                ${allQuestions.map(({cat, q, key}) => `
                    <div style="margin-bottom:0.75rem;">
                        <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem;">
                            ${QUIZ_CATEGORIES[cat].icon} ${q}
                        </label>
                        <input type="text" class="profile-quiz-input" data-key="${key}"
                            value="${escapeHtml(myProfile[key] || '')}"
                            placeholder="Cevabın..."
                            style="width:100%;padding:0.5rem 0.75rem;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-family:inherit;font-size:0.875rem;">
                    </div>
                `).join('')}
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="document.getElementById('profileQuizModal').remove()">İptal</button>
                <button class="save-btn" onclick="saveMyProfile()">Kaydet</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveMyProfile() {
    document.querySelectorAll('.profile-quiz-input').forEach(input => {
        const key = input.dataset.key;
        const val = input.value.trim();
        if (val) quizProfile[currentUser][key] = val;
        else delete quizProfile[currentUser][key];
    });
    localStorage.setItem('quizProfile_' + currentUser, JSON.stringify(quizProfile[currentUser]));
    if (window.firebaseAPI) window.firebaseAPI.saveData('quizProfile_' + currentUser, quizProfile[currentUser]);
    document.getElementById('profileQuizModal')?.remove();
    renderQuizPage();
}

function openOtherProfileView(user) {
    const profile = quizProfile[user];
    const name = user === 'emir' ? 'Emir' : 'Pelin';
    const entries = Object.entries(profile);
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:420px;">
            <div class="modal-header">
                <h3>👤 ${name}'in Profili</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body" style="max-height:60vh;overflow-y:auto;">
                ${entries.length === 0
                    ? '<p style="color:var(--text-secondary);">Henüz profil doldurulmamış.</p>'
                    : entries.map(([key, val]) => {
                        const q = key.replace(/_/g,' ').replace(/^[a-z]+ /,'');
                        return `<div style="padding:0.5rem 0;border-bottom:1px solid var(--border-color);">
                            <div style="font-size:0.75rem;color:var(--text-secondary);">${q}</div>
                            <div style="font-size:0.9rem;color:var(--text-primary);font-weight:500;">${escapeHtml(val)}</div>
                        </div>`;
                    }).join('')
                }
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showAddQuizModal() {
    const other = currentUser === 'emir' ? 'pelin' : 'emir';
    const otherName = currentUser === 'emir' ? 'Pelin' : 'Emir';
    const otherProfile = quizProfile[other];
    const profileEntries = Object.entries(otherProfile);

    const suggestions = profileEntries.length > 0
        ? `<div style="margin-bottom:0.75rem;">
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.4rem;">💡 ${otherName}'in profilinden soru önerileri:</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
                ${profileEntries.slice(0,4).map(([k,v]) => {
                    const q = k.replace(/_/g,' ').replace(/^[a-z]+ /,'');
                    return `<button onclick="fillQuizFromProfile(this,'${escapeHtml(q)}','${escapeHtml(v)}')"
                        style="background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:8px;padding:0.3rem 0.6rem;font-size:0.75rem;cursor:pointer;color:var(--text-primary);">
                        ${q}?
                    </button>`;
                }).join('')}
            </div>
           </div>`
        : '';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'addQuizModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${otherName}'e Soru Sor</h3>
                <button class="close-btn" onclick="document.getElementById('addQuizModal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${suggestions}
                <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;">
                    <button class="add-btn" onclick="generateAIQuizQuestion()" style="flex:1;font-size:0.85rem;">
                        ✨ AI Soru Üret
                    </button>
                    <button class="add-btn" onclick="generateAIQuizQuestionFromProfile()" style="flex:1;font-size:0.85rem;" ${profileEntries.length === 0 ? 'disabled' : ''}>
                        🎯 Profilden Üret
                    </button>
                </div>
                <input type="text" id="quizQuestionInput" placeholder="Soru..." maxlength="200">
                <input type="text" id="quizAnswerInput" placeholder="Doğru cevap (sadece sen göreceksin)..." maxlength="100">
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="document.getElementById('addQuizModal').remove()">İptal</button>
                <button class="save-btn" onclick="saveQuizQuestion()">Sor</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('quizQuestionInput')?.focus(), 100);
}

function fillQuizFromProfile(btn, question, answer) {
    document.getElementById('quizQuestionInput').value = question + '?';
    document.getElementById('quizAnswerInput').value = answer;
    btn.style.background = 'var(--accent-color)';
    btn.style.color = 'white';
}

function saveQuizQuestion() {
    const question = document.getElementById('quizQuestionInput')?.value.trim();
    const answer = document.getElementById('quizAnswerInput')?.value.trim();
    if (!question || !answer) return;
    quizData.questions.unshift({
        id: Date.now(), question, answer,
        askedBy: currentUser, userAnswer: null, correct: null,
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
    });
    saveQuizData();
    document.getElementById('addQuizModal')?.remove();
    renderQuizPage();
}

function submitQuizAnswer(questionId) {
    const input = document.getElementById('ans_' + questionId);
    const userAnswer = input?.value.trim();
    if (!userAnswer) return;
    const q = quizData.questions.find(q => q.id === questionId);
    if (!q) return;
    q.userAnswer = userAnswer;
    q.correct = userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();
    q.answeredAt = new Date().toISOString();
    saveQuizData();
    renderQuizPage();
}

function deleteQuizQuestion(id) {
    quizData.questions = quizData.questions.filter(q => q.id !== id);
    saveQuizData();
    renderQuizPage();
}

function saveQuizData() {
    localStorage.setItem('quizQuestions', JSON.stringify(quizData.questions));
    if (window.firebaseAPI) window.firebaseAPI.saveData('quizQuestions', quizData.questions);
}

// ===== AI SORU ÜRETME =====

async function generateAIQuizQuestion() {
    const other = currentUser === 'emir' ? 'pelin' : 'emir';
    const otherName = currentUser === 'emir' ? 'Pelin' : 'Emir';
    const myName = currentUser === 'emir' ? 'Emir' : 'Pelin';
    
    const questionInput = document.getElementById('quizQuestionInput');
    const answerInput = document.getElementById('quizAnswerInput');
    
    if (!questionInput || !answerInput) return;
    
    // API key kontrolü
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_API_KEY_HERE') {
        alert('AI özelliği için API key gerekli. Lütfen manuel soru girin.');
        return;
    }
    
    // Loading göster
    questionInput.value = 'AI soru üretiyor...';
    questionInput.disabled = true;
    answerInput.disabled = true;
    
    const categories = Object.keys(QUIZ_CATEGORIES).map(k => QUIZ_CATEGORIES[k].label).join(', ');
    
    const prompt = `Sen bir quiz soru üreticisisin. ${myName}, ${otherName}'e sormak için bir soru üretmelisin.

Kategoriler: ${categories}

Kurallar:
- Kısa ve net bir soru sor (max 15 kelime)
- Kişisel ve ilginç olsun
- Cevabı tahmin edilebilir olmalı
- Türkçe yaz
- Sadece soruyu yaz, açıklama yapma

Format:
Soru: [soru metni]

Örnek:
Soru: En sevdiğin mevsim hangisi?`;

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
                temperature: 0.8
            })
        });
        
        if (!res.ok) {
            throw new Error(`API Hatası: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || '';
        
        // "Soru:" kısmını temizle
        const question = reply.replace(/^Soru:\s*/i, '').trim();
        
        questionInput.value = question;
        answerInput.value = '';
        answerInput.focus();
        
    } catch (error) {
        console.error('AI soru üretme hatası:', error);
        questionInput.value = '';
        alert('AI soru üretemedi (API key süresi dolmuş olabilir). Lütfen manuel soru girin.');
    } finally {
        questionInput.disabled = false;
        answerInput.disabled = false;
    }
}

async function generateAIQuizQuestionFromProfile() {
    const other = currentUser === 'emir' ? 'pelin' : 'emir';
    const otherName = currentUser === 'emir' ? 'Pelin' : 'Emir';
    const myName = currentUser === 'emir' ? 'Emir' : 'Pelin';
    const otherProfile = quizProfile[other];
    
    const questionInput = document.getElementById('quizQuestionInput');
    const answerInput = document.getElementById('quizAnswerInput');
    
    if (!questionInput || !answerInput) return;
    
    const profileEntries = Object.entries(otherProfile);
    if (profileEntries.length === 0) {
        alert(`${otherName} henüz profil doldurmamış.`);
        return;
    }
    
    // API key kontrolü
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_API_KEY_HERE') {
        alert('AI özelliği için API key gerekli. Lütfen manuel soru girin.');
        return;
    }
    
    // Loading göster
    questionInput.value = 'AI soru üretiyor...';
    questionInput.disabled = true;
    answerInput.disabled = true;
    
    // Profil verilerini hazırla
    const profileData = profileEntries.map(([k, v]) => {
        const q = k.replace(/_/g, ' ').replace(/^[a-z]+ /, '');
        return `${q}: ${v}`;
    }).join('\n');
    
    const prompt = `Sen bir quiz soru üreticisisin. ${myName}, ${otherName}'in profilini biliyor ve ona soru soracak.

${otherName}'in profili:
${profileData}

Kurallar:
- Profildeki bilgilerden BİRİNİ seç
- O bilgiyle ilgili yaratıcı bir soru sor
- Cevap profilde olmalı
- Kısa ve net sor (max 15 kelime)
- Türkçe yaz
- Sadece soruyu ve cevabı yaz

Format:
Soru: [soru metni]
Cevap: [cevap metni]

Örnek:
Soru: En sevdiğin renk nedir?
Cevap: Mavi`;

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        if (!res.ok) {
            throw new Error(`API Hatası: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || '';
        
        // Parse et
        const questionMatch = reply.match(/Soru:\s*(.+)/i);
        const answerMatch = reply.match(/Cevap:\s*(.+)/i);
        
        if (questionMatch && answerMatch) {
            questionInput.value = questionMatch[1].trim();
            answerInput.value = answerMatch[1].trim();
        } else {
            questionInput.value = reply.split('\n')[0].replace(/^Soru:\s*/i, '').trim();
            answerInput.value = '';
        }
        
        answerInput.focus();
        
    } catch (error) {
        console.error('AI soru üretme hatası:', error);
        questionInput.value = '';
        alert('AI soru üretemedi (API key süresi dolmuş olabilir). Lütfen manuel soru girin.');
    } finally {
        questionInput.disabled = false;
        answerInput.disabled = false;
    }
}
