# Sampora Backend Form Handoff

Generated: 2026-05-18

Source folder: `sampora-website-public-v3/`

## Current Frontend Contract

The contact form is backend-ready at the markup and browser-behavior layer, but `[BACKEND_CONTACT_ENDPOINT]` remains an external integration placeholder. The static handoff package may keep this placeholder before production launch.

In placeholder mode, the form stores a pending payload and shows the fallback/pending contact message instead of issuing a backend request. The frontend must not claim real backend receipt while the placeholder remains.

In live endpoint mode, `[BACKEND_CONTACT_ENDPOINT]` has been replaced with the real backend endpoint and browser QA must confirm the form issues a POST request and handles success/failure responses correctly.

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

- In placeholder mode, the frontend keeps the request in a pending/local handoff path and does not claim backend receipt or issue a real backend request.
- In live endpoint mode, show success only after an explicit successful backend response.
- Network errors, endpoint errors, and validation failures must keep the user in a failure/pending state with the form data preserved where possible.

## Earlier Evidence

Recorded on 2026-05-18 before this handoff update:

- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: `PASS static checks for 15 HTML files`
- `node qa-evidence/page-layer-browser-check.mjs`: status `PASS`, failures `[]`, screenshots `42`

This docs update does not claim fresh browser QA.

## Backend Integration Checklist

- Replace `[BACKEND_CONTACT_ENDPOINT]` in both `action` and `data-endpoint` before production launch.
- Accept all visible fields and hidden context fields listed above.
- Validate required fields server-side: `name`, `email`, `company`, and `message`.
- Store or route `intent`, `source_page`, `source_section`, `plan`, and `lang` with the lead.
- Return a clear success response only after the backend receives the submission.
- Return useful failure responses for validation, network, or service errors.
- Re-run contact form static checks and browser QA in live endpoint mode after endpoint integration.
- Do not disable the form in the static handoff package only because the production endpoint is not configured yet.

