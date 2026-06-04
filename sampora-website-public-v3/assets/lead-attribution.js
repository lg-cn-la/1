(function () {
  'use strict';

  var SESSION_KEY = 'sampora_attribution';
  var LEGACY_SESSION_KEY = 'sampora_lead_attribution_v1';
  var FIRST_TOUCH_KEY = 'sampora_first_touch';
  var LAST_TOUCH_KEY = 'sampora_last_touch';
  var CONSENT_KEY = 'sampora_cookie_consent';
  var PREFS_KEY = 'sampora_cookie_consent_preferences';
  var TRACKING_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'msclkid'
  ];
  var OUTPUT_KEYS = TRACKING_KEYS.concat([
    'landing_page',
    'referrer',
    'conversion_page',
    'cta_intent',
    'cta_location',
    'cta_event',
    'captured_at',
    'first_landing_page',
    'first_referrer',
    'first_utm_source',
    'first_utm_medium',
    'first_utm_campaign',
    'last_landing_page',
    'last_referrer'
  ]);

  function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  function normalizeString(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : '';
  }

  function normalizeUrlWithoutHash(rawUrl) {
    try {
      var parsed = new URL(rawUrl, window.location.href);
      parsed.hash = '';
      return parsed.toString();
    } catch (error) {
      var fallback = String(rawUrl || '');
      var hashIndex = fallback.indexOf('#');
      return hashIndex >= 0 ? fallback.slice(0, hashIndex) : fallback;
    }
  }

  function readStorage(area, key) {
    try {
      return window[area].getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(area, key, value) {
    try {
      window[area].setItem(key, JSON.stringify(value));
    } catch (error) {
      // Storage can be unavailable in private or locked-down browsing modes.
    }
  }

  function readJson(area, key) {
    var raw = readStorage(area, key);
    if (!raw) return {};
    try {
      var parsed = JSON.parse(raw);
      return isObject(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function analyticsStorageAllowed() {
    var choice = readStorage('localStorage', CONSENT_KEY);
    if (choice === 'accepted') return true;
    if (choice === 'custom') {
      var prefs = readJson('localStorage', PREFS_KEY);
      return prefs.analyticsMarketing === true;
    }
    return false;
  }

  function flatClean(source) {
    var output = {};
    OUTPUT_KEYS.forEach(function (key) {
      output[key] = normalizeString(source && source[key]);
    });
    return output;
  }

  function pageTouch() {
    var params = new URLSearchParams(window.location.search || '');
    var touch = {
      landing_page: normalizeUrlWithoutHash(window.location.href),
      referrer: normalizeString(document.referrer),
      conversion_page: normalizeUrlWithoutHash(window.location.href),
      captured_at: new Date().toISOString()
    };
    TRACKING_KEYS.forEach(function (key) {
      touch[key] = normalizeString(params.get(key));
    });
    return touch;
  }

  function hasTouchSignal(touch) {
    return TRACKING_KEYS.some(function (key) {
      return !!touch[key];
    }) || !!touch.referrer;
  }

  function readCurrentSession() {
    var current = readJson('sessionStorage', SESSION_KEY);
    if (Object.keys(current).length) return current;
    return readJson('sessionStorage', LEGACY_SESSION_KEY);
  }

  function buildSessionAttribution() {
    var existing = flatClean(readCurrentSession());
    var touch = pageTouch();
    var next = flatClean(existing);

    if (!next.landing_page) next.landing_page = touch.landing_page;
    if (!next.referrer) next.referrer = touch.referrer;
    next.conversion_page = touch.conversion_page;
    next.captured_at = touch.captured_at;

    TRACKING_KEYS.forEach(function (key) {
      if (touch[key]) next[key] = touch[key];
    });

    writeStorage('sessionStorage', SESSION_KEY, next);
    return next;
  }

  function updateTouches(session) {
    if (!analyticsStorageAllowed()) return { first: {}, last: {} };

    var touch = pageTouch();
    if (!hasTouchSignal(touch)) {
      return {
        first: readJson('localStorage', FIRST_TOUCH_KEY),
        last: readJson('localStorage', LAST_TOUCH_KEY)
      };
    }

    var first = readJson('localStorage', FIRST_TOUCH_KEY);
    if (!Object.keys(first).length) {
      first = {
        landing_page: touch.landing_page || session.landing_page,
        referrer: touch.referrer || session.referrer,
        utm_source: touch.utm_source || session.utm_source,
        utm_medium: touch.utm_medium || session.utm_medium,
        utm_campaign: touch.utm_campaign || session.utm_campaign,
        captured_at: touch.captured_at
      };
      writeStorage('localStorage', FIRST_TOUCH_KEY, first);
    }

    var last = {
      landing_page: touch.landing_page || session.landing_page,
      referrer: touch.referrer || session.referrer,
      utm_source: touch.utm_source || session.utm_source,
      utm_medium: touch.utm_medium || session.utm_medium,
      utm_campaign: touch.utm_campaign || session.utm_campaign,
      captured_at: touch.captured_at
    };
    writeStorage('localStorage', LAST_TOUCH_KEY, last);

    return { first: first, last: last };
  }

  function mergeTouches(session, touches) {
    var next = flatClean(session);
    var first = touches.first || {};
    var last = touches.last || {};
    next.first_landing_page = normalizeString(first.landing_page) || next.landing_page;
    next.first_referrer = normalizeString(first.referrer) || next.referrer;
    next.first_utm_source = normalizeString(first.utm_source) || next.utm_source;
    next.first_utm_medium = normalizeString(first.utm_medium) || next.utm_medium;
    next.first_utm_campaign = normalizeString(first.utm_campaign) || next.utm_campaign;
    next.last_landing_page = normalizeString(last.landing_page) || next.conversion_page || next.landing_page;
    next.last_referrer = normalizeString(last.referrer) || next.referrer;
    return next;
  }

  function inferIntent(element) {
    var explicit = normalizeString(element.getAttribute('data-ga-intent'));
    if (explicit) return explicit;
    var href = normalizeString(element.getAttribute('href'));
    try {
      var parsed = new URL(href, window.location.href);
      var intent = normalizeString(parsed.searchParams.get('intent'));
      if (intent === 'start_trial') return 'trial_request';
      if (intent) return intent;
    } catch (error) {}
    return '';
  }

  function inferEvent(element, intent) {
    var explicit = normalizeString(element.getAttribute('data-ga-event'));
    if (explicit) return explicit;
    if (intent === 'trial_request') return 'apply_for_trial_click';
    if (element.hasAttribute('data-resource-slug')) return 'resource_click';
    return 'cta_click';
  }

  function ctaPayload(element) {
    var intent = inferIntent(element);
    var payload = {
      cta_event: inferEvent(element, intent),
      cta_intent: intent,
      cta_location: normalizeString(element.getAttribute('data-ga-location')),
      conversion_page: normalizeUrlWithoutHash(window.location.href),
      captured_at: new Date().toISOString()
    };
    var resourceSlug = normalizeString(element.getAttribute('data-resource-slug'));
    var planSlug = normalizeString(element.getAttribute('data-plan-slug'));
    if (resourceSlug) payload.resource_slug = resourceSlug;
    if (planSlug) payload.plan_slug = planSlug;
    return payload;
  }

  function saveCtaState(payload) {
    var current = flatClean(readCurrentSession());
    current.cta_event = payload.cta_event;
    current.cta_intent = payload.cta_intent;
    current.cta_location = payload.cta_location;
    current.conversion_page = payload.conversion_page;
    current.captured_at = payload.captured_at;
    writeStorage('sessionStorage', SESSION_KEY, current);
  }

  function pushDataLayer(payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({
        event: payload.cta_event
      }, getAttribution(), payload));
    } catch (error) {}
  }

  function bindCtaTracking() {
    document.addEventListener('click', function (event) {
      var element = event.target.closest('[data-ga-event], [data-ga-intent], [data-ga-location], [data-resource-slug], [data-plan-slug], a[href*="intent=start_trial"]');
      if (!element) return;
      var payload = ctaPayload(element);
      saveCtaState(payload);
      pushDataLayer(payload);
    });
  }

  function getAttribution() {
    var session = flatClean(readCurrentSession());
    var touches = {
      first: readJson('localStorage', FIRST_TOUCH_KEY),
      last: readJson('localStorage', LAST_TOUCH_KEY)
    };
    return Object.freeze(mergeTouches(session, touches));
  }

  var sessionAttribution = buildSessionAttribution();
  mergeTouches(sessionAttribution, updateTouches(sessionAttribution));
  bindCtaTracking();

  Object.defineProperty(window, 'SamporaLeadAttribution', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Object.freeze({
      get: getAttribution
    })
  });
}());
