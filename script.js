/* ============================================================
   Convertisseur d'Heures — WPInfo24
   script.js
   ============================================================ */

// ── Éléments DOM ─────────────────────────────────────────────
const inputEl      = document.getElementById('inputValue');
const inputUnit    = document.getElementById('inputUnit');
const inputLabel   = document.getElementById('inputLabel');
const resultBox    = document.getElementById('resultBox');
const resultPH     = document.getElementById('resultPlaceholder');
const resultText   = document.getElementById('resultText');
const resultUnit   = document.getElementById('resultUnit');
const btnConvert   = document.getElementById('btnConvert');
const subtitleLbl  = document.getElementById('subtitleLabel');
const infoEx       = document.getElementById('infoExamples');
const themeToggle  = document.getElementById('themeToggle');
const themeOptions = document.getElementById('themeOptions');
const themeDots    = document.querySelectorAll('.theme-dot');

// ── État ──────────────────────────────────────────────────────
// mode = 'dec2hm'  : décimal → heures + minutes  (ex: 7.75 → 7h45)
// mode = 'hm2dec'  : heures.minutes → décimal     (ex: 8.30 → 8,50)
let mode = 'dec2hm';

// ── Initialisation ────────────────────────────────────────────
applyMode();

// ── Événements de saisie ──────────────────────────────────────
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') runConvert();
});

inputEl.addEventListener('input', () => {
  const val = inputEl.value.trim();
  if (val === '') { resetResult(); return; }
  runConvert();
});

// ── Bouton Convertir (bascule de mode) ────────────────────────
btnConvert.addEventListener('click', () => {
  mode = (mode === 'dec2hm') ? 'hm2dec' : 'dec2hm';
  applyMode();
  resetResult();
  inputEl.value = '';
  inputEl.focus();
});

// ── Appliquer le mode actuel à l'interface ────────────────────
function applyMode() {
  if (mode === 'dec2hm') {
    inputEl.type           = 'number';
    inputEl.inputMode      = 'decimal';
    inputLabel.textContent = 'Heure décimale';
    inputUnit.textContent  = 'h';
    inputEl.placeholder    = 'ex : 7.75';
    subtitleLbl.innerHTML  = 'Décimal → Heures &amp; Minutes';
    btnConvert.textContent = '⇄ Passer en Heures → Décimal';
    infoEx.innerHTML       = 'Ex : 7,75 h &nbsp;→&nbsp; 7 h 45 min<br>Ex : 1,5 h &nbsp;→&nbsp; 1 h 30 min';
  } else {
    inputEl.type           = 'text';
    inputEl.inputMode      = 'decimal';
    inputLabel.textContent = 'Heures et minutes';
    inputUnit.textContent  = '';
    inputEl.placeholder    = 'ex : 8.30 ou 8h30';
    subtitleLbl.innerHTML  = 'Heures &amp; Minutes → Décimal';
    btnConvert.textContent = '⇄ Passer en Décimal → Heures';
    infoEx.innerHTML       = 'Ex : 8.30 &nbsp;→&nbsp; 8,50 h<br>Ex : 7.45 &nbsp;→&nbsp; 7,75 h';
  }
}

// ── Lancer la conversion selon le mode ────────────────────────
function runConvert() {
  const raw = inputEl.value.trim();
  if (raw === '') { resetResult(); return; }

  if (mode === 'dec2hm') {
    const val = parseFloat(raw.replace(',', '.'));
    if (isNaN(val) || val < 0) {
      shake(); resetResult(); return;
    }
    convertDecToHM(val);
  } else {
    convertHMToDec(raw);
  }
}

// ── Décimal → Heures & Minutes ────────────────────────────────
function convertDecToHM(valDecimal) {
  const totalMinutes = Math.round(valDecimal * 60);
  const heures  = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formatted = `${heures} h ${String(minutes).padStart(2, '0')} min`;
  showResult(formatted, '');
}

// ── Heures.Minutes → Décimal ──────────────────────────────────
// Accepte : 8.30  8,30  8h30  8H30  → 8h30 = 8,50 h décimal
function convertHMToDec(raw) {
  // Normaliser : remplacer h/H par ".", virgule par "."
  let normalized = raw.replace(/[hH]/g, '.').replace(',', '.').trim();
  // Supprimer un éventuel "." terminal (ex: "8h" devient "8.")
  normalized = normalized.replace(/\.$/, '');

  const parts   = normalized.split('.');
  const heures  = parseInt(parts[0], 10) || 0;
  const minPart = parts[1] || '0';

  // "30" → 30 min | "3" → 30 min | "05" → 5 min
  let minutes;
  if (minPart.length === 1) {
    minutes = parseInt(minPart, 10) * 10;
  } else {
    minutes = parseInt(minPart.substring(0, 2), 10);
  }

  if (isNaN(minutes) || {
    shake(); resetResult(); return;
  }

  const decimal   = heures + (minutes / 60);
  const formatted = parseFloat(decimal.toFixed(2)).toString().replace('.', ',') + ' h';
  showResult(formatted, '');
}

// ── Afficher le résultat ──────────────────────────────────────
function showResult(text, unit) {
  resultPH.style.display   = 'none';
  resultText.style.display = 'block';
  resultText.textContent   = text;
  resultBox.classList.add('has-value');
  if (unit) {
    resultUnit.textContent   = unit;
    resultUnit.style.display = 'block';
  } else {
    resultUnit.style.display = 'none';
  }
}

// ── Réinitialiser le résultat ─────────────────────────────────
function resetResult() {
  resultPH.style.display   = 'inline';
  resultText.style.display = 'none';
  resultUnit.style.display = 'none';
  resultText.textContent   = '';
  resultBox.classList.remove('has-value');
}

function shake() {
  resultBox.classList.add('shake');
  setTimeout(() => resultBox.classList.remove('shake'), 400);
}

// ── Gestion du menu de thème ──────────────────────────────────
themeToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle('open');
});

document.addEventListener('click', () => {
  themeOptions.classList.remove('open');
});

themeDots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    applyTheme(dot.dataset.theme);
    themeOptions.classList.remove('open');
  });
});

function applyTheme(theme) {
  document.body.classList.remove('theme-blue', 'theme-green', 'theme-red');
  document.body.classList.add('theme-' + theme);
  themeDots.forEach(d => d.classList.toggle('active', d.dataset.theme === theme));
  try { localStorage.setItem('wpinfo24_theme', theme); } catch(e) {}
}

// ── Restaurer le thème sauvegardé ─────────────────────────────
(function restoreTheme() {
  try {
    const saved = localStorage.getItem('wpinfo24_theme');
    if (saved) applyTheme(saved);
  } catch(e) {}
})();
