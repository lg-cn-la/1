import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

const corePages = ['index.html', 'solutions.html', 'resources.html', 'plans.html', 'about.html', 'contact.html', 'resource-manuals.html'];
const supportPages = ['404.html', 'privacy.html', 'cookie-policy.html', 'terms.html'];
const allPages = [...corePages, ...supportPages, 'thank-you.html'];
const ogImageUrl = 'https://getsampora.com/assets/og-sampora.png';
const ogImageAlt = 'Sampora sample supplier and panel operations software';
const requiredCoreSocialMeta = [
  'og:type',
  'og:title',
  'og:description',
  'og:url',
  'og:image',
  'og:image:width',
  'og:image:height',
  'og:image:alt',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
];
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
const ga4EventFields = [
  'cta_text',
  'cta_location',
  'cta_intent',
  'cta_event',
  'resource_slug',
  'plan_slug',
  'source_page',
  'source_section',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'landing_page_path',
  'conversion_page_path',
  'referrer_domain',
  'first_utm_source',
  'first_utm_medium',
  'first_utm_campaign',
  'first_landing_page_path',
  'last_landing_page_path',
  'language',
  'has_gclid',
  'has_fbclid',
  'has_msclkid',
  'click_id_type',
];
const forbiddenGa4FormFields = [
  'name',
  'email',
  'company',
  'role',
  'role_other',
  'business_type',
  'message',
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  failures.push(message);
}

function assertNoForbiddenGa4Fields(label, source) {
  for (const field of forbiddenGa4FormFields) {
    const keyPattern = new RegExp(`(?:^|[{,]\\s*)["']?${field}["']?\\s*:`, 'm');
    if (keyPattern.test(source)) fail(`${label}: sanitized GA4 payload must not include form field ${field}`);
  }
}

function functionBody(source, name) {
  const signature = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'm');
  const match = signature.exec(source);
  if (!match) return '';
  let depth = 1;
  let index = match.index + match[0].length;
  for (; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(match.index + match[0].length, index);
    }
  }
  return '';
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

function metaKeys(html) {
  const keys = [];
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    const key = (attrs.property || attrs.name || '').toLowerCase();
    if (key) keys.push(key);
  }
  return keys;
}

