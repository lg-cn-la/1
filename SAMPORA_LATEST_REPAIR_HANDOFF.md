# Sampora Latest Repair Handoff

> Short entrypoint for new Codex windows and controller/subagent handoffs. Detailed historical logs are archived in `SAMPORA_LATEST_REPAIR_LOG.md`.

## READ FIRST / UPDATE REQUIRED

- Any new window, worker subagent, reviewer subagent, or controller must read this file before modifying Sampora files.
- Also read `ACCEPTANCE_TESTS.md`; it defines what must be checked before delivery claims.
- Also check `ISSUE_LEDGER.md`; it records stable IDs, current statuses, and allowed actions for recurring issues.
- Default entry is this short handoff. Read SAMPORA_LATEST_REPAIR_LOG.md only for history or regression tracing.
- Before editing, summarize active scope, file ownership, known pitfalls, and planned verification.
- During execution, keep changes inside the assigned package boundary.
- Before final response, append concise status to this file or, for detailed package history, to SAMPORA_LATEST_REPAIR_LOG.md.
- If a new pitfall is discovered, record symptom, root cause, prevention rule, verification, and owner package.

## Path Policy

- Resolve active paths relative to the repository root, the directory that contains `AGENTS.md`.
- Treat historical absolute paths in old handoff/log entries as legacy paths from a previous machine. Map them to the same repo-relative file when possible.
- Do not create compatibility folders or symlinks for legacy absolute paths.
- New handoff entries should use repo-relative paths unless quoting a command output or historical artifact exactly.

## Required Intake File Index

Use this index before classifying, dispatching, repairing, or reviewing Sampora work. It prevents controllers and subagents from reading only the main three files and missing supporting handoff material.

Always read or check:

- `AGENTS.md` for workspace-level Sampora process rules and the intake file index.
- `SAMPORA_LATEST_REPAIR_HANDOFF.md` for active scope, source of truth, package boundaries, pitfalls, and latest notes.
- `ACCEPTANCE_TESTS.md` for acceptance categories, issue-status workflow, validation tiers, and required proof.
- `ISSUE_LEDGER.md` for stable recurring IDs, status, evidence, and allowed action.
- `SAMPORA_TERMINOLOGY_GLOSSARY.md` before any visible-copy, i18n, topology-label, workflow-copy, CTA/footer/FAQ/pricing, dynamic data, or resource-manual language change.

Read only when relevant:

- `SAMPORA_LATEST_REPAIR_LOG.md` for detailed history or regression tracing. It is not current proof.
- `redirect-map.md` for redirect, deployment, package, or legacy-route work.
- `sampora-website-public-v3/README.md`, `DEPLOYMENT_NOTES.md`, `QA_REPORT.md`, `verification-report.md`, `backend-form-handoff.md`, `content-audit-fixes.md`, and `visual-animation-fixes.md` for active-source package docs and prior QA notes. Verify current files before relying on them.
- `archives/`, `动态/`, and other local reference/demo folders, when present, for historical/reference context only. Do not treat archived reports, reference HTML, screenshots, or old QA JSON as current proof.

When dispatching subagents, paste the subset of this index that matches their assignment. Do not assume a subagent will discover supporting handoff files without being told.

## Current Status Summary

**Current closeout as of 2026-05-18 20:35 CST:** all controller-thread subagent tasks have completed and were controller-reviewed. The total review blockers found during this round (cross-page footer legal/icon consistency and homepage workflow motion fallback) are repaired and verified in the active working source `sampora-website-public-v3/`. No active controller-thread task queue remains, and no new task is queued by this handoff. Do not run compression, zip, packaging, v4 creation, or zip rebuild steps unless the user explicitly asks for packaging. The older timestamped summary below is historical context and must not be used as permission to package.

**Status as of 2026-05-18 16:48 CST:** homepage topology motion has been adjusted in the active v3 working source using the local topology reference documented in the detailed log. Per the user's latest instruction, packaging and full final delivery validation are deferred until the current batch of point-by-point fixes is complete.

**Source of truth:** `sampora-website-public-v3/`

**Final package outputs:**
- `sampora-website-public-v3.zip`
- `sampora-website-handoff-v3.zip`

These zips are the last packaged outputs before the latest working-source motion fix. Rebuild and hash the next versioned deliverables only after the user confirms the batch is complete.

**Detailed history:** `SAMPORA_LATEST_REPAIR_LOG.md`

**Acceptance contract:** `ACCEPTANCE_TESTS.md`

**Recurring issue ledger:** `ISSUE_LEDGER.md`

## Historical Mojibake / Archive Boundary Rule

- Historical mojibake-looking strings may appear only in `SAMPORA_LATEST_REPAIR_LOG.md` or in clearly labeled historical evidence blocks.
- This active handoff, current acceptance rules, current ledger routing rows, and current page/source files must not contain unlabeled mojibake-looking strings such as repeated question marks, replacement characters, or legacy garbled samples.
- Agents must verify current files, scripts, or browser state before repairing. Do not treat archived mojibake samples, old screenshots, old reports, or old QA JSON as current proof.
- Do not copy historical mojibake markers into source files, translation objects, QA scripts, README/deployment docs, or active handoff notes.
- If a future task needs to cite a historical marker, put the exact sample in the detailed log under a dated archive heading and summarize it in active docs with ASCII-safe wording.

## Package Status

| Package | Files | Current Status | Remaining Risk |
|---|---|---|---|
| A Homepage | index.html | Homepage sticky-nav source conflict repaired; workflow/topology static and browser QA included in final verification | None found in final verification |
| B Solutions/Resources | solutions.html, resources.html | Resources sticky-nav source conflict repaired; topology/static/browser checks included in final verification | None found in final verification |
| C Plans/Contact | plans.html, contact.html | Backend-ready placeholder form, browser follow-up, review complete | Real backend endpoint still external: [BACKEND_CONTACT_ENDPOINT] |
| D Resource Manuals | resource-manuals.html, assets/resource-manuals/data.js, assets/resource-manuals/app.js | Fallback hardening, language smoke/browser checks, review complete | None found in final verification |
| E Docs | README/deployment/QA/verification/redirect docs | Chinese legacy route policy aligned to server/CDN rewrites; static/browser QA coverage updated; review complete | None found in final verification |
| Delivery | sampora-website-delivery, public/handoff zips | Synced and rebuilt from current source | Axe has 8 non-blocking violations, 0 blocking |

## Fresh Verification Evidence

This window reran the critical final checks after the other agent reported completion:

- node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs" -> PASS final audit static checks
- node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs" -> PASS static checks for 8 physical HTML files and 7 absent Chinese legacy redirects
- node --check "sampora-website-public-v3\assets\i18n-sweep.js" -> exit 0
- node --check "sampora-website-public-v3\assets\resource-manuals\data.js" -> exit 0
- node --check "sampora-website-public-v3\assets\resource-manuals\app.js" -> exit 0
- node "sampora-website-public-v3\qa-evidence\resource-manuals-language-smoke.mjs" -> resource manuals language smoke: OK
- node "sampora-website-public-v3\qa-evidence\resource-manuals-browser-language-check.mjs" -> resource manuals browser language check: OK
- node "sampora-website-public-v3\qa-evidence\page-layer-browser-check.mjs" -> status: PASS, failures: [], screenshots: 42
- node "sampora-website-public-v3\qa-evidence\lighthouse-axe-check.mjs" -> status: PASS, axeViolationCount: 8, axeBlockingViolationCount: 0
- dedicated topology mark browser check -> PASS for EN/ZH/HI and modal clone: nav/text `S`, matching cyan text, monospace font, rounded-rect mark, 0 inner mark circles.
- dedicated topology motion browser check -> PASS: `topoDash` duration 2.4s, changing stroke dash offsets, moving packet coordinates, `pulse-ring`, `topoScan`, and modal clone motion all active.
- page-layer browser evidence includes sticky samples for index, solutions, resources, resource-manuals, plans, and contact.
- Previous public v3 source/zip comparison before the latest motion fix -> 233 source files, 0 missing, 0 mismatches, 0 extra.
- Previous zip inspection before the latest motion fix -> public v3 zip has 233 entries, handoff v3 zip has 18 entries, both have 0 backslash entries; public zip has 0 non-ASCII HTML entries and 0 parent-prefix entries.
- Current packaging note -> source changed after those v3 zips; do not treat existing v3 zip hashes as proof of the latest working source. Rebuild once after the batch is complete.

## Non-Negotiable Scope For Future Changes

- Fix only issues named in the latest audit or the user's newest message.
- Anything not explicitly named is out of scope and must not be changed.
- Every new visual, business-path, language, motion, legal, or packaging regression must be mapped to `ACCEPTANCE_TESTS.md` before repair.
- If no acceptance item covers the failure, add or update one before or alongside the fix.
- Treat `sampora-website-public-v3/` as the current working source of truth. Per the user's latest batching instruction, keep point-by-point repairs in the active working source and defer the next versioned zip rebuild/full final validation until all current fixes are complete.
- Do not rely on old reports, old screenshots, or previous QA JSON as proof.
- Do not paste mojibake or broken multilingual text into source files or active handoff notes.
- Visible copy changes are multilingual by default. When any page-visible text, i18n key, card body, CTA copy, FAQ, workflow/topology label, pricing copy, footer copy, hero proof card, or dynamic project/sample data is changed in one language, the same semantic update must be made in EN, ZH, and HI primary translations/source data in the same task. Do not rely on `i18n-sweep.js` alone as a substitute. A single-language edit is allowed only when the newest user message explicitly limits scope to one language; the worker prompt and handoff entry must record that exception and name the other languages as intentionally deferred.
- Terminology source: read `SAMPORA_TERMINOLOGY_GLOSSARY.md` before changing any EN/ZH/HI visible copy, i18n key, topology label, workflow copy, pricing/FAQ/footer/CTA copy, dynamic sample/project data, or resource-manual language. Follow its canonical EN/ZH/HI glossary, topology policy, and Hindi style rules.
- Confirmed legal names only: verify the Chinese legal name from current source/browser when legal copy is in scope; the English legal name is `Anhui Jiayu Enterprise Service Co., Ltd.`.
- Overseas-server deployment stage: do not display ICP numbers or ICP placeholders.

## Default Repair Intake Gate

When the user asks in Chinese or English to follow `AGENTS.md` and this handoff before taking over, that short instruction is enough to trigger the repair workflow. The agent must not ask the user to restate the handoff rules.

Before any file edit, complete a short internal intake gate. Do not print the full gate by default unless the user explicitly asks to see the plan. The gate must determine:

1. Current explicit issues to fix.
2. Explicit out-of-scope areas that must not be touched.
3. Package split and writable files for each package.
4. Acceptance categories affected in `ACCEPTANCE_TESTS.md`.
5. Issue status for each item: `[CONFIRMED]`, `[VERIFY-FIRST]`, `[STRATEGY]`, `[REGRESSION]`, `[REMOVED]`, `[OUT-OF-SCOPE]`, or `[BLOCKED]`.
6. Red-check commands and completion verification for each package.
7. Planned read-only verification subagents, implementation subagents, read-only review subagent, and final controller verification.

If the gate finds unclear scope, cross-package write overlap, or any need to touch an unmentioned area, stop and ask the user before editing. If the gate is clear and the user's newest message asks to proceed or includes repair content, continue after the gate using the subagent workflow. By default, give only a brief status update instead of printing the full gate.

When the user provides a repair checklist, GPT/web-audit summary, or issue list, treat it as repair input and internally normalize every item before dispatch:

- acceptance category in `ACCEPTANCE_TESTS.md`
- existing test/script coverage
- coverage gap, if any
- owner package and writable files
- red check and completion check
- issue status and allowed action

