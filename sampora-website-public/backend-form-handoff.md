# Sampora Backend Form Handoff

Generated: 2026-05-18

Source folder: `E:\claude work\sampora-website-public`

## Current Frontend Contract

The contact form is backend-ready at the markup and browser-behavior layer, but `[BACKEND_CONTACT_ENDPOINT]` remains an external integration placeholder. While the placeholder remains, the frontend must not claim real backend receipt.

Form contract:

- `method="post"`
- `action="[BACKEND_CONTACT_ENDPOINT]"`
- `data-endpoint="[BACKEND_CONTACT_ENDPOINT]"`
- visible fields: `name`, `email`, `company`, `role`, `business_type`, `message`
- hidden fields: `intent`, `source_page`, `source_section`, `plan`, `lang`
- submit label: `Submit request`

## Intent Map

Supported conversion intent values:

- Start trial -> `contact.html?intent=start_trial#contact-form`
- Book a demo -> `contact.html?intent=book_demo#contact-form`
- Contact sales -> `contact.html?intent=contact_sales#contact-form`
- Talk to sales -> `contact.html?intent=contact_sales#contact-form`
- Enterprise plan -> `contact.html?intent=enterprise_demo#contact-form`
- Resources consult -> `contact.html?intent=resource_question#contact-form`

The form also preserves source context through `source_page`, `source_section`, `plan`, and `lang`.

## Success and Failure Behavior

- With the endpoint placeholder still present, the frontend keeps the request in a pending/local handoff path and does not claim backend receipt.
- After a real endpoint is configured, show success only after an explicit successful backend response.
- Network errors, endpoint errors, and validation failures must keep the user in a failure/pending state with the form data preserved where possible.

## Fresh Evidence

- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: `PASS static checks for 15 HTML files`
- `node qa-evidence/page-layer-browser-check.mjs`: status `PASS`, failures `[]`, screenshots `42`

## Backend Integration Checklist

- Replace `[BACKEND_CONTACT_ENDPOINT]` in both `action` and `data-endpoint`.
- Accept all visible fields and hidden context fields listed above.
- Validate required fields server-side: `name`, `email`, `company`, and `message`.
- Store or route `intent`, `source_page`, `source_section`, `plan`, and `lang` with the lead.
- Return a clear success response only after the backend receives the submission.
- Return useful failure responses for validation, network, or service errors.
- Re-run contact form static and browser QA after endpoint integration.
