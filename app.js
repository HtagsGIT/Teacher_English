
:root {
  --bg:        #0c0c12;
  --surface:   #16161f;
  --surface2:  #1e1e2c;
  --border:    rgba(255,255,255,0.07);
  --accent:    #7c3aed;
  --accent2:   #a855f7;
  --teal:      #2dd4bf;
  --text:      #e2e2ee;
  --muted:     rgba(255,255,255,0.35);
  --correction: #fbbf24;  /* Amber for corrections */
  --translation: #60a5fa; /* Blue for translations */
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 20px;
  background-image:
    radial-gradient(ellipse at 15% 40%, rgba(124,58,237,0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 10%, rgba(45,212,191,0.07) 0%, transparent 45%);
}

.container {
  max-width: 580px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-family: 'Syne', sans-serif;
  font-size: 30px;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #a78bfa, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

/* ── LANGUAGE SELECTOR ───────────────────────────────── */
.lang-selector {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 16px;
}

.lang-selector label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.lang-selector select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  background: var(--surface2);
  color: var(--text);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23888' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  transition: border-color 0.2s;
}
.lang-selector select:focus { border-color: rgba(124,58,237,0.5); }
.lang-selector select option { background: #1a1a2e; }
.hint {
  font-size: 12px;
  color: var(--teal);
  margin-top: 6px;
  text-align: center;
  opacity: 0.8;
}

/* ── SYNTHESIZER PANEL ─────────────────────────── */
.synth-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
}

.synth-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--teal));
  border-radius: 2px 2px 0 0;
}

.synth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.synth-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.synth-status {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  color: var(--muted);
  transition: all 0.3s;
}
.synth-status.speaking {
  background: rgba(45,212,191,0.15);
  color: var(--teal);
}
.synth-status.ready {
  background: rgba(124,58,237,0.15);
  color: var(--accent2);
}

/* Visualizer */
.visualizer {
  background: var(--surface2);
  border-radius: 12px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
}

.synth-idle-text {
  color: var(--muted);
  font-size: 13px;
  position: absolute;
  transition: opacity 0.3s;
}

.wave-bars {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 50px;
  opacity: 0;
  transition: opacity 0.3s;
}

.wave-bars span {
  display: block;
  width: 4px;
  height: 8px;
  background: linear-gradient(to top, var(--accent), var(--teal));
  border-radius: 4px;
  transition: height 0.1s;
}

/* Speaking state */
.visualizer.active .synth-idle-text { opacity: 0; }
.visualizer.active .wave-bars { opacity: 1; }

.visualizer.active .wave-bars span {
  animation: waveAnim 0.6s ease-in-out infinite alternate;
}
.wave-bars span:nth-child(1)  { animation-delay: 0.00s; }
.wave-bars span:nth-child(2)  { animation-delay: 0.04s; }
.wave-bars span:nth-child(3)  { animation-delay: 0.08s; }
.wave-bars span:nth-child(4)  { animation-delay: 0.12s; }
.wave-bars span:nth-child(5)  { animation-delay: 0.16s; }
.wave-bars span:nth-child(6)  { animation-delay: 0.20s; }
.wave-bars span:nth-child(7)  { animation-delay: 0.24s; }
.wave-bars span:nth-child(8)  { animation-delay: 0.28s; }
.wave-bars span:nth-child(9)  { animation-delay: 0.24s; }
.wave-bars span:nth-child(10) { animation-delay: 0.20s; }
.wave-bars span:nth-child(11) { animation-delay: 0.16s; }
.wave-bars span:nth-child(12) { animation-delay: 0.12s; }
.wave-bars span:nth-child(13) { animation-delay: 0.08s; }
.wave-bars span:nth-child(14) { animation-delay: 0.04s; }
.wave-bars span:nth-child(15) { animation-delay: 0.00s; }

/* Sliders */
.synth-controls {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.synth-control {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.synth-control label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 500;
}

.synth-control input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: var(--surface2);
  outline: none;
  cursor: pointer;
  accent-color: var(--accent);
}
.synth-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--teal));
  cursor: pointer;
  box-shadow: 0 0 8px rgba(124,58,237,0.5);
}