Print a concise issue status table before edits when an issue list is supplied. Keep it short; it is not the full intake gate. Required columns: item, status, evidence/command, owner package, and allowed action. If an item cannot be mapped to an acceptance category and owner package, mark it `[BLOCKED]` and stop to ask only about that item before editing.

## Standard Repair Flow

Use this flow for every GPT, human, Codex, downloaded-report, or agent-generated issue list:

1. **Issue intake:** put every proposed issue into a pending verification pool. The list itself is not proof.
2. **Ledger check:** if an item resembles `ISSUE_LEDGER.md`, carry forward its stable ID, current status, last evidence, and allowed action before deciding whether fresh evidence changes that status.
3. **Status table:** verify each item against current files, scripts, or browser state, then label it `[CONFIRMED]`, `[VERIFY-FIRST]`, `[STRATEGY]`, `[REGRESSION]`, `[REMOVED]`, `[OUT-OF-SCOPE]`, or `[BLOCKED]`.
4. **Action:** repair only `[CONFIRMED]`; run verification only for `[VERIFY-FIRST]`; edit only docs/QA/packaging for `[STRATEGY]`; run guards only for `[REGRESSION]` until failure reclassifies it as `[CONFIRMED]`; do not repair `[REMOVED]` or `[OUT-OF-SCOPE]`; ask for `[BLOCKED]`.
5. **Scope:** assign each actionable item to one Package A/B/C/D/E owner and keep edits inside that writable file boundary.
6. **Verification:** small changes use scoped verification; global/shared changes use full regression for the affected contract; final delivery claims use full five-layer validation.

## Issue Status Workflow

- `[CONFIRMED]`: Current files, script output, or browser evidence prove the issue exists. It maps to an acceptance category and owner package. Only these items may receive page/source repairs.
- `[VERIFY-FIRST]`: The issue is plausible but not proven. Allowed action is limited to adding/running a scoped test, grep, static check, or browser verification. Reclassify before repairing.
- `[STRATEGY]`: The item concerns docs, redirect policy, packaging policy, deployment guidance, acceptance coverage, or handoff strategy. Allowed action is limited to those files and delivery policy; do not change page behavior.
- `[REGRESSION]`: The item is a standing regression guard. Rerun the mapped check every round and record PASS/FAIL. Repair only if current evidence shows a failure and the item is reclassified as `[CONFIRMED]`.
- `[REMOVED]`: The item is a historical issue that no longer exists in the current package. Do not repair it, do not restore removed behavior/files, and keep only evidence if needed.
- `[OUT-OF-SCOPE]`: The item is not in the latest audit/newest user message, or it would require an unassigned file. Do not repair.
- `[BLOCKED]`: The item is ambiguous, lacks owner/acceptance mapping, or cannot be verified from the current workspace. Ask for clarification before repair.

After repairs, final handoff must include scoped diff summary and fresh evidence: commands/browser checks run, PASS/FAIL results, remaining failures, and files intentionally left untouched.

## Repair Sequence And Done-When Gate

When multiple issue types are present, prefer this dependency order unless the controller has fresh evidence that a different order is safer:

1. Packaging, redirect policy, and public/handoff boundary.
2. Global i18n, footer/legal, and CTA policy.
3. Contact form backend readiness and intent handling.
4. Topology and workflow motion.
5. SEO, Lighthouse, axe, delivery sync, zip inspection, and final acceptance.

Do not run implementation work in parallel across dependency layers that can overwrite each other. Each implementation task must include a `Done when` checklist with concrete checks, such as exact static grep results, browser-time samples, visible text assertions, route/intent assertions, or named QA commands.

## Validation Scope Tiers

Verification depth must match the change scope:

- **Scoped check:** use for light, single-package, or docs-only changes. Run the mapped red check and completion check for the touched acceptance category only. Examples: README/redirect policy does not require topology motion checks; `contact.html` edits focus on contact form, CTA/intent, hidden fields, and relevant i18n checks.
- **Full regression for affected contract:** use when shared contracts change, such as `i18n-sweep.js`, footer/legal, CTA policy, shared header/nav, cross-page CSS, or QA scripts. Run the affected all-page language/footer/CTA/static/browser guard, but do not automatically add unrelated Lighthouse or resource-manual deep checks unless the changed contract touches them.
- **Full five-layer validation:** use before final delivery claims, public/handoff zip rebuilds, broad cross-package repairs, or after changes that affect multiple acceptance categories at once. This includes static checks, syntax checks, language/manual checks, browser checks, Lighthouse/axe, delivery sync, and zip inspection.

Do not use old reports, old screenshots, or old QA JSON as current evidence. They can help choose a scoped check, but the acceptance claim must come from current files, current scripts, or current browser evidence.

## Read-Only Verification Subagents

For long issue lists or multi-package audits, the controller should split first-pass verification across read-only verification subagents before creating the issue status table.

- Split by package or topic, such as Homepage, Solutions/Resources, Plans/Contact, Resource Manuals, Docs/redirects/packaging, or cross-page policy.
- Verification subagents must not edit files, update docs, rebuild packages, or repair anything.
- Each verification subagent checks only its assigned issue subset against current files, scripts, grep output, or browser state.
- Each verification subagent reports a compact table: item, exists now, evidence/command, recommended status, recommended owner package, and notes.
- The controller/main agent merges those reports, resolves conflicts, and makes the final issue status decision before dispatching implementation workers.
- Implementation workers may receive only items the controller has classified as `[CONFIRMED]`, except `[STRATEGY]` workers, which remain limited to docs/QA/packaging policy.

## Controller Scheduling Rule

After dispatching subagents, the controller must not wait idly if independent work remains. Continue splitting and dispatching non-blocking read-only verification, implementation, or review tasks whose file ownership and dependency layer are clear. Wait only when the next critical-path action is blocked by a needed subagent result, an unclear scope decision, a cross-package write overlap, or a dependency-layer ordering risk.

After a subagent is dispatched, do not keep the same controller turn open only to poll or continuously wait for that subagent. Let the subagent return its report asynchronously, continue with already-visible non-blocking work, or return control so the client can deliver the next queued user comment. Check or wait on a subagent only when the next controller action truly needs that result, when a long silence suggests the subagent may be stuck or dead, or when closure/reassignment is needed. If checking after a long silence, request a concise status once and then either proceed from the returned report, close/reassign the task, or continue with other visible work; do not repeatedly busy-poll.

When one or more subagent completion reports arrive in the current controller context, the controller must prioritize closeout immediately. Read each report, close the finished agent, classify the result as PASS, FAIL, or BLOCKED, record or prepare the required handoff update, decide whether read-only review is needed, and continue dispatching the next non-conflicting confirmed task. Do not leave completed agents hanging until the user asks for status. This does not conflict with the no-busy-wait rule: the controller does not need to continuously wait for subagents, but once a completion notice is visible in the current context it must be processed before ordinary new work. If the report shows the same file still has a follow-up write conflict, record the blocking reason and do not dispatch overlapping writes; otherwise keep the workflow moving. Controller status updates and final responses must list active/running agents, completed-and-processed agents, and any blocked/completed-but-not-actionable reports so the user can see the real queue state.

## Controller Final Review Delegation Rule

Final review should also be delegated to a read-only review subagent whenever subagents are available. The controller's final-review role is to inspect the review report for obvious evidence gaps, incorrect scope, status mistakes, contradictions, or owner-package errors. The controller should rerun verification directly only when the report is missing required proof, is internally inconsistent, conflicts with current evidence, or the user explicitly asks.

## Multilingual Copy Sync Rule

All future visible-copy repair tasks must treat EN, ZH, and HI as one content surface unless the user's newest instruction explicitly says the task is single-language only.

- If a worker changes English copy, it must also update the corresponding Chinese and Hindi copy with the same business meaning.
- If a worker changes Chinese or Hindi copy, it must also check and update the matching English and remaining third-language copy where the same key/surface exists.
- This applies to static fallback HTML, `translations.en`, `translations.zh`, `translations.hi`, dynamic project/sample arrays, topology labels, workflow cards, hero proof cards, pricing/FAQ/footer/CTA copy, and resource/manual data where the same content appears in language-specific objects.
- Do not satisfy this rule by only patching `i18n-sweep.js`; the primary translation/source objects must carry complete EN/ZH/HI content.
- If the user intentionally assigns only one language for a narrow polish round, the prompt must state the exception, the handoff entry must say which languages were intentionally not changed, and review must not treat those deferred languages as silently complete.
- Read-only review must compare the changed keys/surfaces across EN/ZH/HI and report any stale, English-only, copied-through, empty, or mojibake-looking counterpart as a remaining `I18N-001` failure or explicitly deferred exception.
- Terminology-sensitive copy must also match `SAMPORA_TERMINOLOGY_GLOSSARY.md`. If a term is missing or conflicts with the newest user instruction, treat it as a terminology strategy gap before page repair.

## Failure-Prevention Checklist

**Before editing:**
- Confirm the change is in the latest audit or user's newest message.
- Map each change to one package and one file owner.
- Run a scoped red check before editing.
- Do not touch out-of-scope files.

**During implementation:**
- Do not trust subagent summaries alone; inspect changed files or scoped diffs.
- Do not mix write ownership between workers.
- For visible-copy edits, update the corresponding EN/ZH/HI primary translation/source entries together unless the newest user message explicitly grants a single-language exception.
- Do not validate workflow/topology motion with screenshots only; use browser-time sampling and computed style checks.
- Do not update CTA links from memory; verify the intent URL policy with search.
- Do not change docs based on intended package contents; check actual files.

**Before handoff:**
- Rerun fresh scoped checks for touched files.
- Use a read-only review subagent for latest-audit review when subagents are available.
- Treat the controller's final-review work as a sanity-check of the read-only review report by default; rerun checks directly only for gaps, contradictions, current-evidence conflicts, or explicit user request.
- Run any needed controller-level final verification only after implementation and read-only review pass.
- Rebuild packages only after source verification.
- Inspect zip entry paths and repaired-file inclusion.

## Subagent Prompt Contract

Do not assume subagents automatically read global instructions. The controller must paste the relevant package, file ownership, failure-prevention rules, red checks, verification commands, and handoff-log requirement directly into every worker/reviewer prompt.

Implementation subagent prompts must require:
- Read this handoff and `ACCEPTANCE_TESTS.md` first.
- Restate assigned files and out-of-scope files.
- Map the work to acceptance categories.
- Restate the assigned issue statuses and allowed actions.
- State the validation tier: scoped, full regression for affected contract, or full five-layer.
- State a `Done when` checklist with concrete verification conditions before editing.
- For visible-copy tasks, include a `Done when` item proving the matching EN/ZH/HI fallback, translation, and dynamic data entries were updated together, or state the explicit single-language exception from the user's newest message.
- Run scoped red check before editing.
- Run scoped verification after editing.
- Append result to the handoff/log before final response.
- Record new pitfalls using symptom/root-cause/prevention/verification/owner format.

Read-only verification subagent prompts must require:
- Read this handoff and `ACCEPTANCE_TESTS.md` first.
- Restate the assigned issue subset and out-of-scope files.
- Make no edits and do not rebuild packages.
- Verify each item against current files, scripts, grep output, or browser state.
- Report item, exists now, evidence/command, recommended status, recommended owner package, and notes.
- Mark ambiguous or unmapped items `[BLOCKED]` instead of guessing.
- Mention matching `ISSUE_LEDGER.md` IDs when an assigned item resembles a recurring issue.

Review subagent prompts must require:
- Read-only mode.
- Latest-audit checklist as source of truth.
- Acceptance checklist coverage review.
- Direct public-package review only.
- Exact PASS/FAIL output with file references.
- Recommended owner package for any remaining failure.
- Ledger status changes required for recurring failures.
- For visible-copy changes, PASS/FAIL coverage for EN/ZH/HI counterparts, including static fallback, translation objects, and dynamic data objects touched by the same surface.
- A report complete enough for controller sanity-check: commands/evidence run, PASS/FAIL for each assigned item, remaining gaps, out-of-scope items, and whether any controller rerun is actually needed.

