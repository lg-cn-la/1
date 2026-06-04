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
- hidden fields: `intent`, `source_page`, `source_section`, `plan`, `lang`, plus attribution-only fields `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `msclkid`, `referrer`, `landing_page`, `conversion_page`, `cta_intent`, `cta_location`, `cta_event`, `captured_at`, `first_landing_page`, `first_referrer`, `first_utm_source`, `first_utm_medium`, `first_utm_campaign`, `last_landing_page`, and `last_referrer`
- honeypot field: `website`
- submit label: `Submit request`

## Intent Map

Supported conversion intent values:

- Start trial -> `contact.html?intent=start_trial#contact-form`
- Book a demo -> `contact.html?intent=book_demo#contact-form`
- Contact sales -> `contact.html?intent=contact_sales#contact-form`
- Talk to sales -> `contact.html?intent=contact_sales#contact-form`
- Enterprise plan -> `contact.html?intent=enterprise_demo#contact-form`
- Cooperation resources -> `contact.html?intent=cooperation#contact-form`

The form also preserves source context through `source_page`, `source_section`, `plan`, and `lang`, plus attribution context through the hidden fields listed above. Hidden fields are attribution and routing context only; they are not permission, price, discount, or security inputs.

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
- Store or route `intent`, `source_page`, `source_section`, `plan`, `lang`, and the full attribution field set with the lead.
- Trim all incoming fields. Apply field limits before storage and notification email rendering.
- Keep URL/referrer-style attribution fields around 2000 characters or less.
- Keep UTM and click-ID fields around 500 characters or less.
- Missing or overlong attribution fields must not fail the main form submission; store empty values or truncated attribution values instead.
- HTML-escape values in the notification email.
- Add an Attribution section to the lead notification email so operators can inspect campaign/source context without opening the sheet.
- Keep `website` honeypot filtering enabled server-side.
- Return JSON `{ "ok": true }` only after the backend receives and accepts the submission.
- Return useful failure responses for validation, network, or service errors.
- Re-run contact form static checks and browser QA using local mock interception for automated tests, and use manual end-to-end submit for the real `/api/contact` backend route when needed.

## Bundled Apps Script Example

`backend/google-apps-script-contact.gs` is a handoff example for teams that temporarily receive `/api/contact` through Google Apps Script or adapt the same field contract into their real backend. It is not proof that production `/api/contact` exists.

The example:

- Parses `application/x-www-form-urlencoded` requests from the current frontend.
- Keeps JSON parsing only as a compatibility path.
- Trims and length-limits visible, context, and attribution fields.
- Requires only visible business form fields: `name`, `company`, `email`, `role`, and `business_type`.
- Treats attribution as non-blocking context and truncates it instead of rejecting a valid lead.
- Stores all attribution fields in sheet columns.
- Adds a separate Attribution section to the notification email.

## GTM / GA4 Operator Handoff

GA4 and Microsoft Clarity must remain managed through Google Tag Manager. Do not add direct GA4, Clarity, Google Ads, Meta Pixel, LinkedIn Insight, or similar snippets to public HTML.

For every frontend `dataLayer` event that should reach GA4, the GTM operator must create both:

- a Custom Event Trigger whose event name exactly matches the pushed `dataLayer` event, and
- a GA4 Event Tag that uses that trigger and maps the event parameters needed for reporting.

Initial event setup:

- `generate_lead`: primary lead event. Mark this as the initial GA4 Key event / Conversion after the GA4 tag is receiving it correctly.
- `contact_form_submit`: debug or auxiliary event only. Do not mark this as the initial conversion.
- `apply_for_trial_click`: trial CTA click event. Add this event name explicitly; do not rely on `start_trial_click` for the current tracking contract.

