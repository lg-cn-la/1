# Sampora Website QA Evidence Note

Generated: 2026-05-18

Source folder: `sampora-website-public-v3/`

## Result

Package E refreshed the public-package evidence on 2026-05-18 after the latest documentation/report update. This report covers the source directory only; delivery sync and zip rebuild remain controller/package-delivery responsibilities.

## Evidence Used

- `node --check assets/i18n-sweep.js`: exit 0
- `node --check assets/resource-manuals/data.js`: exit 0
- `node --check assets/resource-manuals/app.js`: exit 0
- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: `PASS static checks for 15 HTML files`
- `node qa-evidence/resource-manuals-language-smoke.mjs`: `resource manuals language smoke: OK`
- `node qa-evidence/resource-manuals-browser-language-check.mjs`: `resource manuals browser language check: OK`
- `node qa-evidence/page-layer-browser-check.mjs`: status `PASS`, failures `[]`, screenshots `42`
- `node qa-evidence/lighthouse-axe-check.mjs`: status `PASS`, axe violations `8`, blocking axe violations `0`
- Source-content stale grep excluding `qa-evidence/**`: no matches for the latest-audit blocked terms.

## Repair Notes From Earlier Rounds

- Static page baseline is clean for balanced style blocks and official title/meta/absolute canonical coverage.
- Legal/company wording is standardized to `漏 2026 Anhui Jiayu Enterprise Service Co., Ltd.` and `瀹夊窘鐪佸槈绂逛紒涓氭湇鍔℃湁闄愬叕鍙竊.
- Contact form is backend-ready with `method`, `action`, `data-endpoint`, hidden context fields, and fetch-path behavior for the configured endpoint.
- Placeholder contact submission remains conservative and does not claim backend receipt while `[BACKEND_CONTACT_ENDPOINT]` is still present.
- Index workflow and topology runtime initialization are restored.
- Solutions/resources topology motion is active.
- Homepage hero left vertical line is disabled.
- Plans matrix is enlarged.
- Resource manuals route `#category/ops-station` works and manual copy uses business-module wording.
- Resources page avoids region-only framing.
- Partner Network wording is conservative until implementation details are confirmed.

## P0 / P1 / P2 Mapping

### P0 - Runtime and static blockers

Status: refreshed source evidence is available.

Evidence: final static, page-layer static, syntax checks, and resource-manual smoke checks pass with the command output listed above. README/deployment notes match the included legacy redirect files.

### P1 - Page behavior and visual checks

Status: refreshed browser evidence is available.

Evidence: `page-layer-browser-check.mjs` returned status `PASS`, failures `[]`, and 42 screenshots. The evidence covers navigation parity, workflow loop state, topology motion, Contact form behavior, plans matrix dimensions, and resource-manual routing.

### P2 - Copy and terminology cleanup

Status: refreshed source evidence is available.

Evidence: stale terminology grep returned no blocked hits outside `qa-evidence/**`; Contact submit copy is `Submit request`; resource manuals pass UI/language smoke checks; business copy is aligned with Online Sample Operations Platform positioning.

## Lighthouse Artifact

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| index.html | 0.56 | 0.97 | 0.96 | 1.00 |
| solutions.html | 1.00 | 0.98 | 0.96 | 1.00 |
| resources.html | 0.99 | 0.98 | 0.96 | 1.00 |
| resource-manuals.html | 0.79 | 0.98 | 0.96 | 0.91 |
| plans.html | 1.00 | 0.98 | 0.96 | 1.00 |
| contact.html | 1.00 | 1.00 | 1.00 | 1.00 |

## Axe Artifact

- `qa-evidence\axe-output.json`
- Blocking violations: 0
- Total recorded non-blocking violations: 8

## Backend Handoff Note

The contact form is frontend-ready with `[BACKEND_CONTACT_ENDPOINT]` as the placeholder. Backend still needs to replace that value and verify the real submission endpoint.

## External Confirmation Items

- Real backend endpoint for contact submission.
- Advanced allocation behavior and backend implementation.
- Partner Network implementation details and commercial wording.
- Deployed redirect behavior after upload or CDN rewrite configuration.