## If Another Repair Round Starts

Use this package ownership map:

| Package | Writable Files |
|---|---|
| A Homepage | sampora-website-public-v3\index.html |
| B Solutions/Resources | sampora-website-public-v3\solutions.html, sampora-website-public-v3\resources.html |
| C Plans/Contact | sampora-website-public-v3\plans.html, sampora-website-public-v3\contact.html |
| D Resource Manuals | sampora-website-public-v3\resource-manuals.html, sampora-website-public-v3\assets\resource-manuals\data.js, sampora-website-public-v3\assets\resource-manuals\app.js |
| E Docs | README/deployment/QA/verification/redirect docs only |

## Latest Handoff Note / Handoff Update Log

Historical detailed update-log entries that previously made this active handoff noisy were archived to `SAMPORA_LATEST_REPAIR_LOG.md` under `2026-05-19 CST Archive - Active handoff historical update log before mojibake boundary cleanup`. Historical mojibake-looking samples in that log are preserved only as labeled history, not current evidence.

### Current Active Notes

- Source of truth remains `sampora-website-public-v3/` unless the user explicitly assigns packaging or a new versioned source.
- Do not package, rebuild zips, sync delivery folders, stage, commit, push, or create a new delivery version unless explicitly asked.
- Keep using the subagent workflow and read-only final-review delegation when subagents are available; controllers should not busy-poll asynchronous subagents, but must immediately close out any completion reports that have arrived in the current context.
- Visible-copy changes must stay synchronized across EN/ZH/HI primary source data unless the newest user message explicitly grants a single-language exception.
- Old handoff entries, old screenshots, old reports, and old QA JSON are never current proof. Rerun the mapped scoped check before claiming a repair.
- Package ownership remains the map above; page source, QA evidence outputs, delivery folders, and zips are out of scope for Package E docs-only strategy tasks unless explicitly assigned.
- Terminology governance now lives in `SAMPORA_TERMINOLOGY_GLOSSARY.md`; future language workers must use it as the source of truth before changing role names, workflow terms, topology labels, Hindi SaaS terms, or Chinese equivalents.
- The required intake file index now lives in both `AGENTS.md` and this handoff. Controllers must use it during intake and paste the relevant subset into subagent prompts.
- Latest archived active entries before this cleanup included Package E async subagent wait rule sync, Package A FAQ layout balance, Package B Solutions card/fit-cycle repair, multilingual copy sync policy, and topology ledger evidence. Read the detailed log only when tracing those decisions.

### 2026-05-20 JST - Package B Solutions compare table column balance

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No `resources.html`, `index.html`, other pages, visible copy/i18n, CTA/footer/legal, topology behavior, QA evidence outputs, delivery folders, zips, README files, staging, commit, push, or packaging files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left unchanged because this is not a recurring ledger issue.

**Audit item addressed:** `[CONFIRMED]` Package B `solutions.html` visual layout issue from the newest user message: the `#compare` decision matrix outer `.compare-wrap` was centered, but the three business columns inherited left alignment from global table cells, leaving text tight to the left and empty on the right. The repair adds a narrow `#compareTable th:not(:first-child), #compareTable td:not(:first-child) { text-align: center }` override while preserving the first decision-point column as left aligned.

**Verification run:** red Playwright geometry before editing showed `.compare-wrap` centered with no document overflow, but non-first first-row cells computed `text-align:left`; at 1280px business-column imbalances were `138.91px`, `53.03px`, and `106.02px`, and at 1440px they were `171.33px`, `85.45px`, and `138.45px`. Post-repair Playwright geometry passed at 1280px and 1440px: business columns computed `text-align:center` with left/right text-gap imbalance `0-0.02px`, header aligns were `left/center/center/center`, first column remained `left`, `.compare-wrap` remained centered, and document overflow stayed `0`. Mobile 390px kept document overflow `0`, table width `960px`, and `.compare-wrap` horizontal scroll overflow `604px`. Static guards passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `git diff --check` -> exit 0 with CRLF warnings only.

**Remaining failures:** none found in this scoped Package B decision-matrix layout task. Existing dirty workspace changes outside this assigned scope were not reviewed, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** future `solutions.html` compare-table visual checks should measure internal text gaps and computed `text-align`, not only outer container centering. Keep the first column left aligned for row-label scanability unless a future audit explicitly assigns that behavior.

**Follow-up note:** verifier follow-up confirmed the user's "leave space on both sides" request also applied to the desktop/tablet `.compare-wrap` width, not only internal cell alignment. Files changed in the follow-up: `sampora-website-public-v3/solutions.html` and this handoff only; `ISSUE_LEDGER.md` stayed unchanged because this remains a one-off visual layout issue. Red Playwright check before the follow-up showed 1280px and 1440px `.compare-wrap` container inner margins were `0/0` while mobile 390px had document overflow `0`, table width `960px`, and wrap scroll overflow `604px`. The follow-up added `#compare .compare-wrap { max-width: 1120px; margin-inline: auto }`, preserving `#compareTable` min-width `960px` and non-first-column center alignment. Green Playwright check passed: 1280px viewport margins `80/80`, container inner margins `56/56`; 1440px viewport margins `160/160`, container inner margins `120/120`; 390px document overflow `0`, wrap `356` client / `960` scroll / `604` overflow; first column remained `left`, business columns and headers remained `center`. Static checks passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `git diff --check` -> exit 0 with CRLF warnings only. Remaining failures: none in this scoped follow-up.

### 2026-05-20 JST - Package B Solutions hero seam visual fix

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No copy/i18n labels, CTA/footer/legal/routes, topology behavior, assets, QA evidence outputs, delivery folders, zips, screenshots, or other pages were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because this is not a recurring ledger issue.

**Audit item addressed:** `[CONFIRMED]` Package B `solutions.html` visual issue from the newest user message: the global `.section { border-top: 1px solid var(--line) }` created a horizontal separator between the hero and the first `01 / Solution layers` section. Added a narrow `.hero + .section { border-top: 0 }` override only for the hero-adjacent first section, leaving the global section border and other separators intact.

**Verification run:** required red check failed before editing with `FAIL: first solutions section inherits global section border-top after hero`. Post-repair red check passed with `PASS: first solutions section border override present or no inherited border`. Source grep confirmed the global `.section` border remains and the `.hero + .section` override exists. Static guards passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS and `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped visual fix. Browser screenshot verification, Lighthouse/axe, QA evidence refresh, delivery sync, zip rebuild, and packaging were intentionally not run.

**Notes for next handoff:** if future hero-to-section seam work is requested, keep it scoped to the affected page and first section unless a fresh audit explicitly assigns broader section-border behavior.

### 2026-05-20 JST - Package B topology performance smoothing

**Files changed:** `sampora-website-public-v3/solutions.html`, `sampora-website-public-v3/resources.html`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, and `ISSUE_LEDGER.md` for scoped `TOPOLOGY-001` evidence. No `index.html`, `plans.html`, `contact.html`, `resource-manuals.html`, assets, QA evidence outputs, delivery folders, zips, redirect docs, visible copy/i18n labels, CTA/footer/legal behavior, or package artifacts were intentionally changed.

**Audit items addressed:** `[CONFIRMED]` Package B topology performance smoothing for `solutions.html` and `resources.html`. The repair followed the previous homepage smoothing pattern: inactive base topology flows no longer run `topoDash`; active `.flow.on` and `.flow-group.on .flow` still animate; moving packet `animateMotion` primitives remain; moving flow/packet drop-shadow filters were removed; and Resources active flows no longer run the extra `flowBreathe` / `flowAmberBreathe` animations. Solutions highlight-only `.topo-scan` remains intentionally disabled; Resources required topology scan/business motion was not disabled.

**Verification run:** red browser sampling at 1440x900 confirmed current cost patterns while business motion worked. Before repair, `solutions.html` had 13 animated flows, 10 animated inactive flows, 31 topology computed filters, 13 `animateMotion` packets, active `topoDash`, dash offset change, packet movement, route cycle `network -> enterprise -> panel -> network`, close text `X`, and modal body children `1 -> 0 -> 1` across open/close/reopen. Before repair, `resources.html` had 9 animated flows, 6 animated inactive flows, 20 topology computed filters, 9 `animateMotion` packets, `flowBreathe`/`flowAmberBreathe` on all flows, active dash offset change, packet movement, setup/supplier/finance modes working, close text `X`, and close inside `.window-bar`. Local rAF in this worker did not reproduce the controller's stable 33ms median, measuring about 17-18ms p50/p95 before repair; the static cost pattern and controller conflict evidence drove the scoped repair. Post-repair browser sampling passed: Solutions now has 3 animated flows, 0 animated inactive flows, 5 topology computed filters, 13 `animateMotion` packets, active `topoDash`, dash offset `-26.2453px -> -43.5393px`, packet center movement, route cycle preserved, close `X`, and controlled modal clone count. Resources now has 3 animated flows, 0 animated inactive flows, 2 topology computed filters, 9 `animateMotion` packets, 0 `flowBreathe` animations, active `topoDash`, dash offset `-19.2147px -> -35.8873px`, packet center movement, setup/supplier/finance modes preserved, and close remains in `.window-bar`. Post-repair local rAF remained about 17-18ms p50/p95. Static guards passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS and `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped topology smoothing pass. Page-level `bgDrift` / background animations remain `[VERIFY-FIRST]` and out of scope for this worker. Full screenshot browser suite, Lighthouse/axe, QA evidence refresh, delivery sync, zip rebuild, and packaging were intentionally not run.

**Notes for next handoff:** keep Package B topology smoothing scoped to active business motion. Future topology edits should verify animated inactive flow count, computed filter count, active dash offset changes, packet movement, route/mode behavior, and modal close/placement before and after changes. Do not re-enable Solutions highlight-only scan/sheens without explicit user request, and do not pursue page-level background animation changes without a new scoped authorization.

### 2026-05-20 JST - Package B Solutions topology layout stability

**Files changed:** `sampora-website-public-v3/solutions.html`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, and `ISSUE_LEDGER.md` for scoped `TOPOLOGY-001` evidence. No visible copy, translations, other pages, QA evidence outputs, delivery folders, zips, README files, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package B `solutions.html` topology/solution-layer mode layout stability. Current browser red check at 1280x932 showed EN and HI mode switching changed `#topoText` height by `22.11px` and moved hero/grid/console/next section by `22.11px`; SVG stage and modebar heights stayed stable. The repair reserves stable height for topology summary text, tags, and narrow-screen header/ticker wrapping, while preserving mode-specific active flows and packet motion.

**Verification run:** post-repair Chromium geometry checks passed for EN/ZH/HI across `network`, `panel`, and `enterprise`: 1280x932 and 1440x900 desktop had `0px` delta for hero/grid/window/main/summary/next-section/text/tags/header/ticker/modebar; 390x900 mobile smoke stayed within `0-1.34px` next-section tolerance with stable console/window heights. Active mode paths still changed to `path-network`, `path-panel`, and `path-enterprise`; active flow/packet counts remained `3/3/7`. Motion sampling passed with enterprise `topoDash` offset changing `0px -> -12.3347px` and packet center moving. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `git diff --check` -> exit 0 with CRLF warnings only.

**Remaining failures:** none found in this scoped Package B topology layout stability task. Existing dirty workspace changes outside this assigned scope were not reviewed, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** future `solutions.html` topology edits should measure geometry by language and mode, including `#topoText`, `.console-tags`, `.window-bar`, `.console-ticker`, `.console-window`, `.hero-grid`, and `.hero + .section`, and should continue verifying active path classes plus dash/packet motion.

### 2026-05-20 JST - Package E required intake file index

