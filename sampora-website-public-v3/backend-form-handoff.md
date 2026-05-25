# Sampora Backend Form Handoff

Generated: 2026-05-25

Source folder: `sampora-website-public-v3/`

## Current Frontend Contract

The contact form posts to the production contact route contract at `/api/contact` and keeps success-only submit feedback behavior.

Form contract:

- `method="post"`
- `action="/api/contact"`
- `data-endpoint="/api/contact"`
- `CONTACT_ENDPOINT` constant in submit script matches the same URL
- visible fields: `name`, `email`, `company`, `role`, `business_type`, `message`
- required server-side fields: `name`, `company`, `email`, `role`, `business_type`
- optional field: `message`
- submit body: `FormData` -> `URLSearchParams`, sent as `application/x-www-form-urlencoded`
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

- Show success only after an explicit successful backend response: HTTP 2xx and JSON body `{ "ok": true }`.
- HTTP 2xx with `{ "ok": false }`, invalid or missing JSON, network errors, endpoint errors, and validation failures must show failure and preserve user input.

## Earlier Evidence

Recorded on 2026-05-18 before this handoff update:

- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: `PASS static checks for 15 HTML files`
- `node qa-evidence/page-layer-browser-check.mjs`: status `PASS`, failures `[]`, screenshots `42`

This docs update does not claim fresh browser QA.

## Backend Integration Checklist

- Keep `action`, `data-endpoint`, and `CONTACT_ENDPOINT` as `/api/contact`.
- Accept all visible fields and hidden context fields listed above.
- Accept `application/x-www-form-urlencoded` from `FormData` -> `URLSearchParams`; JSON may be supported as a compatibility path, but the route must not be JSON-only.
- Validate required fields server-side: `name`, `company`, `email`, `role`, and `business_type`.
- Treat `message` as optional; store it when provided.
- Store or route `intent`, `source_page`, `source_section`, `plan`, `lang`, `landing_page`, `referrer`, `utm_source`, `utm_medium`, and `utm_campaign` with the lead.
- Keep `website` honeypot filtering enabled server-side.
- Return JSON `{ "ok": true }` only after the backend receives and accepts the submission.
- Return useful failure responses for validation, network, or service errors.
- Re-run contact form static checks and browser QA using local mock interception for automated tests, and use manual end-to-end submit for the real `/api/contact` backend route when needed.

