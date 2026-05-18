/* Sampora language coordinator: keeps language state in sync without rewriting page copy. */
(function(){
  const LANGS = ['en', 'zh', 'hi'];
  const STORAGE_KEY = 'sampora_lang';
  const LANGUAGE_CONTROLS = '.lang button, .lang-btn, button[data-lang], a[data-lang], [role="button"][data-lang]';

  function isSupported(lang){
    return LANGS.includes(lang);
  }

  function normalizeLang(lang){
    const value = String(lang || '').toLowerCase();
    if (value.startsWith('zh')) return 'zh';
    if (value.startsWith('hi')) return 'hi';
    return isSupported(value) ? value : 'en';
  }

  function readSavedLang(){
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return isSupported(saved) ? saved : '';
    } catch(e) {
      return '';
    }
  }

  function languageControls(){
    return Array.from(document.querySelectorAll(LANGUAGE_CONTROLS));
  }

  function currentLang(){
    const active = languageControls().find(btn => (
      btn.classList.contains('active') || btn.getAttribute('aria-pressed') === 'true'
    ));
    const activeLang = active && active.dataset ? active.dataset.lang : '';
    if (isSupported(activeLang)) return activeLang;

    const saved = readSavedLang();
    if (saved) return saved;

    return normalizeLang(document.documentElement.lang);
  }

  function persistLang(lang){
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch(e) {}
  }

  function syncControls(lang){
    languageControls().forEach(btn => {
      if (!btn.dataset || !isSupported(btn.dataset.lang)) return;
      const selected = btn.dataset.lang === lang;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function applyLang(nextLang, options){
    const lang = normalizeLang(nextLang || currentLang());
    const previous = normalizeLang(document.body && document.body.dataset ? document.body.dataset.lang : document.documentElement.lang);

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    if (document.body) document.body.dataset.lang = lang;
    persistLang(lang);
    syncControls(lang);

    if (!options || options.dispatch !== false) {
      window.dispatchEvent(new CustomEvent('sampora:languagechange', {
        detail: { lang, previous }
      }));
    }

    return lang;
  }

  function languageFromEventTarget(target){
    const control = target && target.closest ? target.closest(LANGUAGE_CONTROLS) : null;
    const lang = control && control.dataset ? control.dataset.lang : '';
    return isSupported(lang) ? lang : '';
  }

  window.__samporaApplyI18nSweep = applyLang;

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(currentLang(), { dispatch: false });
  });

  document.addEventListener('click', event => {
    const lang = languageFromEventTarget(event.target);
    if (lang) setTimeout(() => applyLang(lang), 0);
  });
})();