/* Voice selector */
.voice-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}
.voice-selector label {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.voice-selector select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  outline: none;
  background: var(--surface2);
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s;
}
.voice-selector select:focus { border-color: rgba(124,58,237,0.5); }
.voice-selector select option { background: #1a1a2e; }

.test-btn {
  align-self: flex-end;
  padding: 8px 18px;
  border: 1px solid rgba(45,212,191,0.3);
  border-radius: 20px;
  background: rgba(45,212,191,0.08);
  color: var(--teal);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.test-btn:hover {
  background: rgba(45,212,191,0.18);
  box-shadow: 0 0 15px rgba(45,212,191,0.2);
}
.test-btn:active { transform: scale(0.97); }

/* ── CHAT ─────────────────────────────────── */
.chat-container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
  min-height: 220px;
  max-height: 340px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  animation: fadeUp 0.3s ease both;
}

.user-message { flex-direction: row-reverse; }

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  background: var(--surface2);
  border: 1px solid var(--border);
}

.text {
  max-width: 74%;
  padding: 10px 15px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.55;
  word-break: break-word;
}

.user-message .text {
  background: linear-gradient(135deg, #5b21b6, #7c3aed);
  color: #fff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 3px 15px rgba(124,58,237,0.3);
}

.assistant-message .text {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
}

.assistant-message.speaking .text {
  border-color: rgba(45,212,191,0.35);
  background: rgba(45,212,191,0.05);
  color: #99f6e4;
}

.status-message .text {
  background: transparent;
  color: var(--muted);
  font-style: italic;
  font-size: 13px;
  border: none;
  padding: 3px 0;
}

/* Correction & translation styling */
.correction-block {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px dashed rgba(251,191,36,0.3);
}
.correction-label {
  color: var(--correction);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.correction-text {
  color: #fcd34d;
  font-style: italic;
}
.translation-block {
  margin-top: 6px;
}
.translation-label {
  color: var(--translation);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.translation-text {
  color: #93c5fd;
}

/* Typing cursor */
.typing-cursor::after {
  content: '▋';
  animation: blink 0.7s step-end infinite;
  color: var(--teal);
  margin-left: 2px;
}

/* Typing dots */
.typing-dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(167,139,250,0.5);
  animation: dotBounce 1.2s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

/* ── MAIN CONTROLS ────────────────────────── */
.controls {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.mic-button {
  width: 68px;
  height: 68px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(124,58,237,0.45);
  position: relative;
}
.mic-button:hover { transform: scale(1.07); box-shadow: 0 6px 28px rgba(124,58,237,0.65); }
.mic-button:active { transform: scale(0.95); }
.mic-button.listening { animation: micPulse 1.5s infinite; }
.mic-button.listening::after {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 2px solid rgba(167,139,250,0.45);
  animation: ring 1.5s infinite;
}
.mic-icon { font-size: 30px; }

.mode-selector {
  display: flex;
  gap: 6px;
  background: var(--surface2);
  border: 1px solid var(--border);
  padding: 5px;
  border-radius: 30px;
}
.mode-selector label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--muted);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  transition: color 0.2s, background 0.2s;
}
.mode-selector label:has(input:checked) {
  color: var(--text);
  background: rgba(124,58,237,0.3);
}
.mode-selector input[type="radio"] { display: none; }

.learning-badge {
  position: absolute;
  top: -8px;
  right: 20px;
  background: linear-gradient(135deg, #2dd4bf, #7c3aed);
  color: white;
  padding: 4px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 10px rgba(45,212,191,0.3);
}

/* Tooltip */
#tooltip {
  position: fixed;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(124,58,237,0.9);
  color: #fff;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
}
#tooltip.active {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Scrollbar */
.chat-container::-webkit-scrollbar { width: 5px; }
.chat-container::-webkit-scrollbar-track { background: transparent; }
.chat-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }

/* ── ANIMATIONS ───────────────────────────── */
@keyframes waveAnim {
  from { height: 6px; }
  to   { height: 48px; }
}
@keyframes micPulse {
  0%   { transform: scale(1);    box-shadow: 0 4px 20px rgba(124,58,237,0.45); }
  50%  { transform: scale(1.08); box-shadow: 0 4px 35px rgba(124,58,237,0.85); }
  100% { transform: scale(1);    box-shadow: 0 4px 20px rgba(124,58,237,0.45); }
}
@keyframes ring {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0;   }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
  40%           { transform: translateY(-6px); opacity: 1;   }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker enregistré:', reg))
      .catch(err => console.log('Erreur Service Worker:', err));
  });
}
