# File Identity

Package verified: `sampora-website-public-v1.zip`

SHA256:

```text
1D132B27CCD2B4081ED697CE847577A12164D56091BB7075C1EC15340870FE74
```

Root HTML entries:

```text
contact.html
index.html
plans.html
pricing.html
products.html
resource-manuals.html
resources.html
solutions.html
```

Chinese physical HTML entries: none.

Packaging note: raw ZIP central-directory inspection found 217 entries with backslash path separators, although Python `zipfile` normalizes/displayed them with `/`. This is a current packaging-format failure for a later non-runtime repair round.

# Command Results

Commands were run against the current versioned path because the workspace source is `sampora-website-public-v1/`.

```text
node "sampora-website-public-v1\qa-evidence\page-layer-browser-check.mjs"
{
  "status": "PASS",
  "failures": [],
  "evidence": "qa-evidence/page-layer-browser-evidence.json",
  "screenshots": 42
}
```

```text
node "sampora-website-public-v1\qa-evidence\resource-manuals-browser-language-check.mjs"
resource manuals browser language check: OK
```

```text
node "sampora-website-public-v1\qa-evidence\lighthouse-axe-check.mjs"
{
  "status": "PASS",
  "lighthouse": "qa-evidence/lighthouse-output.json",
  "axe": "qa-evidence/axe-output.json",
  "axeViolationCount": 8,
  "axeBlockingViolationCount": 0
}
```

Additional split subagents ran fresh read-only browser sampling for workflow/topology/modal, plans/contact, resource manuals, and cross-page language/Lighthouse checks.

# Runtime Issue Status Table

| item | status | evidence / command | owner package | allowed action |
|---|---|---|---|---|
| ZIP path separators | CONFIRMED | Raw central-directory parser and .NET ZipArchive found 217 backslash entries in `sampora-website-public-v1.zip` | Delivery / Package E Packaging | Later non-runtime packaging repair; do not rebuild in this verify-only task |
| `index.html` visible mojibake | CONFIRMED | Runtime language sweep found visible `Pain \u{922b}?Outcome` / `Focus: intake \u{922b}?allocation \u{922b}?review`; source evidence around `index.html:3987` | Package A Homepage / i18n copy | Later repair in Package A, then rerun language/runtime checks |
| `plans.html` language switcher labels mojibake | CONFIRMED | Runtime language sweep shows labels `涓枃` and `啶灌た啶ㄠ啶︵`; source evidence `plans.html:155` | Package C Plans/Contact | Later repair in Package C, then rerun language checks |
| `contact.html` language switcher labels mojibake | CONFIRMED | Runtime language sweep shows labels `涓枃` and `啶灌た啶ㄠ啶︵`; source evidence `contact.html:1125-1126` | Package C Plans/Contact | Later repair in Package C, then rerun language/contact checks |
| `resources.html` HI footer legal name | CONFIRMED | Runtime HI state did not preserve accepted English legal name; source evidence uses Hindi transliterated company text around `resources.html:2314` | Package B Solutions/Resources / Legal-footer i18n | Later repair in Package B, then rerun footer/legal language checks |
| Workflow motion | REGRESSION | Subagent A sampled `index.html` t=0s/3s/6s; Step 01-04 progressed through running/receive/complete states | Package A Homepage | Guard passed; no repair in verify-only task |
| Topology motion | REGRESSION | Subagent A sampled index/solutions/resources t=0s/1s/3s/6s; `topoDash`, changing dashoffset, `topoScan`, visible packets | Package A/B | Guard passed; no repair in verify-only task |
| Topology modal and S mark | REGRESSION | Subagent A opened/closed modals on index/solutions/resources; close text `X`, aria-label `Close topology`, button/Escape close, S mark visible | Package A/B | Guard passed; no repair in verify-only task |
| Plans sticky nav | REGRESSION | Subagent B scrolled pricing cards/matrix/footer; `.mast position=fixed`, `top=34`, visible/pinned | Package C Plans/Contact | Guard passed; no repair in verify-only task |
| Contact hidden fields and submit honesty | REGRESSION | Subagent B checked five intent URLs; hidden fields preserved; placeholder endpoint showed pending toast only, no fake success | Package C Plans/Contact | Guard passed; no repair in verify-only task |
| Resource Manuals runtime | REGRESSION | Subagent C checked EN/ZH/HI x `#doc/config`, `#doc/ops`, `#category/ops-station`; titles/search/articles/back/images passed | Package D Resource Manuals | Guard passed; no repair in verify-only task |
| Lighthouse / axe | REGRESSION | Fresh run status PASS; 8 axe non-blocking violations, 0 blocking | Package E / final QA | Guard passed with known non-blocking axe findings |

# Workflow Evidence

Subagent A ran fresh Chromium sampling on `sampora-website-public-v1/index.html#workflow`.

```text
t=0s: Step 01 relay-running; Step 02 relay-receive
t=3s: Step 01 relay-complete; Step 02 relay-running; Step 03 relay-receive
t=6s: Step 01/02/03 relay-complete; Step 04 relay-running relay-last
```

Verdict: PASS. Workflow visibly progresses within 6 seconds.

# Topology Evidence

Subagent A sampled index/solutions/resources at t=0s/1s/3s/6s.

