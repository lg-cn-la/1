# Sampora Deployment Runbook

This runbook records post-deploy checks for the Sampora public website. It is documentation only; do not rebuild packages or run live deployment from this file unless explicitly assigned.

## Public Source And Package Boundary

Current public source of truth:

```text
sampora-website-public-v3/
```

Public deployment zips should contain only public web-root assets and pages. They should not include:

```text
qa-evidence/
backend/
snippets/
scripts/
*.md
```

The IndexNow script is an operator/backend step and stays outside public deployment zips:

```text
sampora-website-public-v3/scripts/submit-indexnow.mjs
```

## Post-Deploy Static Checks

After deployment, confirm:

1. All expected public pages load.
2. `GTM-NC23T9B2` remains present.
3. No direct GA4 `gtag.js` snippet was added.
4. No direct Clarity script was added.
5. `thank-you.html` remains `noindex, nofollow`.
6. `thank-you.html` is not in `sitemap.xml`.
7. `thank-you.html` is not submitted by IndexNow.
8. Required current public assets exist:
   - `assets/og-sampora.png`
   - `assets/sampora-logo.png`

Desired-but-not-yet-present standardized assets should not be treated as deploy blockers unless a later task adds them:

```text
assets/sampora-mark.png
assets/sampora-chat-avatar.png
```

## Contact Backend Checks

At minimum, confirm the backend receives:

```text
name
company
email
role
business_type
message
utm_source
utm_medium
utm_campaign
landing_page
conversion_page
cta_event
cta_intent
cta_location
```

Then confirm:

- Contact form submits to `/api/contact`.
- Required field validation works server-side.
- Missing attribution does not fail the submission.
- Backend success returns JSON with `ok === true`.
- Failure responses preserve user input.
- Google Sheet, database, or CRM receives the lead.
- Notification email is delivered.
- The notification email includes a separate Attribution section.
- Contact success redirects to `thank-you.html`.

Do not claim production Contact acceptance until the deployed `/api/contact`, Sheet or CRM write, and email notification have been checked in the live environment.

## GTM Preview And GA4 DebugView

Use GTM Preview / Tag Assistant after deployment:

1. Open the deployed website in GTM Preview.
2. Click header, hero, footer, resource, and plan-card CTAs.
3. Submit a Contact test lead through the deployed backend.
4. Confirm `contact_form_submit` fires only after backend-ok success.
5. Confirm `generate_lead` fires only on `thank-you.html`.
6. Refresh `thank-you.html` and confirm `generate_lead` does not duplicate.
7. Confirm no PII is mapped to GA4 event parameters.

Check GA4 DebugView for:

```text
book_demo_click
apply_for_trial_click
contact_sales_click
resource_click
pricing_plan_click
contact_form_submit
generate_lead
```

`pricing_plan_click` is the reserved/allowed dedicated plan-card event. If the current source still uses conversion CTA events on plan cards, confirm those events carry `plan_slug`.

## GA4 Admin Steps

After events appear in GA4:

1. Mark `generate_lead` as the Key event / Conversion.
2. Do not mark `contact_form_submit` as the primary conversion.
3. Create event-scoped custom dimensions:

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

## IndexNow Operator Step

Before running IndexNow, confirm the key file is reachable:

```text
https://getsampora.com/65e62f1d55ca4d9fbd11e31ca240a016.txt
```

Run from the repo source tree:

```powershell
node "sampora-website-public-v3\scripts\submit-indexnow.mjs"
```

Expected result:

```text
HTTP status: 200
```

The script should be handed to backend/operators separately and should not be bundled into public deployment zips.
