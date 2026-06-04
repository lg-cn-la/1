# Sampora Website Public Package

Recommended deployment entry: `index.html`.

## Canonical Public Pages

Maintained public pages:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`
- `about.html`

Canonical links currently use `https://getsampora.com/...`.

## Compatibility Redirects

The public package no longer ships standalone redirect HTML files for `products.html` or `pricing.html`.
Legacy product/pricing routes are backend/CDN-managed 301 redirects to canonical content pages.

Configure these backend/CDN 301 redirects in the same production release:

| Legacy path | Target | Status |
|---|---|---:|
| `/products.html` | `/index.html` | 301 |
| `/products` | `/index.html` | 301 |
| `/products/` | `/index.html` | 301 |
| `/pricing.html` | `/plans.html` | 301 |
| `/pricing` | `/plans.html` | 301 |
| `/pricing/` | `/plans.html` | 301 |
| `/about_sampora_issues_fixed.html` | `/about.html` | 301 |
| `/首页.html` | `/index.html` | 301 |
| `/产品.html` | `/index.html` | 301 |
| `/解决方案.html` | `/solutions.html` | 301 |
| `/资源中心.html` | `/resources.html` | 301 |
| `/资源-跳转页面.html` | `/resource-manuals.html` | 301 |
| `/版本方案.html` | `/plans.html` | 301 |
| `/联系我们.html` | `/contact.html` | 301 |

## Deployment Notes

The public package uses the `Online Sample Operations Platform` positioning for panel providers, sample suppliers, survey stations, and research subcontracting teams.

Legal/company wording should remain:

- `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.`
- `安徽省嘉禹企业服务有限公司`

This is the overseas-server stage. Do not add mainland filing display text until the deployment and legal status changes.

## Contact Form Endpoint Policy

`contact.html` is configured to the same-origin production contact route:

- `/api/contact`

The form `action`, `data-endpoint`, and submit-script `CONTACT_ENDPOINT` must stay identical.

Explore Cooperation Resources links use `contact.html?intent=cooperation#contact-form`; docs must not describe a separate legacy resource/implementation intent mapping as current behavior.

Lead context fields submitted with the form include:

- Core context: `intent`, `source_page`, `source_section`, `plan`, `lang`
- Attribution context: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `msclkid`, `referrer`, `landing_page`, `conversion_page`, `cta_intent`, `cta_location`, `cta_event`, `captured_at`, `first_landing_page`, `first_referrer`, `first_utm_source`, `first_utm_medium`, `first_utm_campaign`, `last_landing_page`, `last_referrer`
- Honeypot: `website`

The bundled `backend/google-apps-script-contact.gs` file is an example backend handoff, not proof of a production backend. A real `/api/contact` implementation should accept the frontend `application/x-www-form-urlencoded` body, may keep JSON compatibility, trim and length-limit submitted values, store attribution in lead records, and keep missing or overlong attribution from failing an otherwise valid form submission.

Marketing tracking remains GTM-operated. GA4 and Clarity should stay inside GTM with no direct public HTML tags. Each frontend `dataLayer` event needs a GTM Custom Event Trigger plus a GA4 Event Tag; mark only `generate_lead` as the initial GA4 Key event / Conversion. Keep `contact_form_submit` as debug/auxiliary, add `apply_for_trial_click`, and do not depend on `start_trial_click`.

## QA Evidence

Package E redirect-policy evidence recorded for this public source after the redirect repair:

- Pre-fix red check confirmed the seven Chinese legacy redirect HTML files were present in the public root and in the then-current public zip.
- Pre-fix red check confirmed the old physical Chinese redirect policy wording was present in `redirect-map.md`, `ACCEPTANCE_TESTS.md`, this README, and `DEPLOYMENT_NOTES.md`.
- Pre-fix `node qa-evidence/final-audit-static-check.mjs` did not catch the redirect-policy failure until this repair added coverage.
- Post-fix `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`.
- Post-fix source checks must confirm the public root contains exactly the seven real content pages and no standalone redirect HTML files.
- The public zip was not rebuilt by this Package E subagent; controller packaging must rebuild and inspect it before final delivery.

## Package Boundary

This directory is the static public source. Do not treat handoff-only reports or rebuilt archives as proof unless the public source has been checked directly.
