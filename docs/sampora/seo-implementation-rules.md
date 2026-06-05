# Sampora SEO、结构化数据与 Sitemap 实施规则

更新时间：2026-06-05

本文用于约束 Sampora 官网 SEO 文案、OG/Twitter、JSON-LD、sitemap 和 Codex patch 的修改边界。后续 SEO 改动应先按本文分类，再执行源码修改。

## 1. 当前 SEO 总策略

当前阶段不先新增大量长尾 SEO HTML 页面。优先在现有核心页面中做非破坏式关键词补充。

核心页面：

- `index.html`
- `solutions.html`
- `resources.html`
- `plans.html`
- `about.html`
- `contact.html`

当前策略：

- 不新增 doorway page。
- 不堆关键词。
- 不新增隐藏关键词、不可见 span 或 `meta keywords`。
- 不扭曲原页面语义。
- 不改页面结构、CSS、JS 动效、表单逻辑、导航或 footer 链接。
- 先改 title、meta description、H1 / hero、可见正文、alt、已有 OG/Twitter title/description、I18N.en、I18N.zh。

## 2. 必上关键词

英文 MUST 词：

- `online sample operations platform`
- `sample operations software`
- `panel management software`
- `supplier routing workflow`
- `delivery review workflow`
- `settlement workflow`
- `sample suppliers`
- `panel providers`
- `market research`

中文对应口径：

- 在线样本运营平台
- 样本运营软件
- 自有样本库管理软件
- 供应商路由流程
- 交付审核流程
- 结算流程
- 在线样本供应商 / 样本供应商
- 自有样本库运营方 / Panel Provider
- 市场研究

## 3. 可选长尾词

OPTIONAL 词可以先放到 Resources、FAQ、说明段、Contact 辅助文案或内链锚文本中观察，不要全站重复：

- `sample supplier management software`
- `panel provider operations software`
- `market research panel management software`
- `sample delivery review workflow`
- `sample supplier settlement workflow`
- `survey sample supplier`

## 4. 页面分工

- 首页：负责品牌定位、品类词和总体业务叙事。
- Solutions：负责 supplier management、supplier routing、API delivery 和场景化方案。
- Resources：负责 workflow 词，包括 supplier routing workflow、delivery review workflow、settlement workflow。
- Plans：负责 software comparison、版本选择、自有样本库管理软件、供应商网络运营和 Enterprise。
- About：负责品牌信任、行业上下文、market research sample operations。
- Contact：负责 demo / trial / sales 转化，不写成关键词页。

## 5. 关键词频次规则

- `sample operations software` 和 `panel management software` 每个页面可见正文不建议超过 2 次。
- workflow 词可以在 Resources 中稍多出现，但必须在真实流程语境中。
- `market research` 只用于行业上下文，不要每页硬塞。
- 中文必须按 `terminology-glossary.md`，不要把 `panel management software` 写成“Panel 管理软件”或“面板管理软件”。

## 6. OG / Twitter 规则

可以同步更新已有的：

- `og:title`
- `og:description`
- `twitter:title`
- `twitter:description`

但必须遵守：

- 只改已有标签；如果页面没有对应 OG/Twitter title/description，不要主动新增。
- 不改 `og:url`。
- 不改 canonical。
- 不改 `og:image`。
- 不改 `twitter:image`。
- 不把正式 logo 当成 OG 分享图。

## 7. JSON-LD 规则

首页 JSON-LD 只保留当前已确认的结构：

- `Organization`
- `WebSite`
- `SoftwareApplication`

当前 SEO 补词不修改 JSON-LD。不要为了加关键词去改 `description`。

不要新增：

- `Product`
- `Offer`
- `price`
- `Review`
- `Rating`
- `AggregateRating`

原因：Sampora 是 B2B SaaS 产品，但首页不是电商商品详情页，也没有公开价格、库存、评分或评论。用 `Product` / `Offer` / `AggregateRating` 容易造成不准确结构化数据或 QA guard 冲突。

## 8. Sitemap 规则

没有新增页面时，不新增 URL。

SEO 文案更新后可以检查 sitemap：

- 如果本轮修改了页面主内容，可以更新对应 URL 的 `<lastmod>`。
- 如果首页 canonical 是 `https://getsampora.com/`，sitemap 首页也应使用 `https://getsampora.com/`，不要写 `/index.html`。
- 不要改 `priority`，除非明显错误。
- 不新增 `changefreq`。
- 未修改页面保持原 lastmod。
- XML 修改后必须确认可 parse。

## 9. Codex patch 边界

SEO 文案 patch 允许修改：

- 六个核心 HTML 页面。
- sitemap.xml，仅限 canonical 首页 URL 和 changed pages lastmod。
- handoff 记录，仅限简短记录。

不允许修改：

- CSS。
- JS 动效。
- Contact 表单 endpoint、intent、字段、提交逻辑、analytics attributes。
- JSON-LD。
- canonical。
- `og:url`、OG/Twitter image。
- QA guard、ledger、acceptance 文档，除非用户明确要求。

## 10. 汇报规则

完成后必须说明：

- 实际修改文件。
- 是否跳过 JSON-LD。
- 是否更新 sitemap。
- 是否只做 smoke check。
- 是否未做完整五层验收。

如果没有做完整五层验证，不得写“验收完成”。