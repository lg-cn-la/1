# Sampora Confirmed Runtime Fix Result

Date: 2026-05-18 CST

## Files Changed

- `sampora-website-public-v1/index.html`
- `sampora-website-public-v1/plans.html`
- `sampora-website-public-v1/contact.html`
- `sampora-website-public-v1/resources.html`
- `sampora-website-public-v1.zip`
- `sampora-website-public-v1/qa-evidence/page-layer-browser-evidence.json` and refreshed browser screenshots from `page-layer-browser-check.mjs`
- `sampora-website-public-v1/qa-evidence/resource-manuals-browser-language-evidence.json` and refreshed resource-manual screenshots
- `sampora-website-public-v1/qa-evidence/lighthouse-*.json`, `lighthouse-output.json`, and `axe-output.json`
- `ISSUE_LEDGER.md`
- `SAMPORA_LATEST_REPAIR_HANDOFF.md`
- `SAMPORA_CONFIRMED_FIX_RESULT.md`
- `sampora-website-handoff-v1.zip`

## Diff Summary By Confirmed Fix

1. ZIP path separators
   - Rebuilt `sampora-website-public-v1.zip` from `sampora-website-public-v1/`.
   - ZIP entry names now use forward slashes only.
   - No page source was changed for this packaging item.

2. `index.html` visible mojibake
   - Replaced the broken U+922B-plus-question separator in the visible outcome/customer/proof copy.
   - Current safe copy includes `Pain -> Outcome`, `Focus: intake -> allocation -> review`, and `intake -> allocate -> review -> settle`.

3. `plans.html` language switcher labels
   - Replaced mojibake language button text with stable labels: `EN`, `中文`, `HI`.
   - No Plans layout, matrix, CTA, or sticky-nav logic was changed.

4. `contact.html` language switcher labels
   - Replaced mojibake language button text with stable labels: `EN`, `中文`, `HI`.
   - Contact form action, endpoint placeholder, hidden fields, URL intent handling, and submit behavior were left unchanged.

5. `resources.html` Hindi footer legal name
   - Replaced the Hindi-transliterated legal company name with `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.` in the HI footer copy.
   - No Resources topology, CTA, or content flow was changed.

## Proof Scope Stayed Limited

- Only the five confirmed checklist items were repaired.
- Source edits were limited to `index.html`, `plans.html`, `contact.html`, and `resources.html`.
- No workflow source, topology motion source, topology modal/S mark code, Contact backend behavior, Resource Manuals content/runtime source, or Lighthouse/axe remediation was changed.
- Required verification refreshed QA evidence files, but those are evidence artifacts rather than page-behavior changes.

## ZIP Evidence

Raw central-directory inspection after rebuild:

```text
entries = 233
backslash entry count = 0
root HTML = contact.html, index.html, plans.html, pricing.html, products.html, resource-manuals.html, resources.html, solutions.html
Chinese physical HTML entries = none
parent staging prefixes = 0
SHA-256 = 395BF3D71A975174E24B8AB414EDAD5114CAD0CF652606854A88E4A19D026169
```

Handoff v1 zip inspection after adding the result/handoff files:

```text
entries = 24
backslash entry count = 0
required present = AGENTS.md, ACCEPTANCE_TESTS.md, ISSUE_LEDGER.md, SAMPORA_LATEST_REPAIR_HANDOFF.md, SAMPORA_CONFIRMED_FIX_RESULT.md, redirect-map.md
```

Source-vs-ZIP comparison:

```text
source files = 233
zip entries = 233
missing = 0
extra = 0
mismatches = 0
```

## Runtime Evidence For Fixed Pages

Scoped source/runtime checks:

```text
indexBadSeparatorCount = 0
indexCustomerImpactReplacementCount = 4
indexOutcomeReplacementCount = 1
indexProofLoopReplacementCount = 1
plans labels = EN | 中文 | HI
contact labels = EN | 中文 | HI
resources HI footer = © 2026 Anhui Jiayu Enterprise Service Co., Ltd.
resources HI legal Devanagari/transliteration = false
```

Runtime browser language sweep over `index.html`, `plans.html`, `contact.html`, and `resources.html`:

```text
EN/ZH/HI states passed for all four pages.
No visible U+922B-plus-question separator.
No ???? marker.
No ICP No. or Wan ICP visible marker.
Plans and Contact language labels stayed EN | 中文 | HI in every state.
Resources HI footer preserved Anhui Jiayu Enterprise Service Co., Ltd.
```

## Passed Guards Reconfirmed

```text
node "sampora-website-public-v1\qa-evidence\final-audit-static-check.mjs"
PASS final audit static checks

node "sampora-website-public-v1\qa-evidence\page-layer-static-check.mjs"
PASS static checks for 8 physical HTML files and 7 absent Chinese legacy redirects

node --check "sampora-website-public-v1\assets\i18n-sweep.js"
PASS

node --check "sampora-website-public-v1\assets\resource-manuals\data.js"
PASS

node --check "sampora-website-public-v1\assets\resource-manuals\app.js"
PASS

node "sampora-website-public-v1\qa-evidence\resource-manuals-language-smoke.mjs"
resource manuals language smoke: OK

node "sampora-website-public-v1\qa-evidence\page-layer-browser-check.mjs"
status: PASS; failures: []; screenshots: 42

node "sampora-website-public-v1\qa-evidence\resource-manuals-browser-language-check.mjs"
resource manuals browser language check: OK

node "sampora-website-public-v1\qa-evidence\lighthouse-axe-check.mjs"
status: PASS; axeViolationCount: 8; axeBlockingViolationCount: 0
```

Previously passed guard status:

```text
workflow motion = PASS via page-layer-browser-check.mjs
topology motion = PASS via page-layer-browser-check.mjs
modal close and S mark = PASS via page-layer-browser-check.mjs
Plans sticky nav = PASS via page-layer-browser-check.mjs
Contact hidden fields / placeholder submit honesty = PASS via page-layer-browser-check.mjs
Resource Manuals runtime = PASS via resource-manuals-browser-language-check.mjs
Lighthouse / axe blocking status = PASS, 0 blocking axe violations
```

## Remaining Failures

None found for the five confirmed runtime/packaging items after repair and fresh verification.

Known external or non-blocking items remain unchanged:

- Real backend endpoint integration is still external.
- Production-domain and deployed server/CDN rewrite behavior still require deployment-side confirmation.
- Axe reports 8 non-blocking findings and 0 blocking findings.
