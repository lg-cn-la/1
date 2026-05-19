# Sampora Acceptance Tests

> Regression contract for Sampora repair work. This file defines what "accepted" means. It is not a customer delivery document.

## How To Use This File

- Read this file during the default repair intake gate, before editing website files.
- Map every requested failure to an acceptance category below.
- Check `ISSUE_LEDGER.md` for recurring issue IDs, current statuses, and allowed actions before classifying repeated audit findings.
- When the user provides a GPT/web-audit repair list, Markdown issue list, or checklist, verify each item against current files before repair. Normalize each list item into: acceptance category, existing coverage, coverage gap, owner package, issue status, red check, and completion check.
- Produce a concise issue status table before edits when an issue list is supplied. Do not use the issue list itself as proof.
- For long or multi-package lists, first-pass verification may be delegated to read-only verification subagents. They may gather evidence and recommend statuses, but the controller/main agent must merge the reports and decide the final issue status before repair.
- After dispatching subagents, the controller must not wait idly when independent work remains. Once a subagent has clear scope, file ownership, allowed actions, and `Done when` checks, the controller should continue with the next non-blocking verification, dispatch, docs, or review task, or return control so the client can deliver the next queued user comment. Do not keep the same turn open only to poll a subagent. Wait/check only when the next action depends on a returned result, unclear scope, cross-package write overlap, dependency-layer ordering, a long silence suggests a stuck/dead subagent, or closure/reassignment is needed. When one or more completion reports arrive in the current context, close them out immediately: read reports, close agents, classify PASS/FAIL/BLOCKED, record or prepare handoff updates, decide whether review is needed, continue non-conflicting confirmed dispatch, and include active/running/completed-processed agent state in controller status/final output.
- Final review should also be delegated to a read-only review subagent whenever subagents are available. The controller's final-review role is to inspect the review report for obvious evidence gaps, incorrect scope, status mistakes, contradictions, or owner-package errors; the controller should rerun verification directly only when the report is missing required proof, is internally inconsistent, conflicts with current evidence, or the user explicitly asks.
- Visible copy changes are multilingual by default. Any changed page text, translation key, dynamic project/sample data, card, CTA, FAQ, pricing, workflow/topology label, footer, or hero proof copy must be updated across EN/ZH/HI primary source data in the same task. A single-language repair is accepted only when the user's newest instruction explicitly limits scope; the worker and reviewer must record that exception and list the deferred languages.
- Active handoff docs must separate current instructions from historical evidence. Mojibake-looking samples are allowed only in `SAMPORA_LATEST_REPAIR_LOG.md` or clearly labeled historical evidence, never as unlabeled current handoff instructions or current page/source content.
- Standard flow: issue intake -> issue-ledger check -> status table -> status-based action -> Package A/B/C/D/E file scope -> validation tier. Only `[CONFIRMED]` can repair page/source files; uncertainty stays `[VERIFY-FIRST]`; strategy stays docs/QA/packaging; final delivery uses full five-layer validation.
- If a new visual, business-path, language, motion, legal, or packaging failure is not covered here, add a new acceptance item before or alongside the repair.
- Prefer an automated script or grep command for every acceptance item. If automation is not practical yet, mark the item as "coverage needed" and describe the manual/browser check.
- A repair is not complete until the relevant acceptance checks pass and the final controller verification has been rerun.

## Core Acceptance Commands

Run these before delivery claims:

```powershell
node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"
node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"
node --check "sampora-website-public-v3\assets\i18n-sweep.js"
node --check "sampora-website-public-v3\assets\resource-manuals\data.js"
node --check "sampora-website-public-v3\assets\resource-manuals\app.js"
node "sampora-website-public-v3\qa-evidence\resource-manuals-language-smoke.mjs"
node "sampora-website-public-v3\qa-evidence\resource-manuals-browser-language-check.mjs"
node "sampora-website-public-v3\qa-evidence\page-layer-browser-check.mjs"
node "sampora-website-public-v3\qa-evidence\lighthouse-axe-check.mjs"
```

These commands are the full delivery baseline, not a requirement for every scoped worker task. Use the validation scope below to choose the smallest check set that proves the mapped acceptance category without creating duplicate work.

## Validation Scope

