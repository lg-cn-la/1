# Sampora Deployment Notes

Deploy `index.html` as the default entry. Maintained content pages use these English canonical paths:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`
- `about.html`

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

Re-check deployed Chinese legacy route behavior after CDN or server rewrite configuration. The current source uses absolute canonical links under `https://getsampora.com/...`.

## Public Copy Baseline

The supported public-facing business wording should remain aligned with the **Online Sample Operations Platform** positioning.

Footer/legal copy should use:

- `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.`
- `安徽省嘉禹企业服务有限公司`

This is the overseas-server stage. Do not add mainland filing display text until the deployment and legal status changes.

## Contact Form Endpoint Policy

`contact.html` now submits to the same-origin production route:

- `/api/contact`

Deployment checks:

- Keep `action`, `data-endpoint`, and `CONTACT_ENDPOINT` as `/api/contact`.
- Confirm the backend accepts `application/x-www-form-urlencoded` from `FormData` -> `URLSearchParams`; JSON may be supported as a compatibility path, but the route must not be JSON-only.
- Confirm the backend requires `name`, `company`, `email`, `role`, and `business_type`.
- Confirm `message` remains optional and is stored when provided.
- Confirm the backend accepts hidden context fields `intent`, `source_page`, `source_section`, `plan`, `lang`, `landing_page`, `referrer`, `utm_source`, `utm_medium`, and `utm_campaign`.
- Keep honeypot field `website` in the payload.
- Keep success-only submit behavior: clear form only after HTTP 2xx with JSON `{ "ok": true }`; HTTP 2xx with `{ "ok": false }`, invalid JSON, HTTP errors, and network errors must show failure and preserve user input.

## QA Evidence

Packaged QA evidence includes:

- `qa-evidence\page-layer-static-check.mjs`
- `qa-evidence\page-layer-browser-check.mjs`
- `qa-evidence\page-layer-browser-evidence.json`
- `qa-evidence\resource-manuals-language-smoke.mjs`
- `qa-evidence\resource-manuals-browser-language-check.mjs`
- `qa-evidence\resource-manuals-browser-language-evidence.json`
- `qa-evidence\lighthouse-output.json`
- `qa-evidence\axe-output.json`
