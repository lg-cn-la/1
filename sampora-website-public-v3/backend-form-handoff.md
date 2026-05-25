# Sampora Backend Form Handoff

Generated: 2026-05-25

Source folder: `sampora-website-public-v3/`

## Current Frontend Contract

The contact form is configured to the live Apps Script Web App endpoint and keeps success-only submit feedback behavior.

Form contract:

- `method="post"`
- `action="https://script.google.com/macros/s/AKfycbyHALTY5VRPba0ok2PKkPAUzBHWr8LIASQS1zZ3KCRsj4fg50tqIQltCQzLTP6i4GKP/exec"`
- `data-endpoint="https://script.google.com/macros/s/AKfycbyHALTY5VRPba0ok2PKkPAUzBHWr8LIASQS1zZ3KCRsj4fg50tqIQltCQzLTP6i4GKP/exec"`
- `CONTACT_ENDPOINT` constant in submit script matches the same URL
- visible fields: `name`, `email`, `company`, `role`, `business_type`, `message`
- hidden fields: `intent`, `source_page`, `source_section`, `plan`, `lang`, `landing_page`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`
- honeypot field: `website`
- submit label: `Submit request`

## Intent Map

Supported conversion intent values:

- Start trial -> `contact.html?intent=start_trial#contact-form`
- Book a demo -> `contact.html?intent=book_demo#contact-form`
- Contact sales -> `contact.html?intent=contact_sales#contact-form`
- Talk to sales -> `contact.html?intent=contact_sales#contact-form`
- Enterprise plan -> `contact.html?intent=enterprise_demo#contact-form`
- Resources consult -> `contact.html?intent=resource_question#contact-form`

The form also preserves source context through `source_page`, `source_section`, `plan`, and `lang`, plus attribution context through `landing_page`, `referrer`, `utm_source`, `utm_medium`, and `utm_campaign`.

## Success and Failure Behavior

- Show success only after an explicit successful backend response (`res.ok`).
- Network errors, endpoint errors, and validation failures must keep the user in a failure/pending state with the form data preserved where possible.

## Earlier Evidence

Recorded on 2026-05-18 before this handoff update:

- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: `PASS static checks for 15 HTML files`
- `node qa-evidence/page-layer-browser-check.mjs`: status `PASS`, failures `[]`, screenshots `42`

This docs update does not claim fresh browser QA.

## Backend Integration Checklist

- Keep `action`, `data-endpoint`, and `CONTACT_ENDPOINT` as the same live endpoint URL.
- Accept all visible fields and hidden context fields listed above.
- Validate required fields server-side: `name`, `email`, `company`, and `message`.
- Store or route `intent`, `source_page`, `source_section`, `plan`, `lang`, `landing_page`, `referrer`, `utm_source`, `utm_medium`, and `utm_campaign` with the lead.
- Keep `website` honeypot filtering enabled server-side.
- Return a clear success response only after the backend receives the submission.
- Return useful failure responses for validation, network, or service errors.
- Re-run contact form static checks and browser QA using local mock interception for automated tests, and use manual end-to-end submit for real sheet/mail validation.

