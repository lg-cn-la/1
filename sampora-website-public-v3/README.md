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

Canonical links currently use `https://www.sampora.com/...`. Confirm the final production domain before launch if it changes.

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

`contact.html` is configured to the live Apps Script Web App endpoint:

- `https://script.google.com/macros/s/AKfycbyHALTY5VRPba0ok2PKkPAUzBHWr8LIASQS1zZ3KCRsj4fg50tqIQltCQzLTP6i4GKP/exec`

The form `action`, `data-endpoint`, and submit-script `CONTACT_ENDPOINT` must stay identical.

Lead context fields submitted with the form include:

- Core context: `intent`, `source_page`, `source_section`, `plan`, `lang`
- Attribution context: `landing_page`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`
- Honeypot: `website`

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
