# Sampora Tracking And Analytics

This document records the current Sampora public website tracking contract. It is documentation only; do not add tracking snippets or edit public HTML from this file.

## Ownership

- GTM owns runtime tag management for GA4, Microsoft Clarity, and future marketing tags.
- Current GTM container: `GTM-NC23T9B2`
- GA4 measurement ID: `G-WFWT4F8YF5`
- The GA4 measurement ID is operator configuration inside GTM. It should not be hardcoded into public HTML with direct `gtag.js`.
- Microsoft Clarity should be managed through GTM and consent mode, not through a direct public HTML snippet.

## Tool Responsibilities

- GA4: traffic, events, conversion analysis, reporting dimensions, and funnel analysis.
- GTM: tag orchestration, GA4 event tags, Clarity, consent-aware marketing tags, and Custom Event Triggers.
- Clarity: heatmaps, session recordings, and page experience diagnostics.
- Google Search Console: search exposure, clicks, and search queries.
- Google Sheet or CRM: individual lead quality, sales ownership, notes, and follow-up state.

## Consent And Direct-Tag Rules

Public HTML should keep default non-essential consent denied before GTM:

```text
analytics_storage = denied
ad_storage = denied
ad_user_data = denied
ad_personalization = denied
wait_for_update = configured
```

Do not add:

- Direct GA4 `gtag.js`
- Direct Clarity script
- Direct Google Ads conversion tag
- Meta Pixel
- LinkedIn Insight tag
- Duplicate `generate_lead` triggers

## Event Contract

Primary conversion event:

```text
generate_lead
```

Rules:

- Trigger only on `thank-you.html` page load.
- Use session storage dedupe so refresh does not create duplicate lead events.
- Do not trigger from `contact.html` submit callback.
- Do not trigger from the backend.
- Mark only `generate_lead` first as the GA4 Key event / Conversion.

Auxiliary event:

```text
contact_form_submit
```

Rules:

- Trigger only after the backend returns success.
- Use for debug and support analysis.
- Do not mark as the primary GA4 Key event / Conversion.

CTA and support events allowed in the Sampora contract:

```text
book_demo_click
apply_for_trial_click
contact_sales_click
resource_click
pricing_plan_click
contact_form_submit
generate_lead
```

`pricing_plan_click` is the reserved/allowed dedicated plan-card event. Current plan-card CTA source may retain `apply_for_trial_click` or `contact_sales_click` with `plan_slug`; if a future source or GTM mapping introduces a plan-card-only event, use `pricing_plan_click`.

## Apply For Trial Compatibility

The public Apply for trial CTA keeps this compatibility shape:

```text
Visible label = Apply for trial
dataLayer event = apply_for_trial_click
cta_intent = trial_request
URL/form intent = start_trial
```

Example:

```html
<a href="contact.html?intent=start_trial#contact-form"
   data-ga-event="apply_for_trial_click"
   data-ga-intent="trial_request"
   data-ga-location="header">
  Apply for trial
</a>
```

Do not reintroduce `start_trial_click` as the button event.

## Cooperation Resources

Use:

```text
event = resource_click
cta_intent = cooperation_resources
resource_slug = cooperation_resources
```

## Plan Cards

Plan cards should include:

```text
plan_slug = sampora_panel
plan_slug = supplier_network
plan_slug = enterprise
```

Ordinary navigation or footer links to Plans do not need `plan_slug`.

## Sanitized GA4 Parameters

Allowed GA4 event parameters:

```text
cta_text
cta_location
cta_intent
cta_event
resource_slug
plan_slug
source_page
source_section
utm_source
utm_medium
utm_campaign
utm_term
utm_content
landing_page_path
conversion_page_path
referrer_domain
first_utm_source
first_utm_medium
first_utm_campaign
first_landing_page_path
last_landing_page_path
language
has_gclid
has_fbclid
has_msclkid
click_id_type
```

Recommended event-scoped GA4 custom dimensions after events are visible in DebugView:

```text
cta_location
cta_intent
resource_slug
plan_slug
utm_source
utm_medium
utm_campaign
landing_page_path
conversion_page_path
referrer_domain
click_id_type
language
```

## PII And Raw Attribution Exclusions

Do not map these to GA4 event parameters:

```text
name
email
company
role
role_other
business_type
message
gclid
fbclid
msclkid
referrer
landing_page
conversion_page
```

Raw click IDs and full URL/referrer values may remain in Contact hidden fields for `/api/contact`, Google Sheet or CRM storage, and email notification context. GA4 receives only sanitized path, domain, boolean, or type fields.
