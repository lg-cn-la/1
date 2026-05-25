# Sampora Acceptance Tests

> Regression contract for Sampora repair work. This file defines what "accepted" means. It is not a customer delivery document.

## How To Use This File

- Read this file during the default repair intake gate, before editing website files. Since 2026-05-22 it is a reference contract, not a default final-acceptance gate, unless the user explicitly asks for acceptance, review, screenshots, browser proof, packaging, or final delivery validation.
- Current user override: ordinary Sampora repair rounds must not run default first-pass verification workers, visual acceptance reviewers, final-review subagents, browser screenshot acceptance, or full acceptance reruns. A current user screenshot or direct visual complaint is enough current complaint evidence for scoped repair. If no acceptance/review was explicitly requested and run, final reports must say `not acceptance-reviewed` / `未做验收` instead of claiming PASS.
- Use the intake file index in `AGENTS.md` and `SAMPORA_LATEST_REPAIR_HANDOFF.md` before classifying or dispatching work, so supporting handoff docs such as terminology, redirect, public-package QA, and archive/reference files are not missed.
- Treat the current assistant/new agent as the controller by default for Sampora repairs. The controller orchestrates intake, issue-status decisions, package/file ownership, subagent dispatch when useful, conflict handling, concise evidence synthesis, and handoff records. Do not dispatch first-pass verification, visual acceptance review, or final read-only review by default.
- The controller may perform docs/process governance edits when the task is handoff, acceptance, ledger, or intake policy. It may run minimal sanity checks to prevent syntax breakage, destructive edits, or ownership mistakes, but must not turn those checks into a final acceptance gate unless the user asks.
- Map every requested failure to an acceptance category below.
- Check `ISSUE_LEDGER.md` for recurring issue IDs, current statuses, and allowed actions before classifying repeated audit findings.
- When the user provides a GPT/web-audit repair list, Markdown issue list, or checklist, verify each item against current files before repair. Normalize each list item into: acceptance category, existing coverage, coverage gap, owner package, issue status, red check, and completion check.
- Produce a concise issue status table before edits when an issue list is supplied. Do not use the issue list itself as proof.
- Do not delegate first-pass verification by default. Use read-only verification subagents only when the user explicitly asks for verification/review, the issue is ambiguous enough to block editing, or the controller cannot map ownership safely.
- Implementation subagent prompts must include the relevant required files and rules directly, including `AGENTS.md`, this acceptance contract, the active handoff, matching ledger rows, glossary/terminology files when relevant, assigned file ownership, out-of-scope files, allowed action, `Done when` checks, handoff-log requirements, and visual/multilingual review requirements for affected surfaces.
- Implementation subagents must use short write locks: before an actual file write, check the latest handoff/current diff for active or recent overlapping ownership of the same file/selector/function, announce the exact file and scoped region to be written, and stop as `[BLOCKED: overlapping write ownership]` if overlap exists. Release the write lock immediately after the file write completes; verification and review remain read-only and do not hold the lock.
- After dispatching subagents, the controller must not wait idly when independent work remains. Once a subagent has clear scope, file ownership, allowed actions, and `Done when` checks, the controller should continue with the next non-blocking verification, dispatch, docs, or review task, or return control so the client can deliver the next queued user comment. Do not keep the same turn open only to poll a subagent. Wait/check only when the next action depends on a returned result, unclear scope, cross-package write overlap, dependency-layer ordering, a long silence suggests a stuck/dead subagent, or closure/reassignment is needed. When one or more completion reports arrive in the current context, close them out immediately: read reports, close agents, classify PASS/FAIL/BLOCKED, record or prepare handoff updates, decide whether review is needed, continue non-conflicting confirmed dispatch, and include active/running/completed-processed agent state in controller status/final output.
- Final review and UI visual acceptance review are disabled by default. Delegate them only when the user explicitly asks for review, acceptance, screenshots, browser proof, packaging, or final delivery validation.
- Visible copy changes are active-language synchronized by default. Active language support is EN/ZH; Hindi/`hi` locale support is decommissioned unless the user explicitly reintroduces it. Any changed page text, translation key, dynamic project/sample data, card, CTA, FAQ, pricing, workflow/topology label, footer, or hero proof copy must be updated across EN/ZH primary source data in the same task. A single-language repair is accepted only when the user's newest instruction explicitly limits scope; the worker and reviewer must record that exception and list the deferred active language.
- Visual acceptance / 视觉验收 is disabled by default for ordinary Sampora repair rounds. Run it only when explicitly requested by the user's newest message.
- Do not claim `technical/static PASS`, `runtime geometry PASS`, `visual acceptance PASS`, or `real visual perception PASS` unless that exact check was explicitly requested and actually run.
- Active handoff docs must separate current instructions from historical evidence. Mojibake-looking samples are allowed only in `SAMPORA_LATEST_REPAIR_LOG.md` or clearly labeled historical evidence, never as unlabeled current handoff instructions or current page/source content.
- Standard flow: issue intake -> issue-ledger check -> status table -> status-based action -> Package A/B/C/D/E file scope -> validation tier. Only `[CONFIRMED]` can repair page/source files; uncertainty stays `[VERIFY-FIRST]`; strategy stays docs/QA/packaging; final delivery uses full five-layer validation.
- If a new visual, business-path, language, motion, legal, or packaging failure is not covered here, add a new acceptance item before or alongside the repair.
- Prefer an automated script or grep command for every acceptance item. If automation is not practical yet, mark the item as "coverage needed" and describe the manual/browser check.
- An ordinary repair round can be handed back after the scoped edit and any smallest useful mechanical checks. If acceptance/final review was not explicitly requested and run, report it as not acceptance-reviewed instead of blocking the handoff.