function pngSize(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(`${rel}: missing required image asset`);
    return null;
  }
  const bytes = fs.readFileSync(file);
  if (bytes.length < 24 || bytes.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    fail(`${rel}: required image asset is not a valid PNG`);
    return null;
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
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
  const ogImageSize = pngSize('assets/og-sampora.png');

  for (const page of [...corePages, ...supportPages]) {
    const html = read(page);
    const canonical = findCanonical(html);
    const ogUrl = findMetaContent(html, 'og:url');
    if (!canonical) fail(`${page}: missing canonical URL`);
    if (!ogUrl) fail(`${page}: missing og:url`);
    if (canonical && ogUrl && ogUrl !== canonical) fail(`${page}: og:url ${ogUrl} does not match canonical ${canonical}`);
    if (corePages.includes(page)) {
      for (const key of requiredCoreSocialMeta) {
        if (!findMetaContent(html, key)) fail(`${page}: missing ${key}`);
      }
      if (findMetaContent(html, 'og:type') !== 'website') fail(`${page}: og:type must be website`);
      if (findMetaContent(html, 'og:image') !== ogImageUrl) fail(`${page}: og:image must use ${ogImageUrl}`);
      if (findMetaContent(html, 'twitter:image') !== ogImageUrl) fail(`${page}: twitter:image must use ${ogImageUrl}`);
      if (findMetaContent(html, 'twitter:card') !== 'summary_large_image') fail(`${page}: twitter:card must be summary_large_image`);
      if (findMetaContent(html, 'og:image:alt') !== ogImageAlt) fail(`${page}: og:image:alt must be ${ogImageAlt}`);
      if (ogImageSize) {
        if (findMetaContent(html, 'og:image:width') !== String(ogImageSize.width)) {
          fail(`${page}: og:image:width must match assets/og-sampora.png width ${ogImageSize.width}`);
        }
        if (findMetaContent(html, 'og:image:height') !== String(ogImageSize.height)) {
          fail(`${page}: og:image:height must match assets/og-sampora.png height ${ogImageSize.height}`);
        }
      }
    }
  }

  const thankYouSocialKeys = metaKeys(read('thank-you.html')).filter((key) => key.startsWith('og:') || key.startsWith('twitter:'));
  if (thankYouSocialKeys.length) fail(`thank-you.html: must not include OG/Twitter tags (${thankYouSocialKeys.join(', ')})`);
  if (/thank-you\.html/i.test(read('sitemap.xml'))) fail('sitemap.xml: must not include thank-you.html');
  if (/thank-you\.html/i.test(read('scripts/submit-indexnow.mjs'))) fail('submit-indexnow.mjs: must not submit thank-you.html');

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
  for (const field of forbiddenGa4FormFields) {
    if (ga4EventFields.includes(field)) fail(`ga4EventFields must not include form field ${field}`);
  }
  for (const field of attributionFields) {
    if (!new RegExp(`name=["']${field}["']`).test(contactHtml)) fail(`contact.html: missing hidden field ${field}`);
  }
  for (const field of ga4EventFields) {
    if (!contactHtml.includes(field)) fail(`contact.html: missing sanitized GA4 dataLayer field ${field}`);
    if (!thankHtml.includes(field)) fail(`thank-you.html: missing sanitized GA4 dataLayer field ${field}`);
  }
  if (/generate_lead/.test(contactHtml)) fail('contact.html: must not push generate_lead');
  if (!/contact_form_submit/.test(contactHtml)) fail('contact.html: missing contact_form_submit success event');
  if (/dataLayer\.push\s*\(\s*Object\.assign\s*\(\s*\{\s*\}\s*,\s*attribution\s*,/s.test(contactHtml)) {
    fail('contact.html: contact_form_submit must not push raw attribution into dataLayer');
  }
  if (!/resolveContactSubmitDataLayerPayload/.test(contactHtml)) {
    fail('contact.html: missing sanitized contact submit dataLayer payload helper');
  }
  const contactPayloadBody = functionBody(contactHtml, 'buildContactDataLayerPayload');
  if (!contactPayloadBody) fail('contact.html: missing buildContactDataLayerPayload body for GA4 field audit');
  assertNoForbiddenGa4Fields('contact.html buildContactDataLayerPayload', contactPayloadBody);
  if (!/disabled\s*=|\.disabled\s*=|setAttribute\(["']disabled["']/.test(contactHtml)) fail('contact.html: submit button must have disabled/loading state');
  const generateLeadCount = (thankHtml.match(/event\s*:\s*['"]generate_lead['"]/g) || []).length;
  if (generateLeadCount !== 1) fail(`thank-you.html: expected one generate_lead event literal, found ${generateLeadCount}`);
  if (!/sessionStorage/.test(thankHtml)) fail('thank-you.html: missing sessionStorage dedupe guard');
  if (!/lead_form\s*:\s*['"]contact['"]/.test(thankHtml)) fail('thank-you.html: generate_lead missing lead_form contact');
  if (!/leadEventPayload/.test(thankHtml)) fail('thank-you.html: generate_lead missing sanitized GA4 payload helper');
}

function checkAttributionAsset() {
  const js = read('assets/lead-attribution.js');
  for (const token of [
    'sampora_attribution',
    'sampora_first_touch',
    'sampora_last_touch',
    'SamporaLeadAttribution',
    'toDataLayer',
    'buildDataLayerPayload',
    'cta_event',
    'apply_for_trial_click',
    'resource_slug',
  ]) {
    if (!js.includes(token)) fail(`assets/lead-attribution.js: missing ${token}`);
  }
  for (const field of attributionFields) {
    if (!js.includes(field)) fail(`assets/lead-attribution.js: missing attribution field ${field}`);
  }
  for (const field of ga4EventFields) {
    if (!js.includes(field)) fail(`assets/lead-attribution.js: missing sanitized GA4 field ${field}`);
  }
  if (/window\.dataLayer\.push\s*\(\s*Object\.assign\s*\([\s\S]{0,160}getAttribution\(\)[\s\S]{0,160}payload/.test(js)) {
    fail('assets/lead-attribution.js: CTA dataLayer push must not merge raw attribution');
  }
  if (!/window\.dataLayer\.push\s*\(\s*Object\.assign\s*\(\s*\{\s*event\s*:\s*analyticsPayload\.cta_event\s*\}\s*,\s*analyticsPayload\s*\)\s*\)/s.test(js)) {
    fail('assets/lead-attribution.js: CTA dataLayer push must use sanitized analyticsPayload');
  }
  const assetPayloadBody = functionBody(js, 'buildDataLayerPayload');
  if (!assetPayloadBody) fail('assets/lead-attribution.js: missing buildDataLayerPayload body for GA4 field audit');
  assertNoForbiddenGa4Fields('assets/lead-attribution.js buildDataLayerPayload', assetPayloadBody);

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