| Tier | Use When | Required Proof |
|---|---|---|
| Scoped check | Single-package, docs-only, or clearly bounded fixes. | The mapped red check and completion check for touched files/categories only. Example: README or redirect policy does not require topology motion sampling; contact-only edits focus on contact form, CTA/intent, hidden fields, and relevant i18n checks. |
| Full regression for affected contract | Shared contracts change, such as i18n sweep, footer/legal, CTA policy, shared header/nav, cross-page CSS, QA scripts, or common assets. | All affected pages/contracts are checked for the changed surface. Add browser checks when the shared behavior is runtime-visible. |
| Full five-layer validation | Final delivery claims, zip rebuilds, broad cross-package repair rounds, or changes touching multiple acceptance categories. | Core acceptance commands, delivery/source comparison when relevant, Lighthouse/axe, and zip inspection. |

Old reports, old screenshots, and old QA JSON are not current proof. Use them only to select scoped checks or trace history.

Zip acceptance after source checks pass:

- Current public and handoff deliverables must use the repair iteration suffix: `sampora-website-public-v3/`, `sampora-website-public-v3.zip`, `sampora-website-handoff-v3.zip`, then `v4`, `v5`, and so on for later repair iterations. If the user does not specify a version, choose the next unused suffix.
- Zip entries must use forward slashes, with 0 backslash entries.
- Public zip must contain repaired HTML, QA scripts, `lighthouse-output.json`, `axe-output.json`, and `README.md`.
- Public zip must not contain physical Chinese legacy redirect HTML files: `首页.html`, `产品.html`, `解决方案.html`, `资源中心.html`, `资源-跳转页面.html`, `版本方案.html`, or `联系我们.html`.
- Handoff zip must contain current handoff docs, `ISSUE_LEDGER.md`, and `redirect-map.md`.
- Final delivery notes must name the exact versioned artifact paths and SHA-256 hashes. Unversioned names are workspace convenience only, not upload/handoff targets after a repair iteration.

## Issue Status Tags

Use these tags before any repair action:

| Status | Required Proof | Allowed Action |
|---|---|---|
| `[CONFIRMED]` | Current file/script/browser evidence proves the issue exists and maps to an acceptance category plus owner package. | Repair the assigned source or docs, then rerun the mapped acceptance check. |
| `[VERIFY-FIRST]` | The issue is plausible but not proven in the current workspace. | Only add/run scoped tests, static checks, greps, or browser verification. Reclassify before repair. |
| `[STRATEGY]` | The item concerns docs, redirect/deployment policy, packaging strategy, acceptance coverage, or handoff workflow. | Edit only the related docs, QA policy, packaging policy, or handoff/acceptance files. Do not change page behavior. |
| `[REGRESSION]` | The item is a standing guard that must be rerun, but current evidence has not shown failure. | Verify and record PASS/FAIL only. If it fails, reclassify as `[CONFIRMED]` before repair. |
| `[REMOVED]` | Current files or package evidence show the historical issue no longer exists. | Do not repair or restore it. Keep evidence only if useful for handoff. |
| `[OUT-OF-SCOPE]` | The item is not in the latest audit/newest user message, or it needs an unassigned area. | Do not repair. Record why it is out of scope. |
| `[BLOCKED]` | The item lacks owner/acceptance mapping, is ambiguous, or cannot be verified from this workspace. | Stop and ask only for the missing information. |

## Acceptance Matrix