## Core Acceptance Commands

Run these before delivery claims:

```powershell
node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"
node "sampora-website-public-v3\qa-evidence\language-layer-structure-check.mjs"
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

Visual/UI acceptance is not part of the default scoped repair tier anymore. If the user explicitly asks for acceptance, review, screenshots, browser proof, or final delivery validation, then collect the requested evidence and report it honestly. Otherwise, repair the named surface and state that final visual acceptance was not run.

Zip acceptance after source checks pass:

- Current public and handoff deliverables must use the repair iteration suffix: `sampora-website-public-v3/`, `sampora-website-public-v3.zip`, `sampora-website-handoff-v3.zip`, then `v4`, `v5`, and so on for later repair iterations. If the user does not specify a version, choose the next unused suffix.
- Zip entries must use forward slashes, with 0 backslash entries.
- Public zip must contain repaired HTML, QA scripts, `lighthouse-output.json`, `axe-output.json`, and `README.md`.
- Public zip must not contain standalone legacy redirect HTML files such as `products.html`, `pricing.html`, `about_sampora_issues_fixed.html`, `首页.html`, `产品.html`, `解决方案.html`, `资源中心.html`, `资源-跳转页面.html`, `版本方案.html`, or `联系我们.html`.
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
| `[BLOCKED: overlapping write ownership]` | Another active or recent implementation owner covers the same file, selector, section, or function during the intended write window. | Do not edit, merge, or overwrite. Report the overlap to the controller; read-only verification may continue if it does not require writes. |

## Acceptance Matrix

Short write-lock coverage is part of Scope acceptance. Implementation workers must hold a write lock only during the actual write operation, release it immediately after writing, and continue verification read-only. Overlapping same-file/selector/function writers are blockers, not merge tasks.

| Category | Acceptance Items | Current Coverage |
|---|---|---|
| Scope | Only latest-audit or newest-user-message items are changed. Unmentioned content is out of scope. Only `[CONFIRMED]` items receive page/source repairs; direct current user screenshots/comments count as complaint evidence for scoped repair. Do not dispatch first-pass verification, visual acceptance review, or final review by default. Use implementation subagents when useful, keep write ownership disjoint, and close completed reports without creating a new review loop. | `AGENTS.md` + handoff intake gate + required file index; implementation worker scoped `Done when`; controller concise handoff. If no acceptance/review was run, report `not acceptance-reviewed` / `未做验收`. |
| Legal/footer | No `嘉育`, `皖ICP备`, `ICP No.`, `Wan ICP No.`, `[CONFIRM_ICP_NUMBER]`, or unexpected ICP wording. Company names are `安徽省嘉禹企业服务有限公司` and `Anhui Jiayu Enterprise Service Co., Ltd.`. Footer company info is consistent across canonical pages and i18n sweep. Legal support pages must keep homepage-style footer layout, distinct page-specific titles/status/eyebrows, current footer legal link marked with `aria-current="page"`, public legal status-bar copy, and no internal delivery status text such as `Delivery workflow / Live`, `Minimal production handoff`, `交付工作流 / 在线`, or `最小生产交付包`. | `final-audit-static-check.mjs`, `legal-pages-distinct-check.mjs`; full-source grep required for new legal failures. |
| Forbidden copy | No `????`, `India-ready`, `India rollout`, `Access center`, `Join us`, `Visit community`, `Career journey`, `global SaaS survey distribution platform`, `traffic value`, `traffic into measurable value`, stale backend-evidence wording, or generic resource manual steps. | `final-audit-static-check.mjs`, `page-layer-static-check.mjs`, resource manual smoke checks. |
| CTA policy | Allowed conversion labels are `Start trial`, `Book a demo`, `Contact sales`, `Talk to sales`, and contact-form `Submit request`. Conversion CTAs must route to `contact.html` with the required `intent`, except same-page non-conversion anchors such as manuals navigation. | Partially covered by static/browser checks; coverage needed for strict label allowlist and all conversion CTA intent classification. |
| Contact backend readiness | Contact form has `method="post"`, consistent `action` + `data-endpoint` + script `CONTACT_ENDPOINT`, and current live Apps Script endpoint wiring. Hidden context includes `intent`, `source_page`, `source_section`, `plan`, `lang`, `landing_page`, `referrer`, `utm_source`, `utm_medium`, and `utm_campaign`; honeypot `website` remains present. Submit flow keeps URL-param parsing, `fetch()`, inline `aria-live` feedback, backend success-only success state, failure preservation, no thank-you redirect, and no input clearing unless the real endpoint returns success. | `final-audit-static-check.mjs`, `page-layer-browser-check.mjs`, `contact-submit-feedback-check.mjs`; behavior check required after contact edits. |
| Homepage hero | Desktop hero is not squeezed at 1200/1440/1536/1920, text column does not become a narrow vertical stack, console/topology is large enough, `.hero-copy::after` is disabled, and hero CTA routing is correct. | `final-audit-static-check.mjs`, `page-layer-browser-check.mjs`; visual screenshots retained in `qa-evidence`. |
| Hero eyebrow alignment | Product, Solutions, and Resources desktop hero eyebrow / intro labels align with the top border of the paired topology or console graphic at 1314x1270 and 1440x900, with a noticeably open eyebrow-to-title gap, while EN/ZH desktop and 390px mobile checks keep document horizontal overflow at 0. | Scoped browser geometry for `index.html`, `solutions.html`, and `resources.html` across EN/ZH; static guards after scoped CSS changes. |
| Homepage role scenarios layout | In `index.html` `#customers` / Role scenarios, each role-card `.impact` workflow line stays pinned to a consistent tight bottom position on desktop, card internals redistribute vertical space so shorter cards are not top-clustered, and EN/ZH desktop/mobile checks have no document or role-card text horizontal overflow. | Scoped browser geometry at 1280x1270, 1440x900, and 390x900 for EN/ZH; static guards after scoped CSS changes. |
| Homepage final CTA layout | In `index.html` `#contact .final-cta`, the left card keeps clear spacing from eyebrow to title, even vertical rhythm across title/body/steps/buttons, minimal desktop bottom gap below the buttons, preserved CTA hrefs, and no reintroduced `margin-top:auto` or `justify-content: space-between` on the left stack. The right FAQ panel keeps three equal-height FAQ items with wrapping. EN/ZH desktop and mobile geometry checks must show no horizontal overflow. | Scoped browser geometry for EN/ZH desktop and 390px mobile after final CTA changes; source grep for CTA hrefs, absence of forbidden left-stack auto/space-between rules, and FAQ equal-row CSS. |
| Plans matrix layout | `plans.html` pricing matrix wrapper is centered with balanced desktop/tablet side whitespace while mobile keeps no document horizontal overflow and preserves horizontal scrolling inside `.matrix-wrap`. | Scoped browser geometry at 1280/1440/1750 and 390; static guards after scoped CSS changes. |
| Workflow motion | Workflow progresses across Step 01 -> 02 -> 03 -> 04 within 6 seconds. No early `return` stops the timer loop. | `final-audit-static-check.mjs`, `page-layer-browser-check.mjs`. |
| Topology motion | Active flow has `animationName !== none`; `strokeDashoffset` changes over time; active packets are visible or moving where packet primitives exist. Highlight-only scan/sheen overlays are optional: if the current handoff records that `.topo-scan` or console sheen was intentionally disabled by user request, validate retained line/packet/ticker motion instead and do not treat that overlay's `animationName: none` as a repair item. Do not validate motion by screenshots alone. | `page-layer-browser-check.mjs` plus scoped browser sampling; update browser guards when user-approved highlight-disable exceptions are present. |
| Topology/modal details | Topology modal close control must display `X`; homepage topology keeps the Sampora/S product mark; language switches must not remove topology controls or mark. | Coverage needed unless added to browser checks; manual browser check required for related edits. |
| Language/i18n | Active language support is EN/ZH. EN/ZH switching leaves hero/title content non-empty, no `????`, no mojibake-looking text, no old positioning copy, footer legal remains current, CTA hrefs remain valid, and resource manuals show real Chinese. Stale `hi`, `?lang=hi`, or `localStorage.sampora_lang=hi` must fall back to English and must not expose a Hindi button, Hindi dictionary, Hindi QA case, Hindi screenshot target, or `documentElement.lang='hi'`. Any visible-copy change must update the corresponding EN/ZH primary fallback, translation-object, and dynamic data entries together unless the newest user instruction explicitly grants a single-language exception. Terminology-sensitive copy must comply with `SAMPORA_TERMINOLOGY_GLOSSARY.md`, including canonical Chinese role terms and topology-node policy. `projects.zh = projects.en`, copied-through English in ZH surfaces, stale untranslated counterpart strings, glossary conflicts, post-main language patches such as `Object.assign(translations.zh, ...)`, `Object['assign'](HERO_UI.zh, ...)`, `COPY['zh'].foo = ...`, or relying only on `i18n-sweep.js` are failures for changed surfaces. | `language-layer-structure-check.mjs` guards against normal, bracketed, and obfuscated post-main language patch layers on primary page data objects; resource manual language checks and page-layer browser checks cover EN/ZH runtime surfaces. Scoped copy checks must compare changed keys/surfaces across EN/ZH and against `SAMPORA_TERMINOLOGY_GLOSSARY.md`; coverage still needed for all canonical-page hero/footer/modal assertions and deeper dynamic project/sample semantic parity. |
| Visual acceptance | Disabled by default for ordinary Sampora repair rounds. Run only when the user's newest message explicitly asks for acceptance, review, screenshots, browser proof, or final delivery validation. Current user screenshots/direct complaints are enough complaint evidence for scoped repair and must not be routed back into a default verification queue. | Do not claim `technical/static PASS`, `runtime geometry PASS`, `visual acceptance PASS`, or `real visual perception PASS` unless that exact check was requested and actually run. If no final acceptance was run, report `not acceptance-reviewed` / `未做验收`. |
| Header brand visual parity | Use only when the user explicitly asks for header/logo/brand visual review or final delivery validation. Otherwise, treat direct user screenshots/comments as scoped repair input and do not run a default visual parity acceptance loop. | Optional checks, when explicitly requested: `node "sampora-website-public-v3\qa-evidence\header-consistency-check.mjs"` and `node "sampora-website-public-v3\qa-evidence\header-brand-visual-check.mjs"`. Do not claim PASS unless run. |
| Visual boundary geometry | Auxiliary only, not a default gate. Use for section/footer boundary repairs only when explicitly requested or when a small mechanical check is needed after editing. Current user screenshots/direct complaints should go straight to scoped repair. | Optional check: `node "sampora-website-public-v3\qa-evidence\visual-boundary-geometry-check.mjs"`. Do not claim runtime/visual PASS unless run. |
| Navigation/sticky | Canonical pages and legal support pages keep consistent nav/header spacing. On scroll, the top status strip must collapse or move out of the viewport so the main `.mast` navigation is the visible top chrome; returning to the top restores the status strip. | `page-layer-browser-check.mjs` records `evidence.sticky` for index, solutions, resources, resource-manuals, plans, and contact at 1440px; `legal-pages-distinct-check.mjs` covers legal support-page status collapse; scoped browser checks should assert `.mast` remains measurable and visible after scroll and status does not occupy the viewport top. |
| Docs/redirects | README, deployment notes, redirect map, and backend route handoff agree: public deploy package ships the seven real content pages plus approved support pages `404.html`, `privacy.html`, `cookie-policy.html`, and `terms.html` in the public root. Legacy product, pricing, old About filename, and Chinese routes are backend/CDN-managed 301 redirects, not physical public-root HTML files. Docs must not claim final/browser QA passed unless freshly rerun. Active handoff must stay short and current: bulky historical update-log entries and mojibake-looking samples belong in `SAMPORA_LATEST_REPAIR_LOG.md` under a dated archive heading, while active docs may only summarize them as historical evidence. Current page/source files and active handoff notes must not contain unlabeled `????`, replacement characters, or known historical mojibake markers. | `final-audit-static-check.mjs`; Package E scoped grep in handoff log; rerun docs grep after docs edits; `active-handoff-mojibake-guard.mjs` for active/archive boundary when present. |
| Accessibility/performance | Lighthouse/axe must be run after final source changes. Blocking axe violations must be 0. Non-blocking axe findings must be reported honestly. | `lighthouse-axe-check.mjs`. |
| Packaging | Delivery public directory is synced from current public source. Zips are rebuilt after verification and inspected for path format, repaired file inclusion, and absence of standalone legacy redirect HTML files in public source/package. Every repair iteration uses versioned public directory and zip artifacts (`v1`, `v2`, ...), and the final response identifies exact paths plus SHA-256 hashes. | Controller zip inspection required; `final-audit-static-check.mjs` checks public source absence; versioned artifact inspection and hash reporting required for delivery. |

