/* Sampora language preference helper: shared initial language selection. */
(function(){
  const STORAGE_KEY = 'sampora_lang';

  function normalize(lang, fallback){
    const value = String(lang || '').trim().toLowerCase().replace('_', '-');
    if (value.startsWith('zh')) return 'zh';
    if (value.startsWith('en')) return 'en';
    return fallback || '';
  }

  function queryLang(){
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('lang')) return '';
      return normalize(params.get('lang'), 'en');
    } catch(e) {
      return '';
    }
  }

  function savedLang(){
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lang = normalize(saved, '');
      if (lang) return lang;
      if (saved) {
        localStorage.removeItem(STORAGE_KEY);
        return 'en';
      }
    } catch(e) {}
    return '';
  }

  function browserLang(){
    const values = [];
    if (navigator.languages && navigator.languages.length) values.push(...navigator.languages);
    if (navigator.language) values.push(navigator.language);
    for (const value of values) {
      const lang = normalize(value, '');
      if (lang) return lang;
    }
    return '';
  }

  function initialLang(){
    return queryLang() || savedLang() || browserLang() || 'en';
  }

  function currentLang(){
    return normalize(
      document.documentElement.dataset.lang ||
      document.body?.dataset.lang ||
      document.documentElement.lang,
      ''
    ) || savedLang() || initialLang();
  }

  function saveLang(lang){
    const normalized = normalize(lang, 'en');
    try { localStorage.setItem(STORAGE_KEY, normalized); } catch(e) {}
    return normalized;
  }

  function syncDocumentLang(lang){
    const normalized = normalize(lang, 'en');
    document.documentElement.lang = normalized === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.lang = normalized;
    if (document.body) document.body.dataset.lang = normalized;
    return normalized;
  }

  const api = {
    key: STORAGE_KEY,
    normalize,
    queryLang,
    savedLang,
    browserLang,
    getInitialLang: initialLang,
    getCurrentLang: currentLang,
    saveLang,
    syncDocumentLang
  };

  window.SamporaLanguagePreference = api;
  window.__samporaLanguagePreference = api;
})();
