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

Canonical links currently use `https://www.sampora.com/...`. Confirm the final production domain before launch if it changes.

## Compatibility Redirects

Physical redirect files shipped in the public root:

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

## Deployment Notes

The public package uses the `Online Sample Operations Platform` positioning for panel providers, sample suppliers, survey stations, and research subcontracting teams.

Legal/company wording should remain:

- `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.`
- `安徽省嘉禹企业服务有限公司`

This is the overseas-server stage. Do not add mainland filing display text until the deployment and legal status changes.

The contact form keeps `[BACKEND_CONTACT_ENDPOINT]` as the backend endpoint placeholder. Replace it in both `action` and `data-endpoint` before production form launch. While the placeholder remains, the frontend preserves the request context and does not claim backend receipt.

## QA Evidence

Package E redirect-policy evidence recorded for this public source after the redirect repair:

- Pre-fix red check confirmed the seven Chinese legacy redirect HTML files were present in the public root and in `sampora-website-public.zip`.
- Pre-fix red check confirmed the old physical Chinese redirect policy wording was present in `redirect-map.md`, `ACCEPTANCE_TESTS.md`, this README, and `DEPLOYMENT_NOTES.md`.
- Pre-fix `node qa-evidence/final-audit-static-check.mjs` did not catch the redirect-policy failure until this repair added coverage.
- Post-fix `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`.
- Post-fix source checks must confirm the seven Chinese legacy redirect HTML files are absent and `products.html` / `pricing.html` remain present.
- The public zip was not rebuilt by this Package E subagent; controller packaging must rebuild and inspect it before final delivery.

## Package Boundary

This directory is the static public source. Do not treat handoff-only reports or rebuilt archives as proof unless the public source has been checked directly.
