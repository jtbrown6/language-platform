// Application State
const appState = {
    currentTab: 'journal',
    entries: [
        {
            id: 1,
            date: '2025-10-20',
            text: 'Hoy fue un día muy bueno. I went to the mercado and bought some frutas frescas. Me gusta mucho la comida española.',
            wordCount: 25
        },
        {
            id: 2,
            date: '2025-10-19', 
            text: 'Estoy aprendiendo español cada día. It\'s challenging pero también es muy rewarding. Quiero hablar con fluidez.',
            wordCount: 20
        }
    ],
    wordList: ['mercado', 'día', 'hablar', 'aprender'],
    currentEntry: { text: '', timestamp: null },
    chatHistory: [],
    selectedEntry: null,
    selectedText: '',
    selectionPosition: null
};

// Dictionary Data
const dictionaryData = {
    casa: {
        word: 'casa',
        pos: 'sustantivo femenino',
        definitions: ['Edificio para habitar', 'Familia, grupo de personas que viven juntas']
    },
    mercado: {
        word: 'mercado',
        pos: 'sustantivo masculino',
        definitions: ['Sitio público donde se compran y venden mercancías', 'Plaza donde se realizan operaciones comerciales']
    },
    día: {
        word: 'día',
        pos: 'sustantivo masculino',
        definitions: ['Tiempo que la Tierra tarda en dar una vuelta sobre su eje', 'Período de 24 horas']
    },
    bueno: {
        word: 'bueno',
        pos: 'adjetivo',
        definitions: ['Que tiene las cualidades positivas propias de su naturaleza', 'Útil, provechoso, beneficioso']
    },
    aprender: {
        word: 'aprender',
        pos: 'verbo transitivo',
        definitions: ['Adquirir el conocimiento de algo por medio del estudio o de la experiencia', 'Fijar algo en la memoria']
    },
    hablar: {
        word: 'hablar',
        pos: 'verbo intransitivo',
        definitions: ['Articular palabras para expresarse o comunicarse', 'Conversar con una o más personas']
    },
    comer: {
        word: 'comer',
        pos: 'verbo transitivo',
        definitions: ['Ingerir alimento', 'Tomar una comida']
    },
    vivir: {
        word: 'vivir',
        pos: 'verbo intransitivo',
        definitions: ['Tener vida', 'Habitar en un lugar']
    },
    ser: {
        word: 'ser',
        pos: 'verbo copulativo',
        definitions: ['Indica la esencia o naturaleza de las cosas', 'Expresa identidad o características permanentes']
    },
    estar: {
        word: 'estar',
        pos: 'verbo copulativo',
        definitions: ['Indica estado o situación temporal', 'Expresa ubicación o posición']
    },
    tener: {
        word: 'tener',
        pos: 'verbo transitivo',
        definitions: ['Poseer algo', 'Mantener en el poder']
    },
    ir: {
        word: 'ir',
        pos: 'verbo intransitivo',
        definitions: ['Moverse de un lugar hacia otro', 'Dirigirse a un sitio']
    }
};