## New Failure Protocol

When a new issue is found:

1. Add or update an acceptance item in this file.
2. Identify the existing script/grep/browser check that will catch it.
3. If no check exists, add a "coverage needed" note and, when practical, add or update a QA script before repairing.
4. Run a check before repair only when the issue is not already backed by a current user screenshot/direct complaint and the check is needed to locate ownership safely.
5. Do not use read-only verification subagents by default. Use them only when explicitly requested, ambiguous ownership blocks editing, or packaging/final delivery validation is requested.
6. Check `ISSUE_LEDGER.md` for matching stable IDs and carry forward the current status unless fresh evidence changes it.
7. Classify the issue with an issue status tag and include it in the issue status table.
8. Follow dependency order when several issue types are present: packaging/redirect first, global i18n/footer/CTA second, contact/intent third, topology/workflow fourth, and SEO/Lighthouse/axe/delivery/final acceptance last.
9. Before implementation, state scoped `Done when` conditions focused on files to change, files to leave untouched, and the smallest useful mechanical check if any.
10. For visible-copy changes, include EN/ZH counterpart updates in the implementation scope and `Done when` checks unless the newest user message explicitly grants a single-language exception. The check must include fallback HTML, translation objects, and dynamic data objects for the touched surface. Do not add or repair Hindi counterparts unless Hindi support is explicitly reintroduced.
11. For visual/UI changes, do not require `technical/static PASS`, `runtime geometry PASS`, `visual acceptance PASS`, or `real visual perception PASS` unless the user's newest message explicitly asks for those checks.
12. Repair only `[CONFIRMED]` items in assigned package files. Use `[VERIFY-FIRST]` only for verification work, `[STRATEGY]` only for docs/QA/packaging policy, `[REGRESSION]` only as a guard until it fails, and `[REMOVED]` as no-repair/no-restore.
13. Run only the smallest useful mechanical checks unless the user requested acceptance/review/final delivery validation.
14. Do not delegate final review or UI visual acceptance review unless explicitly requested.
15. Output scoped diff summary, commands actually run if any, known remaining risk, untouched files, and whether final acceptance/review was not run.
16. Record the pitfall in `SAMPORA_LATEST_REPAIR_HANDOFF.md` or detailed history in `SAMPORA_LATEST_REPAIR_LOG.md`, and update `ISSUE_LEDGER.md` when a recurring issue status changes.

