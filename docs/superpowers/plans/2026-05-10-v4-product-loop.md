# V4 Product Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a v4 static HTML demo that evolves v3.5 into a product-running short loop hero.

**Architecture:** Copy v3.5 into a new standalone HTML file, then make focused CSS/HTML/JS changes inside the hero console. Keep legacy pages untouched so design history stays comparable.

**Tech Stack:** Vanilla HTML, CSS, and JavaScript in one static file. No framework, no package install, no external runtime beyond existing Google Fonts.

---

### Task 1: Preserve v3.5 and create v4

**Files:**
- Read: `补充资料归档/operations-console/09_v35_operations_console_hybrid.html`
- Create: `补充资料归档/operations-console/11_v4_operations_console_product_loop.html`
- Modify: `补充资料归档/operations-console/README.md`

- [ ] Copy the v3.5 file to the new v4 file.
- [ ] Update the page title, metadata, top comment, and footer version label to v4.
- [ ] Add the v4 file to the operations-console README as the current active iteration.

### Task 2: Add product loop structure

**Files:**
- Modify: `补充资料归档/operations-console/11_v4_operations_console_product_loop.html`

- [ ] Replace the center console window body with a `live-runner` layout.
- [ ] Add four stage buttons/indicators: Launch, Route, QC, Settle.
- [ ] Add three live metric rows: completes, QC queue, settlement.
- [ ] Add a compact activity feed inside the console window.

### Task 3: Add product loop styling and motion

**Files:**
- Modify: `补充资料归档/operations-console/11_v4_operations_console_product_loop.html`

- [ ] Style `live-runner` using the existing navy/cyan/lime/amber palette.
- [ ] Use transform and opacity for stage transitions.
- [ ] Keep the console readable below 560px by reducing node and metric density.
- [ ] Honor `prefers-reduced-motion` by freezing the loop into a readable state.

### Task 4: Add lightweight loop behavior

**Files:**
- Modify: `补充资料归档/operations-console/11_v4_operations_console_product_loop.html`

- [ ] Add a `productLoop` state array with the four stages and their values.
- [ ] Update stage active state, labels, metric numbers, and progress width every 2.4 seconds.
- [ ] Avoid layout thrash by only changing text content, classes, and transform-friendly styles.

### Task 5: Verify

**Files:**
- Open: `补充资料归档/operations-console/11_v4_operations_console_product_loop.html`

- [ ] Open the page in the browser.
- [ ] Check desktop first viewport against v3.5: product clarity, visual memory, and motion usefulness.
- [ ] Check mobile width: no broken text, CTA visible, console not overlapping.
- [ ] Run a quick git diff review before final summary.