// Verb Conjugations
const verbConjugations = {
    hablar: {
        infinitive: 'hablar',
        presente: { yo: 'hablo', tu: 'hablas', el: 'habla', nosotros: 'hablamos', vosotros: 'habláis', ellos: 'hablan' },
        preterito: { yo: 'hablé', tu: 'hablaste', el: 'habló', nosotros: 'hablamos', vosotros: 'hablasteis', ellos: 'hablaron' },
        futuro: { yo: 'hablaré', tu: 'hablarás', el: 'hablará', nosotros: 'hablaremos', vosotros: 'hablaréis', ellos: 'hablarán' }
    },
    comer: {
        infinitive: 'comer',
        presente: { yo: 'como', tu: 'comes', el: 'come', nosotros: 'comemos', vosotros: 'coméis', ellos: 'comen' },
        preterito: { yo: 'comí', tu: 'comiste', el: 'comió', nosotros: 'comimos', vosotros: 'comisteis', ellos: 'comieron' },
        futuro: { yo: 'comeré', tu: 'comerás', el: 'comerá', nosotros: 'comeremos', vosotros: 'comeréis', ellos: 'comerán' }
    },
    vivir: {
        infinitive: 'vivir',
        presente: { yo: 'vivo', tu: 'vives', el: 'vive', nosotros: 'vivimos', vosotros: 'vivís', ellos: 'viven' },
        preterito: { yo: 'viví', tu: 'viviste', el: 'vivió', nosotros: 'vivimos', vosotros: 'vivisteis', ellos: 'vivieron' },
        futuro: { yo: 'viviré', tu: 'vivirás', el: 'vivirá', nosotros: 'viviremos', vosotros: 'viviréis', ellos: 'vivirán' }
    },
    ser: {
        infinitive: 'ser',
        presente: { yo: 'soy', tu: 'eres', el: 'es', nosotros: 'somos', vosotros: 'sois', ellos: 'son' },
        preterito: { yo: 'fui', tu: 'fuiste', el: 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', ellos: 'fueron' },
        futuro: { yo: 'seré', tu: 'serás', el: 'será', nosotros: 'seremos', vosotros: 'seréis', ellos: 'serán' }
    },
    estar: {
        infinitive: 'estar',
        presente: { yo: 'estoy', tu: 'estás', el: 'está', nosotros: 'estamos', vosotros: 'estáis', ellos: 'están' },
        preterito: { yo: 'estuve', tu: 'estuviste', el: 'estuvo', nosotros: 'estuvimos', vosotros: 'estuvisteis', ellos: 'estuvieron' },
        futuro: { yo: 'estaré', tu: 'estarás', el: 'estará', nosotros: 'estaremos', vosotros: 'estaréis', ellos: 'estarán' }
    },
    tener: {
        infinitive: 'tener',
        presente: { yo: 'tengo', tu: 'tienes', el: 'tiene', nosotros: 'tenemos', vosotros: 'tenéis', ellos: 'tienen' },
        preterito: { yo: 'tuve', tu: 'tuviste', el: 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', ellos: 'tuvieron' },
        futuro: { yo: 'tendré', tu: 'tendrás', el: 'tendrá', nosotros: 'tendremos', vosotros: 'tendréis', ellos: 'tendrán' }
    },
    ir: {
        infinitive: 'ir',
        presente: { yo: 'voy', tu: 'vas', el: 'va', nosotros: 'vamos', vosotros: 'vais', ellos: 'van' },
        preterito: { yo: 'fui', tu: 'fuiste', el: 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', ellos: 'fueron' },
        futuro: { yo: 'iré', tu: 'irás', el: 'irá', nosotros: 'iremos', vosotros: 'iréis', ellos: 'irán' }
    },
    aprender: {
        infinitive: 'aprender',
        presente: { yo: 'aprendo', tu: 'aprendes', el: 'aprende', nosotros: 'aprendemos', vosotros: 'aprendéis', ellos: 'aprenden' },
        preterito: { yo: 'aprendí', tu: 'aprendiste', el: 'aprendió', nosotros: 'aprendimos', vosotros: 'aprendisteis', ellos: 'aprendieron' },
        futuro: { yo: 'aprenderé', tu: 'aprenderás', el: 'aprenderá', nosotros: 'aprenderemos', vosotros: 'aprenderéis', ellos: 'aprenderán' }
    }
};

// Common verbs for verb detection
const commonVerbs = ['hablar', 'comer', 'vivir', 'ser', 'estar', 'tener', 'hacer', 'ir', 'venir', 'poder', 'querer', 'decir', 'dar', 'ver', 'saber', 'poner', 'trabajar', 'estudiar', 'aprender', 'escribir'];

// AI Tutor Responses
const aiTutorResponses = {
    'por vs para': {
        patterns: ['por', 'para', 'difference', 'diferencia', 'cuando'],
        response: '¡Buena pregunta! "Por" se usa para razones (I did it por amor), duración (por dos horas), y intercambio (pagué 10 euros por el libro). "Para" se usa para propósito (estudio para aprender), destino (voy para Madrid), y fechas límite (necesito esto para mañana). Recuerda: Por = reason/duration, Para = purpose/destination.'
    },
    'ser vs estar': {
        patterns: ['ser', 'estar', 'difference', 'diferencia', 'cuándo'],
        response: 'Esta es una distinción importante. "Ser" describe características permanentes (Soy alto, Es inteligente) y identidad (Soy profesor). "Estar" describe estados temporales (Estoy cansado, Está feliz) y ubicación (Estoy en casa). Un truco: DOCTOR (Description, Occupation, Characteristic, Time, Origin, Relation) usa SER. PLACE (Position, Location, Action, Condition, Emotion) usa ESTAR.'
    },
    'subjuntivo': {
        patterns: ['subjuntivo', 'subjunctive', 'cuando usar'],
        response: 'El subjuntivo expresa deseo, duda, emoción o irrealidad. Úsalo después de expresiones como "espero que" (Espero que vengas), "es importante que" (Es importante que estudies), o "no creo que" (No creo que sea verdad). También después de "cuando" hablando del futuro: "Cuando llegues, llámame."'
    },
    'default': {
        patterns: [],
        response: 'Esa es una excelente pregunta sobre español. Te recomiendo practicar con ejemplos concretos y leer mucho en español para familiarizarte con los patrones naturales del idioma. ¿Hay algún aspecto específico de gramática o vocabulario que te gustaría explorar?'
    }
};

// Practice sentence templates
const practiceSentenceTemplates = [
    { english: 'I need to go to the market tomorrow.', spanish: 'Necesito ir al mercado mañana.' },
    { english: 'My house is very big and comfortable.', spanish: 'Mi casa es muy grande y cómoda.' },
    { english: 'We speak Spanish every day at school.', spanish: 'Hablamos español todos los días en la escuela.' },
    { english: 'They eat lunch at two in the afternoon.', spanish: 'Ellos comen el almuerzo a las dos de la tarde.' },
    { english: 'She is learning to cook traditional food.', spanish: 'Ella está aprendiendo a cocinar comida tradicional.' },
    { english: 'I lived in Madrid for three years.', spanish: 'Viví en Madrid durante tres años.' },
    { english: 'The good days are when I practice Spanish.', spanish: 'Los días buenos son cuando practico español.' },
    { english: 'We have to study more to understand better.', spanish: 'Tenemos que estudiar más para entender mejor.' },
    { english: 'I am going to the store to buy some food.', spanish: 'Voy a la tienda a comprar algo de comida.' },
    { english: 'Today is a beautiful day to walk outside.', spanish: 'Hoy es un día hermoso para caminar afuera.' }
];

// DOM Elements
const elements = {
    // Tabs
    journalTab: document.getElementById('journalTab'),
    archiveTab: document.getElementById('archiveTab'),
    practiceTab: document.getElementById('practiceTab'),
    
    // Tab content
    journalView: document.getElementById('journalView'),
    archiveView: document.getElementById('archiveView'),
    practiceView: document.getElementById('practiceView'),
    
    // Journal elements
    currentDate: document.getElementById('currentDate'),
    wordCount: document.getElementById('wordCount'),
    journalTextarea: document.getElementById('journalTextarea'),
    floatingButtons: document.getElementById('floatingButtons'),
    definitionBtn: document.getElementById('definitionBtn'),
    conjugateBtn: document.getElementById('conjugateBtn'),
    submitReviewBtn: document.getElementById('submitReviewBtn'),
    
    // Panels
    definitionPanel: document.getElementById('definitionPanel'),
    conjugationPanel: document.getElementById('conjugationPanel'),
    definitionContent: document.getElementById('definitionContent'),
    conjugationContent: document.getElementById('conjugationContent'),
    reviewPanel: document.getElementById('reviewPanel'),
    reviewResults: document.getElementById('reviewResults'),
    closeReviewBtn: document.getElementById('closeReviewBtn'),
    saveEntryBtn: document.getElementById('saveEntryBtn'),
    
    // AI Tutor
    aiTutorBtn: document.getElementById('aiTutorBtn'),
    aiTutorOverlay: document.getElementById('aiTutorOverlay'),
    closeTutorBtn: document.getElementById('closeTutorBtn'),
    chatHistory: document.getElementById('chatHistory'),
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn'),
    
    // Archive elements
    entriesList: document.getElementById('entriesList'),
    entryDisplay: document.getElementById('entryDisplay'),
    wordListDisplay: document.getElementById('wordListDisplay'),
    wordListCount: document.getElementById('wordListCount'),
    clearWordListBtn: document.getElementById('clearWordListBtn'),
    
    // Practice elements
    practiceWordCount: document.getElementById('practiceWordCount'),
    generatePracticeBtn: document.getElementById('generatePracticeBtn'),
    practiceDisplay: document.getElementById('practiceDisplay'),
    practiceContent: document.getElementById('practiceContent'),
    generateNewSetBtn: document.getElementById('generateNewSetBtn'),
    
    // Messages
    successMessage: document.getElementById('successMessage')
};

// Initialize App
function initializeApp() {
    setupEventListeners();
    setCurrentDate();
    updateWordCount();
    renderEntries();
    updateWordList();
    updatePracticeWordCount();
}

// Event Listeners Setup
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });
    
    // Journal functionality
    elements.journalTextarea.addEventListener('input', updateWordCount);
    elements.journalTextarea.addEventListener('mouseup', handleTextSelection);
    elements.journalTextarea.addEventListener('keyup', handleTextSelection);
    elements.definitionBtn.addEventListener('click', showDefinition);
    elements.conjugateBtn.addEventListener('click', showConjugation);
    elements.submitReviewBtn.addEventListener('click', submitForReview);
    elements.saveEntryBtn.addEventListener('click', saveEntry);
    elements.closeReviewBtn.addEventListener('click', () => {
        elements.reviewPanel.classList.add('hidden');
    });
    
    // Panel close buttons
    document.querySelectorAll('.close-panel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closePanel(e.target.dataset.panel);
        });
    });
    
    // AI Tutor
    elements.aiTutorBtn.addEventListener('click', toggleAITutor);
    elements.closeTutorBtn.addEventListener('click', () => {
        elements.aiTutorOverlay.classList.add('hidden');
    });
    elements.sendChatBtn.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Archive functionality
    elements.clearWordListBtn.addEventListener('click', clearWordList);
    
    // Practice functionality
    elements.generatePracticeBtn.addEventListener('click', generatePractice);
    elements.generateNewSetBtn.addEventListener('click', generatePractice);
    
    // Document click to hide floating buttons
    document.addEventListener('click', (e) => {
        if (!elements.floatingButtons.contains(e.target) && 
            !elements.journalTextarea.contains(e.target)) {
            elements.floatingButtons.classList.add('hidden');
        }
    });
}

