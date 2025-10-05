
const NL_STORAGE_KEY = 'nl_last_shown_at';
const NL_DISMISSED_KEY = 'nl_dismissed';
const NL_COOLDOWN_DAYS = 30; 
const NL_SHOW_DELAY_MS = 800; 


const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];
const daysToMs = d => d * 24 * 60 * 60 * 1000;

function shouldShowModal() {
  try {
    const dismissed = localStorage.getItem(NL_DISMISSED_KEY) === '1';
    const last = parseInt(localStorage.getItem(NL_STORAGE_KEY) || '0', 10);
    const expired = Date.now() - last > daysToMs(NL_COOLDOWN_DAYS);
    return !dismissed && (last === 0 || expired);
  } catch { return true; }
}

function markShown() {
  try { localStorage.setItem(NL_STORAGE_KEY, String(Date.now())); } catch {}
}
function markDismissed() {
  try {
    localStorage.setItem(NL_DISMISSED_KEY, '1');
    localStorage.setItem(NL_STORAGE_KEY, String(Date.now()));
  } catch {}
}


let firstFocusable = null, lastFocusable = null, prevActive = null;

function openModal() {
  const overlay = qs('#nl-overlay');
  if (!overlay) return;

  overlay.hidden = false;
  document.body.style.overflow = 'hidden'; 
  prevActive = document.activeElement;


  const focusables = qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', overlay)
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  firstFocusable = focusables[0];
  lastFocusable  = focusables[focusables.length - 1];
  if (qs('#nl-email')) qs('#nl-email').focus({ preventScroll: true });

  markShown();
}

function closeModal() {
  const overlay = qs('#nl-overlay');
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = ''; 
  if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
  markDismissed();
}


function handleKeydown(e){
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
  if (e.key === 'Tab' && firstFocusable && lastFocusable) {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault(); lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault(); firstFocusable.focus();
    }
  }
}


function isValidEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}


document.addEventListener('DOMContentLoaded', () => {
  const overlay = qs('#nl-overlay');
  const btnClose = qs('#nl-close');
  const form = qs('#nl-form');
  const input = qs('#nl-email');
  const error = qs('#nl-error');
  const success = qs('#nl-success');
  const copyBtn = qs('#nl-copy');
  const codeEl = qs('#nl-code');

  if (!overlay || !btnClose || !form || !input) return;

 
  if (shouldShowModal()) {
    setTimeout(openModal, NL_SHOW_DELAY_MS);
  }


  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', handleKeydown);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.textContent = '';

    const email = input.value || '';
    if (!isValidEmail(email)) {
      error.textContent = 'Introduce un email válido.';
      input.focus();
      return;
    }

    form.hidden = true;
    success.hidden = false;
   
  });


  if (copyBtn && codeEl) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEl.textContent.trim());
        copyBtn.textContent = 'Copiado ✓';
        setTimeout(() => (copyBtn.textContent = 'Copiar'), 1800);
      } catch {
        copyBtn.textContent = 'Error';
        setTimeout(() => (copyBtn.textContent = 'Copiar'), 1800);
      }
    });
  }
});
function openNewsletterModal() {
  const overlay = document.getElementById('nl-overlay');
  if (!overlay) return;
  overlay.hidden = false;                 
  document.body.style.overflow = 'hidden';
}

function closeNewsletterModal() {
  const overlay = document.getElementById('nl-overlay');
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = '';      
}


document.addEventListener('DOMContentLoaded', () => {
  openNewsletterModal();


  document.getElementById('nl-close')?.addEventListener('click', closeNewsletterModal);


  document.getElementById('nl-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'nl-overlay') closeNewsletterModal();
  });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNewsletterModal();
  });
});