**Files changed:** `AGENTS.md`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, `ACCEPTANCE_TESTS.md`, and `ISSUE_LEDGER.md`. No HTML page source, JS/CSS assets, QA evidence outputs, delivery folders, zips, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[STRATEGY]` controller handoff governance. The mandatory entry files now include a required intake file index so controllers and subagents can see supporting handoff material beyond the main handoff/acceptance/ledger trio. The index covers always-read files, relevant-on-demand files, public-package docs, detailed history, `archives/`, `动态/`, and local reference/demo folders, while preserving the rule that reference/history files are not current proof.

**Verification run:** scoped docs/process checks passed after this edit: `Select-String` in `AGENTS.md` and this handoff found `Sampora intake file index` / `Required Intake File Index`, `SAMPORA_TERMINOLOGY_GLOSSARY.md`, `redirect-map.md`, `archives/`, `动态/`, and the subagent prompt instruction; `Select-String` in `ACCEPTANCE_TESTS.md` found `required file index`; `Select-String` in `ISSUE_LEDGER.md` found `HANDOFF-003`.

**Remaining failures:** none known for this docs/process strategy task. Existing page source and QA artifacts were intentionally left untouched.

**Notes for next handoff:** during intake, do not stop at the main three docs. Use the index to decide which supporting docs are relevant, then paste those exact file requirements into any subagent prompt. Archive/reference files may guide checks but cannot prove current page behavior.

- **Pitfall / symptom:** a controller read only the main handoff/acceptance/ledger files and missed supporting handoff files that were already present locally.
- **Root cause:** the mandatory entry files did not expose a clear, compact index of all supporting intake files and relevant-on-demand references.
- **Prevention rule:** use the required intake file index in `AGENTS.md` and `SAMPORA_LATEST_REPAIR_HANDOFF.md` before classifying work, and include the relevant indexed files in every subagent prompt.
- **Verification:** `Select-String` checks find the index headings and supporting file names in `AGENTS.md`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, `ACCEPTANCE_TESTS.md`, and `ISSUE_LEDGER.md`.
- **Owner package:** Package E handoff policy / controller intake.

### 2026-05-19 CST - Package E controller subagent completion closeout rule

**Files changed:** `SAMPORA_LATEST_REPAIR_HANDOFF.md`, `ACCEPTANCE_TESTS.md`, and `ISSUE_LEDGER.md`. No HTML, JS, CSS, QA evidence outputs, delivery folders, zips, README, staging, commit, push, packaging, or Package A `index.html` files were intentionally changed.

**Audit item addressed:** `[STRATEGY]` controller workflow governance. The controller scheduling rule now explicitly says that when one or more subagent completion reports arrive in the current context, the controller must immediately read reports, close finished agents, classify PASS/FAIL/BLOCKED, record or prepare handoff updates, decide whether review is needed, and keep dispatching the next non-conflicting confirmed work. Completed agents must not be left hanging until the user asks for status. The rule also clarifies that this does not conflict with no busy-wait/no polling: no continuous wait is required, but visible completion notices take priority once they arrive.

**Verification run:** scoped docs/strategy checks passed. `Select-String` in this handoff found `completion reports arrive`, `completed agents hanging`, `completed-and-processed agents`, `same file still has a follow-up write conflict`, and the new section heading. `Select-String` in `ACCEPTANCE_TESTS.md` found `completion reports arrive`, `PASS/FAIL/BLOCKED`, `completed-processed agent state`, and `completion-closeout rule`. `Select-String` in `ISSUE_LEDGER.md` found `HANDOFF-002`, `completion-closeout`, `completed subagent reports hanging`, `PASS/FAIL/BLOCKED`, and `no-busy-wait`. `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS.

**Remaining failures:** none known for this docs/process rule. Page source and Package A worker-owned `index.html` were intentionally left untouched.

**Notes for next handoff:** future controllers should report active/running/completed-processed agents in status updates and final responses. If a completed report reveals a same-file follow-up write conflict, record the blocking reason; otherwise continue with the next non-conflicting confirmed task without waiting for a user nudge.

### 2026-05-19 CST - Package E terminology glossary and handoff index

**Files changed:** `SAMPORA_TERMINOLOGY_GLOSSARY.md`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, `ACCEPTANCE_TESTS.md`, and `ISSUE_LEDGER.md`. No HTML, JS, CSS, QA evidence, delivery folders, zips, README, staging, commit, or packaging files were intentionally changed.

**Audit item addressed:** `[STRATEGY]` terminology governance for future visible-copy and i18n work. A standalone glossary now records canonical EN/ZH/HI terms, including user-confirmed `Panel Provider` -> `自有样本运营方`, `Workspace` -> `工作台`, topology-node policy, and Devanagari-first Hindi style with limited retained SaaS/industry terms.

**Verification run:** scoped docs/strategy checks confirmed the glossary exists and contains the required core terms, the active handoff indexes the glossary, `ACCEPTANCE_TESTS.md` maps glossary compliance under `Language/i18n`, and `ISSUE_LEDGER.md` records `TERMINOLOGY-001`. UTF-8 required-term coverage check found all 51 tracked terms, including `Panel Provider`, `自有样本运营方`, `Workspace`, `工作台`, `SAMPLE SUPPLY POOL`, and Hindi canonical role/workspace strings. Glossary bad-marker check found no repeated-question-mark placeholder marker or replacement character. `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped docs/strategy task. This worker did not implement page translation repairs or reclassify any page-source item.

**Notes for next handoff:** future language agents must read `SAMPORA_TERMINOLOGY_GLOSSARY.md` before page copy changes. If a visible term is absent from the glossary, add or confirm the terminology strategy before modifying HTML/source copy.

### 2026-05-19 CST - Package B Solutions decision matrix column balance

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No compare text/data, CTA, footer, hero, topology, mini-metrics, workflow-tab logic, resources/plans/contact files, QA evidence outputs, delivery folders, zips, packaging, staging, commit, or push files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because no recurring issue status changed.

**Audit item addressed:** `[CONFIRMED]` Package B `section#compare` decision matrix layout. Source red check found `#compareTable` inherited global `table { width:100%; min-width:860px }` and later global `@media(max-width:1100px) table { min-width:940px }`, with no scoped `table-layout` or column allocation. Browser red check at 1681px ZH showed auto-layout columns about `290 / 317 / 360 / 390px`, so the solution columns widened unevenly toward the right. The table now has scoped `#compareTable` fixed layout, `min-width:960px`, first column at `24%`, and the three solution columns equally split at `25.333%`; cell wrapping is scoped to `#compareTable`.

**Verification run:** static CSS check confirmed `#compareTable` has fixed layout, scoped min-width, explicit first/remaining column widths, scoped wrapping rules, the existing mobile `.compare-wrap` overflow guard remains, and the previous mini-metrics/workflow strings remain present. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Inline script syntax check for 3 scripts -> OK. `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS. Browser DOM check with Chrome -> ZH 1681px, ZH 1440px, and EN 1440px all had `tableLayout=fixed`, `minWidth=960px`, no document horizontal overflow, table using the compare wrap width, right blank about `1px`, first column `24%`, solution width spread about `0.05px`, and column widths about `326 / 344 / 344 / 344px`. ZH 390px had document overflow `0` with internal `.compare-wrap` scroll overflow `604px`, preserving mobile table scrolling.

**Remaining failures:** none found in this scoped Package B `#compare` layout task. Existing dirty `ISSUE_LEDGER.md` state was not touched by this worker.

**Notes for next handoff:** keep compare table layout scoped to `#compareTable`; do not change global `table` rules for this issue. If future decision-matrix work changes copy or data, apply visible-copy EN/ZH/HI sync rules and recheck desktop column balance plus mobile internal scrolling.

### 2026-05-19 CST - Package B Solutions mini-metric phrase wrap返工

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No CTA, footer, topology, workflow-tab timer/lock logic, compare table, ticker, other pages, QA evidence outputs, delivery folders, zips, packaging, staging, commit, or push files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because no recurring issue status changed.

**Audit item addressed:** `[CONFIRMED]` Package B `section#fit` Panel recommendation `#r2` phrase-wrap failure where `survey participation` could split across visual lines. Desktop `.mini-metrics strong` no longer uses `overflow-wrap:anywhere`; each rendered metric `span` uses `white-space:nowrap` so short intended phrases stay intact. The mobile overflow guard was extended to `.mini-metrics strong span` and resets span `white-space:normal` below 680px so narrow screens still have a safe wrap path.

**Verification run:** red source check before repair confirmed Panel EN r2 was `→ Member operations\n→ survey participation`, desktop `.mini-metrics strong` used `overflow-wrap:anywhere`, and spans had no nowrap guard. Post-repair static CSS check confirmed desktop strong uses `overflow-wrap:normal`, spans use `white-space:nowrap`, mobile guard includes metric spans and restores `white-space:normal`, the previous no-`margin-top:auto` middle-gap fix remains, and workflow auto-cycle/click-lock strings remain present. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Inline script syntax check for 3 scripts -> OK. Browser DOM check with Chrome at 1440px -> EN Panel `#r2` spans `→ Member operations` and `→ survey participation` each stayed `white-space:nowrap`, one visual line with 17.39px line height, and `overflow=0`; EN Panel page `overflowX=0`, label top spread `0`, description-to-metrics gap `26px`. EN Enterprise, ZH Network, and HI Enterprise samples also had stacked spans, label top spread `0`, value areas inside cards, `strongOverflow=0`, span overflow `0`, page `overflowX=0`, and preserved no-middle-blank gap.

**Remaining failures:** none found in this scoped返工. Existing workflow-tab auto-cycle/click-lock and EN/ZH/HI rec data formatting were preserved.

**Notes for next handoff:** desktop mini-metric lines should preserve intended phrases as atomic spans; do not reintroduce `overflow-wrap:anywhere` on `.mini-metrics strong` without a desktop phrase-wrap browser check. Keep the mobile span override so narrow screens can still wrap safely.

### 2026-05-19 CST - Package B Solutions recommendation middle-gap返工

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No CTA, footer, topology, workflow-tab timer/lock logic, compare table, ticker, other pages, QA evidence outputs, delivery folders, zips, packaging, staging, commit, or push files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because no recurring issue status changed.

**Audit item addressed:** `[CONFIRMED]` Package B `section#fit` recommendation large-card rhythm返工 after user reported a large empty middle band in Hindi Enterprise. `.mini-metrics` no longer uses `margin-top:auto`; it now uses a controlled `clamp(18px, 2.4vw, 26px)` gap after the description with no padding-top push. `.recommend` keeps a coherent centered stack rhythm so title/description/metrics read as one vertical group instead of top text plus an empty middle plus bottom-anchored metrics. The mini cards still preserve the previous label-top/value-area grid and line-span value rendering.

**Verification run:** red source check before repair confirmed `.mini-metrics` still had `margin-top:auto; padding-top:20px`, while the internal mini cards already used the label/value grid. Post-repair static CSS check confirmed `.mini-metrics` has no `margin-top:auto`, has the controlled clamp margin and `padding-top:0`, the mini-card `grid-template-rows: auto minmax(66px, 1fr)` remains, and workflow auto-cycle/click-lock strings remain present. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Inline script syntax check for 3 scripts -> OK. Browser DOM check with Chrome at 1440px -> Hindi Enterprise `descriptionToMetricsGap=26px`, `metricsBottomGap=60.64px`, `labelTopSpread=0`, `overflowX=0`, all values inside cards, mini-card bottom gaps about `7px`, and r2 first line `→ प्राप्ति`; ZH Enterprise and ZH Network also had `descriptionToMetricsGap=26px`, `labelTopSpread=0`, `overflowX=0`, all values inside cards, and r2 first lines `→ 接收` / `→ 项目接收`.

