(function(){
  const STORAGE_KEY = 'sampora_cookie_consent';
  const VERSION = '2026-05';
  const categories = ['necessary', 'functional', 'analytics', 'marketing'];
  const copy = {
    en: {
      title: 'Cookie Preferences',
      intro: 'Sampora uses necessary storage for basic site operation. Functional / AI support storage is used for the SaleSmartly support chat. Analytics and marketing cookies are not currently used.',
      necessaryTitle: 'Necessary storage',
      necessaryDesc: 'Used for language preference, cookie preference, resource manual state, contact form fallback status, and basic site operation.',
      functionalTitle: 'Functional / AI support storage',
      functionalDesc: 'Used for SaleSmartly support chat, including chat state, vendor session continuity, misuse prevention, and follow-up when visitors choose to provide contact details.',
      analyticsTitle: 'Analytics cookies',
      analyticsDesc: 'Currently not used. Sampora does not load separate analytics cookies or dedicated website analytics tools on this public site.',
      marketingTitle: 'Marketing cookies',
      marketingDesc: 'Currently not used. Sampora does not use advertising pixels, retargeting cookies, or SaleSmartly marketing features on this public site.',
      necessaryStatus: 'Always on',
      functionalStatus: 'Used for support chat',
      notUsed: 'Currently not used',
      save: 'Save preferences',
      close: 'Close'
    },
    zh: {
      title: 'Cookie 偏好设置',
      intro: 'Sampora 使用必要存储支持网站基础运行。功能性 / AI 客服存储用于 SaleSmartly 客服会话。分析 Cookie 和营销 Cookie 当前未启用。',
      necessaryTitle: '必要存储',
      necessaryDesc: '用于语言偏好、Cookie 偏好设置、资源手册状态、联系表单 fallback 状态和网站基础运行。',
      functionalTitle: '功能性 / AI 客服存储',
      functionalDesc: '用于 SaleSmartly 客服会话，包括保持聊天状态、服务商会话连续性、防止滥用，并在访问者主动提供联系方式时支持后续跟进。',
      analyticsTitle: '分析 Cookie',
      analyticsDesc: '当前未启用。Sampora 不会在本公开网站加载独立分析 Cookie 或专门的网站分析工具。',
      marketingTitle: '营销 Cookie',
      marketingDesc: '当前未启用。Sampora 不会在本公开网站使用广告像素、再营销 Cookie 或 SaleSmartly 营销功能。',
      necessaryStatus: '始终开启',
      functionalStatus: '用于客服会话',
      notUsed: '当前未启用',
      save: '保存偏好',
      close: '关闭'
    }
  };

  function currentLang(){
    try {
      const saved = localStorage.getItem('sampora_lang');
      if (saved === 'zh' || saved === 'en') return saved;
    } catch(e) {}
    const raw = (document.documentElement.dataset.lang || document.documentElement.lang || 'en').toLowerCase();
    return raw.startsWith('zh') ? 'zh' : 'en';
  }

  function getCopy(){ return copy[currentLang()] || copy.en; }

  function getConsent(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || null; } catch(e) { return null; }
  }

  function saveConsent(){
    const payload = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      version: VERSION,
      savedAt: new Date().toISOString()
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch(e) {}
    window.dispatchEvent(new CustomEvent('sampora:cookie-consent', { detail: payload }));
    return payload;
  }

  function statusKey(category){
    if (category === 'necessary') return 'necessaryStatus';
    if (category === 'functional') return 'functionalStatus';
    return 'notUsed';
  }

  function buildRows(){
    return categories.map(function(category){
      return '<div class="cookie-row cookie-row--' + category + '" data-cookie-category="' + category + '">' +
        '<strong data-cookie-copy="' + category + 'Title"></strong>' +
        '<p data-cookie-copy="' + category + 'Desc"></p>' +
        '<span class="cookie-status" data-cookie-copy="' + statusKey(category) + '"></span>' +
        '</div>';
    }).join('');
  }

  function ensureModal(){
    let backdrop = document.getElementById('sampora-cookie-modal-backdrop');
    if (backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.id = 'sampora-cookie-modal-backdrop';
    backdrop.className = 'cookie-modal-backdrop';
    backdrop.innerHTML = '<div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="sampora-cookie-title">' +
      '<h2 id="sampora-cookie-title"></h2><p data-cookie-copy="intro"></p>' +
      '<div class="cookie-category-list">' + buildRows() + '</div>' +
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
  }

  window.SamporaCookiePreferences = { open: openPreferences, close: closePreferences, getConsent: getConsent, saveNecessaryOnly: saveConsent };
  function init(){ bindOpeners(); if(location.hash === '#cookie-preferences') setTimeout(openPreferences, 80); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('storage', refresh);
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.lang button,[data-lang]');
    if(btn) setTimeout(refresh, 40);
  });
})();
