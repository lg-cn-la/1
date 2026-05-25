# Sampora Redirect Map

Use English canonical paths for all maintained public pages. The public package ships only real content pages in the public root. Legacy product, pricing, About, and Chinese routes are handled by backend/CDN 301 redirects, not physical public-root HTML files.

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

Canonical maintained pages:

- `index.html`
- `solutions.html`
- `resources.html`
- `resource-manuals.html`
- `plans.html`
- `contact.html`
- `about.html`
