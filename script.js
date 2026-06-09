  const input  = document.getElementById('inputDecimal');
  const box    = document.getElementById('resultBox');
  const ph     = document.getElementById('resultPlaceholder');
  const rt     = document.getElementById('resultText');
  const ru     = document.getElementById('resultUnit');

  // Convert on Enter key
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') convert();
  });

  // Live conversion as user types
  input.addEventListener('input', () => {
    const val = input.value.trim();
    if (val === '' || isNaN(parseFloat(val))) {
      reset(); return;
    }
    doConvert(parseFloat(val));
  });

  function convert() {
    const raw = input.value.trim().replace(',', '.');
    const val = parseFloat(raw);

    if (raw === '' || isNaN(val) || val < 0) {
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
      reset();
      return;
    }
    doConvert(val);
  }

  function doConvert(val) {
    const totalMinutes = Math.round(val * 60);
    const heures  = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const formatted = minutes === 0
      ? `${heures} h 00 min`
      : `${heures} h ${String(minutes).padStart(2, '0')} min`;

    ph.style.display  = 'none';
    rt.style.display  = 'block';
    ru.style.display  = 'block';
    rt.textContent    = formatted;
    box.classList.add('has-value');
  }

  function reset() {
    ph.style.display  = 'inline';
    rt.style.display  = 'none';
    ru.style.display  = 'none';
    rt.textContent    = '';
    box.classList.remove('has-value');
  }