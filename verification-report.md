# Sampora Website Verification Evidence Note

Generated: 2026-05-18

Source folder: `E:\claude work\sampora-website-public`

Handoff folder: `E:\claude work\sampora-website-delivery\sampora-website-handoff`

## Status

Recorded verification evidence exists from earlier static checks, browser checks, resource-manual checks, Lighthouse output, axe output, and terminology scans.

This report is not a current release approval. During this Package E documentation-update pass, controller verification, browser QA, Lighthouse, axe, delivery sync, zip rebuild, and archive inspection were not rerun.

## Command and Artifact Evidence

- `node --check assets/resource-manuals/data.js`: exit 0
- `node --check assets/resource-manuals/app.js`: exit 0
- `node --check assets/i18n-sweep.js`: exit 0
- `node qa-evidence/resource-manuals-language-smoke.mjs`: `resource manuals language smoke: OK`
- `node qa-evidence/resource-manuals-browser-language-check.mjs`: `resource manuals browser language check: OK`
- `node qa-evidence/page-layer-static-check.mjs`: earlier recorded static-check success for 15 HTML files
- `node qa-evidence/page-layer-browser-check.mjs`: earlier recorded browser-check success with 42 screenshots
- Historical Lighthouse artifact: `E:\claude work\sampora-website-public\qa-evidence\lighthouse-output.json`
- Historical axe artifact: `E:\claude work\sampora-website-public\qa-evidence\axe-output.json`
- Terminology scan across public pages/docs/manual scripts: no blocked hits in the recorded QA pass.

## Earlier Fixes Recorded

- Static page baseline: CSS style blocks are balanced; official pages have title, meta description, and absolute canonical coverage.
- Legal baseline: old year text, mainland filing display text, and old company-name variants are removed; legal wording is standardized to `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.` and `安徽省嘉禹企业服务有限公司`.
- SEO baseline: official page title/meta/canonical checks pass.
- Dynamic behavior: index workflow loops; index, solutions, and resources topology motion is active; homepage hero left vertical line is disabled; plans matrix is enlarged.
- CTA/contact behavior: CTAs carry `intent` and land on `#contact-form`; contact form has backend-ready method/action/data-endpoint wiring, hidden context fields, and conservative pending behavior while the backend placeholder remains.
- Content cleanup: resources page avoids region-only framing; resource manuals have module-specific business copy; Partner Network wording remains conservative.

## Historical Browser Evidence Summary

Primary browser evidence file:

- `E:\claude work\sampora-website-public\qa-evidence\page-layer-browser-evidence.json`

Assertions from that JSON:

- `generatedAt: 2026-05-17T18:00:00.361Z`
- no failures were recorded in that earlier artifact
- `screenshots` contains 42 PNG screenshot entries.
- Navigation evidence covers six official pages at 390, 1440, 1536, and 1920 widths.
- Desktop navigation parity is restored across the official pages.
- Index workflow records looped relay states at 0 ms, 1000 ms, 3000 ms, and 6000 ms.
- Index topology evidence records active flow and scan animation.
- Solutions topology evidence records active flow, scan, and packet states.
- Resources topology evidence records active flow and scan animation.
- Plans evidence records enlarged matrix dimensions.
- Contact evidence records `method: "post"`, `action: "[BACKEND_CONTACT_ENDPOINT]"`, `data-endpoint: "[BACKEND_CONTACT_ENDPOINT]"`, required visible fields, hidden context fields, `Submit request`, and placeholder pending storage behavior.
- Resource-manual evidence records doc/category routing for `#doc/config`, `#doc/ops`, and `#category/ops-station`, plus zero replacement-character, placeholder question-mark sequence, and empty-label failures.

Resource-manual language evidence file:

- `E:\claude work\sampora-website-public\qa-evidence\resource-manuals-browser-language-evidence.json`

Assertions from that JSON:

- no failures were recorded in that earlier artifact
- Sampled states: en-doc-config, en-doc-ops, en-category-ops-station, zh-doc-config, hi-doc-config.
- Sampled language states include expected English, Chinese, and Hindi/Hinglish rendering checks.

## Historical Lighthouse Artifact

Summary file:

- `E:\claude work\sampora-website-public\qa-evidence\lighthouse-output.json`

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| index.html | 0.56 | 0.97 | 0.96 | 1.00 |
| solutions.html | 1.00 | 0.98 | 0.96 | 1.00 |
| resources.html | 0.99 | 0.98 | 0.96 | 1.00 |
| resource-manuals.html | 0.79 | 0.98 | 0.96 | 0.91 |
| plans.html | 1.00 | 0.98 | 0.96 | 1.00 |
| contact.html | 1.00 | 1.00 | 1.00 | 1.00 |

## Historical Axe Artifact

Summary file:

- `E:\claude work\sampora-website-public\qa-evidence\axe-output.json`

Recorded status:

- Blocking violations: 0
- Total recorded non-blocking violations: 8

## P0 / P1 / P2 Mapping

### P0 - Package and static blockers

Status: historical evidence only; current controller verification remains pending.

Evidence:

- Static checker output was previously recorded as successful for 15 HTML files.
- CSS style-block balance is included in the static baseline.
- Official title/meta/absolute canonical coverage is included in the static baseline.
- README and deployment notes match the included legacy redirect files.

### P1 - Page behavior and visual checks

Status: historical evidence only; current browser QA remains pending.

Evidence:

- Browser checker output was previously recorded as successful with 42 screenshots.
- Navigation evidence covers index, solutions, resources, resource manuals, plans, and contact at mobile and desktop widths.
- Topology/workflow evidence records active motion on the relevant pages.
- Contact form evidence verifies backend-ready fields and conservative placeholder behavior.
- Resource-manual evidence verifies language views and the `#category/ops-station` route.

### P2 - Copy, language cleanup, and docs

Status: historical evidence only; current delivery review remains pending.

Evidence:

- Terminology scan in recorded QA pass has no blocked hits.
- Contact submit copy is `Submit request`.
- Resource-manual smoke and browser language checks pass.
- Reports and package notes are updated to the backend-ready contact flow.

## Remaining External Handoff Items

These are not frontend blockers:

- Replace `[BACKEND_CONTACT_ENDPOINT]` with the real backend endpoint.
- Validate advanced allocation and Partner Network details during backend/product implementation.
- Re-check deployed redirect behavior after upload or CDN rewrite configuration.
