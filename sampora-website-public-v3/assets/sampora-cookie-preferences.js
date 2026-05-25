(function(){
  const STORAGE_KEY = 'sampora_cookie_consent';
  const VERSION = '2026-05';
  const defaultConsent = { necessary: true, analytics: false, marketing: false, version: VERSION };
  const copy = {
    en: {
      notice: 'We use necessary browser storage to keep this site working, such as language preference and cookie preference.',
      gotIt: 'Got it', preferences: 'Cookie Preferences', title: 'Cookie Preferences',
      intro: 'Sampora currently uses only necessary cookies and browser storage. Analytics and marketing cookies are not enabled on this website.',
      necessaryTitle: 'Necessary cookies and local storage', necessaryDesc: 'Always on. Used for language preference, cookie preference, resource manual state, and contact form fallback status.',
      analyticsTitle: 'Analytics cookies', analyticsDesc: 'Currently not used. If we enable analytics cookies in the future, they will only be loaded after you give consent.',
      marketingTitle: 'Marketing cookies', marketingDesc: 'Currently not used. If we enable advertising or retargeting cookies in the future, they will only be loaded after you give consent.',
      alwaysOn: 'Always on', notUsed: 'Currently not used', save: 'Save preferences', close: 'Close'
    },
    zh: {
      notice: '我们使用必要的浏览器本地存储来保证网站正常运行，例如语言偏好和 Cookie 偏好设置。',
      gotIt: '知道了', preferences: 'Cookie 偏好设置', title: 'Cookie 偏好设置',
      intro: 'Sampora 当前仅使用必要 Cookie 与浏览器本地存储。本网站当前未启用分析 Cookie 或营销 Cookie。',
      necessaryTitle: '必要 Cookie 与本地存储', necessaryDesc: '始终开启。用于语言偏好、Cookie 偏好设置、资源手册状态和联系表单 fallback 状态。',
      analyticsTitle: '分析 Cookie', analyticsDesc: '当前未启用。未来如启用分析 Cookie，将在取得您的同意后再加载。',
      marketingTitle: '营销 Cookie', marketingDesc: '当前未启用。未来如启用广告像素或再营销 Cookie，将在取得您的同意后再加载。',
      alwaysOn: '始终开启', notUsed: '当前未启用', save: '保存偏好', close: '关闭'
    }
  };
  function currentLang(){
    try { const saved = localStorage.getItem('sampora_lang'); if (saved === 'zh' || saved === 'en') return saved; } catch(e) {}
    const raw = (document.documentElement.dataset.lang || document.documentElement.lang || 'en').toLowerCase();
    return raw.startsWith('zh') ? 'zh' : 'en';
  }
  function getCopy(){ return copy[currentLang()] || copy.en; }
  function getConsent(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || null; } catch(e) { return null; }
  }
  function saveConsent(extra){
    const payload = Object.assign({}, defaultConsent, extra || {}, { savedAt: new Date().toISOString() });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch(e) {}
    window.dispatchEvent(new CustomEvent('sampora:cookie-consent', { detail: payload }));
    hideNotice();
    return payload;
  }
  function ensureModal(){
    let backdrop = document.getElementById('sampora-cookie-modal-backdrop');
    if (backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.id = 'sampora-cookie-modal-backdrop';
    backdrop.className = 'cookie-modal-backdrop';
    backdrop.innerHTML = '<div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="sampora-cookie-title">' +
      '<h2 id="sampora-cookie-title"></h2><p data-cookie-copy="intro"></p>' +
      '<div class="cookie-row"><strong data-cookie-copy="necessaryTitle"></strong><p data-cookie-copy="necessaryDesc"></p><span class="cookie-status" data-cookie-copy="alwaysOn"></span></div>' +
      '<div class="cookie-row"><strong data-cookie-copy="analyticsTitle"></strong><p data-cookie-copy="analyticsDesc"></p><span class="cookie-status" data-cookie-copy="notUsed"></span></div>' +
      '<div class="cookie-row"><strong data-cookie-copy="marketingTitle"></strong><p data-cookie-copy="marketingDesc"></p><span class="cookie-status" data-cookie-copy="notUsed"></span></div>' +
      '<div class="cookie-actions"><button type="button" class="btn ghost" data-cookie-close></button><button type="button" class="btn primary" data-cookie-save></button></div>' +
      '</div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function(e){ if(e.target === backdrop) closePreferences(); });
    backdrop.querySelector('[data-cookie-close]').addEventListener('click', closePreferences);
    backdrop.querySelector('[data-cookie-save]').addEventListener('click', function(){ saveConsent(); closePreferences(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closePreferences(); });
    return backdrop;
  }
  function renderModal(){
    const t = getCopy();
    const backdrop = ensureModal();
    backdrop.querySelector('#sampora-cookie-title').textContent = t.title;
    backdrop.querySelectorAll('[data-cookie-copy]').forEach(function(el){
      const key = el.getAttribute('data-cookie-copy');
      if (t[key]) el.textContent = t[key];
    });
    backdrop.querySelector('[data-cookie-close]').textContent = t.close;
    backdrop.querySelector('[data-cookie-save]').textContent = t.save;
  }
  function openPreferences(){ renderModal(); ensureModal().classList.add('open'); }
  function closePreferences(){ const backdrop = document.getElementById('sampora-cookie-modal-backdrop'); if(backdrop) backdrop.classList.remove('open'); }
  function ensureNotice(){
    let notice = document.getElementById('sampora-cookie-notice');
    if (notice) return notice;
    notice = document.createElement('div');
    notice.id = 'sampora-cookie-notice';
    notice.className = 'cookie-notice';
    notice.innerHTML = '<p data-cookie-notice-text></p><div class="cookie-notice-actions"><button type="button" class="btn primary" data-cookie-got-it></button><button type="button" class="btn ghost" data-cookie-open-from-notice></button></div>';
    document.body.appendChild(notice);
    notice.querySelector('[data-cookie-got-it]').addEventListener('click', function(){ saveConsent(); });
    notice.querySelector('[data-cookie-open-from-notice]').addEventListener('click', function(){ openPreferences(); });
    return notice;
  }
  function showNotice(){
    if (getConsent()) return;
    const t = getCopy();
    const notice = ensureNotice();
    notice.querySelector('[data-cookie-notice-text]').textContent = t.notice;
    notice.querySelector('[data-cookie-got-it]').textContent = t.gotIt;
    notice.querySelector('[data-cookie-open-from-notice]').textContent = t.preferences;
    notice.classList.add('show');
  }
  function hideNotice(){ const notice = document.getElementById('sampora-cookie-notice'); if(notice) notice.classList.remove('show'); }
  function bindOpeners(){
    document.addEventListener('click', function(e){
      const trigger = e.target.closest('[data-cookie-preferences-open], a[href="#cookie-preferences"]');
      if (!trigger) return;
      e.preventDefault();
      openPreferences();
    });
  }
  function refresh(){
    if (document.getElementById('sampora-cookie-modal-backdrop')) renderModal();
    const notice = document.getElementById('sampora-cookie-notice');
    if (notice && notice.classList.contains('show')) showNotice();
  }
  window.SamporaCookiePreferences = { open: openPreferences, close: closePreferences, getConsent: getConsent, saveNecessaryOnly: saveConsent };
  function init(){ bindOpeners(); showNotice(); if(location.hash === '#cookie-preferences') setTimeout(openPreferences, 80); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('storage', refresh);
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.lang button,[data-lang]');
    if(btn) setTimeout(refresh, 40);
  });
})();
