# Sampora Deployment Notes

Deploy `index.html` as the default entry. Maintained content pages use these English canonical paths:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`

## Compatibility Redirects

The public package includes English root redirect HTML files for compatibility:

- `products.html` -> `index.html`
- `pricing.html` -> `plans.html`

Chinese legacy routes are not shipped as physical files in the public deploy package because filename preservation can fail and produce mojibake during extraction or hosting upload. Configure server/CDN rewrite rules for old Chinese routes when needed:

- `/首页.html` -> `/index.html`
- `/产品.html` -> `/index.html`
- `/解决方案.html` -> `/solutions.html`
- `/资源中心.html` -> `/resources.html`
- `/资源-跳转页面.html` -> `/resource-manuals.html`
- `/版本方案.html` -> `/plans.html`
- `/联系我们.html` -> `/contact.html`

Re-check deployed Chinese legacy route behavior after CDN or server rewrite configuration. The current source uses absolute canonical links under `https://www.sampora.com/...`. Confirm the final production domain before deployment if that domain is not final.

## Public Copy Baseline

The supported public-facing business wording should remain aligned with the **Online Sample Operations Platform** positioning.

Footer/legal copy should use:

- `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.`
- `安徽省嘉禹企业服务有限公司`

This is the overseas-server stage. Do not add mainland filing display text until the deployment and legal status changes.

## Contact Form Endpoint Policy

The static handoff package may keep `[BACKEND_CONTACT_ENDPOINT]` in `contact.html` before production launch. In this placeholder mode, the form stores a pending payload and shows the fallback/pending contact message instead of issuing a backend request.

Before production launch:

- Replace `[BACKEND_CONTACT_ENDPOINT]` with the real backend endpoint in both `action` and `data-endpoint`.
- Confirm the backend accepts the visible fields `name`, `email`, `company`, `role`, `business_type`, and `message`.
- Confirm the backend accepts hidden context fields `intent`, `source_page`, `source_section`, `plan`, and `lang`.
- Rerun browser QA in live endpoint mode and confirm the contact form issues a POST request and handles success/failure responses correctly.

Do not disable the form in the static handoff package only because the production endpoint is not configured yet.

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
