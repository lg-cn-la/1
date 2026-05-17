# Sampora Redirect Map

Use English canonical paths for all maintained public pages. Physical redirect HTML files are included in the public package for local compatibility; production should also support these mappings with backend rewrite rules, especially if Chinese filenames become mojibake during extraction.

| Legacy path | Canonical path | Public package handling |
|---|---|---|
| 首页.html | index.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 产品.html | index.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| products.html | index.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 解决方案.html | solutions.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 资源中心.html | resources.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 资源-跳转页面.html | resource-manuals.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 版本方案.html | plans.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 联系我们.html | contact.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| pricing.html | plans.html | root redirect HTML: meta refresh + `location.replace` + fallback link |

Canonical maintained pages:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`
