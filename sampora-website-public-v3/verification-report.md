# Sampora Website Verification Evidence Note

Generated: 2026-05-18

Source folder: `sampora-website-public-v3/`

## Status

Package E refreshed redirect-policy source verification after removing standalone redirect HTML files from the public root and updating redirect-policy docs. This report is scoped to Package E. It does not claim full delivery readiness, delivery sync, browser QA, Lighthouse/axe freshness, or zip rebuild; those remain controller/package-delivery responsibilities.

## Fresh Package E Evidence

- Pre-fix root listing confirmed `首页.html`, `产品.html`, `解决方案.html`, `资源中心.html`, `资源-跳转页面.html`, `版本方案.html`, and `联系我们.html` were present in the public root.
- Pre-fix zip inspection confirmed the same seven Chinese legacy redirect HTML entries were present in the then-current public zip.
- Pre-fix docs grep confirmed stale physical Chinese redirect policy wording in `redirect-map.md`, `ACCEPTANCE_TESTS.md`, `README.md`, and `DEPLOYMENT_NOTES.md`.
- Pre-fix `node qa-evidence/final-audit-static-check.mjs` returned `PASS final audit static checks`, proving the old script did not cover this failure.
- Post-fix `node qa-evidence/final-audit-static-check.mjs` returned `PASS final audit static checks` after adding redirect-policy coverage.
- Post-fix source verification must confirm the public root contains exactly the seven real content pages and no standalone redirect HTML files.

## Redirect Policy

Official public entry points use English paths only. The public source ships only real content pages in the public root. Legacy product, pricing, About, and Chinese routes must be configured as backend/CDN 301 redirects, not shipped as physical public-root HTML files.

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

## Remaining External Handoff Items

- Controller must rebuild and inspect the current versioned public zip; this Package E subagent did not rebuild zips.
- Controller must ensure rebuilt public zip does not contain the seven Chinese legacy redirect HTML files.
- The static handoff package may keep `[BACKEND_CONTACT_ENDPOINT]` before production launch. In placeholder mode, the contact form stores a pending payload and shows the fallback/pending contact message instead of issuing a backend request.
- Replace `[BACKEND_CONTACT_ENDPOINT]` with the real backend endpoint before production form launch. After replacement, rerun browser QA in live endpoint mode and confirm POST submission plus success/failure response handling.
- Do not disable the form only because the static handoff package has not configured the production endpoint yet.
- Re-run full delivery verification before any final delivery claim.

