# Backend Route Handoff

This public package ships only real content pages in the public root. Legacy routes must be handled by backend/CDN 301 redirects in the production release.

## Required 301 Redirects

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

## Nginx Example

```nginx
location = /products.html { return 301 /index.html$is_args$args; }
location = /products      { return 301 /index.html$is_args$args; }
location = /products/     { return 301 /index.html$is_args$args; }

location = /pricing.html  { return 301 /plans.html$is_args$args; }
location = /pricing       { return 301 /plans.html$is_args$args; }
location = /pricing/      { return 301 /plans.html$is_args$args; }

location = /about_sampora_issues_fixed.html { return 301 /about.html$is_args$args; }

location = /首页.html          { return 301 /index.html$is_args$args; }
location = /产品.html          { return 301 /index.html$is_args$args; }
location = /解决方案.html      { return 301 /solutions.html$is_args$args; }
location = /资源中心.html      { return 301 /resources.html$is_args$args; }
location = /资源-跳转页面.html { return 301 /resource-manuals.html$is_args$args; }
location = /版本方案.html      { return 301 /plans.html$is_args$args; }
location = /联系我们.html      { return 301 /contact.html$is_args$args; }
```

## Express Example

```js
const redirects = new Map([
  ['/products.html', '/index.html'],
  ['/products', '/index.html'],
  ['/products/', '/index.html'],
  ['/pricing.html', '/plans.html'],
  ['/pricing', '/plans.html'],
  ['/pricing/', '/plans.html'],
  ['/about_sampora_issues_fixed.html', '/about.html'],
  ['/首页.html', '/index.html'],
  ['/产品.html', '/index.html'],
  ['/解决方案.html', '/solutions.html'],
  ['/资源中心.html', '/resources.html'],
  ['/资源-跳转页面.html', '/resource-manuals.html'],
  ['/版本方案.html', '/plans.html'],
  ['/联系我们.html', '/contact.html'],
]);

app.use((req, res, next) => {
  const target = redirects.get(req.path);
  if (!target) return next();
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return res.redirect(301, `${target}${query}`);
});
```

## Contact Endpoint Gate

The static handoff source may keep `[BACKEND_CONTACT_ENDPOINT]` in `contact.html`. Production must either replace that token during the release process or inject a real endpoint from the backend template response. If no real endpoint exists yet, this package is a staging/static handoff and must not be marked production ready.