## Gaps To Convert Into Scripts

These items are accepted requirements but need stronger scripted coverage:

- Strict CTA visible-label allowlist and conversion intent classification.
- Modal close button text is exactly `X` across topology/modal surfaces.
- Homepage topology retains the Sampora/S product mark after language switches.
- EN/ZH hero and footer checks across all six canonical pages, not only Resource Manuals.
- Broader scripted detection that visible-copy changes updated matching EN/ZH keys and dynamic project/sample data semantically, beyond the current post-main language-layer guard.
- Footer legal text consistency across every canonical page after i18n sweep runs.
- `page-layer-browser-check.mjs` should distinguish required topology business motion from user-approved highlight-only scan/sheen disables, so intentional `topo-scan` removal does not appear as a false failure.
- Active handoff/archive boundary guard should remain conservative and no-write: fail on unlabeled mojibake markers in current handoff/page source, but allow dated archive sections in `SAMPORA_LATEST_REPAIR_LOG.md` to preserve historical evidence.
- Visual helper scripts are optional diagnostics only. Do not extend or run them as default acceptance/review gates unless the user explicitly asks for browser proof, screenshots, review, acceptance, or final delivery validation.
- Extend `visual-boundary-geometry-check.mjs` only when explicitly assigned; keep it auxiliary and never use helper PASS as a substitute for the user's direct visual judgment.