// Tab Management
function switchTab(tabName) {
    appState.currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'View').classList.add('active');
    
    // Tab-specific initialization
    if (tabName === 'archive') {
        renderEntries();
    } else if (tabName === 'practice') {
        updatePracticeWordCount();
    }
}

// Date Management
function setCurrentDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    elements.currentDate.textContent = today.toLocaleDateString('en-US', options);
}

// Word Count
function updateWordCount() {
    const text = elements.journalTextarea.value;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    elements.wordCount.textContent = `${wordCount} words`;
    appState.currentEntry.text = text;
}

// Text Selection and Floating Buttons
function handleTextSelection() {
    const textarea = elements.journalTextarea;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim();
    
    if (selectedText && selectedText.split(' ').length === 1) {
        appState.selectedText = selectedText.toLowerCase();
        showFloatingButtons(textarea);
        
        // Check if it's a verb to show/hide conjugate button
        const isVerb = commonVerbs.includes(appState.selectedText) || 
                      verbConjugations.hasOwnProperty(appState.selectedText);
        
        if (isVerb) {
            elements.conjugateBtn.style.display = 'inline-block';
        } else {
            elements.conjugateBtn.style.display = 'none';
        }
    } else {
        elements.floatingButtons.classList.add('hidden');
    }
}

