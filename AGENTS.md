# Workspace Agent Instructions

Before modifying any Sampora website files, read:

`SAMPORA_LATEST_REPAIR_HANDOFF.md`

Also read the acceptance contract:

`ACCEPTANCE_TESTS.md`

Check recurring issue status in:

`ISSUE_LEDGER.md`

Detailed historical logs are archived in:

`SAMPORA_LATEST_REPAIR_LOG.md`

Read the log only when tracing history, debugging a regression, or checking why a previous change was made.

## Sampora intake file index

Use this index before classifying or dispatching Sampora work. It exists so new controllers and subagents do not miss supporting handoff files.

Always read or check:

- `SAMPORA_LATEST_REPAIR_HANDOFF.md`: active control document, scope, current source of truth, package boundaries, and latest handoff notes.
- `ACCEPTANCE_TESTS.md`: acceptance categories, issue-status workflow, validation tiers, and required proof before delivery claims.
- `ISSUE_LEDGER.md`: stable recurring issue IDs, current status, last evidence, and allowed action.
- `SAMPORA_TERMINOLOGY_GLOSSARY.md`: required before changing EN/ZH/HI visible copy, i18n keys, topology labels, workflow copy, pricing/FAQ/footer/CTA copy, dynamic sample/project data, or resource-manual language.

Read only when relevant:

- `SAMPORA_LATEST_REPAIR_LOG.md`: detailed history, old evidence, and regression tracing. Do not use it as current proof.
- `redirect-map.md`: redirect, deployment, package, or legacy-route work.
- `sampora-website-public-v3/README.md`, `DEPLOYMENT_NOTES.md`, `QA_REPORT.md`, `verification-report.md`, `backend-form-handoff.md`, `content-audit-fixes.md`, `visual-animation-fixes.md`, and `MODIFICATION_SUMMARY.md`: public-package docs and prior QA notes for the active source tree. Verify current files before relying on them.
- `README.md`, `PROJECT_HANDOFF.md`, `SurveySaaS_官网终审交接文档.md`, `docs/surveysaas/product-positioning-summary.md`, `docs/surveysaas/sample-supplier-taxonomy.md`, and `docs/surveysaas/backend-function-map.md`: product positioning, target-customer taxonomy, backend capability, and claim-authenticity references. Read when positioning, visible claims, role taxonomy, product capability, backend evidence, or sales/demo narrative is in scope; verify current page/source files before relying on them.
- `补充资料归档/README.md`, `补充资料归档/operations-console/README.md`, `补充资料归档/operations-console/DESIGN_STRATEGY_v4.7.md`, and `补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md`: local design/product reference material. Read when visual direction, operations-console design strategy, or old design rationale is relevant; do not treat it as current proof.
- `SAMPORA_CONFIRMED_FIX_RESULT.md`, `SAMPORA_COPY_FIX_RESULT.md`, `SAMPORA_RUNTIME_VERIFY_RESULT.md`, `SAMPORA_TOPOLOGY_MARK_FIX_RESULT.md`, `content-audit-fixes.md`, `verification-report.md`, and `visual-dynamic-fixes.md`: historical repair/result reports. Read only when tracing prior repair decisions, package identity, or regression history; rerun current checks before action.
- `archives/`, `动态/`, and other local reference/demo folders when present: historical/reference material only. They can guide checks but cannot prove current page state.

Before dispatching a subagent, paste the specific files from this index that are relevant to that subagent's scope. Do not assume subagents will discover them on their own.

For Sampora repair work:

## Current user override: no default acceptance/review loops

This section overrides any older Sampora rule below that requires default first-pass verification workers, final-review workers, visual acceptance, real visual perception PASS, or full acceptance reruns.

