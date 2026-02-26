// ═══════════════════════════════════════════════════════
//  ENGLISH TEACHER — Voice learning assistant
//  Speak French/English • Get English responses + corrections
// ═══════════════════════════════════════════════════════

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
  
  // ── DOM ────────────────────────────────────────────────
  const startBtn      = document.getElementById('start');
  const langSelect    = document.getElementById('lang');
  const chatContainer = document.getElementById('chatContainer');
  const tooltip       = document.getElementById('tooltip');
  const synthStatus   = document.getElementById('synthStatus');
  const visualizer    = document.getElementById('visualizer');
  const synthIdleText = document.getElementById('synthIdleText');
  const rateSlider    = document.getElementById('rateSlider');
  const pitchSlider   = document.getElementById('pitchSlider');
  const volSlider     = document.getElementById('volSlider');
  const rateVal       = document.getElementById('rateVal');
  const pitchVal      = document.getElementById('pitchVal');
  const volVal        = document.getElementById('volVal');
  const voiceSelect   = document.getElementById('voiceSelect');
  const testVoiceBtn  = document.getElementById('testVoiceBtn');

  // Vérification que tous les éléments existent
  if (!startBtn) {
    console.error('Bouton start manquant!');
    return;
  }

  // ── STATE ───────────────────────────────────────────────
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition    = null;
  let isListening    = false;
  let isSpeaking     = false;
  let allVoices      = [];
  let speakWatchdog  = null;

  // Simple translation cache (French → English common phrases)
  const translationCache = {
    // Will be populated dynamically with common phrases
  };

  // ── SLIDERS ───────────────────────────────────────────
  if (rateSlider && rateVal) {
    rateSlider.addEventListener('input', () => rateVal.textContent = parseFloat(rateSlider.value).toFixed(1));
  }
  if (pitchSlider && pitchVal) {
    pitchSlider.addEventListener('input', () => pitchVal.textContent = parseFloat(pitchSlider.value).toFixed(1));
  }
  if (volSlider && volVal) {
    volSlider.addEventListener('input', () => volVal.textContent = Math.round(volSlider.value * 100));
  }

  // ═══════════════════════════════════════════════════════
  //  VOICE MANAGEMENT
  // ═══════════════════════════════════════════════════════
  function populateVoiceList() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length || !voiceSelect) return;
    allVoices = voices;

    // Prioritize English voices
    const sorted = [
      ...voices.filter(v => v.lang.startsWith('en')),
      ...voices.filter(v => !v.lang.startsWith('en'))
    ];

    voiceSelect.innerHTML = '';
    sorted.forEach(voice => {
      const opt = document.createElement('option');
      opt.dataset.idx = voices.indexOf(voice);
      opt.textContent = `${voice.name} (${voice.lang})${voice.lang.startsWith('en') ? ' 🇬🇧' : ''}`;
      if (voice.lang.startsWith('en')) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = populateVoiceList;
    setTimeout(populateVoiceList, 200);
  }

langSelect.addEventListener('change', () => {
  populateVoiceList();
  if (isListening) { safeStopListening(); setTimeout(safeStartListening, 200); }
});

function getSelectedVoice() {
  const opt = voiceSelect.selectedOptions[0];
  if (!opt) return null;
  return allVoices[parseInt(opt.dataset.idx)] || null;
}

// ═══════════════════════════════════════════════════════
//  LANGUAGE DETECTION (simple version)
// ═══════════════════════════════════════════════════════
function detectLanguage(text) {
  // Simple detection based on common French words/patterns
  const frenchPatterns = [
    /\b(bonjour|salut|ça va|merci|oui|non|je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|et|mais|ou|donc|car|pour|dans|avec|sans|chez|entre|pendant|depuis|jusqu'|vers|selon|sous|sur|devant|derrière|par|pour|en)\b/i,
    /[éèêëàâîïôûùçœæ]/i,
    /\b(comment|pourquoi|quand|où|qui|que|quel|quelle)\b/i
  ];
  
  // Count French indicators
  let frenchScore = 0;
  frenchPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) frenchScore += matches.length;
  });
  
  // If text contains French characters or common words, consider it French
  return frenchScore > 0 ? 'fr' : 'en';
}

