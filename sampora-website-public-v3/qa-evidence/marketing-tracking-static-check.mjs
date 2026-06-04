import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

const corePages = ['index.html', 'solutions.html', 'resources.html', 'plans.html', 'about.html', 'contact.html', 'resource-manuals.html'];
const supportPages = ['404.html', 'privacy.html', 'cookie-policy.html', 'terms.html'];
const allPages = [...corePages, ...supportPages, 'thank-you.html'];
const attributionFields = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'referrer',
  'landing_page',
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
  'last_referrer',
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  failures.push(message);
}

function parseAttributes(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/\s([a-zA-Z0-9_:-]+)(?:=(["'])(.*?)\2)?/g)) {
    attrs[match[1].toLowerCase()] = match[3] || '';
  }
  return attrs;
}

function findMetaContent(html, property) {
  const propPattern = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\b(?=[^>]*(?:property|name)=["']${propPattern}["'])[^>]*>`, 'i');
  const tag = html.match(pattern)?.[0] || '';
  return tag.match(/\bcontent=["']([^"']+)["']/i)?.[1] || '';
}

function findCanonical(html) {
  return html.match(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || '';
}

function extractJsonLd(html, page) {
  const scripts = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1].trim();
    try {
      scripts.push(JSON.parse(raw));
    } catch (error) {
      fail(`${page}: JSON-LD is not valid JSON (${error.message})`);
    }
  }
  return scripts;
}

function typeNames(value) {
  if (!value || typeof value !== 'object') return [];
  const nodes = Array.isArray(value['@graph']) ? value['@graph'] : [value];
  return nodes.map((node) => node && node['@type']).flat().filter(Boolean);
}

function checkForbiddenDirectTags() {
  const directTagPatterns = [
    [/googletagmanager\.com\/gtag\/js/i, 'direct gtag.js loader'],
    [/clarity\.ms\/tag/i, 'direct Clarity loader'],
    [/window\.clarity\s*=\s*function/i, 'inline Clarity bootstrap'],
    [/fbq\s*\(|fbevents\.js|connect\.facebook\.net/i, 'Meta Pixel'],
    [/linkedin\.com\/insight|snap\.licdn\.com|lintrk\s*\(/i, 'LinkedIn Insight'],
  ];
  for (const page of allPages) {
    const html = read(page);
    for (const [pattern, label] of directTagPatterns) {
      if (pattern.test(html)) fail(`${page}: contains ${label}`);
    }
  }
}

function checkOgAndJsonLd() {
  for (const page of [...corePages, ...supportPages]) {
    const html = read(page);
    const canonical = findCanonical(html);
    const ogUrl = findMetaContent(html, 'og:url');
    const ogImage = findMetaContent(html, 'og:image');
    if (!canonical) fail(`${page}: missing canonical URL`);
    if (!ogUrl) fail(`${page}: missing og:url`);
    if (canonical && ogUrl && ogUrl !== canonical) fail(`${page}: og:url ${ogUrl} does not match canonical ${canonical}`);
    if (corePages.includes(page) && ogImage !== 'https://getsampora.com/assets/og-sampora.png') {
      fail(`${page}: og:image must use https://getsampora.com/assets/og-sampora.png`);
    }
  }

  for (const page of allPages) {
    const scripts = extractJsonLd(read(page), page);
    const types = scripts.flatMap(typeNames);
    for (const forbidden of ['Review', 'Rating', 'AggregateRating']) {
      if (types.includes(forbidden) || JSON.stringify(scripts).includes(`"${forbidden}"`)) {
        fail(`${page}: JSON-LD must not include ${forbidden}`);
      }
    }
    if (page !== 'index.html' && scripts.length) {
      fail(`${page}: JSON-LD must not be added outside homepage`);
    }
  }

  const indexScripts = extractJsonLd(read('index.html'), 'index.html');
  const indexTypes = new Set(indexScripts.flatMap(typeNames));
  for (const required of ['Organization', 'WebSite', 'SoftwareApplication']) {
    if (!indexTypes.has(required)) fail(`index.html: missing ${required} JSON-LD`);
  }
  if (!JSON.stringify(indexScripts).includes('https://getsampora.com/assets/og-sampora.png')) {
    fail('index.html: Organization.logo should use assets/og-sampora.png fallback');
  }
}

function checkCtaAttributes() {
  for (const page of allPages) {
    const html = read(page);
    if (html.includes('start_trial_click')) fail(`${page}: contains deprecated start_trial_click`);
    for (const match of html.matchAll(/<a\b[^>]*href=["'][^"']*intent=start_trial[^"']*#contact-form[^"']*["'][^>]*>/gi)) {
      const attrs = parseAttributes(match[0]);
      const label = `${page}: start_trial CTA ${match[0].slice(0, 120)}`;
      if (attrs['data-ga-event'] !== 'apply_for_trial_click') fail(`${label} missing data-ga-event apply_for_trial_click`);
      if (attrs['data-ga-intent'] !== 'trial_request') fail(`${label} missing data-ga-intent trial_request`);
      if (!attrs['data-ga-location']) fail(`${label} missing data-ga-location`);
    }
  }

  const indexHtml = read('index.html');
  const resourceLink = indexHtml.match(/<a\b(?=[^>]*Explore Cooperation Resources|[^>]*data-i18n=["']opProofCoopCta["'])[^>]*>/i)?.[0] || '';
  const resourceAttrs = parseAttributes(resourceLink);
  if (resourceAttrs['data-ga-event'] !== 'resource_click') fail('index.html: Explore Cooperation Resources missing resource_click event');
  if (resourceAttrs['data-ga-intent'] !== 'cooperation_resources') fail('index.html: Explore Cooperation Resources missing cooperation_resources intent');
  if (resourceAttrs['data-resource-slug'] !== 'cooperation_resources') fail('index.html: Explore Cooperation Resources missing data-resource-slug');

  const plansHtml = read('plans.html');
  for (const slug of ['sampora_panel', 'supplier_network', 'enterprise']) {
    if (!plansHtml.includes(`data-plan-slug="${slug}"`) && !plansHtml.includes(`data-plan-slug='${slug}'`)) {
      fail(`plans.html: missing data-plan-slug ${slug}`);
    }
  }
}

function checkContactAndLeadEvents() {
  const contactHtml = read('contact.html');
  const thankHtml = read('thank-you.html');
  for (const field of attributionFields) {
    if (!new RegExp(`name=["']${field}["']`).test(contactHtml)) fail(`contact.html: missing hidden field ${field}`);
  }
  if (/generate_lead/.test(contactHtml)) fail('contact.html: must not push generate_lead');
  if (!/contact_form_submit/.test(contactHtml)) fail('contact.html: missing contact_form_submit success event');
  if (!/disabled\s*=|\.disabled\s*=|setAttribute\(["']disabled["']/.test(contactHtml)) fail('contact.html: submit button must have disabled/loading state');
  const generateLeadCount = (thankHtml.match(/event\s*:\s*['"]generate_lead['"]/g) || []).length;
  if (generateLeadCount !== 1) fail(`thank-you.html: expected one generate_lead event literal, found ${generateLeadCount}`);
  if (!/sessionStorage/.test(thankHtml)) fail('thank-you.html: missing sessionStorage dedupe guard');
  if (!/lead_form\s*:\s*['"]contact['"]/.test(thankHtml)) fail('thank-you.html: generate_lead missing lead_form contact');
}

function checkAttributionAsset() {
  const js = read('assets/lead-attribution.js');
  for (const token of [
    'sampora_attribution',
    'sampora_first_touch',
    'sampora_last_touch',
    'SamporaLeadAttribution',
    'cta_event',
    'apply_for_trial_click',
    'resource_slug',
  ]) {
    if (!js.includes(token)) fail(`assets/lead-attribution.js: missing ${token}`);
  }
  for (const field of attributionFields) {
    if (!js.includes(field)) fail(`assets/lead-attribution.js: missing attribution field ${field}`);
  }

  const consent = read('assets/sampora-cookie-preferences.js');
  for (const key of ['sampora_attribution', 'sampora_first_touch', 'sampora_last_touch', 'sampora_lead_attribution_v1']) {
    if (!consent.includes(key)) fail(`assets/sampora-cookie-preferences.js: rejection cleanup missing ${key}`);
  }
}

function checkBackendDocs() {
  const backend = read('backend/google-apps-script-contact.gs');
  const handoff = read('backend-form-handoff.md');
  for (const field of attributionFields) {
    if (!backend.includes(field)) fail(`backend/google-apps-script-contact.gs: missing ${field}`);
    if (!handoff.includes(field)) fail(`backend-form-handoff.md: missing ${field}`);
  }
  for (const token of ['Attribution', 'contact_form_submit', 'generate_lead', 'apply_for_trial_click', 'Custom Event Trigger', 'GA4 Event Tag', 'Key event']) {
    if (!handoff.includes(token)) fail(`backend-form-handoff.md: missing GTM/GA4 handoff token ${token}`);
  }
  if (!/URLSearchParams|parameter|postData\.type/i.test(backend)) fail('backend/google-apps-script-contact.gs: should accept form-urlencoded submissions');
  if (!/slice\(|substring\(|maxLength|limit/i.test(backend)) fail('backend/google-apps-script-contact.gs: should length-limit attribution fields');
}

checkForbiddenDirectTags();
checkOgAndJsonLd();
checkCtaAttributes();
checkContactAndLeadEvents();
checkAttributionAsset();
checkBackendDocs();

if (failures.length) {
  console.error('MARKETING_TRACKING_STATIC_CHECK_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('MARKETING_TRACKING_STATIC_CHECK_OK');