- Since 2026-05-22, ordinary Sampora repair rounds should proceed as direct scoped repair, not as "verify -> repair -> review -> final acceptance" loops.
- Do not dispatch read-only verification subagents, visual acceptance reviewers, or final-review subagents unless the user's newest message explicitly asks for verification, review, screenshots, browser proof, acceptance, packaging, or final delivery validation.
- When the user provides a current screenshot or direct visual complaint, treat it as sufficient current complaint evidence for a scoped repair. Do not move it back into a verification queue just to prove it again.
- Implementation agents may run only the smallest useful mechanical checks needed to avoid syntax breakage, destructive edits, or ownership mistakes. Do not expand those checks into acceptance gates.
- Final responses must not claim `PASS`, `accepted`, `verified`, or `real visual perception PASS` unless the user explicitly requested that check and it was actually run. If no final acceptance/review was run, say `not acceptance-reviewed` or `未做验收`.
- Handoff updates should list changed files, untouched scope, commands actually run if any, and known remaining risk. They should not require before/after screenshots, reviewer judgment, or EN/ZH/HI visual sweeps by default.

- Treat `SAMPORA_LATEST_REPAIR_HANDOFF.md` as the control document and single working handoff source.
- Treat `ACCEPTANCE_TESTS.md` as a reference contract, not a default final-acceptance gate, unless the user explicitly requests acceptance, review, packaging, or final delivery validation.
- Treat `ISSUE_LEDGER.md` as the stable ID/status map for recurring issues; check it before creating implementation work for anything that resembles a historical failure.
- Treat the current assistant/new agent as the controller by default. The controller handles intake, issue-status decisions, package/file ownership, subagent dispatch when useful, conflict handling, concise evidence synthesis, and handoff records. Do not dispatch first-pass verification, visual acceptance review, or final read-only review by default.
- The controller must not directly implement page/source repairs after classification unless subagents are unavailable, the user explicitly asks the controller to do it, or the task is narrow enough that dispatch would add process overhead. Docs/process governance edits by the controller are allowed when the newest user message is about handoff, acceptance, ledger, or intake policy.
- Do not modify files before summarizing the handoff document's current instructions, active scope, known pitfalls, and planned file ownership.
- If the user says "先按 AGENTS.md 和 SAMPORA_LATEST_REPAIR_HANDOFF.md 接手，不要跳过交接规则", run the default repair intake gate before any file edits.
- The default repair intake gate is short, not a long plan mode. Run it internally unless the user explicitly asks to see the plan. It must determine: current explicit issues to fix; explicit out-of-scope areas; package split and writable files; the smallest useful check if any; whether an implementation subagent is worthwhile; and what will be intentionally left unverified.
- Do not spend user-facing time printing the intake gate by default. Give only a brief status update before execution unless blocked or asked to show the plan.
- If the intake gate finds unclear scope, cross-package write overlap, or any need to touch an unmentioned area, stop and ask the user before editing.
- If the intake gate is clear and the user's newest message asks to proceed or gives repair content, continue with the subagent workflow after the gate; do not require the user to repeat all handoff rules.
- All issues proposed by GPT, a human reviewer, Codex, a downloaded report, or another agent enter the pending verification pool first. Do not send any item directly to implementation before the status table is created.
- If a proposed issue resembles an `ISSUE_LEDGER.md` row, include that stable ID, current ledger status, last evidence, and allowed action in the status table.
- When the user provides any repair checklist, GPT/web-audit summary, Markdown issue list, or audit issue list, verify each item against the current files before repair. Do not treat the list itself as proof.
- For each item, normalize: acceptance category, existing coverage, coverage gap, owner package, red check, completion check, and issue status.
- Present a concise issue status table before edits. Include item, status, evidence or command, owner package, and allowed action. This table is separate from the internal intake gate and should stay short.
- Use these issue statuses:
  - `[CONFIRMED]`: the issue exists now, maps to an acceptance category, has an owner package, and has a failing red check or concrete file/browser evidence.
  - `[VERIFY-FIRST]`: the issue is plausible but not proven in the current files or browser state.
  - `[STRATEGY]`: the item is about docs, redirect policy, packaging policy, deployment guidance, or acceptance coverage, not page behavior.
  - `[REGRESSION]`: the item is a standing regression guard. Rerun the mapped check every round, but do not repair page/source files unless the check currently fails and the item is reclassified as `[CONFIRMED]`.
  - `[REMOVED]`: the item was a historical issue that no longer exists in the current package. Do not repair or reintroduce it; keep only evidence if needed.
  - `[OUT-OF-SCOPE]`: the item is not in the latest audit or newest user message, or it would require touching an unassigned area.
  - `[BLOCKED]`: the item is ambiguous, cannot be mapped to an owner package or acceptance category, or needs information the current workspace cannot provide.
