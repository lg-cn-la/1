# Sampora Content Audit Fixes

Generated: 2026-05-18

Source folder: `E:\claude work\sampora-website-public`

## Scope

This report covers Package E documentation for content, legal/footer, language, CTA, redirect, resource-manual, meta, and deployment evidence. It does not approve or rebuild archives.

## Content and Legal Baseline

- Public positioning is `Online Sample Operations Platform` for panel providers, sample suppliers, survey stations, and research subcontracting teams.
- Approved company names are `安徽省嘉禹企业服务有限公司` and `Anhui Jiayu Enterprise Service Co., Ltd.`
- Overseas-server stage remains in effect; no mainland filing display is included.
- Canonical links currently use `https://www.sampora.com/...`; confirm the final production domain if it changes.
- Blocked legacy terms were scanned without spelling them back into this report.

## Redirect Evidence

Actual redirect files inspected in the public root:

- `products.html` -> `index.html`
- `pricing.html` -> `plans.html`
- `首页.html` -> `index.html`
- `产品.html` -> `index.html`
- `解决方案.html` -> `solutions.html`
- `资源中心.html` -> `resources.html`
- `资源-跳转页面.html` -> `resource-manuals.html`
- `版本方案.html` -> `plans.html`
- `联系我们.html` -> `contact.html`

Chinese redirect HTML files are included. Server/CDN rewrites are still recommended because Chinese filenames may become mojibake during extraction or hosting upload.

## Fix Areas Documented

- Content terminology: current copy uses sample operations, panel operations, supplier network, partner network, and settlement language rather than generic survey or traffic positioning.
- Legal/footer: company wording is unified and no mainland filing display is used for this stage.
- Language/i18n: the global sweep is constrained by static checks, and Resource Manuals language smoke/browser checks confirm non-empty EN/ZH/HI surfaces without question-mark fallback output.
- CTA flow: conversion paths lead to `contact.html?intent=...#contact-form` using supported intent values.
- Resource Manuals: module-specific manual data and fallback behavior are covered by syntax, smoke, and browser language checks.
- Meta/canonical: canonical URLs are present and production-domain confirmation is documented.

## Fresh Evidence

- `node --check assets/i18n-sweep.js`: exit 0
- `node --check assets/resource-manuals/data.js`: exit 0
- `node --check assets/resource-manuals/app.js`: exit 0
- `node qa-evidence/final-audit-static-check.mjs`: `PASS final audit static checks`
- `node qa-evidence/page-layer-static-check.mjs`: `PASS static checks for 15 HTML files`
- `node qa-evidence/resource-manuals-language-smoke.mjs`: `resource manuals language smoke: OK`
- `node qa-evidence/resource-manuals-browser-language-check.mjs`: `resource manuals browser language check: OK`
- Source stale-term scan excluding `qa-evidence/**`: no matches

## Remaining External Items

- Confirm the production domain before final CDN configuration if it differs from the current canonical base.
- Verify deployed redirect behavior after upload, especially for Chinese filenames.
