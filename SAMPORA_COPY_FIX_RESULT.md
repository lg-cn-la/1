# Sampora Copy Fix Result

Date: 2026-05-18 CST

Scope: copy-only / terminology-only / i18n visible text polish for the current `sampora-website-public-v2` package. This round does not change layout, animation, form logic, CTA routing, QA scripts, or Lighthouse/axe scripts. A follow-up packaging correction was added because AGENTS requires every source/report/QA repair iteration to advance the versioned deliverable suffix.

## Files Changed

- `sampora-website-public-v2/index.html`
- `sampora-website-public-v2/solutions.html`
- `sampora-website-public-v2/resources.html`
- `sampora-website-public-v2/plans.html`
- `sampora-website-public-v2/assets/resource-manuals/data.js`
- refreshed verification output under `sampora-website-public-v2/qa-evidence/` from browser checks
- `sampora-website-public-v2.zip`
- `sampora-website-handoff-v2.zip`
- `SAMPORA_COPY_FIX_RESULT.md`
- `ISSUE_LEDGER.md`
- `SAMPORA_LATEST_REPAIR_HANDOFF.md`

## P0 / P1 Before And After

| Priority | Area | Before | After |
|---|---|---|---|
| P0 | Homepage pain cards | Earlier instruction had 3 pain themes, which risked collapsing the existing 5-card section. | Preserved 5 cards and mapped the 3 themes across 5 cards: project intake, project setup, supplier allocation, delivery tracking, finance & settlement. |
| P0 | Homepage i18n broken text | ZH/HI dictionary had visible `????` fallbacks in FAQ/status/workflow copy. | Replaced with readable ZH and natural Hinglish/English fallback copy. |
| P0 | Mojibake/static fallback | Plans status and metric fallback text contained mojibake-like strings before JS replacement. | Replaced static fallback text with `Delivery workflow / Live`, `sample delivery`, `Sample operations layers`, `QC pass rate`, and `Settlement scope`. |
| P0 | Supplier quota/control claims | Risky phrases such as supplier quotas were checked before repair. | No current public-page matches found; no supplier-level quota/device/hourly control claims were added. |
| P1 | Generic `traffic` wording | Resource manual content used `traffic` in project launch, Hybrid API, and Survey Station guidance. | Replaced with `sample delivery starts`, `respondent flow`, and `respondent flow or conversion`. |
| P1 | Generic Chinese `流量` wording | Read-only review found Chinese resource manual article copy still used `流量` in project launch, Hybrid API, and Survey Station guidance. | Replaced with `样本交付` and `受访者流转` wording. |
| P1 | Internal jargon | Visible `operating layer` fallback remained in homepage/Plans static copy. | Replaced with `Sample operations layer for` and `Sample operations layers`. |
| P1 | Resource/footer labels | Generic labels such as Help documents / Guide manuals / Roadmap were present before this copy round. | Replaced with operator/operations manuals and implementation roadmap wording in visible footer/i18n copy. |
| P1 | CTA labels | Disallowed CTA labels were checked. | No current matches for `Book a guided demo`, `Trial request`, `Send inquiry`, `Access center`, `Join us`, `Visit community`, or `Career journey`. |

## P2 Polish

- Kept sentence polish limited to visible copy already in the requested files.
- Did not rewrite layouts, add sections, change product architecture, change plan names, or alter legal/email text.

## Grep / Static Results

Fixed-string scans over public source files returned 0 matches for:

```text
閳
鑴
娑
鍟
????
messy supplier work
traffic into measurable value
global SaaS survey distribution platform
survey distribution platform
India-ready
India rollout
Access center
鏉冪泭涓績
Join us
Visit community
Career journey
Book a guided demo
Trial request
Send inquiry
Full topology console
Product loop
supplier quotas
supplier-level quotas
suppliers, quotas, finance and delivery
operating layer
```

Resource-manual content scan returned `traffic content matches=0`.

Resource-manual Chinese content scan returned `liuliang content matches=0`, and fixed-string scan for `流量` returned 0 matches.

Homepage card verification returned `cardCount=5` with the expected EN titles and text:

```text
Projects arrive from different channels
Project setup still takes manual coordination
Supplier allocation depends on manual decisions
Delivery tracking is fragmented
Settlement and reconciliation take too long
```

## Verification Run

```powershell
node "sampora-website-public-v2\qa-evidence\final-audit-static-check.mjs"
# PASS final audit static checks

node "sampora-website-public-v2\qa-evidence\page-layer-static-check.mjs"
# PASS static checks for 8 physical HTML files and 7 absent Chinese legacy redirects

node --check "sampora-website-public-v2\assets\resource-manuals\data.js"
# exit 0

node --check "sampora-website-public-v2\assets\resource-manuals\app.js"
# exit 0

node "sampora-website-public-v2\qa-evidence\resource-manuals-language-smoke.mjs"
# resource manuals language smoke: OK

node "sampora-website-public-v2\qa-evidence\resource-manuals-browser-language-check.mjs"
# resource manuals browser language check: OK

node "sampora-website-public-v2\qa-evidence\page-layer-browser-check.mjs"
# {"status":"PASS","failures":[],"evidence":"qa-evidence/page-layer-browser-evidence.json","screenshots":42}

node "sampora-website-public-v2\qa-evidence\lighthouse-axe-check.mjs"
# {"status":"PASS","axeViolationCount":8,"axeBlockingViolationCount":0}

Read-only review subagent:
# PASS after follow-up Package D fix; initial failure for Chinese `流量` in resource manual article copy was repaired and rechecked.
```

## Skipped / Confirmation Needed

- Footer email domain `jiayu@surveysaas.com` was intentionally left unchanged.
- Legal company name and copyright text were intentionally left unchanged.
- Product architecture and plan names were intentionally left unchanged.
- CTA hrefs, intent parameters, Contact form endpoint/hidden fields, topology SVG, workflow timing, QA scripts, and Lighthouse/axe scripts were intentionally left unchanged.

## Versioned Deliverables

- `sampora-website-public-v2/`
- `sampora-website-public-v2.zip` SHA-256: `2D6D1525333CE55730419EDD64EA13EF659A848AA121F42D28BA866D6238CD1B`
- `sampora-website-handoff-v2.zip`

The initial copy-only repair changed files under `v1`; this was corrected by promoting the repaired package to `v2` and rebuilding versioned public/handoff zips.

Public v2 zip inspection: 233 entries, 0 backslash entries, 8 root HTML files, 0 non-ASCII HTML entries, 0 parent-prefix entries, and source-vs-zip comparison found 233 files, 0 missing, 0 extra.

## Blocked Items

None.
