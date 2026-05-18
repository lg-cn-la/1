# Final Business Content, CTA, Legal, and Contact Flow Report

Generated: 2026-05-18

Scope: content, legal wording, CTA routing, resource copy, and backend-ready contact-form documentation for `E:\claude work\sampora-website-public`. This report reflects the final frontend delivery state passed to documentation update task E.

## Delivery Status

Status: recorded evidence exists for the current frontend delivery scope, with external business/backend confirmation items listed at the end. This Package E documentation-alignment round did not rerun final QA.

## Static, SEO, and Legal Baseline

- CSS `<style>` blocks are balanced in the official public pages.
- Official pages have title, meta description, and absolute canonical URL coverage in the final static checks.
- README and deployment notes match the included English and Chinese legacy redirect HTML files.
- Legacy year text, mainland filing display text, and old company-name variants have been removed from the public-facing copy.
- Legal/company wording is standardized to:
  - `© 2026 Anhui Jiayu Enterprise Service Co., Ltd.`
  - `安徽省嘉禹企业服务有限公司`
- SEO static checks pass for title, meta description, and canonical coverage on the official pages.

## Page-Level Content Updates

### `index.html`

- Positioning now presents Sampora as an Online Sample Operations Platform for panel providers and sample suppliers.
- Homepage workflow copy focuses on supplier allocation, project delivery, review records, finance, and Partner Network coordination.
- Homepage hero decoration was adjusted so the left vertical line is not shown in the final state.
- Workflow animation now loops and topology motion is active.

### `solutions.html`

- Solution copy is aligned to the Panel, Supplier Network, and Enterprise operating models.
- Topology flow, scan, and packet motion are bound in the final visual state.
- Partner Network wording is conservative and avoids overclaiming implementation detail that still needs confirmation.

### `resources.html`

- Resource page copy is no longer region-only.
- Resources now describe manuals, rollout notes, and implementation references for online sample operations.
- Advanced allocation and Partner Network material is framed as implementation-stage reference content, not as a fully confirmed backend claim.
- Topology motion is active in the final browser evidence.

### `resource-manuals.html`

- Resource manuals now use business-module wording instead of generic placeholder text.
- Module language covers Project List, Hybrid API, Project Settlement, Supplier Bills, Client Invoice, Callback Logs, Operation Logs, Survey Station, Member Finance, Supplier Allocation & Pricing, Finance & Multi-party Settlement, and Partner Network.
- Resource-manual smoke/browser evidence records zero placeholder question-mark sequence failures.

### `plans.html`

- Plan copy remains aligned to Panel, Supplier Network, and Enterprise.
- Plans matrix is enlarged and more readable in the final visual evidence.
- Enterprise wording keeps sales/business confirmation language without implying unverified implementation detail.

### `contact.html`

- Contact page is backend-ready and does not present placeholder submission as a completed backend handoff.
- Primary CTAs route to `contact.html?intent=...#contact-form`.
- The form has method/action/data-endpoint wiring, hidden context fields, and a fetch path for the real backend endpoint once configured.

## CTA Intent Map

Final CTA routing pattern:

| CTA | Target |
| --- | --- |
| Start trial | `contact.html?intent=start_trial#contact-form` |
| Book a demo | `contact.html?intent=book_demo#contact-form` |
| Contact sales | `contact.html?intent=contact_sales#contact-form` |
| Talk to sales | `contact.html?intent=contact_sales#contact-form` |
| Enterprise demo | `contact.html?intent=enterprise_demo#contact-form` |
| Resource question | `contact.html?intent=resource_question#contact-form` |
| View manuals | `resource-manuals.html` or the relevant manual route |
| Read rollout notes | resources/manual route for rollout notes |
| Submit request | Contact form submit button only |

Final intent values documented for backend handling:

- `start_trial`
- `book_demo`
- `contact_sales`
- `enterprise_demo`
- `resource_question`

Observed placement:

- Header: `Book a demo` and `Start trial`
- Hero: `Start trial` and `Book a demo`
- Plans: Panel and Supplier Network use trial/demo routing; Enterprise uses sales/demo routing
- Resources: manual and rollout-note routing, with a sales CTA for commercial questions
- Footer: sales/contact routing remains available
- Contact form: `Submit request`

## Backend-Ready Contact Fields

The contact form is prepared for backend integration with:

- `method="post"`
- `action="[BACKEND_CONTACT_ENDPOINT]"`
- `data-endpoint="[BACKEND_CONTACT_ENDPOINT]"`
- visible fields:
  - `name`
  - `email`
  - `company`
  - `role`
  - `business_type`
  - `message`
- hidden fields:
  - `intent`
  - `source_page`
  - `source_section`
  - `plan`
  - `lang`

Behavior now documented:

- The form preserves request context from CTA intent and page source.
- Submission uses the configured backend endpoint when the placeholder is replaced.
- While the placeholder remains, the frontend stores pending form data and shows conservative pending behavior instead of claiming the request was received by a backend.

## Resource and Manual Content Cleanup

- Resources page avoids region-only framing.
- Manual copy now describes actual business modules and operations.
- The Partner Network copy is intentionally conservative until implementation details are confirmed.
- Manual smoke/browser checks cover English, Chinese, and Hindi/Hinglish states.
- Manual evidence records zero replacement-character failures, zero placeholder question-mark sequence failures, and zero empty-label failures.

## QA Evidence Referenced

- Final static script: `E:\claude work\sampora-website-public\qa-evidence\final-audit-static-check.mjs`
- Page-layer static script: `E:\claude work\sampora-website-public\qa-evidence\page-layer-static-check.mjs`
- Page-layer browser evidence: `E:\claude work\sampora-website-public\qa-evidence\page-layer-browser-evidence.json`
- Resource-manual smoke script: `E:\claude work\sampora-website-public\qa-evidence\resource-manuals-language-smoke.mjs`
- Resource-manual browser evidence: `E:\claude work\sampora-website-public\qa-evidence\resource-manuals-browser-language-evidence.json`
- Lighthouse summary: `E:\claude work\sampora-website-public\qa-evidence\lighthouse-output.json`
- Accessibility summary: `E:\claude work\sampora-website-public\qa-evidence\axe-output.json`

Latest recorded QA evidence:

- Final static, page-layer static, resource-manual smoke/browser, and page-layer browser evidence artifacts are packaged for controller review and rerun.
- Lighthouse output exists for all six official pages.
- Accessibility output exists and records zero blocking violations.

## Business Confirmation Items

These items still need owner confirmation outside the frontend package:

- Replace `[BACKEND_CONTACT_ENDPOINT]` with the real backend endpoint.
- Confirm advanced supplier allocation rules and backend behavior.
- Confirm Partner Network implementation details and commercial wording.
- Re-check deployed redirect behavior after upload or CDN rewrite configuration.
