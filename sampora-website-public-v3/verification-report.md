# Sampora Website Verification Evidence Note

Generated: 2026-05-18

Source folder: `sampora-website-public-v3/`

## Status

Package E refreshed redirect-policy source verification on 2026-05-18 after removing Chinese-named legacy redirect files from the public root and updating redirect-policy docs. This report is scoped to Package E. It does not claim full delivery readiness, delivery sync, browser QA, Lighthouse/axe freshness, or zip rebuild; those remain controller/package-delivery responsibilities.

## Fresh Package E Evidence

- Pre-fix root listing confirmed `首页.html`, `产品.html`, `解决方案.html`, `资源中心.html`, `资源-跳转页面.html`, `版本方案.html`, and `联系我们.html` were present in the public root.
- Pre-fix zip inspection confirmed the same seven Chinese legacy redirect HTML entries were present in the then-current public zip.
- Pre-fix docs grep confirmed stale physical Chinese redirect policy wording in `redirect-map.md`, `ACCEPTANCE_TESTS.md`, `README.md`, and `DEPLOYMENT_NOTES.md`.
- Pre-fix `node qa-evidence/final-audit-static-check.mjs` returned `PASS final audit static checks`, proving the old script did not cover this failure.
- Post-fix `node qa-evidence/final-audit-static-check.mjs` returned `PASS final audit static checks` after adding redirect-policy coverage.
- Post-fix source verification must confirm the seven Chinese legacy redirect HTML files are absent and English redirects `products.html` and `pricing.html` remain present.

## Redirect Policy

Official public entry points use English paths only. The public source ships canonical English pages plus English redirect files `products.html` and `pricing.html`. Chinese legacy routes must be configured as server/CDN rewrite rules when needed, not shipped as physical public-root HTML files.

## Remaining External Handoff Items

- Controller must rebuild and inspect the current versioned public zip; this Package E subagent did not rebuild zips.
- Controller must ensure rebuilt public zip does not contain the seven Chinese legacy redirect HTML files.
- The static handoff package may keep `[BACKEND_CONTACT_ENDPOINT]` before production launch. In placeholder mode, the contact form stores a pending payload and shows the fallback/pending contact message instead of issuing a backend request.
- Replace `[BACKEND_CONTACT_ENDPOINT]` with the real backend endpoint before production form launch. After replacement, rerun browser QA in live endpoint mode and confirm POST submission plus success/failure response handling.
- Do not disable the form only because the static handoff package has not configured the production endpoint yet.
- Re-run full delivery verification before any final delivery claim.

