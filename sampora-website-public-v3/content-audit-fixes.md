# Sampora Content Audit Fixes

Generated: 2026-05-18

Source folder: `sampora-website-public-v3/`

## Scope

This report covers Package E documentation for content, legal/footer, language, CTA, redirect, resource-manual, meta, and deployment evidence. It does not approve or rebuild archives.

## Content and Legal Baseline

- Public positioning is `Online Sample Operations Platform` for panel providers, sample suppliers, survey stations, and research subcontracting teams.
- Approved company names are `瀹夊窘鐪佸槈绂逛紒涓氭湇鍔℃湁闄愬叕鍙竊 and `Anhui Jiayu Enterprise Service Co., Ltd.`
- Overseas-server stage remains in effect; no mainland filing display is included.
- Canonical links currently use `https://getsampora.com/...`.
- Blocked legacy terms were scanned without spelling them back into this report.

## Redirect Evidence

The public package no longer ships standalone redirect HTML files for `products.html` or `pricing.html`.
Legacy product/pricing routes are backend/CDN-managed 301 redirects to canonical content pages.

| Legacy path | Target | Status |
|---|---|---:|
| `/products.html` | `/index.html` | 301 |
| `/products` | `/index.html` | 301 |
| `/products/` | `/index.html` | 301 |
| `/pricing.html` | `/plans.html` | 301 |
| `/pricing` | `/plans.html` | 301 |
| `/pricing/` | `/plans.html` | 301 |
| `/about_sampora_issues_fixed.html` | `/about.html` | 301 |
| `/首页.html` | `/index.html` | 301 |
| `/产品.html` | `/index.html` | 301 |
| `/解决方案.html` | `/solutions.html` | 301 |
| `/资源中心.html` | `/resources.html` | 301 |
| `/资源-跳转页面.html` | `/resource-manuals.html` | 301 |
| `/版本方案.html` | `/plans.html` | 301 |
| `/联系我们.html` | `/contact.html` | 301 |

## Fix Areas Documented

- Content terminology: current copy uses sample operations, panel operations, supplier network, partner network, and settlement language rather than generic survey or traffic positioning.
- Legal/footer: company wording is unified and no mainland filing display is used for this stage.
- Language/i18n: the global sweep is constrained by static checks, and Resource Manuals language smoke/browser checks confirm non-empty EN/ZH surfaces without question-mark fallback output.
- CTA flow: conversion paths lead to `contact.html?intent=...#contact-form` using supported intent values.
- Resource Manuals: module-specific manual data and fallback behavior are covered by syntax, smoke, and browser language checks.
- Meta/canonical: canonical URLs are present and production-domain confirmation is documented.

## Fresh Evidence

- `node --check assets/i18n-sweep.js`: exit 0
- `node --check assets/resource-manuals/data.js`: exit 0
- `node --check assets/resource-manuals/app.js`: exit 0
- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: run after this route cleanup to confirm the root contains exactly seven real content pages
- `node qa-evidence/resource-manuals-language-smoke.mjs`: `resource manuals language smoke: OK`
- `node qa-evidence/resource-manuals-browser-language-check.mjs`: `resource manuals browser language check: OK`
- Source stale-term scan excluding `qa-evidence/**`: no matches

## Remaining External Items

- Confirm the production domain before final CDN configuration if it differs from the current canonical base.
- Verify deployed redirect behavior after upload, especially for Chinese filenames.