**Remaining failures:** none found in this scoped返工. Existing workflow-tab auto-cycle/click-lock and EN/ZH/HI rec data formatting were preserved.

**Notes for next handoff:** do not reintroduce `margin-top:auto` on `.mini-metrics`; it recreates the middle void in stretched recommendation cards. Future checks should sample Hindi Enterprise plus one ZH state for description-to-metrics gap, label top alignment, value containment, and page overflow.

### 2026-05-19 CST - Package A contact final CTA follow-up rhythm fix

**Files changed:** `sampora-website-public-v3/index.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No visible copy, translations, dynamic projects, CTA hrefs, other pages, QA evidence outputs, delivery folders, zips, README, staging, commit, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package A `#contact` final CTA layout regression from the previous attempt. The previous `#contact .final-steps { margin-top: auto; padding-top: 30px; }` pushed the three steps and buttons toward the bottom of the left `.final-cta` card, creating the user-reported large middle void. This follow-up removes that auto push and replaces it with a continuous rhythm: body-to-steps gap, step row gap, and steps-to-buttons gap now stay close and natural. The right FAQ panel keeps the existing equal-row distribution and long-text wrapping approach.

**Verification run:** scoped source red check before repair identified `#contact .final-steps` using `margin-top: auto`. Post-repair source check confirmed `#contact .final-steps` now uses `gap: 12px`, `margin-top: 26px`, and `padding-top: 0`; step rows use `min-height: 34px`; mobile keeps `margin-top: 24px`, `gap: 8px`, and `padding-top: 0`. Chromium geometry check passed at 1680x1270 for EN/ZH/HI: left `.final-cta` height `454px`, body-to-steps `26px`, steps-to-buttons `26px`, step heights `34/34/34`, step gaps `12/12`, FAQ heights `113/113/113`, FAQ gaps `12/12`, FAQ bottom gap `0`, horizontal overflow `0`, and contact CTA hrefs stayed `contact.html?intent=start_trial#contact-form` and `contact.html?intent=book_demo#contact-form`. Chromium geometry check passed at 390x900 for EN/ZH/HI: body-to-steps `24px`, steps-to-buttons `22px`, step heights `34/34/34`, step gaps `8/8`, FAQ items stayed equal height per language (`147/147/147` EN, `125.3/125.3/125.3` ZH, `152.8/152.8/152.8` HI), FAQ gaps `12/12`, FAQ bottom gap `0`, horizontal overflow `0`, and the same CTA hrefs were preserved. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped Package A `#contact` final CTA / FAQ layout follow-up. `I18N-001`, `CTA-001`, and `STICKY-001` remain regression guards only; no ledger status changed, so `ISSUE_LEDGER.md` was intentionally left untouched.

**Notes for next handoff:** do not reintroduce `margin-top: auto` or `justify-content: space-between` on the left final CTA content stack. If future work changes this section, verify final CTA group gaps and FAQ equal-row behavior separately after reveal animations have settled.

### 2026-05-19 CST - Package B Solutions mini-metrics rhythm rework

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No CTA, footer, topology, compare table, ticker, resource/plans/contact/index/resource-manuals files, QA evidence outputs, delivery folders, zips, packaging, staging, commit, or push files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because no recurring issue status changed.

**Audit item addressed:** `[CONFIRMED]` Package B `section#fit` recommendation mini-metrics rhythm返工. The mini metric cards no longer center the entire card content as one flex column. Each mini card now uses a two-row grid so the label (`Primary asset` / `Main workflow` / `Finance view`, and ZH/HI equivalents) stays aligned at the top while the value area uses the remaining space. Metric values are rendered as safe `span.textContent` lines inside the `strong` element, allowing compact even distribution without unsafe HTML. The `Main workflow` metric format is now consistent across EN/ZH/HI and across panel/network/enterprise rec entries: every workflow line begins with `→`, including `→ Project intake`, `→ 项目接收`, `→ Intake`, and `→ 接收`.

**Verification run:** red source check before repair confirmed `.mini-metrics div` used whole-card `justify-content:center`, Enterprise r2 first lines lacked leading arrows, and Network r2 remained one-line in EN/ZH/HI. Post-repair static source checks confirmed the old one-line Network r2 and old no-leading-arrow Enterprise r2 strings are absent, new leading-arrow r2 strings are present for panel/network/enterprise EN/ZH/HI, `.mini-metrics div` uses `grid-template-rows: auto minmax(66px, 1fr)`, the scoped mini card block no longer has `justify-content:center`, and `setMetricValue()` renders line spans with `span.textContent`. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Inline script syntax check for 3 scripts -> OK. Browser DOM check with Chrome at 1440px -> EN Enterprise, ZH Enterprise, and ZH Network all had label top spread `0px`, page `overflowX=0`, all value areas inside their cards, strong/card horizontal overflow `0`, card bottom gap about `7px`, recommendation bottom gap `29px`, mini cards using CSS grid, and r2 visual lines beginning with `→`; a character-code check confirmed ZH Network r2 line starts are U+2192.

**Remaining failures:** none found in this scoped Package B返工. Previously completed workflow-tab auto-cycle/click-lock remained untouched.

**Notes for next handoff:** keep `sampora-website-public-v3/` as active source. Future mini-metric work should preserve the label-top/value-area grid structure and verify label-top spread, value containment, and r2 leading-arrow format in at least Enterprise plus any edited state.

### 2026-05-19 CST - Package B Solutions recommendation metrics and workflow tabs

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No resources/plans/contact/index/resource-manuals files, QA evidence outputs, delivery folders, zips, packaging, staging, commit, or push files were intentionally changed. `ISSUE_LEDGER.md` was not updated because `I18N-001` and `TOPOLOGY-001` remain regression guards with no material status change.

**Audit items addressed:** `[CONFIRMED]` Package B `section#fit` Enterprise recommendation `Primary Asset` and `Main workflow` mini metrics. EN/ZH/HI source data now render `Primary Asset` as stacked Panel / client / supplier roles with no plus signs in that rec metric, and `Main workflow` as stacked steps with arrows at the start of each step after the first. `.mini-metrics strong` uses safe `textContent` with `white-space: pre-line`; metric cards have tighter line height, padding, and centered vertical distribution so stacked r1/r2 and one-line r3 do not leave large bottom whitespace or horizontal overflow. `[CONFIRMED]` Package B `#workflow` Operating Path tabs now auto-cycle through `panel -> network -> enterprise` before user interaction and stop on the clicked tab after any workflow-tab click, using separate workflow timer/lock names from the existing topology fit carousel.

**Verification run:** red source checks before editing confirmed the old EN/ZH/HI Enterprise rec metric strings and the old direct workflow click handler were present, with no workflow timer/lock helpers. Post-repair: static source checks confirmed the old one-line Enterprise rec metric strings are absent from the rec values, stacked newline values are present, `white-space: pre-line` / compact centered metric CSS exists, the old direct workflow click handler is absent, `workflowRouteTimer`, `workflowUserLocked`, `startWorkflowRouteCycle()`, and initialization call are present, and topology route cycle helpers remain intact. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Inline script syntax check for 3 scripts -> OK. Browser DOM check with Chrome at 1440px -> workflow active tab changed `network -> enterprise` after one interval, then clicking `panel` stayed on `panel` beyond another interval; EN/ZH Enterprise metric samples had `overflowX=0`, r1/r2 stacked line counts 3/4, `white-space: pre-line`, line-height about 18.3px, metric-card horizontal overflow 0, recommendation-card bottom gap 29px, and balanced metric-card content bottom gaps (EN r1/r2/r3 about 22px/13px/22px; ZH about 22px/13px/31px with matching top gaps). HI browser smoke also showed r1/r2 stacked line counts 3/4 with no r1/r2 horizontal overflow and page `overflowX=0`.

**Remaining failures:** none found in this scoped Package B task. Existing plus and arrow strings outside the assigned Enterprise recommendation mini metrics, such as compare rows, tickers, and other copy, were intentionally left untouched.

**Notes for next handoff:** keep `sampora-website-public-v3/` as the active working source and do not package or rebuild zips until explicitly requested. Future `#fit` mini-metric copy changes should compare EN/ZH/HI source data together and include a browser/DOM spacing sample when stacked text is introduced.

### 2026-05-19 CST - Package A contact final CTA and FAQ panel balance

**Files changed:** `sampora-website-public-v3/index.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No FAQ/final CTA visible copy, translation objects, dynamic data, button hrefs, other pages, QA evidence outputs, delivery folders, zips, README, staging, commit, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package A `#contact` scoped layout polish. The right `Quick answers` FAQ panel keeps the three FAQ items evenly distributed through the available card height. The left `.final-cta` now uses a quiet vertical flex rhythm so the steps and CTA buttons extend into the lower part of the desktop card instead of leaving a large unused lower area. Long EN/ZH/HI FAQ strings keep wrapping inside their cards.

**Verification run:** pre-edit browser red/layout check inspected EN/ZH/HI at 1440x900, 1680x1270, and 390x900. Post-edit Chromium geometry check passed with no failures: desktop EN/ZH/HI left and right cards matched heights (`446.39px` at 1440, `454px` at 1680), final CTA bottom gap was about `1px`, buttons remained `contact.html?intent=start_trial#contact-form` and `contact.html?intent=book_demo#contact-form`, FAQ list bottom gap was about `1px`, FAQ item height deltas were `0-0.02px`, FAQ item gaps were `12px`, text overflow was `0`, and document/body horizontal overflow was `0`. Mobile 390px EN/ZH/HI passed with `overflowX=0`, button hrefs preserved, and no FAQ text overflow. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped Package A `#contact` final CTA / FAQ layout task. `I18N-001`, `CTA-001`, and `STICKY-001` remain regression guards only; no ledger status changed, so `ISSUE_LEDGER.md` was intentionally left untouched.

**Notes for next handoff:** keep `sampora-website-public-v3/` as the active working source and do not package or rebuild zips until explicitly requested. Future `#contact` layout work should keep visible copy and EN/ZH/HI translations unchanged unless the task is explicitly a copy/i18n task, and should verify both final CTA vertical rhythm and FAQ equal distribution in EN/ZH/HI.

### 2026-05-19 CST - Package B Solutions fit recommendation card spacing

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No text, CTA, topology/workflow motion, resource page, QA evidence output, delivery folder, zip, packaging, staging, commit, push, `ACCEPTANCE_TESTS.md`, or `ISSUE_LEDGER.md` files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package B `section#fit` right-side `.recommend` carousel/recommendation card content was visually crowded toward the upper half because `.fit-panel` stretched the right card while `.recommend` had no vertical distribution mechanism and `.mini-metrics` relied on a fixed `margin-top: 24px`. The card now uses vertical flex layout, and `.mini-metrics` uses `margin-top: auto` plus internal top padding so the metrics settle into the lower portion without hardcoding language-specific heights.

**Verification run:** scoped red source check before repair confirmed `.recommend` did not use `display:flex` or `display:grid`, `.mini-metrics` used fixed `margin-top: 24px`, and `.fit-panel` used `align-items: stretch`. Post-repair static check confirmed `.recommend` has `display:flex` and `flex-direction:column`, `.mini-metrics` no longer has fixed `24px` margin and uses `margin-top:auto; padding-top:28px`, and the existing mobile `.mini-metrics{grid-template-columns:1fr}` guard remains present. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Browser geometry check with local Playwright/Chrome at 1440px for EN and ZH across `panel`, `network`, and `enterprise` states showed `.recommend` computed as `flex`/`column`, metrics top ratios about `0.50-0.65`, bottom gap `29px`, `overflowX=0`, and metrics left/right within the card.

**Remaining failures:** none found in this scoped Package B `#fit` recommendation-card layout task. `TOPOLOGY-001` and `I18N-001` remain regression guards only; no ledger status changed, so `ISSUE_LEDGER.md` was intentionally left untouched.

