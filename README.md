# Sampora / SurveySaaS 海外官网与产品文档

> 当前公开品牌：**Sampora**。  
> `SurveySaaS` / `FenSvyG` 是历史旧名，只用于旧资产、旧 demo 和归档上下文。后续公开官网、SEO、JSON-LD、OG/Twitter、Sales PDF、Demo 脚本和 Codex patch 应优先使用 Sampora 口径。

这个仓库保存 Sampora 当前官网产品共识、SEO 规则、术语表、验收边界，以及 SurveySaaS / FenSvyG 旧阶段的设计 demo、真实页面评估输出、补充方案和交接文档。

## 当前 Sampora 必读文档

后续 agent / Codex 接手时，优先读：

1. [docs/sampora/README.md](docs/sampora/README.md)：当前 Sampora 文档索引和维护规则。
2. [docs/sampora/current-product-positioning.md](docs/sampora/current-product-positioning.md)：当前品牌、目标客户、产品定位和不应误写的边界。
3. [docs/sampora/product-boundaries-and-workflows.md](docs/sampora/product-boundaries-and-workflows.md)：确认过的产品能力、业务闭环、Partner Network 和结算流程口径。
4. [docs/sampora/terminology-glossary.md](docs/sampora/terminology-glossary.md)：中英文固定术语，尤其是 `panel management software` 的中文口径。
5. [docs/sampora/seo-implementation-rules.md](docs/sampora/seo-implementation-rules.md)：SEO 关键词、OG/Twitter、JSON-LD、sitemap 和页面修改边界。
6. [docs/sampora/website-repair-and-acceptance-rules.md](docs/sampora/website-repair-and-acceptance-rules.md)：官网修复、回归保护和验收表述规则。

## 当前产品共识

Sampora 不是普通问卷工具、普通项目管理系统、纯样本交易市场，也不应被包装成 Cint / PureSpectrum / Dynata 那类 marketplace。

当前更准确的定位是：

> Online sample operations platform and B2B SaaS workspace for panel providers, sample suppliers, supplier network teams, and market research sample operations teams.

中文可表达为：

> 面向自有样本库运营方、在线样本供应商、供应商网络团队和市场研究样本运营团队的在线样本运营平台 / B2B SaaS 工作台。

## 当前官网与 Codex 执行原则

- 当前前台品牌只用 Sampora。
- SEO 优先在现有核心页面做非破坏式关键词补充，不先新增大量长尾 HTML。
- 首页 JSON-LD 只保留 Organization + WebSite + SoftwareApplication，不新增 Product / Offer / price / Review / Rating / AggregateRating。
- `panel management software` 中文统一为“自有样本库管理软件”，不要写成“Panel 管理软件”或“面板管理软件”。
- 完整五层验证必须真实覆盖静态完整性、视觉与动效运行态、业务路径、文案术语和上线可用性。grep / source review / smoke check 不能说成验收完成。

## 历史资料仍可参考

以下旧资料仍有参考价值，但名称、定位和文案不得直接覆盖当前 Sampora 口径：

1. [docs/surveysaas/product-positioning-summary.md](docs/surveysaas/product-positioning-summary.md)：旧 SurveySaaS 产品定位、功能边界和业务闭环。
2. [docs/surveysaas/sample-supplier-taxonomy.md](docs/surveysaas/sample-supplier-taxonomy.md)：Panel Provider、Sample Supplier、Survey Station、Sample Aggregator、Research Subcontractor、API-connected Supplier 的分类关系。
3. [docs/surveysaas/backend-function-map.md](docs/surveysaas/backend-function-map.md)：基于演示后台实扫的功能地图、模块字段、按钮和流程线索。
4. [补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md](补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md)：从 v48 R8 分支核对后吸收进 main 的设计补充说明。
5. [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md)：旧阶段项目背景、目标客户、设计演进和下一步建议。
6. [补充资料归档/README.md](补充资料归档/README.md)：不在原始 Git 仓库里的桌面补充资料归档说明。
7. [补充资料归档/operations-console/README.md](补充资料归档/operations-console/README.md)：operations console 方向的版本说明和 v4.7 / v4.8 R8 方向资料。

## 历史主线说明

仓库早期主线是 SurveySaaS / FenSvyG 海外官网方向评估，包含多个 demo、operations console 方向、真实页面截图和评估报告。当前这些内容保留为历史资产。

后续如果继续迭代官网，不要从“7 个旧 demo 重新打分”开始。更有效的顺序是：

1. 先读 `docs/sampora/` 目录，确认当前 Sampora 品牌、产品边界、术语、SEO 和验收规则。
2. 再读 `docs/surveysaas/sample-supplier-taxonomy.md` 和 `docs/surveysaas/backend-function-map.md`，吸收仍然有效的业务分类和后台功能证据。
3. 再看 operations console 归档，判断 SaaS 克制感、运营密度、视觉记忆点和产品运行感是否平衡。
4. 最后再把真实业务内容替换进当前候选页面，不要继续写设计说明类占位文案。

## 目录说明

- `docs/sampora/`：当前 Sampora 产品、术语、SEO、结构化数据和验收规则。
- `docs/surveysaas/`：SurveySaaS 旧阶段产品定位、分类和后台功能证据。
- `补充资料归档/operations-console/`：operations console 方向资料和历史 demo。
- `AI网页评估包/`：原始 7 个 demo 和评估入口。
- `真实页面评估输出/`：早期 demo 的桌面端 / 移动端截图、contact sheet 和页面观察 JSON。
- `PROJECT_HANDOFF.md`：旧阶段项目交接说明。
- `DEMO设计评估手册.html`、`真实页面专业评估报告.html`：早期设计评估资料。
- `build_*.js` / `evaluate_*.js` / `make_ai_review_pack.ps1`：生成评估手册、真实页面报告和评估包的脚本。