function showFloatingButtons(textarea) {
    const rect = textarea.getBoundingClientRect();
    const floatingButtons = elements.floatingButtons;
    
    // Position floating buttons near the textarea
    floatingButtons.style.position = 'absolute';
    floatingButtons.style.left = `${rect.left + 10}px`;
    floatingButtons.style.top = `${rect.bottom - 40}px`;
    floatingButtons.classList.remove('hidden');
}

// Definition Display
function showDefinition() {
    const word = appState.selectedText;
    const definition = dictionaryData[word];
    
    if (definition) {
        const content = `
            <div class="definition-item">
                <div class="word-header">${definition.word}</div>
                <div class="pos-tag">${definition.pos}</div>
                ${definition.definitions.map(def => `<div class="definition">${def}</div>`).join('')}
            </div>
        `;
        elements.definitionContent.innerHTML = content;
    } else {
        elements.definitionContent.innerHTML = `
            <div class="definition-item">
                <div class="word-header">${word}</div>
                <div class="definition">Definición no encontrada. Esta palabra puede ser un anglicismo o una palabra menos común.</div>
            </div>
        `;
    }
    
    elements.definitionPanel.classList.remove('hidden');
    elements.floatingButtons.classList.add('hidden');
}

// Conjugation Display  
function showConjugation() {
    const word = appState.selectedText;
    const conjugation = verbConjugations[word];
    
    if (conjugation) {
        const content = `
            <div class="verb-header">
                <div class="word-header">${conjugation.infinitive}</div>
            </div>
            
            <div class="tense-header">Presente</div>
            <table class="conjugation-table">
                <tr><td>yo</td><td>${conjugation.presente.yo}</td></tr>
                <tr><td>tú</td><td>${conjugation.presente.tu}</td></tr>
                <tr><td>él/ella/usted</td><td>${conjugation.presente.el}</td></tr>
                <tr><td>nosotros</td><td>${conjugation.presente.nosotros}</td></tr>
                <tr><td>vosotros</td><td>${conjugation.presente.vosotros}</td></tr>
                <tr><td>ellos/ellas/ustedes</td><td>${conjugation.presente.ellos}</td></tr>
            </table>
            
            <div class="tense-header">Pretérito</div>
            <table class="conjugation-table">
                <tr><td>yo</td><td>${conjugation.preterito.yo}</td></tr>
                <tr><td>tú</td><td>${conjugation.preterito.tu}</td></tr>
                <tr><td>él/ella/usted</td><td>${conjugation.preterito.el}</td></tr>
                <tr><td>nosotros</td><td>${conjugation.preterito.nosotros}</td></tr>
                <tr><td>vosotros</td><td>${conjugation.preterito.vosotros}</td></tr>
                <tr><td>ellos/ellas/ustedes</td><td>${conjugation.preterito.ellos}</td></tr>
            </table>
            
            <div class="tense-header">Futuro</div>
            <table class="conjugation-table">
                <tr><td>yo</td><td>${conjugation.futuro.yo}</td></tr>
                <tr><td>tú</td><td>${conjugation.futuro.tu}</td></tr>
                <tr><td>él/ella/usted</td><td>${conjugation.futuro.el}</td></tr>
                <tr><td>nosotros</td><td>${conjugation.futuro.nosotros}</td></tr>
                <tr><td>vosotros</td><td>${conjugation.futuro.vosotros}</td></tr>
                <tr><td>ellos/ellas/ustedes</td><td>${conjugation.futuro.ellos}</td></tr>
            </table>
        `;
        elements.conjugationContent.innerHTML = content;
    } else {
        elements.conjugationContent.innerHTML = `
            <div class="definition-item">
                <div class="word-header">${word}</div>
                <div class="definition">Conjugación no encontrada. Verifica que sea un verbo en español.</div>
            </div>
        `;
    }
    
    elements.conjugationPanel.classList.remove('hidden');
    elements.floatingButtons.classList.add('hidden');
}