- Only repair `[CONFIRMED]` items. For `[VERIFY-FIRST]`, only add/run tests, grep checks, or browser verification until the item becomes `[CONFIRMED]` or is disproven. For `[STRATEGY]`, only edit related docs, QA policy, acceptance coverage, delivery packaging, or handoff strategy; do not change page functionality. For `[REGRESSION]`, rerun the guard and record PASS/FAIL; repair only after current failure evidence reclassifies it as `[CONFIRMED]`. Do not repair `[REMOVED]`, `[OUT-OF-SCOPE]`, or `[BLOCKED]` items; ask only for the blocked or unclear items.
- Do not delegate first-pass verification by default. Use read-only verification subagents only when the user explicitly asks for verification/review, the issue is ambiguous enough to block editing, or the controller cannot map ownership safely.
- Do not repair checklist items that cannot be mapped to an acceptance category and owner package.
- Only fix items named in the latest Sampora audit.
- Anything not explicitly named in the latest audit is out of scope and must not be changed.
- Every new visual, business-path, language, motion, legal, or packaging regression must be mapped to `ACCEPTANCE_TESTS.md` before repair. If no acceptance item covers it, add or update one before or alongside the fix.
- A repair is not complete if the relevant acceptance check is missing or has not been rerun.
- Visual acceptance / 视觉验收 is disabled by default for ordinary Sampora repair rounds. Run it only when the user's newest message explicitly asks for acceptance, review, screenshots, browser proof, or final delivery validation.
- Do not claim `real visual perception PASS` or any visual PASS unless that acceptance layer was explicitly requested and actually run.
- When several issue types are present, use dependency order unless the controller has current evidence that a different order is safer: packaging/redirect policy first; global i18n/footer/CTA policy second; contact form and intent handling third; topology/workflow motion fourth; SEO, Lighthouse, axe, delivery sync, and final acceptance last.
- Match verification depth to change scope: light single-package fixes use scoped checks; global/shared changes use full regression for the affected contract; final delivery, zip rebuilds, and broad cross-package changes use full five-layer validation. Do not run Lighthouse, axe, full browser screenshots, or unrelated resource-manual checks for every small docs/contact/topology task unless the mapped acceptance category requires them.
- Preserve the original repair approach: split every detachable task to subagents with disjoint file ownership.
- Use short write locks for Sampora implementation work. A write lock is required only for the actual file-write window, not for read-only verification, browser checks, grep/static checks, or review. Before writing, the implementation agent must check the latest handoff/diff for active or recent ownership of the same file/selector/function, announce the exact file and scoped region it is about to write, and proceed only if there is no overlap. Release the lock immediately after the file write is complete, then run verification without holding the write lock. If another active/recent writer owns the same file or scoped region, stop as `[BLOCKED: overlapping write ownership]` and make no edits.
- Do not delegate visual acceptance review or final review by default. Use review subagents only when the user explicitly asks for review/acceptance, or when packaging/final delivery is explicitly requested.
- Do not assume subagents automatically read global instructions. When dispatching a subagent, paste the relevant handoff package, ownership boundary, issue-status decision, allowed action, failure-prevention rules, required verification, and handoff-log requirement directly into that subagent's prompt.
- Every implementation subagent prompt must require the subagent to read `AGENTS.md`, `SAMPORA_LATEST_REPAIR_HANDOFF.md`, `ACCEPTANCE_TESTS.md`, and the relevant `ISSUE_LEDGER.md` row(s), plus `SAMPORA_TERMINOLOGY_GLOSSARY.md` and any indexed on-demand files when visible copy, terminology, product claims, routing, packaging, or visual references are in scope. It must require the subagent to restate assigned files and out-of-scope files, keep disjoint ownership, avoid unrelated edits, run only the smallest useful mechanical checks unless the user requested more, append its result to the handoff log, and avoid claiming PASS for any check that was not run.
- Every read-only verification subagent prompt must require the subagent to read `SAMPORA_LATEST_REPAIR_HANDOFF.md` and `ACCEPTANCE_TESTS.md`, restate its assigned issue subset and out-of-scope files, make no edits, verify each item against current files/scripts/browser state, report evidence, recommend `[CONFIRMED]`, `[VERIFY-FIRST]`, `[STRATEGY]`, `[REGRESSION]`, `[REMOVED]`, `[OUT-OF-SCOPE]`, or `[BLOCKED]`, and recommend an owner package.
- Review subagent prompts are optional and must only be created after an explicit user request for review/acceptance or final delivery validation.
- The controller/main agent must avoid unnecessary process loops. It may run minimal sanity checks to prevent syntax breakage, ownership mistakes, or destructive edits, but must not turn those checks into a final acceptance gate unless the user asks.
- Keep changes within the assigned file ownership boundaries.
- Do not rely on old handoff reports, old screenshots, or previous QA JSON as proof.
- After every repair or review round, append an entry to the handoff document's `Handoff Update Log`.
- Each update log entry must include files changed, verification run, remaining failures, and notes for the next agent.
- When a repair, verification round, or strategy change resolves or reclassifies a recurring issue, update `ISSUE_LEDGER.md` in the same round.
- Do not claim verification or acceptance without fresh verification evidence. For ordinary repair handoff, report the changed files, intentionally untouched areas, and whether final acceptance was not run.
- Do not paste mojibake or broken multilingual text into source files.
- For final delivery work, verify the public source directory directly before syncing handoff docs or rebuilding zip files.
- After any repair iteration that changes source, reports, QA evidence, handoff docs, delivery folders, or zip files, name the current deliverables with the repair iteration suffix (`v1`, `v2`, ...). If the user does not specify a version, choose the next unused suffix. Do not use unversioned `sampora-website-public` or zip names as the upload/handoff target after a repair iteration.
- After repairs, output a scoped diff summary, commands actually run if any, remaining known issues, intentionally untouched files, and an explicit note when no final acceptance/review was run.