**Notes for next handoff:** keep `sampora-website-public-v3/` as the active working source and do not package or rebuild zips until explicitly requested. Future `#fit` card layout changes should preserve the EN/ZH/HI copy unchanged unless the task is explicitly a multilingual copy task, and should verify the recommendation card in at least one long-copy language for overflow.

### 2026-05-19 CST - Package E active handoff mojibake/archive boundary cleanup

**Files changed:** `SAMPORA_LATEST_REPAIR_HANDOFF.md`, `SAMPORA_LATEST_REPAIR_LOG.md`, `ACCEPTANCE_TESTS.md`, `ISSUE_LEDGER.md`, and `sampora-website-public-v3/qa-evidence/active-handoff-mojibake-guard.mjs`. No page source HTML, Resource Manuals app/data, QA evidence JSON/PNGs, delivery folders, zips, packaging outputs, staging, commit, or push files were intentionally changed by this Package E task.

**Audit item addressed:** `[STRATEGY]` governance fix for active-handoff mojibake/history noise. The bulky historical update-log block was moved from the active handoff into `SAMPORA_LATEST_REPAIR_LOG.md` under the dated archive heading `2026-05-19 CST Archive - Active handoff historical update log before mojibake boundary cleanup`. The active handoff now keeps a concise current notes section and a Historical Mojibake / Archive Boundary Rule. `ACCEPTANCE_TESTS.md` maps the rule under Docs/redirects, and `ISSUE_LEDGER.md` records stable `HANDOFF-001`.

**Verification run:** red check before edit found `SAMPORA_LATEST_REPAIR_HANDOFF.md` had 1463 lines and its `Latest Handoff Note / Handoff Update Log` began at line 266 with many historical entries. Post-edit scoped checks passed: `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped docs/QA strategy task. Existing unrelated dirty working-tree changes in page source, QA images/JSON, old delivery folders, and zips were not reviewed or modified by this task.

**Notes for next handoff:** active handoff should remain short. Put bulky historical evidence in `SAMPORA_LATEST_REPAIR_LOG.md` with a dated archive heading and clear historical-only label. Do not treat archived mojibake-looking samples as current page failures; verify current files/browser/scripts first.

- **Pitfall / symptom:** a no-write mojibake guard can flag an existing bad-text detector regex in source as if it were page-visible mojibake.
- **Root cause:** the same marker characters may appear as test patterns inside a sanitizer/validator, not as user-facing content.
- **Prevention rule:** guard scripts should distinguish page-visible/source-copy failures from clearly marked detector regexes, and must not repair out-of-scope page/source files during a docs-only strategy task.
- **Verification:** `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` passes while still scanning active handoff, archive heading, acceptance coverage, ledger row, and public source files.
- **Owner package:** Package E QA guard / controller scope classification.

### 2026-05-19 CST - Package A hero proof cards i18n and layout

**Files changed:** `sampora-website-public-v3/index.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No other pages, `#contact` layout, hero console/topology, CTA hrefs, QA evidence outputs, delivery folders, zips, README, staging, commit, or packaging files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because the related `I18N-001`, `CTA-001`, and `STICKY-001` rows remain regression guards with no status change.

**Audit item addressed:** `[CONFIRMED]` Package A homepage hero proof cards i18n/layout. Fallback HTML and `translations.en` keep the user-provided canonical EN copy for `Project intake`, `Supplier allocation`, and `Review & settlement`. `translations.zh` now uses professional Chinese counterparts: `项目接收`, `供应商分配`, `审核与结算`, with copy covering client/country/CPI/IR/LOI/quota/launch rules, unsuitable supply blocking, supplier pricing, review evidence, callback logs, supplier bills, and client invoices. `translations.hi` now uses Devanagari-first Hindi with retained industry terms where useful, including `CPI`, `IR/LOI`, `supply`, `supplier pricing`, `callback logs`, `supplier bills`, and `client invoices`. The proof-card CSS now uses a compact grid rhythm with centered desktop content, lower min-height, tighter title/body sizing, and mobile auto-height cards so content does not sit at the top with a large blank lower area.

**Verification run:** red check before repair confirmed zh/hi `heroProof*` keys still rendered stale English values including `Supplier allocation updated` and `Traceability`; Chromium geometry at 1680x1270 showed the first EN proof card had `bottomBlank=53.94px` while cards were stretched as plain blocks. Post-repair static scoped check -> PASS for fallback HTML, `translations.en/zh/hi` hero proof content, old zh/hi hero proof values absent, and Start trial / Book demo hrefs unchanged. Chromium geometry check -> PASS at 1680x1270, 1440x900, and 390x900 for EN/ZH/HI: desktop card heights stayed equal (`108.44px` EN, `106px` ZH/HI), top/bottom content gaps were balanced (`13-26.27px`), card/page horizontal overflow was `0`, mobile cards auto-sized without overlap or overflow, and CTA hrefs stayed `contact.html?intent=start_trial#contact-form` and `contact.html?intent=book_demo#contact-form`. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped Package A hero proof cards task. Existing unrelated dirty changes in the workspace were not reviewed, modified, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** keep visible-copy sync mandatory for any future hero proof card edits: fallback HTML plus `translations.en`, `translations.zh`, and `translations.hi` must move together. Do not reintroduce stretched block proof cards that leave short-language content pinned to the top with a large empty lower band.

### 2026-05-19 CST - Package A hero left-column rhythm follow-up

**Files changed:** `sampora-website-public-v3/index.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No visible copy semantics, translation values, CTA hrefs, hero console/topology, `#contact`, role scenarios, other pages, QA evidence outputs, delivery folders, zips, README, staging, commit, or packaging files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because no recurring issue status changed.

**Audit item addressed:** `[CONFIRMED]` Package A homepage hero left-column layout follow-up. The user clarified that the issue covered the full left hero rhythm, not only the three proof cards. The repair scopes `.hero-copy`, `.hero h1`, `.hero-sub`, `.cta-row`, `.hero-proof-grid`, and `.proof-mini`: the left column now uses explicit direct-child vertical spacing from eyebrow to H1 to subtitle to buttons to proof grid, and the proof cards use a smaller responsive min-height, clearer title/body gap, and more readable body line-height so card content no longer bunches together or leaves large top/bottom voids.

**Verification run:** pre-repair Chromium geometry at 1680x1270 and 1440x900 showed hero vertical gaps `18/16/22/24px` for kicker-to-H1, H1-to-subtitle, subtitle-to-buttons, and buttons-to-proof-grid. The previous proof cards used `align-content:center`, `min-height:106px`, `gap:7px`, and `10.5px/1.38` body text; ZH desktop cards measured `106px` high with top/body-bottom gaps about `26.27px`. Post-repair Chromium geometry passed for EN/ZH/HI at 1680x1270, 1440x900, and 390x900: main hero gaps are consistently `22/20/26/24px`; desktop proof card measurements are EN `122.5px` high with top/body-bottom gaps `23.25/23.25px` on the shorter card and `15/15px` on longer cards, ZH `92px` high with `16.25/16.25px`, and HI `106px` high with `23.25/23.25px` or `15/15px`; title-body gap is `9px` in all sampled cards. Mobile proof cards auto-size with top/body-bottom gaps `14/14px`; all sampled cards have text overflow `0`, document horizontal overflow `0`, and CTA hrefs remain `contact.html?intent=start_trial#contact-form` and `contact.html?intent=book_demo#contact-form`. Scoped source search confirmed fallback heroProof text and EN/ZH/HI `heroProof*` translation entries are still present. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS.

**Remaining failures:** none found in this scoped Package A hero-left rhythm follow-up. Existing unrelated dirty workspace changes were not reviewed, modified, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** do not restore margin-only desktop overrides that collapse the hero rhythm back to `18/16/22/24px`, and do not increase proof-card fixed height without rechecking EN/ZH/HI card inner top/title/body/bottom gaps. Future hero-left layout work should preserve current text semantics and CTA intent URLs unless explicitly assigned.

### 2026-05-19 CST - Package B solution-layer card title fit

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No other pages, visible copy, translations, CTA hrefs, topology/workflow carousel logic, compare table data, QA evidence outputs, delivery folders, zips, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package B solution-layer card title fit. The English `Supplier Network` title in the first solution card row was splitting into two lines at 1681px. The solution card top area now uses a two-column grid with a resilient title column, card titles stay on one line on desktop, the later `text-wrap: balance` polish no longer applies to `.plan-card h3`, badges can wrap inside their own column, and the mobile overflow guard restores normal title wrapping below 680px.

**Verification run:** controller red check before repair showed `article.plan-card.network h3` at 1681x1270 EN had height `74.88px`, line-height `37.44px`, and `lineCount=2`. Post-repair no-screenshot Chrome DOM checks passed for EN/ZH/HI at 1681x1270, 1440x900, and 390x900: all sampled solution-card titles had `titleOverflow=0`, card/page overflow was `0`, choose buttons were visible, and EN `Supplier Network` measured `lineCount=1` at 1681px and 1440px. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Inline script syntax check for `solutions.html` -> OK for 2 scripts.

**Remaining failures:** none found for this scoped solution-layer card-title fit task. Earlier Package A/B dirty source changes remain outside this audit item and were not reverted or repackaged.

**Notes for next handoff:** keep `sampora-website-public-v3/` as the active working source. Do not reapply `text-wrap: balance` to `.plan-card h3` on desktop without rechecking English `Supplier Network` and the ZH/HI card titles at desktop widths. Mobile wrapping below 680px is intentional.

### 2026-05-19 CST - Package B fit recommendation vertical distribution

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No visible copy, translations, CTA hrefs, topology/workflow carousel logic, compare table data, other pages, QA evidence outputs, delivery folders, zips, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package B `section#fit .recommend` vertical rhythm. The right recommendation card had its content group centered as one block, leaving large empty bands above and below the actual content. The card now uses a grid row structure so the label, title, and description start near the top, while the mini-metrics area consumes the remaining lower space. This keeps the three metric cards aligned and distributes the available height instead of bunching the content in the middle.

**Verification run:** controller red check before repair showed EN Network at 1681x1270 had `cardHeight=521.44px`, `topGap=130.5px`, `metricsBottomGap=130.5px`, `descToMetrics=26px`, and `.recommend` computed as `display:flex` / `justify-content:center`. Post-repair no-screenshot Chrome DOM checks passed for EN/ZH/HI at 1681x1270 and 1440x900 across `panel`, `network`, and `enterprise`: top gap was `29px`, metrics bottom gap was `29px`, desc-to-metrics gap was `44px`, metric card height spread was `0`, label top spread was `0`, strong overflow max was `0`, metrics stayed inside the card, and page overflow was `0`. Mobile 390x900 EN/ZH/HI Network also passed with page overflow `0` and metrics inside the card. Worker checks and controller rerun passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; inline script syntax check for `solutions.html` -> OK for 2 scripts.

**Remaining failures:** none found for this scoped `#fit` recommendation-card vertical-distribution task. Existing dirty changes outside this audit item were not reviewed, reverted, packaged, staged, committed, or pushed.

**Notes for next handoff:** do not restore `.recommend { justify-content:center; }` for the `#fit` recommendation card. Future `#fit` layout work should measure top gap, desc-to-metrics gap, metrics bottom gap, metric label alignment, strong overflow, and page overflow across EN/ZH/HI before claiming completion.

### 2026-05-19 CST - Controller scoped total validation after Package A/B point fixes

**Files changed:** `SAMPORA_LATEST_REPAIR_HANDOFF.md` only for this controller validation note. No page source, QA evidence outputs, delivery folders, zips, staging, commit, push, or packaging files were intentionally changed by the controller validation step.