// Panel Management
function closePanel(panelType) {
    if (panelType === 'definition') {
        elements.definitionPanel.classList.add('hidden');
    } else if (panelType === 'conjugation') {
        elements.conjugationPanel.classList.add('hidden');
    }
}

// AI Review System
function submitForReview() {
    const text = elements.journalTextarea.value.trim();
    if (!text) {
        showSuccessMessage('Please write something before submitting for review!');
        return;
    }
    
    // Show loading
    elements.submitReviewBtn.innerHTML = '<span class="loading"></span> Reviewing...';
    elements.submitReviewBtn.disabled = true;
    
    // Simulate AI processing
    setTimeout(() => {
        const reviewResult = simulateAIReview(text);
        displayReview(reviewResult);
        
        // Reset button
        elements.submitReviewBtn.innerHTML = 'Submit for Review';
        elements.submitReviewBtn.disabled = false;
    }, 2000);
}

function simulateAIReview(text) {
    // Simple corrections simulation
    let correctedText = text;
    const changes = [];
    
    // Common corrections
    if (text.includes('Yo soy feliz')) {
        correctedText = correctedText.replace('Yo soy feliz', 'Yo estoy feliz');
        changes.push('Changed "soy" to "estoy" - use "estar" for temporary emotional states');
    }
    
    if (text.includes('Me gusta las')) {
        correctedText = correctedText.replace('Me gusta las', 'Me gustan las');
        changes.push('Changed "gusta" to "gustan" - verb must agree with plural object');
    }
    
    if (text.includes('voy a la tienda ayer')) {
        correctedText = correctedText.replace('voy a la tienda ayer', 'fui a la tienda ayer');
        changes.push('Changed "voy" to "fui" - use past tense with "ayer"');
    }
    
    // If no changes needed
    if (changes.length === 0) {
        changes.push('¡Excelente! No se encontraron errores gramaticales importantes.');
    }
    
    return {
        original: text,
        corrected: correctedText,
        changes: changes
    };
}