| Category | Acceptance Items | Current Coverage |
|---|---|---|
| Scope | Only latest-audit or newest-user-message items are changed. Unmentioned content is out of scope. Only `[CONFIRMED]` items receive page/source repairs; `[VERIFY-FIRST]` is verification-only until proven; `[STRATEGY]` is docs/QA/packaging policy only; `[REGRESSION]` is verify-only until it fails; `[REMOVED]` is no-repair/no-restore. Each implementation task must include a concrete `Done when` checklist. After subagent dispatch, the controller must keep moving on clear non-blocking work or return control for the next queued user comment instead of waiting idly; it should check subagent status only when blocked, after long silence, or for closure/reassignment. When completion reports arrive in the current context, the controller must immediately process and close them, classify PASS/FAIL/BLOCKED, record or prepare handoff updates, handle same-file write conflicts as blockers, continue non-conflicting confirmed dispatch, and report active/running/completed-processed agent state. Final review should be delegated to a read-only review subagent; the controller sanity-checks the report for gaps/errors instead of redoing all verification by default. | `AGENTS.md` + handoff intake gate; read-only verification subagent reports for long lists; issue status table; reviewer must inspect scoped diffs and `Done when` evidence; controller sanity-check of read-only review report; handoff/controller scheduling and completion-closeout rule. |
| Legal/footer | No `嘉育`, `皖ICP备`, `ICP No.`, `Wan ICP No.`, `[CONFIRM_ICP_NUMBER]`, or unexpected ICP wording. Company names are `安徽省嘉禹企业服务有限公司` and `Anhui Jiayu Enterprise Service Co., Ltd.`. Footer company info is consistent across canonical pages and i18n sweep. | `final-audit-static-check.mjs`; full-source grep required for new legal failures. |
| Forbidden copy | No `????`, `India-ready`, `India rollout`, `Access center`, `Join us`, `Visit community`, `Career journey`, `global SaaS survey distribution platform`, `traffic value`, `traffic into measurable value`, stale backend-evidence wording, or generic resource manual steps. | `final-audit-static-check.mjs`, `page-layer-static-check.mjs`, resource manual smoke checks. |
| CTA policy | Allowed conversion labels are `Start trial`, `Book a demo`, `Contact sales`, `Talk to sales`, and contact-form `Submit request`. Conversion CTAs must route to `contact.html` with the required `intent`, except same-page non-conversion anchors such as manuals navigation. | Partially covered by static/browser checks; coverage needed for strict label allowlist and all conversion CTA intent classification. |
| Contact backend readiness | Contact form has `method="post"`, `action="[BACKEND_CONTACT_ENDPOINT]"`, `data-endpoint="[BACKEND_CONTACT_ENDPOINT]"`, hidden `intent`, `source_page`, `source_section`, `plan`, `lang`, URL-param parsing, `fetch()`, backend success-only success state, and placeholder/failure pending state. | `final-audit-static-check.mjs`, `page-layer-browser-check.mjs`; behavior check required after contact edits. |
| Homepage hero | Desktop hero is not squeezed at 1200/1440/1536/1920, text column does not become a narrow vertical stack, console/topology is large enough, `.hero-copy::after` is disabled, and hero CTA routing is correct. | `final-audit-static-check.mjs`, `page-layer-browser-check.mjs`; visual screenshots retained in `qa-evidence`. |
| Workflow motion | Workflow progresses across Step 01 -> 02 -> 03 -> 04 within 6 seconds. No early `return` stops the timer loop. | `final-audit-static-check.mjs`, `page-layer-browser-check.mjs`. |
| Topology motion | Active flow has `animationName !== none`; `strokeDashoffset` changes over time; active packets are visible or moving where packet primitives exist. Highlight-only scan/sheen overlays are optional: if the current handoff records that `.topo-scan` or console sheen was intentionally disabled by user request, validate retained line/packet/ticker motion instead and do not treat that overlay's `animationName: none` as a repair item. Do not validate motion by screenshots alone. | `page-layer-browser-check.mjs` plus scoped browser sampling; update browser guards when user-approved highlight-disable exceptions are present. |
| Topology/modal details | Topology modal close control must display `X`; homepage topology keeps the Sampora/S product mark; language switches must not remove topology controls or mark. | Coverage needed unless added to browser checks; manual browser check required for related edits. |
| Language/i18n | EN/ZH/HI switching leaves hero/title content non-empty, no `????`, no mojibake-looking text, no old positioning copy, footer legal remains current, CTA hrefs remain valid, and resource manuals show real Chinese and natural Hinglish/Devanagari or English fallback. Any visible-copy change must update the corresponding EN/ZH/HI primary fallback, translation-object, and dynamic data entries together unless the newest user instruction explicitly grants a single-language exception. Terminology-sensitive copy must comply with `SAMPORA_TERMINOLOGY_GLOSSARY.md`, including canonical Chinese role terms, Devanagari-first Hindi style, allowed retained SaaS/industry English, and topology-node localization policy. `projects.zh = projects.en`, `projects.hi = projects.en`, copied-through English in ZH/HI surfaces, stale untranslated counterpart strings, glossary conflicts, or relying only on `i18n-sweep.js` are failures for changed surfaces. | Resource manual language checks and page-layer browser checks; scoped copy checks must compare changed keys/surfaces across EN/ZH/HI and against `SAMPORA_TERMINOLOGY_GLOSSARY.md`; coverage needed for all canonical-page hero/footer/modal assertions and dynamic project/sample data parity. |
| Navigation/sticky | Canonical pages keep consistent nav/header spacing. On scroll, the top status strip must collapse or move out of the viewport so the main `.mast` navigation is the visible top chrome; returning to the top restores the status strip. | `page-layer-browser-check.mjs` records `evidence.sticky` for index, solutions, resources, resource-manuals, plans, and contact at 1440px; scoped browser checks should assert `.mast` remains measurable and visible after scroll and status does not occupy the viewport top. |
| Docs/redirects | README, deployment notes, and redirect map agree: public deploy package ships English canonical pages plus English redirect files only. Chinese legacy routes are server/CDN rewrite rules, not physical public-root HTML files, because filenames can become mojibake. Docs must not claim final/browser QA passed unless freshly rerun. Active handoff must stay short and current: bulky historical update-log entries and mojibake-looking samples belong in `SAMPORA_LATEST_REPAIR_LOG.md` under a dated archive heading, while active docs may only summarize them as historical evidence. Current page/source files and active handoff notes must not contain unlabeled `????`, replacement characters, or known historical mojibake markers. | `final-audit-static-check.mjs`; Package E scoped grep in handoff log; rerun docs grep after docs edits; `active-handoff-mojibake-guard.mjs` for active/archive boundary when present. |
| Accessibility/performance | Lighthouse/axe must be run after final source changes. Blocking axe violations must be 0. Non-blocking axe findings must be reported honestly. | `lighthouse-axe-check.mjs`. |
| Packaging | Delivery public directory is synced from current public source. Zips are rebuilt after verification and inspected for path format, repaired file inclusion, and absence of physical Chinese legacy redirect HTML files in public source/package. Every repair iteration uses versioned public directory and zip artifacts (`v1`, `v2`, ...), and the final response identifies exact paths plus SHA-256 hashes. | Controller zip inspection required; `final-audit-static-check.mjs` checks public source absence; versioned artifact inspection and hash reporting required for delivery. |

