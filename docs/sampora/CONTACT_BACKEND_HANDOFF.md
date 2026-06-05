# Sampora Contact Backend Handoff

This document consolidates the current `/api/contact` contract for Sampora. It is documentation only; do not change the Contact frontend or backend from this file.

## Current Frontend Route Contract

The current Contact form posts to the same-origin backend route:

```text
POST /api/contact
```

Current frontend contract:

- `method="post"`
- `action="/api/contact"`
- `data-endpoint="/api/contact"`
- script constant `CONTACT_ENDPOINT = '/api/contact'`
- submit body uses `FormData` converted to `URLSearchParams`
- content type is compatible with `application/x-www-form-urlencoded`
- public HTML must not directly reference Google Apps Script as the form endpoint

## Visible Fields

Visible Contact fields:

```text
name
company
email
role
business_type
message
```

Recommended required fields server-side:

```text
name
company
email
role
business_type
```

`message` is optional.

Current role values:

```text
panel_provider
sample_supplier
client_side
two_sided_operations
aggregator_network
api_supplier
enterprise_multi_entity
not_sure
Other
```

If the backend receives an unknown role value, trim and store the cleaned value. Do not fail an otherwise valid lead only because a role value is outside the current frontend list.

## Hidden Context And Attribution Fields

Context fields:

```text
intent
source_page
source_section
plan
lang
```

Attribution fields:

```text
utm_source
utm_medium
utm_campaign
utm_term
utm_content
gclid
fbclid
msclkid
referrer
landing_page
conversion_page
cta_intent
cta_location
cta_event
captured_at
first_landing_page
first_referrer
first_utm_source
first_utm_medium
first_utm_campaign
last_landing_page
last_referrer
```

Honeypot field:

```text
website
```

Hidden fields are attribution and routing context only. They are not permission, price, discount, or security inputs.

## Success And Failure Behavior

Frontend success requires:

```text
HTTP 2xx
JSON ok === true
```

Only after backend-ok success may the frontend push `contact_form_submit` once and redirect to `thank-you.html`.

Failure cases must preserve user input:

- HTTP non-2xx
- HTTP 2xx with `ok:false`
- invalid or missing JSON
- network errors
- endpoint errors
- validation failures

`generate_lead` belongs only on `thank-you.html` page load and is deduped there.

## Sheet Or CRM Fields

If an existing sales lead table already exists, do not create a duplicate table. Append needed columns to the existing lead record shape.

Recommended minimum fields:

```text
submitted_at
lead_id
name
company
email
role
request_type
message
lead_status
lead_quality
owner
notes
utm_source
utm_medium
utm_campaign
landing_page
conversion_page
cta_event
cta_intent
cta_location
```

Optional attribution fields:

```text
utm_term
utm_content
gclid
fbclid
msclkid
referrer
referrer_domain
first_landing_page
first_referrer
first_utm_source
first_utm_medium
first_utm_campaign
last_landing_page
last_referrer
```

Prefer one field per column instead of placing all attribution into one large JSON cell.

## Backend Handling Rules

- Trim all incoming fields.
- Validate required visible fields server-side.
- Limit URL and referrer fields before storage or email rendering.
- Limit UTM and click-ID fields.
- Missing attribution fields must not fail the main form submission.
- Attribution fields are context; do not use them for authorization, pricing, discounting, or security.
- HTML-escape values in email notifications.
- Add a separate Attribution section to notification emails.
- Keep honeypot filtering enabled.
- Return JSON `{ "ok": true }` only after the backend accepts the submission.

## Google Apps Script Example

`sampora-website-public-v3/backend/google-apps-script-contact.gs` is an optional backend example. It is not a required frontend asset and should not be deployed into the public web root.

If using Google Apps Script:

- Replace `SHEET_ID`.
- Deploy as a Web App or adapt it behind `/api/contact`.
- Confirm Google Sheet writes.
- Confirm notification email delivery.

If a real `/api/contact` backend already exists:

- Use the Apps Script file only as a field-contract and email Attribution reference.
- Do not treat it as mandatory production infrastructure.

## GA4 Versus Sheet Or CRM

GA4 answers aggregate questions:

- Which channels bring visits and `generate_lead`
- Which pages convert
- Which CTAs are clicked
- Which campaigns perform better

Sheet or CRM records answer lead-level questions:

- Who submitted the lead
- Which company they represent
- Whether they match the target customer
- Who owns follow-up
- What lead quality and notes sales assigned

Do not send PII to GA4. Keep PII in `/api/contact`, Sheet, CRM, and email notification flows only.

## UTM Guidance

UTMs do not create themselves. If an operator shares:

```text
https://getsampora.com
```

then the website will not invent `utm_source=linkedin`.

For formal campaigns, use explicit UTM links:

```text
https://getsampora.com/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=india_launch&utm_content=company_post
```

Plain links may rely on referrer and GA4 source inference, but formal promotion, email, WhatsApp, ads, and partner links should use fixed UTM URLs.
