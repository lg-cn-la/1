# Sampora Redirect Map

Use English canonical paths for all maintained public pages. The public package ships English canonical pages plus English redirect files only. Chinese legacy routes are handled by server/CDN rewrite rules, not physical public-root HTML files, because filename preservation can fail and produce mojibake during extraction or hosting upload.

| Legacy path | Canonical path | Handling |
|---|---|---|
| 首页.html | index.html | server/CDN rewrite rule; Product=首页 product overview |
| 产品.html | index.html | server/CDN rewrite rule; Product=首页 product overview |
| products.html | index.html | root redirect HTML: meta refresh + `location.replace` + fallback link |
| 解决方案.html | solutions.html | server/CDN rewrite rule |
| 资源中心.html | resources.html | server/CDN rewrite rule |
| 资源-跳转页面.html | resource-manuals.html | server/CDN rewrite rule |
| 版本方案.html | plans.html | server/CDN rewrite rule |
| 联系我们.html | contact.html | server/CDN rewrite rule |
| pricing.html | plans.html | root redirect HTML: meta refresh + `location.replace` + fallback link |

Canonical maintained pages:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`
