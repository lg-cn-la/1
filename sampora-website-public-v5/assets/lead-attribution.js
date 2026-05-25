(function () {
  'use strict';

  var STORAGE_KEY = 'sampora_lead_attribution_v1';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  function normalizeString(value) {
    return isNonEmptyString(value) ? value.trim() : '';
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

  function readStoredAttribution() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {};
      }
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function writeStoredAttribution(payload) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Ignore storage failures; reads will return defaults.
    }
  }

  function buildSnapshot(source) {
    return {
      landing_page: normalizeString(source.landing_page),
      referrer: normalizeString(source.referrer),
      utm_source: normalizeString(source.utm_source),
      utm_medium: normalizeString(source.utm_medium),
      utm_campaign: normalizeString(source.utm_campaign),
    };
  }

  function hydrateAttribution() {
    var existing = readStoredAttribution();
    var next = {
      landing_page: normalizeString(existing.landing_page),
      referrer: normalizeString(existing.referrer),
      utm_source: normalizeString(existing.utm_source),
      utm_medium: normalizeString(existing.utm_medium),
      utm_campaign: normalizeString(existing.utm_campaign),
    };

    if (!next.landing_page) {
      next.landing_page = normalizeUrlWithoutHash(window.location.href);
    }

    if (!next.referrer) {
      next.referrer = normalizeString(document.referrer);
    }

    var params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      if (!next[key]) {
        var candidate = normalizeString(params.get(key));
        if (candidate) {
          next[key] = candidate;
        }
      }
    });

    writeStoredAttribution(next);
  }

  function getAttribution() {
    var stored = readStoredAttribution();
    return Object.freeze(buildSnapshot(stored));
  }

  hydrateAttribution();

  Object.defineProperty(window, 'SamporaLeadAttribution', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Object.freeze({
      get: getAttribution,
    }),
  });
})();