Failure-prevention rules for Sampora handoffs:

- Never trust a previous agent's success report without checking the actual files it changed.
- Never use old QA artifacts as current proof.
- Never create first-pass verification, visual acceptance review, or final review loops by default. The user has explicitly disabled them for ordinary Sampora repair rounds.
- Never claim visual/layout/component/style acceptance from static CSS, script checks, no-overflow checks, screenshot existence, or language sync alone. If acceptance was not explicitly requested and run, report the repair as changed but not acceptance-reviewed.
- Never make every subagent reread full historical logs or rerun full validation by default; use the detailed log only for regression tracing, and reserve full five-layer validation for global changes or final delivery.
- Never hold a Sampora write lock during read-only validation or final review. Lock only for the actual write operation, unlock immediately after writing, and record/block on overlap before editing.
- Never validate motion only by screenshot; sample browser time, computed animation names, and changing dash offsets.
- Never treat broken multilingual strings as valid content; question marks, mojibake-looking text, and empty translations must fall back or be repaired.
- Never sweep CTA links page-by-page from memory; verify the required intent URL map with search.
- Never update README or handoff docs without checking the real public package contents.
- Never rebuild zips without inspecting zip entry paths and confirming repaired files are included.
- Never hand off same-name public folders or zips after a repair iteration. Use exact versioned paths and report their SHA-256 hashes so the uploaded artifact and inspected artifact cannot diverge.
- If a new pitfall is found, append it to `SAMPORA_LATEST_REPAIR_HANDOFF.md` before ending the round.

When adding a new pitfall, use this exact structure in the handoff document:

- **Pitfall / symptom:** what went wrong or nearly went wrong.
- **Root cause:** why it happened, not just where it appeared.
- **Prevention rule:** what future agents must do differently.
- **Verification:** the command, browser check, or file inspection that proves it is avoided.
- **Owner package:** which package or controller step is responsible next time.
