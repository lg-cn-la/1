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
- `sampora-website-public-v3/README.md`, `DEPLOYMENT_NOTES.md`, `QA_REPORT.md`, `verification-report.md`, `backend-form-handoff.md`, `content-audit-fixes.md`, and `visual-animation-fixes.md`: public-package docs and prior QA notes for the active source tree. Verify current files before relying on them.
- `archives/`, `动态/`, and other local reference/demo folders when present: historical/reference material only. They can guide checks but cannot prove current page state.

Before dispatching a subagent, paste the specific files from this index that are relevant to that subagent's scope. Do not assume subagents will discover them on their own.

For Sampora repair work:

- Treat `SAMPORA_LATEST_REPAIR_HANDOFF.md` as the control document and single working handoff source.
- Treat `ACCEPTANCE_TESTS.md` as the regression contract for what must be checked before delivery claims.
- Treat `ISSUE_LEDGER.md` as the stable ID/status map for recurring issues; check it before creating implementation work for anything that resembles a historical failure.
- Do not modify files before summarizing the handoff document's current instructions, active scope, known pitfalls, and planned file ownership.
- If the user says "先按 AGENTS.md 和 SAMPORA_LATEST_REPAIR_HANDOFF.md 接手，不要跳过交接规则", run the default repair intake gate before any file edits.
- The default repair intake gate is short, not a long plan mode. Run it internally unless the user explicitly asks to see the plan. It must determine: current explicit issues to fix; explicit out-of-scope areas; package split and writable files; acceptance categories affected; each package's red checks and completion verification; planned implementation subagents, read-only review subagent, and final controller verification.
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
- For long or multi-package issue lists, first-pass verification should be delegated to read-only verification subagents by package or topic. These subagents must not edit files. They only verify whether each assigned item exists now, collect evidence, recommend an issue status, and recommend an owner package. The controller/main agent merges those reports into the issue status table and makes the final status decision before any implementation subagent is dispatched.
- Do not repair checklist items that cannot be mapped to an acceptance category and owner package.
- Only fix items named in the latest Sampora audit.
- Anything not explicitly named in the latest audit is out of scope and must not be changed.
- Every new visual, business-path, language, motion, legal, or packaging regression must be mapped to `ACCEPTANCE_TESTS.md` before repair. If no acceptance item covers it, add or update one before or alongside the fix.
- A repair is not complete if the relevant acceptance check is missing or has not been rerun.
- When several issue types are present, use dependency order unless the controller has current evidence that a different order is safer: packaging/redirect policy first; global i18n/footer/CTA policy second; contact form and intent handling third; topology/workflow motion fourth; SEO, Lighthouse, axe, delivery sync, and final acceptance last.
- Match verification depth to change scope: light single-package fixes use scoped checks; global/shared changes use full regression for the affected contract; final delivery, zip rebuilds, and broad cross-package changes use full five-layer validation. Do not run Lighthouse, axe, full browser screenshots, or unrelated resource-manual checks for every small docs/contact/topology task unless the mapped acceptance category requires them.
- Preserve the original repair approach: split every detachable task to subagents with disjoint file ownership.
- Delegate review to a read-only subagent whenever subagents are available.
- Do not assume subagents automatically read global instructions. When dispatching a subagent, paste the relevant handoff package, ownership boundary, failure-prevention rules, required verification, and handoff-log requirement directly into that subagent's prompt.
- Every implementation subagent prompt must require the subagent to read `SAMPORA_LATEST_REPAIR_HANDOFF.md` and `ACCEPTANCE_TESTS.md`, restate its assigned files and out-of-scope files, map its work to acceptance categories, state a validation tier and a `Done when` checklist with concrete verification conditions, run a scoped red check before editing, run scoped verification after editing, and append its result to the handoff log.
- Every read-only verification subagent prompt must require the subagent to read `SAMPORA_LATEST_REPAIR_HANDOFF.md` and `ACCEPTANCE_TESTS.md`, restate its assigned issue subset and out-of-scope files, make no edits, verify each item against current files/scripts/browser state, report evidence, recommend `[CONFIRMED]`, `[VERIFY-FIRST]`, `[STRATEGY]`, `[REGRESSION]`, `[REMOVED]`, `[OUT-OF-SCOPE]`, or `[BLOCKED]`, and recommend an owner package.
- Every review subagent prompt must require read-only behavior, latest-audit and acceptance checklist review, exact PASS/FAIL reporting, and recommended owner package for each remaining failure.
- The controller/main agent should avoid implementation work and should only do delivery-level total verification before final handoff.
- Keep changes within the assigned file ownership boundaries.
- Do not rely on old handoff reports, old screenshots, or previous QA JSON as proof.
- After every repair or review round, append an entry to the handoff document's `Handoff Update Log`.
- Each update log entry must include files changed, verification run, remaining failures, and notes for the next agent.
- When a repair, verification round, or strategy change resolves or reclassifies a recurring issue, update `ISSUE_LEDGER.md` in the same round.
- Do not claim completion without fresh verification evidence.
- Do not paste mojibake or broken multilingual text into source files.
- For final delivery work, verify the public source directory directly before syncing handoff docs or rebuilding zip files.
- After any repair iteration that changes source, reports, QA evidence, handoff docs, delivery folders, or zip files, name the current deliverables with the repair iteration suffix (`v1`, `v2`, ...). If the user does not specify a version, choose the next unused suffix. Do not use unversioned `sampora-website-public` or zip names as the upload/handoff target after a repair iteration.
- After repairs, output a scoped diff summary plus fresh evidence: commands/browser checks run, PASS/FAIL results, remaining failures, and any files intentionally left untouched.

Failure-prevention rules for Sampora handoffs:

- Never trust a previous agent's success report without checking the actual files it changed.
- Never use old QA artifacts as current proof; rerun the relevant scoped check.
- Never make every subagent reread full historical logs or rerun full validation by default; use the detailed log only for regression tracing, and reserve full five-layer validation for global changes or final delivery.
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