```text
index.html: flowAnimationName=topoDash; dashoffset -12.0111px -> -6.67244px -> -41.3364px -> -24.6751px; scanAnimationName=topoScan; packet opacity about 0.75
solutions.html: flowAnimationName=topoDash; dashoffset -20.004px -> -14.676px -> -3.34px -> -31.336px; scanAnimationName=topoScan; packet opacity 0.85
resources.html: flowAnimationName=topoDash; dashoffset -16.81px -> -10.0871px -> -53.8055px -> -33.625px; scanAnimationName=topoScan; packet opacity 0.85
```

Modal evidence:

```text
index.html: close text X; aria-label Close topology; button close PASS; Escape close PASS; normal/modal S mark visible
solutions.html: close text X; aria-label Close topology; button close PASS; Escape close PASS; normal/modal S mark visible
resources.html: close text X; aria-label Close topology; button close PASS; Escape close PASS; normal/modal S mark visible
```

Verdict: PASS for motion and modal behavior.

# Plans Sticky Evidence

Subagent B sampled `plans.html` at 1440x900.

```text
pricing cards: .mast position=fixed; top=34px; height=67; visible/pinned=true
matrix: .mast position=fixed; top=34px; height=67; visible/pinned=true
footer: .mast position=fixed; top=34px; height=67; visible/pinned=true
```

Verdict: PASS.

# Language Switch Evidence

Subagent D ran EN -> ZH -> HI -> EN across:

```text
index.html
solutions.html
resources.html
resource-manuals.html
plans.html
contact.html
```

Passing evidence:

```text
Hero text non-empty on all six pages and all language states.
CTA href/intent preserved on all six pages.
No conversion CTA missing intent.
No ????.
No 嘉育.
No ICP / 皖ICP备 / Wan ICP in visible runtime text.
Topology modal close remains X on index.html, solutions.html, resources.html.
```

Confirmed failures:

```text
index.html: visible mojibake in all language states around "Pain \u{922b}?Outcome" / "Focus: intake \u{922b}?allocation \u{922b}?review".
plans.html: language switcher labels render mojibake, including "涓枃" and "啶灌た啶ㄠ啶︵".
contact.html: language switcher labels render mojibake, including "涓枃" and "啶灌た啶ㄠ啶︵".
resources.html: HI footer does not preserve accepted English legal name.
```

Verdict: FAIL for cross-page language switch due four confirmed issues.

# Contact Form Evidence

Subagent B verified:

```text
contact.html?intent=start_trial#contact-form
contact.html?intent=book_demo#contact-form
contact.html?intent=contact_sales#contact-form
contact.html?intent=enterprise_demo&plan=enterprise#contact-form
contact.html?intent=resource_question#contact-form
```

Runtime hidden fields:

```text
intent: start_trial / book_demo / contact_sales / enterprise_demo / resource_question
source_page: contact.html
source_section: contact-form
lang: en
plan: enterprise preserved for enterprise_demo&plan=enterprise; other routes keep their current intent-based plan value
```

Submit behavior:

```text
action=[BACKEND_CONTACT_ENDPOINT]
data-endpoint=[BACKEND_CONTACT_ENDPOINT]
placeholder toast visible=true
success toast=false
failure toast=false
fetchCalls=[]
pending payload contains intent/source_page/source_section/plan/lang
```

Verdict: PASS. No fake backend success while placeholder endpoint remains.

# Resource Manuals Evidence

Subagent C verified EN/ZH/HI across:

```text
resource-manuals.html#doc/config
resource-manuals.html#doc/ops
resource-manuals.html#category/ops-station
```

Evidence:

```text
No question marks, replacement characters, or mojibake markers.
Titles non-empty:
  EN: Configuration Guide; Supplier Backend & Survey Station Manual; Logs and station
  ZH: 配置指南; 供应商后台与调查站手册; 日志与站点
  HI: English fallback titles with html lang="hi" and Hindi UI signal present
Search works:
  config searches returned 2 results
  ops searches returned 6 results
  ops-station searches returned 2 results
Article open works:
  account-registration; project-list; callback-logs
Back navigation works.
Images load:
  config 3/3
  ops 2/2
  ops-station 2/2
No image request failures or console errors.
```

Verdict: PASS.

# Lighthouse / Axe Evidence

Fresh Lighthouse / axe output:

```text
index.html: performance 0.99; accessibility 0.97; best practices 0.96; SEO 1
solutions.html: performance 0.80; accessibility 0.98; best practices 1; SEO 1
resources.html: performance 1; accessibility 0.98; best practices 1; SEO 1
resource-manuals.html: performance 0.84; accessibility 0.98; best practices 1; SEO 0.91
plans.html: performance 1; accessibility 0.98; best practices 1; SEO 1
contact.html: performance 1; accessibility 1; best practices 1; SEO 1
```

Axe:

```text
Total violations: 8
Blocking violations: 0
Non-blocking violations: 8
index.html: heading-order, landmark-one-main, region
solutions.html: heading-order
resources.html: heading-order
resource-manuals.html: heading-order
plans.html: heading-order
contact.html: region
```

Verdict: PASS for blocking axe threshold; 8 non-blocking findings remain reportable.

# Final Runtime Verdict

Runtime verification completed with confirmed issues.

Confirmed failures: 5

Blocked checks: 0

Confirmed failures are limited to:

```text
1. ZIP raw path separators contain 217 backslash entries.
2. index.html visible mojibake in runtime language sweep.
3. plans.html language switcher labels mojibake.
4. contact.html language switcher labels mojibake.
5. resources.html HI footer does not preserve accepted English legal name.
```

No repairs were performed in this runtime-only task.
