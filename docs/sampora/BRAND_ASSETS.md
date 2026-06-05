# Sampora Brand Assets

This document records current and desired Sampora public website assets. Paths are relative to the public deployment root, currently sourced from `sampora-website-public-v3/`.

## Current Existing Assets

| Asset | Current status | Current dimensions | Primary use |
|---|---|---:|---|
| `assets/sampora-logo.png` | Exists | 2048 x 682 | Formal horizontal logo and JSON-LD `Organization.logo` |
| `assets/og-sampora.png` | Exists | 1200 x 630 | Open Graph, Twitter Card, LinkedIn, WhatsApp, and X sharing image |

## Desired Standardized Assets

These assets are desired standards but are not currently present in the public source tree:

| Asset | Current status | Desired use |
|---|---|---|
| `assets/sampora-mark.png` | Not present | Official Sampora S mark, favicon source, small icon, and system icon source |
| `assets/sampora-chat-avatar.png` | Not present | Customer-service or chat avatar based on the official Sampora S mark |

Do not document the desired assets as shipped assets until the files are actually added to the public source tree.

## Asset Rules

### `assets/sampora-logo.png`

Use for:

- Formal horizontal logo
- JSON-LD `Organization.logo`
- Email signatures
- Brand display

Do not use for:

- `og:image`
- Customer-service or chat avatar
- Small favicon source

### `assets/og-sampora.png`

Use for:

- `og:image`
- `twitter:image`
- LinkedIn, WhatsApp, and X sharing previews

Requirements:

- 1200 x 630 PNG
- Do not replace with the ordinary logo
- Do not use as JSON-LD `Organization.logo`

### Desired `assets/sampora-mark.png`

Target requirements:

- Official S mark only
- No Sampora wordmark text
- Uses the current website S mark color and shape direction
- Suitable source for favicon and small system icon variants
- Do not replace it with an AI-generated dark circular S that differs from the official mark

### Desired `assets/sampora-chat-avatar.png`

Target requirements:

- 512 x 512 PNG
- Based on the official Sampora S mark
- No Sampora wordmark text
- Clear at small sizes
- Colors match the current Sampora logo direction
- Do not use a darker AI-generated circular S variant as the standard avatar

## Canonical References

```text
JSON-LD Organization.logo = https://getsampora.com/assets/sampora-logo.png
og:image = https://getsampora.com/assets/og-sampora.png
twitter:image = https://getsampora.com/assets/og-sampora.png
```