// ═══════════════════════════════════════════════════════
//  SIMPLE TRANSLATION (French → English)
// ═══════════════════════════════════════════════════════
function translateToEnglish(frenchText) {
  // This is a simplified translation for common phrases
  // In a real app, you'd use an API like Google Translate
  
  const commonPhrases = {
    'bonjour': 'hello',
    'salut': 'hi',
    'comment ça va': 'how are you',
    'ça va': 'how are you / I\'m fine',
    'merci': 'thank you',
    'merci beaucoup': 'thank you very much',
    'oui': 'yes',
    'non': 'no',
    's\'il vous plaît': 'please',
    's\'il te plaît': 'please',
    'désolé': 'sorry',
    'pardon': 'sorry / excuse me',
    'au revoir': 'goodbye',
    'à bientôt': 'see you soon',
    'je m\'appelle': 'my name is',
    'comment tu t\'appelles': 'what\'s your name',
    'je suis': 'I am',
    'tu es': 'you are',
    'il est': 'he is',
    'elle est': 'she is',
    'nous sommes': 'we are',
    'vous êtes': 'you are',
    'ils sont': 'they are',
    'j\'aime': 'I like',
    'je n\'aime pas': 'I don\'t like',
    'je veux': 'I want',
    'je ne veux pas': 'I don\'t want',
    'je peux': 'I can',
    'je ne peux pas': 'I can\'t',
    'j\'ai': 'I have',
    'je n\'ai pas': 'I don\'t have',
    'il y a': 'there is / there are',
    'combien': 'how much / how many',
    'où est': 'where is',
    'quand': 'when',
    'pourquoi': 'why',
    'parce que': 'because',
    'très bien': 'very good',
    'bien': 'good',
    'mal': 'bad',
    'chaud': 'hot',
    'froid': 'cold',
    'grand': 'big',
    'petit': 'small',
    'aujourd\'hui': 'today',
    'demain': 'tomorrow',
    'hier': 'yesterday',
    'maintenant': 'now',
    'plus tard': 'later'
  };
  
  // Check for exact matches first
  const lowerText = frenchText.toLowerCase().trim();
  for (let [fr, en] of Object.entries(commonPhrases)) {
    if (lowerText.includes(fr)) {
      return en;
    }
  }
  
  // If no match, return a generic translation note
  return `[translation] → (simplified: "${frenchText}")`;
}

// ═══════════════════════════════════════════════════════
//  SPEECH RECOGNITION
// ═══════════════════════════════════════════════════════
if (!SpeechRecognitionAPI) {
  appendMessage('assistant', "❌ Your browser doesn't support speech recognition. Use Chrome or Edge.");
  startBtn.disabled = true;
}

function createRecognition() {
  if (recognition) {
    try { recognition.abort(); } catch(e) {}
    recognition.onstart  = null;
    recognition.onresult = null;
    recognition.onerror  = null;
    recognition.onend    = null;
    recognition = null;
  }

  if (!SpeechRecognitionAPI) return null;

  const rec            = new SpeechRecognitionAPI();
  rec.continuous       = false;
  rec.interimResults   = false;
  rec.maxAlternatives  = 1;
  rec.lang             = langSelect.value; // User's language (French by default)

  rec.onstart = () => {
    isListening = true;
    startBtn.classList.add('listening');
    appendMessage('status', '🎤 Listening... (speak in your language)');
  };

  rec.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    removeStatusMessages();
    appendMessage('user', transcript);
    processForLearning(transcript);
  };

  rec.onerror = (event) => {
    removeStatusMessages();
    handleRecognitionError(event.error);
  };

  rec.onend = () => {
    isListening = false;
    startBtn.classList.remove('listening');
  };

  return rec;
}

function safeStartListening() {
  if (!SpeechRecognitionAPI) return;
  if (isListening) return;

  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    resetSpeakState();
  }

  recognition = createRecognition();
  if (!recognition) return;

  setTimeout(() => {
    try {
      recognition.start();
    } catch (e) {
      console.error('Start error:', e.message);
      isListening = false;
      startBtn.classList.remove('listening');
    }
  }, 100);
}

