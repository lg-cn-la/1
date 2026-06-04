(function () {
  const CONSENT_KEY = 'sampora_cookie_consent';
  const PREFS_KEY = 'sampora_cookie_consent_preferences';
  const ATTRIBUTION_STORAGE_KEYS = [
    'sampora_attribution',
    'sampora_first_touch',
    'sampora_last_touch',
    'sampora_lead_attribution_v1',
    'sampora_gclid',
    'sampora_fbclid',
    'sampora_msclkid',
    'gclid',
    'fbclid',
    'msclkid'
  ];
  const CLARITY_RETRY_COUNT = 8;
  const CLARITY_RETRY_DELAY = 500;

  const copy = {
    en: {
      bannerTitle: 'Cookie consent',
      bannerText: 'We use necessary cookies to keep Sampora working. With your permission, analytics and marketing cookies help us measure website visits and improve campaigns.',
      acceptAll: 'Accept all',
      rejectNonEssential: 'Reject non-essential',
      managePreferences: 'Manage preferences',
      modalTitle: 'Cookie preferences',
      modalIntro: 'Choose whether Sampora can use analytics and marketing cookies. Necessary cookies are always on.',
      necessaryTitle: 'Necessary cookies',
      necessaryDescription: 'Required for site security, language preference, cookie consent, and basic page functions. These cookies are always on.',
      analyticsTitle: 'Analytics and marketing cookies',
      analyticsDescription: 'Allow Google Analytics, Google Ads, Microsoft Clarity, and related tags configured through Google Tag Manager to measure website usage, improve campaigns, and understand visitor interactions.',
      alwaysOn: 'Always on',
      toggleOn: 'On',
      toggleOff: 'Off',
      savePreferences: 'Save preferences',
      close: 'Close'
    },
    zh: {
      bannerTitle: 'Cookie 同意',
      bannerText: '我们使用必要 Cookie 保障 Sampora 网站运行。经你同意后，分析和营销 Cookie 会帮助我们衡量网站访问并优化推广。',
      acceptAll: '接受全部',
      rejectNonEssential: '拒绝非必要',
      managePreferences: '管理偏好',
      modalTitle: 'Cookie 偏好设置',
      modalIntro: '请选择 Sampora 是否可以使用分析和营销 Cookie。必要 Cookie 始终开启。',
      necessaryTitle: '必要 Cookie',
      necessaryDescription: '用于网站安全、语言偏好、Cookie 同意记录和基础页面功能。这些 Cookie 始终开启。',
      analyticsTitle: '分析与营销 Cookie',
      analyticsDescription: '允许通过 Google Tag Manager 配置的 Google Analytics、Google Ads、Microsoft Clarity 及相关标签衡量网站使用情况、优化推广并了解访问者互动。',
      alwaysOn: '始终开启',
      toggleOn: '开启',
      toggleOff: '关闭',
      savePreferences: '保存偏好',
      close: '关闭'
    }
  };

  let clarityTimer = 0;

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }

  function removeStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {}
  }

  function removeSessionStorage(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {}
  }

  function clearAttributionStorage() {
    ATTRIBUTION_STORAGE_KEYS.forEach(function (key) {
      removeStorage(key);
      removeSessionStorage(key);
    });
  }

  function parsePreferences() {
    const raw = readStorage(PREFS_KEY);
    if (!raw) return { analyticsMarketing: false };
    try {
      const parsed = JSON.parse(raw);
      return { analyticsMarketing: parsed.analyticsMarketing === true };
    } catch (error) {
      return { analyticsMarketing: false };
    }
  }

  function saveChoice(choice, preferences) {
    writeStorage(CONSENT_KEY, choice);
    writeStorage(PREFS_KEY, JSON.stringify({
      analyticsMarketing: preferences.analyticsMarketing === true,
      savedAt: new Date().toISOString()
    }));
  }

  function normalizeLang(value) {
    const lang = String(value || '').trim().toLowerCase();
    if (lang === 'zh' || lang.startsWith('zh-')) return 'zh';
    return lang === 'en' || lang.startsWith('en-') ? 'en' : '';
  }

  function currentLang() {
    const root = document.documentElement;
    const domLang = normalizeLang(root.dataset.lang) || normalizeLang(root.lang);
    if (domLang) return domLang;
    return normalizeLang(readStorage('sampora_lang')) || 'en';
  }

  function t() {
    return copy[currentLang()] || copy.en;
  }

  function consentState(granted) {
    const value = granted ? 'granted' : 'denied';
    return {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value
    };
  }

  function updateGtagConsent(granted) {
    const state = consentState(granted);
    const gtag = typeof window.gtag === 'function'
      ? window.gtag
      : function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
      };
    gtag('consent', 'update', state);
  }

  function updateClarityConsent(granted, retriesRemaining) {
    const value = granted ? 'granted' : 'denied';
    const payload = {
      ad_Storage: value,
      analytics_Storage: value
    };

    if (typeof window.clarity === 'function') {
      window.clarity('consentv2', payload);
      return;
    }

    if (retriesRemaining > 0) {
      window.clearTimeout(clarityTimer);
      clarityTimer = window.setTimeout(function () {
        updateClarityConsent(granted, retriesRemaining - 1);
      }, CLARITY_RETRY_DELAY);
    }
  }

  function applyConsent(granted, options) {
    updateGtagConsent(granted);
    updateClarityConsent(granted, options && options.retryClarity ? CLARITY_RETRY_COUNT : 0);
    window.dispatchEvent(new CustomEvent('sampora:cookie-consent', {
      detail: {
        choice: readStorage(CONSENT_KEY),
        analyticsMarketing: granted === true
      }
    }));
  }

  function getSavedChoice() {
    const saved = readStorage(CONSENT_KEY);
    return saved === 'accepted' || saved === 'rejected' || saved === 'custom' ? saved : '';
  }

  function removeBanner() {
    const banner = document.getElementById('sampora-cookie-banner');
    if (banner) banner.remove();
  }

  function closePreferences() {
    const backdrop = document.getElementById('sampora-cookie-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
  }

  function acceptAll() {
    saveChoice('accepted', { analyticsMarketing: true });
    applyConsent(true, { retryClarity: true });
    removeBanner();
    closePreferences();
  }

  function rejectNonEssential() {
    saveChoice('rejected', { analyticsMarketing: false });
    clearAttributionStorage();
    applyConsent(false, { retryClarity: true });
    removeBanner();
    closePreferences();
  }

  function saveCustomPreferences() {
    const toggle = document.getElementById('sampora-cookie-analytics-toggle');
    const analyticsMarketing = toggle ? toggle.checked === true : false;
    saveChoice('custom', { analyticsMarketing: analyticsMarketing });
    if (!analyticsMarketing) clearAttributionStorage();
    applyConsent(analyticsMarketing, { retryClarity: true });
    removeBanner();
    closePreferences();
  }

  function renderText(root) {
    const strings = t();
    root.querySelectorAll('[data-cookie-copy]').forEach(function (node) {
      const key = node.getAttribute('data-cookie-copy');
      if (strings[key]) node.textContent = strings[key];
    });
  }

  function updateToggleLabel() {
    const label = document.querySelector('[data-cookie-toggle-label]');
    const toggle = document.getElementById('sampora-cookie-analytics-toggle');
    if (!label || !toggle) return;
    label.textContent = toggle.checked ? t().toggleOn : t().toggleOff;
  }

  function ensureBanner() {
    let banner = document.getElementById('sampora-cookie-banner');
    if (banner) return banner;

    banner = document.createElement('section');
    banner.id = 'sampora-cookie-banner';
    banner.className = 'sampora-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = [
      '<div class="sampora-cookie-banner__copy">',
      '<strong data-cookie-copy="bannerTitle"></strong>',
      '<p data-cookie-copy="bannerText"></p>',
      '</div>',
      '<div class="sampora-cookie-banner__actions">',
      '<button type="button" class="sampora-cookie-button sampora-cookie-button--primary" data-cookie-accept-all data-cookie-copy="acceptAll"></button>',
      '<button type="button" class="sampora-cookie-button" data-cookie-reject data-cookie-copy="rejectNonEssential"></button>',
      '<button type="button" class="sampora-cookie-button sampora-cookie-button--ghost" data-cookie-manage data-cookie-copy="managePreferences"></button>',
      '</div>'
    ].join('');

    banner.querySelector('[data-cookie-accept-all]').addEventListener('click', acceptAll);
    banner.querySelector('[data-cookie-reject]').addEventListener('click', rejectNonEssential);
    banner.querySelector('[data-cookie-manage]').addEventListener('click', function () {
      openPreferences();
    });
    document.body.appendChild(banner);
    return banner;
  }

  function ensureModal() {
    let backdrop = document.getElementById('sampora-cookie-modal-backdrop');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'sampora-cookie-modal-backdrop';
    backdrop.className = 'sampora-cookie-modal-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = [
      '<div class="sampora-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="sampora-cookie-modal-title">',
      '<div class="sampora-cookie-modal__header">',
      '<h2 id="sampora-cookie-modal-title" data-cookie-copy="modalTitle"></h2>',
      '<button type="button" class="sampora-cookie-icon-button" data-cookie-close aria-label="Close">X</button>',
      '</div>',
      '<p class="sampora-cookie-modal__intro" data-cookie-copy="modalIntro"></p>',
      '<div class="sampora-cookie-category">',
      '<div>',
      '<strong data-cookie-copy="necessaryTitle"></strong>',
      '<p data-cookie-copy="necessaryDescription"></p>',
      '</div>',
      '<label class="sampora-cookie-switch is-disabled">',
      '<input type="checkbox" checked disabled>',
      '<span aria-hidden="true"></span>',
      '<em data-cookie-copy="alwaysOn"></em>',
      '</label>',
      '</div>',
      '<div class="sampora-cookie-category">',
      '<div>',
      '<strong data-cookie-copy="analyticsTitle"></strong>',
      '<p data-cookie-copy="analyticsDescription"></p>',
      '</div>',
      '<label class="sampora-cookie-switch">',
      '<input type="checkbox" id="sampora-cookie-analytics-toggle">',
      '<span aria-hidden="true"></span>',
      '<em data-cookie-toggle-label></em>',
      '</label>',
      '</div>',
      '<div class="sampora-cookie-modal__actions">',
      '<button type="button" class="sampora-cookie-button" data-cookie-reject data-cookie-copy="rejectNonEssential"></button>',
      '<button type="button" class="sampora-cookie-button sampora-cookie-button--primary" data-cookie-save data-cookie-copy="savePreferences"></button>',
      '<button type="button" class="sampora-cookie-button sampora-cookie-button--ghost" data-cookie-accept-all data-cookie-copy="acceptAll"></button>',
      '</div>',
      '</div>'
    ].join('');

    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) closePreferences();
    });
    backdrop.querySelector('[data-cookie-close]').addEventListener('click', closePreferences);
    backdrop.querySelector('[data-cookie-reject]').addEventListener('click', rejectNonEssential);
    backdrop.querySelector('[data-cookie-save]').addEventListener('click', saveCustomPreferences);
    backdrop.querySelector('[data-cookie-accept-all]').addEventListener('click', acceptAll);
    backdrop.querySelector('#sampora-cookie-analytics-toggle').addEventListener('change', updateToggleLabel);
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function renderBanner() {
    const banner = ensureBanner();
    renderText(banner);
  }

  function renderModal() {
    const backdrop = ensureModal();
    const toggle = backdrop.querySelector('#sampora-cookie-analytics-toggle');
    const saved = getSavedChoice();
    const prefs = parsePreferences();
    toggle.checked = saved === 'accepted' || (saved === 'custom' && prefs.analyticsMarketing === true);
    renderText(backdrop);
    updateToggleLabel();
  }

  function openPreferences() {
    const backdrop = ensureModal();
    renderModal();
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    const firstControl = backdrop.querySelector('button, input:not([disabled])');
    if (firstControl) firstControl.focus({ preventScroll: true });
  }

  function rerender() {
    const banner = document.getElementById('sampora-cookie-banner');
    const modal = document.getElementById('sampora-cookie-modal-backdrop');
    if (banner) renderText(banner);
    if (modal) {
      renderText(modal);
      updateToggleLabel();
    }
  }

  function bindOpeners() {
    document.addEventListener('click', function (event) {
      const trigger = event.target.closest('[data-cookie-preferences-open], a[href="#cookie-preferences"]');
      if (!trigger) return;
      event.preventDefault();
      openPreferences();
    });

    document.addEventListener('click', function (event) {
      if (event.target.closest('.lang button, [data-lang]')) {
        window.setTimeout(rerender, 60);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePreferences();
    });

    window.addEventListener('storage', function (event) {
      if (event.key === 'sampora_lang') rerender();
    });

    if (window.MutationObserver) {
      const observer = new MutationObserver(rerender);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang', 'data-lang']
      });
    }
  }

  function applySavedConsent() {
    const saved = getSavedChoice();
    if (saved === 'accepted') {
      applyConsent(true, { retryClarity: true });
      return true;
    }
    if (saved === 'rejected') {
      clearAttributionStorage();
      applyConsent(false, { retryClarity: true });
      return true;
    }
    if (saved === 'custom') {
      const analyticsMarketing = parsePreferences().analyticsMarketing === true;
      if (!analyticsMarketing) clearAttributionStorage();
      applyConsent(analyticsMarketing, { retryClarity: true });
      return true;
    }
    applyConsent(false, { retryClarity: false });
    return false;
  }

  function init() {
    bindOpeners();
    if (!applySavedConsent()) renderBanner();
    if (window.location.hash === '#cookie-preferences') {
      window.setTimeout(openPreferences, 80);
    }
  }

  window.SamporaCookiePreferences = {
    open: openPreferences,
    close: closePreferences,
    acceptAll: acceptAll,
    rejectNonEssential: rejectNonEssential,
    getConsent: getSavedChoice,
    getPreferences: parsePreferences
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