**Audit items covered:** current batch closeout for Package A homepage hero proof cards / hero-left rhythm and Package B Solutions `#fit` recommendation metrics, fit carousel click-lock, `#workflow` tab carousel click-lock, and `#compare` decision-matrix column balance. Rawls read-only review passed EN/ZH/HI synchronization for the latest Solutions metric changes. Boole read-only review passed homepage hero proof card fallback, EN/ZH/HI translations, CSS/card geometry, mobile overflow, and CTA href preservation.

**Verification run:** controller fresh checks passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS; `node --check` for `assets/i18n-sweep.js`, `assets/resource-manuals/data.js`, and `assets/resource-manuals/app.js` -> exit 0; `node "sampora-website-public-v3\qa-evidence\resource-manuals-language-smoke.mjs"` -> OK; `node "sampora-website-public-v3\qa-evidence\resource-manuals-browser-language-check.mjs"` -> OK. Inline script syntax checks passed for `index.html` (4 scripts) and `solutions.html` (2 scripts). Controller no-screenshot Chrome DOM checks passed for `index.html` EN/ZH/HI at 1440px and 390px: three proof cards present, desktop cards equal-height/equal-top, mobile no horizontal overflow, and Start trial / Book demo intent URLs preserved. Controller no-screenshot Chrome DOM checks passed for `solutions.html` EN/ZH/HI at 1440px and ZH 390px: fit selectors auto-cycle without user click and stay locked after clicking Enterprise; workflow tabs auto-cycle without user click and stay locked after clicking Panel; Enterprise primary asset renders as vertical lines with no plus signs; workflow metric lines start with `→`; Panel workflow spans stay `nowrap` with overflow 0, including `→ survey participation`; mini metric card height spread and label-top spread are 0; compare header widths are about `325.91 / 344.02 / 344.02 / 344.06px`; page overflow is 0; mobile compare scroll stays inside `.compare-wrap`.

**Remaining failures:** none found in this scoped controller total validation. Full screenshot-based `page-layer-browser-check.mjs`, Lighthouse/axe, delivery sync, zip inspection, and packaging were intentionally not run because the user has not asked for packaging/final delivery artifacts and the current batch was scoped to working-source point fixes.

**Notes for next handoff:** keep `sampora-website-public-v3/` as the active source. Do not rebuild zips or create a new delivery version until explicitly requested. Future visible-copy changes must continue to update EN/ZH/HI primary source data together and should use read-only review plus no-screenshot browser DOM checks for quick point-fix closeout when packaging is out of scope.

### 2026-05-19 CST - Package A comprehensive homepage continuation

**Files changed:** `sampora-website-public-v3/index.html`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, and `ISSUE_LEDGER.md` for scoped evidence notes. No other HTML pages, resource-manual assets, QA evidence outputs, delivery folders, zips, README files, package artifacts, staging, commit, push, or packaging files were intentionally changed.

**Audit items addressed:** `[CONFIRMED]` Package A continuation items A-F. Role scenarios now have synced fallback/EN/ZH/HI role copy, Chinese terminology uses `自有样本运营方` where in scope, Hindi role content is Devanagari-first, and `.quote .impact` no longer uses `margin-top:auto`; desktop p-to-impact gaps verify at `14px`. Hero console Operation Feed uses stable grid rows with aligned time/body/status columns. Dynamic project console/feed data now uses separate EN/ZH/HI project arrays instead of `projects.zh = projects.en` / `projects.hi = projects.en`. Topology stage labels are brighter, slightly larger, weight `700`, and baseline-aligned in normal and modal views while core node labels remain English. Paint-heavy `body::after signalSweep`, `body::before ambientDrift`, and offscreen `sectionBreath` references were removed while active topology flow/packet motion remains. Homepage capability 09, product surfaces, pricing roles/lists, workflow, final CTA/FAQ, and the assigned ZH hero/footer terminology were synchronized for EN/ZH/HI.

**Verification run:** scoped red checks before editing confirmed copied-through role/project data, `projects.zh = projects.en`, `projects.hi = projects.en`, `.quote .impact { margin-top:auto }`, ambient animation names, and stale role focus strings. Post-repair checks passed: inline `index.html` script syntax extraction -> OK for 5 scripts; static source assertions -> `projects` aliases removed, quote impact auto margin absent, `signalSweep|ambientDrift|sectionBreath|pulse-lime` absent, old role focus prefixes absent; `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Chrome/Playwright no-screenshot DOM checks passed for EN/ZH/HI at 1440px and 390px: document overflow `0`, role p-to-impact gaps `14px`, feed row overflow `0`, desktop feed body-to-status gaps positive, hero proof overflow `0`, ZH/HI major samples localized, Start trial and Book demo hrefs preserved. A broader browser pass also covered 1680px. Topology modal check passed with close text `X`, ZH aria `关闭拓扑`, stage labels at `9px` / weight `700` / fill `rgba(202, 226, 246, 0.72)`. Motion sampling passed with active `topoDash` dash offset changing and packet coordinates changing. rAF sampling after ambient removal measured p50 about `16.7ms` and p95 about `16.9ms`.

**Remaining failures:** none found in this scoped Package A continuation. Full screenshot browser suite, Lighthouse/axe, delivery sync, zip rebuild, and packaging were intentionally not run because this was a working-source point repair and the user explicitly forbade package/delivery changes.

**Notes for next handoff:** keep `sampora-website-public-v3/` as the active working source. Do not reintroduce project data aliases for ZH/HI, role impact auto-push, or full-page ambient sweep animations. Future homepage visible-copy changes must update fallback/EN/ZH/HI together and rerun scoped browser checks for role scenarios, hero console feed, topology modal labels/motion, CTA hrefs, and no horizontal overflow.

### 2026-05-19 CST - Package B Panel exact phrase verification

**Files changed:** `SAMPORA_LATEST_REPAIR_HANDOFF.md` only for this verification note. No page source, visible copy, translations, CSS, CTA hrefs, QA evidence outputs, delivery folders, zips, staging, commit, push, or packaging files were intentionally changed.

**Audit item checked:** `[VERIFY-FIRST -> REMOVED]` old source-only subagent report claimed the EN Panel solution card lacked the exact phrase `Owned panel and survey site operations`. Fresh current source and browser evidence disproved the old report, so no Package B implementation task was dispatched.

**Verification run:** source check with `Select-String` found `Owned Panel Operations`, `For teams focused on Owned panel and survey site operations...`, `Member incentives, wallet records and finance logs`, and `Optional Partner Network exposure for sample demand` in `sampora-website-public-v3/solutions.html`. No-screenshot Chrome DOM check at 1681x1270 for EN/ZH/HI confirmed the EN Panel solution card raw text includes `Owned panel and survey site operations`, does not include `Owned respondent operations`, and page horizontal overflow is `0`.

**Remaining failures:** none for this exact-phrase verification item. This was not a full rewrite or full i18n copy review, and no packaging/delivery validation was run.

**Notes for next handoff:** do not treat the old source-only exact-phrase report as current evidence. If a future reviewer wants broader Panel-card terminology or translation polish, re-enter it as a fresh multilingual `Language/i18n` verification item with current evidence before any repair.

### 2026-05-19 CST - Package A urgent hero-left layout user-failed rework

**Files changed:** `sampora-website-public-v3/index.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No other pages, visible copy semantics, translations, CTA hrefs, right hero console/topology, role scenarios, `#contact`, dynamic data, QA evidence outputs, delivery folders, zips, README, staging, commit, push, or packaging files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left untouched because no recurring issue status changed.

**Audit item addressed:** `[CONFIRMED]` Package A homepage hero-left visual rhythm user-failed返工 after earlier PASS reports. The user reported the real browser still looked like the whole left hero block was squeezed into one cluster with too much top/bottom empty space. This repair is limited to scoped CSS for `.hero-copy`, `.hero h1`, `.hero-sub`, `.hero .cta-row`, `.hero-proof-grid`, and `.proof-mini`: desktop hero grid now stretches the left column to the hero row height, centers a taller natural content group, uses language-aware spacing for EN/ZH/HI, gives ZH subtitle width enough wrapping to avoid a short-language cluster, and keeps proof cards readable with larger title/body spacing and no text overflow.

**Verification run:** red browser geometry before this rework showed the old PASS evidence was incomplete: EN at 1680x1270 had content/group height `631.06px` inside `853.86px` grid height (`ratio=0.74`, grid top/bottom empty `111.39/111.41px`), EN at 1440x900 had `ratio=0.73` with top/bottom `113.89/113.89px`, and ZH was worse at `ratio=0.62-0.63` with top/bottom empty about `155-163px`. The previous reported `22/20/26/24px` group gaps did not prove whole-block visual rhythm. Post-repair Chrome geometry passed for EN/ZH/HI at 1680x1270, 1440x900, and 390x900: EN ratios are `0.95` at 1680 and `0.85` at 1440; ZH ratios are `0.76` at 1680 and `0.78` at 1440; HI ratios are `0.98` at 1680 and `1.00` at 1440 because Hindi content is naturally taller, with no horizontal overflow. Desktop group gaps are EN `28/24/34/30px`, ZH `34/28/40/36px`, and HI `22/20/26/24px`; proof cards measure EN/HI `133.25px` high and ZH `128px` high, title/body gap `10px`, card text overflow `0`, and document horizontal overflow `0`. Mobile 390 EN/ZH/HI kept overflow `0`, proof card overflow `0`, and auto-height cards. CTA hrefs stayed `contact.html?intent=start_trial#contact-form` and `contact.html?intent=book_demo#contact-form`. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS.

**Remaining failures:** none found in this scoped Package A hero-left layout rework. Existing dirty workspace changes outside this specific CSS/handoff entry were not reviewed, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** do not accept hero-left rhythm based only on local gap numbers. Future checks must include content group height, hero-copy/grid height, content ratio, grid top/bottom empty, proof card internal gaps, overflow, and CTA href preservation across EN/ZH/HI desktop plus mobile smoke. Do not undo this by restoring centered shrink-wrap `.hero-copy` without rerunning the whole-block geometry.

### 2026-05-19 CST - Package A hero topology pool node visual alignment

**Files changed:** `sampora-website-public-v3/index.html`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, and `ISSUE_LEDGER.md` for scoped `TOPOLOGY-001` evidence. No other pages, hero-left, hero proof cards, Role scenarios, Operation feed, dynamic project data, translations semantics, CTA hrefs, QA evidence outputs, delivery folders, zips, README files, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package A hero console topology SVG visual repair for the center `SAMPLE SUPPLY POOL` node. Red browser geometry showed the center pool card was oversized against the neighboring nodes (`190x66` versus Sampora `130x54` and Review/Settle `58x56`), the pool text group was left-biased by about `-22px` in normal and modal views, and the pool subtitle used a much dimmer fill (`rgb(79, 98, 128)`) than nearby node subtitles. The repair narrows the pool node to `160x58`, keeps it slightly wider than Sampora only because the full uppercase title needs room, recenters the title/subtitle with `text-anchor="middle"`, raises subtitle readability to `var(--fg2)`, and synchronizes the router/pool/source path endpoints to the new card edges.

**Verification run:** post-repair Chromium geometry passed for EN/ZH/HI at 1440x900 and 1680x1270 in both normal hero and expanded modal. Pool rect was `160x58`, Sampora `130x54`, Review/Settle `58x56`; pool text center offset stayed within `0.25px` horizontal and about `-1.13px` vertical; title/subtitle overflow was `0/0`; pool title fill was `rgb(123, 227, 255)` and subtitle fill was `rgb(188, 203, 224)`. Motion sampling in the same checks kept `topoDash` active with changing dash offsets and moving packets. Modal live-node check passed: initial `#network` count `1` under `.container.hero-grid`, modal open moves the same node to `.topology-modal__body` with close text `X`, and close restores it to `.container.hero-grid`. Stage labels remained `9px` / weight `700` / `rgba(202, 226, 246, 0.72)`, and document horizontal overflow remained `0`. `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS. `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS.