function safeStopListening() {
  if (!recognition) return;
  try {
    if (isListening) recognition.stop();
  } catch (e) {
    console.warn('Stop error:', e.message);
  }
}

startBtn.addEventListener('click', () => {
  if (isListening) {
    safeStopListening();
  } else {
    safeStartListening();
  }
});

// ═══════════════════════════════════════════════════════
//  LEARNING PROCESSING
// ═══════════════════════════════════════════════════════
function processForLearning(userInput) {
  const detectedLang = detectLanguage(userInput);
  const userLang = langSelect.value.split('-')[0]; // fr, en, es, etc.
  
  let response = '';
  let correction = '';
  let translation = '';
  
  if (detectedLang === 'fr') {
    // User spoke French → correct and translate
    translation = translateToEnglish(userInput);
    response = getEnglishResponse(userInput, 'fr');
    correction = `✅ Correction: In English, you could say: "${translation}"`;
  } else {
    // User spoke English (or other) → respond in English
    response = getEnglishResponse(userInput, 'en');
  }
  
  const tid = appendTyping();
  
  setTimeout(() => {
    removeTyping(tid);
    
    const msgEl = appendMessage('assistant', '');
    let fullResponse = response;
    
    // Add learning elements if needed
    if (correction) {
      fullResponse += `\n\n${correction}`;
    }
    if (translation && !correction) {
      fullResponse += `\n\n📖 Translation: "${translation}"`;
    }
    
    speakAndWrite(fullResponse, msgEl, correction, translation);
  }, 400 + Math.random() * 300);
}