## New Failure Protocol

When a new issue is found:

1. Add or update an acceptance item in this file.
2. Identify the existing script/grep/browser check that will catch it.
3. If no check exists, add a "coverage needed" note and, when practical, add or update a QA script before repairing.
4. Run the check so it fails or proves the current state.
5. For long or multi-package lists, use read-only verification subagents to gather first-pass evidence while preserving package boundaries.
6. Check `ISSUE_LEDGER.md` for matching stable IDs and carry forward the current status unless fresh evidence changes it.
7. Classify the issue with an issue status tag and include it in the issue status table.
8. Follow dependency order when several issue types are present: packaging/redirect first, global i18n/footer/CTA second, contact/intent third, topology/workflow fourth, and SEO/Lighthouse/axe/delivery/final acceptance last.
9. Before implementation, state `Done when` conditions that name the exact command, grep, browser assertion, visual assertion, or package inspection required for completion.
10. For visible-copy changes, include EN/ZH/HI counterpart updates in the implementation scope and `Done when` checks unless the newest user message explicitly grants a single-language exception. The check must include fallback HTML, translation objects, and dynamic data objects for the touched surface.
11. Repair only `[CONFIRMED]` items in assigned package files. Use `[VERIFY-FIRST]` only for verification work, `[STRATEGY]` only for docs/QA/packaging policy, `[REGRESSION]` only as a guard until it fails, and `[REMOVED]` as no-repair/no-restore.
12. Rerun the acceptance check at the validation tier required by the change scope.
13. Delegate final review to a read-only review subagent when available. The controller checks the report for missing proof, obvious contradictions, out-of-scope failures, status mistakes, and owner-package errors before making a delivery claim.
14. Output scoped diff summary and fresh evidence.
15. Record the pitfall in `SAMPORA_LATEST_REPAIR_HANDOFF.md` or detailed history in `SAMPORA_LATEST_REPAIR_LOG.md`, and update `ISSUE_LEDGER.md` when a recurring issue status changes.

## Gaps To Convert Into Scripts

These items are accepted requirements but need stronger scripted coverage:

- Strict CTA visible-label allowlist and conversion intent classification.
- Modal close button text is exactly `X` across topology/modal surfaces.
- Homepage topology retains the Sampora/S product mark after language switches.
- EN/ZH/HI hero and footer checks across all six canonical pages, not only Resource Manuals.
- Scripted detection that visible-copy changes updated matching EN/ZH/HI keys and dynamic project/sample data, instead of leaving copied-through English or stale counterpart language objects.
- Footer legal text consistency across every canonical page after i18n sweep runs.
- `page-layer-browser-check.mjs` should distinguish required topology business motion from user-approved highlight-only scan/sheen disables, so intentional `topo-scan` removal does not appear as a false failure.
- Active handoff/archive boundary guard should remain conservative and no-write: fail on unlabeled mojibake markers in current handoff/page source, but allow dated archive sections in `SAMPORA_LATEST_REPAIR_LOG.md` to preserve historical evidence.
