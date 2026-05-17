# Sampora Redirect Map

Use English canonical paths for all maintained public pages. The public package includes root redirect HTML files for English and Chinese legacy paths. Server/CDN rewrite rules are still recommended for Chinese legacy paths when filename preservation is unreliable, because physical Chinese filenames can become mojibake during zip extraction or hosting upload.

| Legacy path | Canonical path | Handling |
|---|---|---|
| 首页.html | index.html | root redirect HTML + server/CDN rewrite fallback; Product=首页 product overview |
| 产品.html | index.html | root redirect HTML + server/CDN rewrite fallback; Product=首页 product overview |
| products.html | index.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 解决方案.html | solutions.html | root redirect HTML + server/CDN rewrite fallback |
| 资源中心.html | resources.html | root redirect HTML + server/CDN rewrite fallback |
| 资源-跳转页面.html | resource-manuals.html | root redirect HTML + server/CDN rewrite fallback |
| 版本方案.html | plans.html | root redirect HTML + server/CDN rewrite fallback |
| 联系我们.html | contact.html | root redirect HTML + server/CDN rewrite fallback |
| pricing.html | plans.html | root redirect HTML: meta refresh + `location.replace` + fallback link |

Canonical maintained pages:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`