**Remaining failures:** none found for this scoped topology pool-node visual alignment task. Existing dirty workspace changes outside this specific source/docs evidence were not reviewed, reverted, packaged, staged, committed, or pushed.

**Notes for next handoff:** keep the pool node near `160x58` unless a future visual check proves the long uppercase title can remain readable at a narrower width. If changing this topology again, remeasure normal and modal node bboxes, text center offsets, subtitle fill, path endpoints, EN/ZH/HI language switching, live-node modal restore, `topoDash` dash-offset changes, packet motion, stage labels, and horizontal overflow.

### 2026-05-19 CST - Package A Hindi hero console localization follow-up

**Files changed:** `sampora-website-public-v3/index.html`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, and `ISSUE_LEDGER.md` for scoped `I18N-001` evidence. No other pages, delivery folders, zip files, QA evidence artifacts, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package A Hindi hero/topology console peripheral text. Fresh source red checks showed `translations.hi` and `projects.hi` still had English console terms such as `idle`, `Completes`, `QC pass`, `CPI avg`, `14/22/31 reviewed`, `$5.30 plan`, `review pending`, and related English ticker/status wording. Core topology SVG node labels such as `SAMPLE SUPPLY POOL`, `PANEL_01`, and similar system labels were intentionally preserved per topology policy.

**Verification run:** scoped source check after repair confirmed the Hindi `translations.hi` override and `projects.hi` block have no hits for `COMPLETES`, `Completes`, `reviewed`, `plan`, `review pending`, `pending review`, `idle`, `QC pass`, or `CPI avg`. Inline `index.html` script syntax extraction passed for 5 scripts. Static guards passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS. Chromium 1440x900 no-screenshot DOM check passed for EN/ZH/HI: EN console stayed English, ZH console stayed Chinese, HI console labels/trends/meta/feed/ticker were Devanagari-first for the sampled running project, document horizontal overflow was `0`, and console section overflow count was `0`.

**Remaining failures:** none found for this scoped Hindi hero console localization follow-up. Broader Hindi copy outside the right hero console/topology peripheral scope was not reviewed or repaired.

**Notes for next handoff:** when touching homepage hero console or topology peripheral copy again, verify the runtime `projects.hi` data in addition to translation keys. Do not rely on `i18n-sweep.js` alone, and keep core uppercase topology node labels in English unless the topology policy changes.

### 2026-05-19 CST - Package B Solutions terminology repair

**Files changed:** `sampora-website-public-v3/solutions.html` and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No other pages, QA evidence outputs, delivery folders, zips, staging, commit, push, packaging files, screenshots, old public folders, or motion/reference files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left unchanged because the recurring `I18N-001` / `TERMINOLOGY-001` routing status did not change.

**Audit item addressed:** `[CONFIRMED]` Package B `solutions.html` terminology conflict under `Language/i18n`. Chinese `heroSub` and `footerDesc` now use the glossary-required `自有样本运营方` instead of the stale Panel Provider Chinese variants. Hindi `statusMid` and the Panel solution-card badge no longer keep the full English `Panel Provider` string; they use Devanagari-first copy while retaining allowed product/industry terms such as `Panel`, `Sample Supplier`, and `Enterprise`.

**Verification run:** red check before editing found current conflicts in `solutions.html`: ZH `heroSub` and `footerDesc`; HI `statusMid` and Panel-card `badge`. Post-repair source checks passed for the scoped conflict terms: no hits for `样本服务商` or `自有 Panel 供应商`; remaining `Panel Provider` hits are EN meta/footer copy only, not Chinese or Hindi body copy. Inline `solutions.html` script syntax extraction passed for 3 scripts. Static guards passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS. Chromium no-screenshot DOM smoke at 1440x900 for EN/ZH/HI passed: ZH visible hero/footer had `自有样本运营方`, no ZH bad terms, no visible `Panel Provider`; HI `statusMid` and Panel badge had no full `Panel Provider`; document horizontal overflow was `0` in all three languages.

**Remaining failures:** none found for this scoped Solutions terminology task. Existing dirty `solutions.html` changes outside these terminology strings were not reviewed, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** future Package B visible-copy work must keep checking `SAMPORA_TERMINOLOGY_GLOSSARY.md` before edits and verify both source strings and runtime DOM text. Do not treat EN `panel providers` meta/footer wording as a Chinese/Hindi terminology conflict unless a future audit explicitly scopes English wording.

### 2026-05-19 CST - Package B/C/D non-home terminology repair

**Files changed:** `sampora-website-public-v3/contact.html`, `sampora-website-public-v3/plans.html`, `sampora-website-public-v3/resources.html`, `sampora-website-public-v3/resource-manuals.html`, and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No `index.html`, `solutions.html`, QA screenshots/evidence outputs, delivery folders, zips, old public folders, staging, commit, push, packaging files, or motion/reference files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left unchanged because the recurring `I18N-001` / `TERMINOLOGY-001` routing status did not change.

**Audit item addressed:** `[CONFIRMED]` non-home small-page terminology conflicts under `Language/i18n`. `contact.html` ZH `rolePanel` and `footerDesc`, `plans.html` ZH `footerDesc` and matrix `主要用户`, `resources.html` ZH `footerDesc`, and `resource-manuals.html` ZH `brand` now use the glossary-required `自有样本运营方` instead of `样本服务商`. Hindi footer/brand strings in `contact.html`, `plans.html`, and `resource-manuals.html` no longer keep the full English `Panel Provider` phrase inside Hindi body copy; they use Devanagari-first wording while retaining allowed terms such as `Panel`, `Sample Supplier`, and `Partner Network`.

**Verification run:** red check before editing used `Select-String` on the four assigned HTML files and confirmed current hits for `样本服务商` in `contact.html`, `plans.html`, `resources.html`, and `resource-manuals.html`, plus Hindi `Panel Provider` hits in `contact.html`, `plans.html`, and `resource-manuals.html`. Post-repair scoped source checks passed: no hits for `样本服务商` or `自有 Panel 供应商` in the four assigned files; no Hindi-pattern hits for `Panel Provider` (`Panel Provider और`, `Panel Provider टीम`, `Panel Provider के`, `Panel Provider की`, `Panel Provider का`, or `Panel Provider `). Remaining `Panel Provider` / `panel providers` hits are EN fallback/meta/value copy only. Static guards passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\active-handoff-mojibake-guard.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\resource-manuals-language-smoke.mjs"` -> OK; `node "sampora-website-public-v3\qa-evidence\resource-manuals-browser-language-check.mjs"` -> OK. A lightweight no-screenshot DOM smoke was attempted via Playwright CLI against a temporary localhost server, but the CLI `eval` command could not complete due argument parsing; generated `.playwright-cli` scratch artifacts were removed, and no QA screenshots/evidence outputs were kept or changed.

**Remaining failures:** none found in scoped source/static/resource-manual verification for the assigned terminology conflicts. Runtime DOM overflow checks for `contact.html`, `plans.html`, and `resources.html` were not completed because the local Playwright module was not available and the CLI eval path failed; no browser-only failure evidence was observed.

**Notes for next handoff:** keep EN `panel providers` / form option values as natural English unless a future audit explicitly scopes English wording. Future non-home terminology work should continue to verify both source strings and, when the browser tool is available, EN/ZH/HI runtime text without writing screenshot artifacts.

### 2026-05-20 JST - Package B resources topology mode-switch layout stability

**Files changed:** `sampora-website-public-v3/resources.html`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, and `ISSUE_LEDGER.md` for scoped `TOPOLOGY-001` evidence. No `solutions.html`, `index.html`, QA scripts, QA evidence outputs, delivery folders, zips, README files, staging, commit, push, or packaging files were intentionally changed.

**Audit item addressed:** `[CONFIRMED]` Package B `resources.html` topology/resource mode switching vertical reflow. Red Playwright geometry against current files showed EN desktop setup/supplier/finance changed hero/console/next section by `22.67px`, HI desktop by `24.08px`, and HI mobile by `39.08px`; `.topo-stage` stayed stable while `.console-summary`, `#consoleSub`, and mobile ticker text height changed. The repair adds scoped CSS height reserves for the resource console summary and ticker, with a 1280px desktop reserve and a mobile reserve, without changing visible copy or topology JavaScript.

**Verification run:** post-repair Playwright geometry passed for EN/ZH/HI across setup/supplier/finance at 1280x932, 1440x900, and 390x900: hero height, console/window height, and next-section offset deltas were `0px`; `.topo-stage` stayed `246px` desktop and `240px` mobile. Active flow groups still switched to `flowSetup`, `flowSupplier`, and `flowFinance`. Motion sampling passed after the final CSS change: active `topoDash` remained present, dash offsets changed for all three modes, and packet centers moved. Static checks passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `git diff --check` -> exit 0 with CRLF warnings only.

**Remaining failures:** none found in this assigned `resources.html` topology layout stability scope. Existing dirty workspace changes outside the assigned file/docs evidence were not reviewed, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** keep validating resources topology with live browser geometry, not screenshots only. If future copy changes lengthen mode summary or ticker text, rerun EN/ZH/HI setup/supplier/finance geometry at 1280px, 1440px, and 390px and confirm active `topoDash` plus packet movement remain intact.

### 2026-05-20 JST - Package C plans matrix side whitespace

**Files changed:** `sampora-website-public-v3/plans.html`, `ACCEPTANCE_TESTS.md`, and `SAMPORA_LATEST_REPAIR_HANDOFF.md`. No other pages, visible copy/i18n strings, CTA hrefs, footer/legal behavior, contact backend behavior, QA evidence outputs, delivery folders, zips, README/deployment docs, staging, commit, push, or packaging files were intentionally changed. `ISSUE_LEDGER.md` was intentionally left unchanged because this was a one-off visual layout issue, not a recurring ledger item.

**Audit item addressed:** `[CONFIRMED]` Package C `plans.html` `section#matrix` pricing matrix side whitespace. Red browser geometry showed `.matrix-wrap` filled or nearly filled the section container at desktop/tablet sizes: 1280px inner margins `0/0`, 1440px `20/20`, and 1750px `20/20`, while 390px mobile already had document overflow `0` and internal matrix scroll `356/960`. The repair adds a scoped `#matrix .matrix-wrap` desktop/tablet cap of `1120px` with a matching mobile override that preserves `width:100%`, `max-width:100%`, `overflow-x:auto`, and `overflow-y:hidden`. `#matrixTable` keeps `min-width:960px`.

**Verification run:** post-repair Playwright geometry against current `sampora-website-public-v3/plans.html` passed: 1280px container/wrap `1232/1120` with inner margins `56/56`; 1440px `1360/1120` with `120/120`; 1750px `1360/1120` with `120/120`; all desktop/tablet samples had document overflow `0`. Mobile 390px passed with document overflow `0`, wrap client/scroll `356/960`, table min-width `960px`, computed wrap max-width `100%`, `overflow-x:auto`, and `overflow-y:hidden`. Static checks passed: `node "sampora-website-public-v3\qa-evidence\final-audit-static-check.mjs"` -> PASS; `node "sampora-website-public-v3\qa-evidence\page-layer-static-check.mjs"` -> PASS; `git diff --check` -> exit 0 with CRLF warnings only.

**Remaining failures:** none found in this scoped Package C visual layout repair. Existing dirty workspace changes outside the assigned file/docs evidence were not reviewed, reverted, staged, committed, packaged, or synced.

**Notes for next handoff:** keep the matrix wrapper centered and narrower than the section container on desktop/tablet, and keep validating 390px as no document horizontal overflow plus internal `.matrix-wrap` horizontal scroll. If future work changes the matrix width, table min-width, or mobile overflow rule, rerun the same 1280/1440/1750/390 geometry check.