function displayReview(reviewResult) {
    elements.reviewResults.innerHTML = `
        <div class="review-section">
            <h4>Original Text</h4>
            <div class="review-text">${reviewResult.original}</div>
        </div>
        
        <div class="review-section">
            <h4>Corrected Text</h4>
            <div class="review-text">${reviewResult.corrected}</div>
        </div>
        
        <div class="review-section">
            <h4>Changes Made</h4>
            <ul class="changes-list">
                ${reviewResult.changes.map(change => `<li>${change}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Store the corrected text for saving
    appState.currentEntry.reviewedText = reviewResult.corrected;
    appState.currentEntry.originalText = reviewResult.original;
    
    elements.reviewPanel.classList.remove('hidden');
}

// Entry Management
function saveEntry() {
    const text = appState.currentEntry.reviewedText || appState.currentEntry.text;
    if (!text.trim()) {
        showSuccessMessage('No content to save!');
        return;
    }
    
    const wordCount = text.trim().split(/\s+/).length;
    const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        text: text,
        wordCount: wordCount
    };
    
    appState.entries.unshift(newEntry);
    
    // Clear the textarea and reset state
    elements.journalTextarea.value = '';
    appState.currentEntry = { text: '', timestamp: null };
    updateWordCount();
    
    // Close review panel
    elements.reviewPanel.classList.add('hidden');
    
    showSuccessMessage('Entry saved successfully!');
    
    // Update archive if we're on that tab
    if (appState.currentTab === 'archive') {
        renderEntries();
    }
}

// AI Tutor Chat
function toggleAITutor() {
    elements.aiTutorOverlay.classList.toggle('hidden');
    if (!elements.aiTutorOverlay.classList.contains('hidden')) {
        elements.chatInput.focus();
    }
}

function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    // Add user message to history
    appState.chatHistory.push({
        role: 'user',
        message: message,
        timestamp: Date.now()
    });
    
    // Clear input
    elements.chatInput.value = '';
    
    // Get AI response
    const aiResponse = getAITutorResponse(message);
    appState.chatHistory.push({
        role: 'assistant',
        message: aiResponse,
        timestamp: Date.now()
    });
    
    // Update chat display
    updateChatDisplay();
}

function getAITutorResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Find matching response
    for (const [key, responseData] of Object.entries(aiTutorResponses)) {
        if (key !== 'default') {
            const matches = responseData.patterns.some(pattern => 
                lowerMessage.includes(pattern.toLowerCase())
            );
            if (matches) {
                return responseData.response;
            }
        }
    }
    
    return aiTutorResponses.default.response;
}

function updateChatDisplay() {
    elements.chatHistory.innerHTML = appState.chatHistory.map(msg => 
        `<div class="chat-message ${msg.role}">${msg.message}</div>`
    ).join('');
    
    // Scroll to bottom
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
}

// Archive Management
function renderEntries() {
    if (appState.entries.length === 0) {
        elements.entriesList.innerHTML = '<div class="empty-state">No entries yet. Start writing your first journal entry!</div>';
        return;
    }
    
    elements.entriesList.innerHTML = appState.entries.map(entry => `
        <div class="entry-item" data-entry-id="${entry.id}" onclick="selectEntry(${entry.id})">
            <div class="entry-date">${formatDate(entry.date)}</div>
            <div class="entry-preview">${entry.text.substring(0, 100)}...</div>
        </div>
    `).join('');
}