// ═══════════════════════════════════════════════════════
//  ENGLISH RESPONSES (Teacher mode)
// ═══════════════════════════════════════════════════════
function getEnglishResponse(userInput, lang) {
  const input = userInput.toLowerCase();
  
  // Greetings
  if (input.match(/bonjour|salut|hello|hi|hey/i)) {
    return "Hello! It's nice to meet you. How are you today?";
  }
  
  // How are you
  if (input.match(/comment.*va|how are|ça va/i)) {
    return "I'm doing very well, thank you for asking! How about you?";
  }
  
  // Thanks
  if (input.match(/merci|thanks|thank you/i)) {
    return "You're welcome! I'm happy to help you learn English.";
  }
  
  // Time
  if (input.match(/heure|time|what time/i)) {
    const n = new Date();
    return `It's ${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}. Time is important to practice English every day!`;
  }
  
  // Name
  if (input.match(/nom|name|appelles/i)) {
    return "My name is English Teacher. You can call me Teacher for short! What's your name?";
  }
  
  // Joke
  if (input.match(/blague|joke|funny/i)) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a bear with no teeth? A gummy bear!",
      "Why did the student eat his homework? Because the teacher said it was a piece of cake!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Weather
  if (input.match(/météo|weather|rain|sun/i)) {
    return "I can't check the weather directly, but in English we say 'It's raining cats and dogs' for heavy rain, and 'It's sunny' for nice weather!";
  }
  
  // Learning specific
  if (input.match(/learn|apprendre|study|étudier/i)) {
    return "That's great! The best way to learn English is to practice every day. Try to speak with me as much as possible!";
  }
  
  // Goodbye
  if (input.match(/au revoir|bye|goodbye|see you/i)) {
    return "Goodbye! Keep practicing your English. See you next time!";
  }
  
  // Default responses
  const defaults = [
    "That's interesting! Can you tell me more in English?",
    "I understand. In English, we would say that differently. Would you like me to help?",
    "Good try! Remember to practice every day. What else would you like to talk about?",
    "I see! Let's continue our conversation in English. What's next?"
  ];
  
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ═══════════════════════════════════════════════════════
//  SPEECH SYNTHESIS + TYPING EFFECT
// ═══════════════════════════════════════════════════════
function speakAndWrite(text, messageEl, correction, translation) {
  const textSpan  = messageEl.querySelector('.text');
  const mode      = document.querySelector('input[name="responseMode"]:checked');
  const doVoice   = mode && mode.value === 'speak' && !!window.speechSynthesis;

  if (window.speechSynthesis) window.speechSynthesis.cancel();
  resetSpeakState();

  // Format message with learning elements
  let displayText = text;
  if (correction || translation) {
    displayText = text;
    // Will be formatted in HTML
  }

  // Typing effect
  const words     = text.split(' ');
  const totalMs   = doVoice ? estimateDuration(text, parseFloat(rateSlider.value)) : 2000;
  const msPerWord = Math.max(50, totalMs / words.length);

  textSpan.innerHTML = ''; // Clear for typing effect
  textSpan.classList.add('typing-cursor');

  let wordIdx  = 0;
  let wordTimer = setInterval(() => {
    if (wordIdx < words.length) {
      textSpan.innerHTML += (wordIdx === 0 ? '' : ' ') + escapeHtml(words[wordIdx++]);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      clearInterval(wordTimer);
      textSpan.classList.remove('typing-cursor');
      
      // Add correction/translation blocks after typing
      if (correction) {
        const correctionBlock = document.createElement('div');
        correctionBlock.className = 'correction-block';
        correctionBlock.innerHTML = `<div class="correction-label">🔤 Your sentence in English</div>
                                    <div class="correction-text">${escapeHtml(correction.replace('✅ Correction: ', ''))}</div>`;
        textSpan.appendChild(correctionBlock);
      }
      
      if (translation && !correction) {
        const translationBlock = document.createElement('div');
        translationBlock.className = 'translation-block';
        translationBlock.innerHTML = `<div class="translation-label">📖 Translation</div>
                                    <div class="translation-text">${escapeHtml(translation)}</div>`;
        textSpan.appendChild(translationBlock);
      }
    }
  }, msPerWord);

  if (!doVoice) {
    setTimeout(() => { if (!isListening) safeStartListening(); }, totalMs + 600);
    return;
  }

  // Voice synthesis
  const doSpeak = () => {
    const utt   = new SpeechSynthesisUtterance(text);
    utt.lang    = 'en-US'; // Always speak in English
    utt.rate    = parseFloat(rateSlider.value) * 0.9; // Slightly slower for learning
    utt.pitch   = parseFloat(pitchSlider.value);
    utt.volume  = parseFloat(volSlider.value);
    const voice = getSelectedVoice();
    if (voice && voice.lang.startsWith('en')) utt.voice = voice;

    const wdMs = estimateDuration(text, utt.rate) + 5000;
    speakWatchdog = setTimeout(() => {
      console.warn('Watchdog: force reset');
      clearInterval(wordTimer);
      textSpan.innerHTML = escapeHtml(text);
      if (correction) textSpan.innerHTML += `<div class="correction-block"><div class="correction-label">✅ Better: ${escapeHtml(correction)}</div></div>`;
      textSpan.classList.remove('typing-cursor');
      messageEl.classList.remove('speaking');
      resetSpeakState();
      setTimeout(() => { if (!isListening) safeStartListening(); }, 400);
    }, wdMs);

    utt.onstart = () => {
      isSpeaking = true;
      setSpeakingUI(true);
      messageEl.classList.add('speaking');
    };

    const onFinish = () => {
      clearTimeout(speakWatchdog);
      clearInterval(wordTimer);
      textSpan.innerHTML = escapeHtml(text);
      if (correction) {
        textSpan.innerHTML += `<div class="correction-block"><div class="correction-label">🔤 In English</div>
                              <div class="correction-text">${escapeHtml(correction.replace('✅ Correction: ', ''))}</div></div>`;
      }
      if (translation && !correction) {
        textSpan.innerHTML += `<div class="translation-block"><div class="translation-label">📖 Translation</div>
                              <div class="translation-text">${escapeHtml(translation)}</div></div>`;
      }
      textSpan.classList.remove('typing-cursor');
      messageEl.classList.remove('speaking');
      resetSpeakState();
      setTimeout(() => { if (!isListening) safeStartListening(); }, 700);
    };

    utt.onend   = onFinish;
    utt.onerror = (e) => {
      console.warn('Synthesis error:', e.error);
      onFinish();
    };

    window.speechSynthesis.speak(utt);

    // Keep alive for Chrome
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
  };

  if (allVoices.length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { populateVoiceList(); doSpeak(); };
  }
}

function resetSpeakState() {
  isSpeaking = false;
  clearTimeout(speakWatchdog);
  setSpeakingUI(false);
}

function setSpeakingUI(active) {
  if (active) {
    visualizer.classList.add('active');
    synthIdleText.style.opacity = '0';
    synthStatus.textContent     = '🔊 Speaking English...';
    synthStatus.className       = 'synth-status speaking';
  } else {
    visualizer.classList.remove('active');
    synthIdleText.style.opacity = '1';
    synthStatus.textContent     = 'Ready';
    synthStatus.className       = 'synth-status ready';
  }
}

function estimateDuration(text, rate) {
  return (text.split(' ').length / (130 * rate)) * 60000;
}

// Test voice button
testVoiceBtn.addEventListener('click', () => {
  const phrase = "Hello! I'm your English teacher. Let's practice together!";
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  resetSpeakState();

  const utt   = new SpeechSynthesisUtterance(phrase);
  utt.lang    = 'en-US';
  utt.rate    = parseFloat(rateSlider.value) * 0.9;
  utt.pitch   = parseFloat(pitchSlider.value);
  utt.volume  = parseFloat(volSlider.value);
  const voice = getSelectedVoice();
  if (voice && voice.lang.startsWith('en')) utt.voice = voice;
  utt.onstart = () => setSpeakingUI(true);
  utt.onend   = () => setSpeakingUI(false);
  utt.onerror = () => setSpeakingUI(false);
  window.speechSynthesis.speak(utt);
});

// ═══════════════════════════════════════════════════════
//  DOM UTILITIES
// ═══════════════════════════════════════════════════════
function appendMessage(role, text) {
  const wrap = document.createElement('div');

  if (role === 'status') {
    wrap.className = 'message assistant-message status-message';
    wrap.innerHTML = `<span class="avatar">🤖</span><span class="text">${escapeHtml(text)}</span>`;
  } else if (role === 'user') {
    wrap.className = 'message user-message';
    wrap.innerHTML = `<span class="avatar">👤</span><span class="text">${escapeHtml(text)}</span>`;
    wrap.querySelector('.text').addEventListener('click', () => copyText(text));
  } else {
    wrap.className = 'message assistant-message';
    wrap.innerHTML = `<span class="avatar">🇬🇧</span><span class="text"></span>`;
  }

  chatContainer.appendChild(wrap);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return wrap;
}

function appendTyping() {
  const id = 'typing-' + Date.now();
  const w  = document.createElement('div');
  w.className = 'message assistant-message';
  w.id = id;
  w.innerHTML = `<span class="avatar">🇬🇧</span><span class="text"><span class="typing-dots"><span></span><span></span><span></span></span></span>`;
  chatContainer.appendChild(w);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return id;
}

function removeTyping(id)       { document.getElementById(id)?.remove(); }
function removeStatusMessages() { chatContainer.querySelectorAll('.status-message').forEach(e => e.remove()); }
function escapeHtml(s)          { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    tooltip.classList.add('active');
    setTimeout(() => tooltip.classList.remove('active'), 2500);
  });
}

function handleRecognitionError(type) {
  isListening = false;
  startBtn.classList.remove('listening');
  switch (type) {
    case 'not-allowed':
      appendMessage('assistant', "❌ Microphone not allowed. Please enable it in your browser settings.");
      break;
    case 'audio-capture':
      appendMessage('status', "⚠️ Microphone busy, retrying...");
      setTimeout(safeStartListening, 1000);
      break;
    case 'no-speech':
      appendMessage('status', "⏱️ No speech detected. Try again!");
      setTimeout(safeStartListening, 1000);
      break;
    default:
      appendMessage('status', `⚠️ Microphone error: ${type}. Click to try again.`);
  }
}

// ═══════════════════════════════════════════════════════
//  INITIAL MESSAGE
// ═══════════════════════════════════════════════════════
setTimeout(() => {
  appendMessage('assistant', "👋 Hello! I'm your English teacher. You can speak to me in French or English. I'll respond in English and help you learn! Click the 🎤 button and say something!");
}, 400);


});
