# Sampora SEO, Social, And Schema

This document records the current public SEO, social metadata, and structured-data rules for Sampora. It is documentation only; do not edit public HTML from this file.

## Canonical Public Pages

Core marketing pages:

```text
index.html
solutions.html
resources.html
resource-manuals.html
plans.html
about.html
contact.html
```

Approved support pages:

```text
404.html
privacy.html
cookie-policy.html
terms.html
thank-you.html
```

`thank-you.html` is a noindex Contact-success page, not a search landing page.

## Homepage JSON-LD Limits

JSON-LD belongs on homepage `index.html` only.

Allowed JSON-LD types:

```text
Organization
WebSite
SoftwareApplication
```

Do not add:

```text
Review
Rating
AggregateRating
Offer
Product
price
```

Homepage structured-data URLs should use:

```text
https://getsampora.com/
```

Do not use:

```text
https://getsampora.com/index.html
```

Canonical structured-data asset:

```text
Organization.logo = https://getsampora.com/assets/sampora-logo.png
```

## Open Graph And Twitter Card Requirements

Each core marketing page should include complete page-specific social metadata:

```text
og:type
og:title
og:description
og:url
og:image
og:image:width
og:image:height
og:image:alt
twitter:card
twitter:title
twitter:description
twitter:image
```

Each page should use its own canonical absolute `og:url`. Do not set every page to the homepage URL.

Shared image references:

```text
og:image = https://getsampora.com/assets/og-sampora.png
twitter:image = https://getsampora.com/assets/og-sampora.png
```

The local `assets/og-sampora.png` asset should remain 1200 x 630.

## Thank-You Page Exclusions

`thank-you.html` must:

- keep `noindex, nofollow`
- stay out of `sitemap.xml`
- not be submitted through IndexNow
- not include OG/Twitter Card metadata
- remain the page where `generate_lead` can fire after Contact success

## Snippets

Files under a `snippets/` folder are code snippets or development references, not standalone public URLs.

Rules:

- Do not deploy snippet HTML as public pages.
- Merge snippet code into formal pages only when a task explicitly requires it.
- If a formal page already contains the intended snippet behavior, keep snippets as development reference only.

## Sitemap Rules

If Google Search Console already knows `sitemap.xml`, do not resubmit it for every content edit.

Update sitemap only when the URL set changes.

Do not include:

```text
thank-you.html
404.html
```

Current sitemap policy includes the core marketing pages plus legal/support policy pages that should be indexable.

## IndexNow Rules

The current IndexNow key file is:

```text
https://getsampora.com/65e62f1d55ca4d9fbd11e31ca240a016.txt
```

The current operator script is:

```text
sampora-website-public-v3/scripts/submit-indexnow.mjs
```

Operational rules:

- Run IndexNow after deployment, not during ordinary docs edits.
- Run it as a backend/operator step.
- Keep the script outside public deployment zips.
- Confirm the key file is publicly reachable before submission.
- Expected successful HTTP status is `200`.
- Do not submit `thank-you.html`.

Example operator command from the source tree:

```powershell
node "sampora-website-public-v3\scripts\submit-indexnow.mjs"
```