function selectEntry(entryId) {
    const entry = appState.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    appState.selectedEntry = entry;
    
    // Update active state
    document.querySelectorAll('.entry-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-entry-id="${entryId}"]`).classList.add('active');
    
    // Display entry
    elements.entryDisplay.innerHTML = `
        <div class="entry-full-date">${formatDate(entry.date)}</div>
        <div class="entry-text" onclick="handleEntryTextSelection(event)">${entry.text}</div>
        <div class="entry-meta">${entry.wordCount} words</div>
        <div id="addWordBtn" class="hidden" style="margin-top: 10px;">
            <button class="btn btn--sm btn--primary" onclick="addWordToList()">Add to Word List</button>
        </div>
    `;
}

function handleEntryTextSelection(event) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.split(' ').length === 1) {
        appState.selectedText = selectedText.toLowerCase();
        document.getElementById('addWordBtn').classList.remove('hidden');
    } else {
        document.getElementById('addWordBtn').classList.add('hidden');
    }
}

function addWordToList() {
    const word = appState.selectedText;
    if (word && !appState.wordList.includes(word)) {
        appState.wordList.push(word);
        updateWordList();
        updatePracticeWordCount();
        showSuccessMessage(`"${word}" added to your word list!`);
        
        // Clear selection
        window.getSelection().removeAllRanges();
        document.getElementById('addWordBtn').classList.add('hidden');
    } else if (appState.wordList.includes(word)) {
        showSuccessMessage(`"${word}" is already in your word list.`);
    }
}

// Word List Management
function updateWordList() {
    elements.wordListCount.textContent = appState.wordList.length;
    
    if (appState.wordList.length === 0) {
        elements.wordListDisplay.innerHTML = '<p class="empty-state">No words saved yet. Highlight words in your entries to add them to your vocabulary list.</p>';
    } else {
        elements.wordListDisplay.innerHTML = appState.wordList.map(word => 
            `<span class="word-tag">${word}<span class="remove-word" onclick="removeWord('${word}')">&times;</span></span>`
        ).join('');
    }
}

function removeWord(word) {
    appState.wordList = appState.wordList.filter(w => w !== word);
    updateWordList();
    updatePracticeWordCount();
    showSuccessMessage(`"${word}" removed from word list.`);
}

function clearWordList() {
    if (appState.wordList.length === 0) {
        showSuccessMessage('Word list is already empty.');
        return;
    }
    
    if (confirm('Are you sure you want to clear all words from your list?')) {
        appState.wordList = [];
        updateWordList();
        updatePracticeWordCount();
        showSuccessMessage('Word list cleared.');
    }
}

// Practice Generation
function updatePracticeWordCount() {
    elements.practiceWordCount.textContent = appState.wordList.length;
    elements.generatePracticeBtn.disabled = appState.wordList.length === 0;
}

function generatePractice() {
    if (appState.wordList.length === 0) {
        showSuccessMessage('Add some words to your vocabulary list first!');
        return;
    }
    
    // Select random sentences and incorporate user's words where possible
    const practiceSet = [];
    const usedTemplates = new Set();
    
    for (let i = 0; i < Math.min(6, practiceSentenceTemplates.length); i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * practiceSentenceTemplates.length);
        } while (usedTemplates.has(randomIndex));
        
        usedTemplates.add(randomIndex);
        practiceSet.push(practiceSentenceTemplates[randomIndex]);
    }
    
    // Display practice sentences
    elements.practiceContent.innerHTML = practiceSet.map(sentence => `
        <div class="practice-sentence">
            <div class="english-sentence">${sentence.english}</div>
            <div class="spanish-sentence">${sentence.spanish}</div>
        </div>
    `).join('');
    
    elements.practiceDisplay.classList.remove('hidden');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function showSuccessMessage(message) {
    elements.successMessage.textContent = message;
    elements.successMessage.classList.add('show');
    
    setTimeout(() => {
        elements.successMessage.classList.remove('show');
    }, 3000);
}

// Make functions globally available for onclick handlers
window.selectEntry = selectEntry;
window.addWordToList = addWordToList;
window.removeWord = removeWord;
window.handleEntryTextSelection = handleEntryTextSelection;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);