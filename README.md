# SurveySaaS / FenSvyG 海外官网方向评估

这个仓库保存 SurveySaaS / FenSvyG 海外官网的设计 demo、真实页面评估输出、补充方案和交接文档。

后续 agent 接手时，建议先读：

1. [docs/surveysaas/product-positioning-summary.md](docs/surveysaas/product-positioning-summary.md)：当前最新产品定位、供应链位置、客户画像、功能边界、业务闭环、术语和 Demo 主线。后续官网、Sales PDF、Demo 脚本和产品文案应优先以此为产品共识基础。
2. [docs/surveysaas/sample-supplier-taxonomy.md](docs/surveysaas/sample-supplier-taxonomy.md)：Panel Provider、Sample Supplier、Survey Station、Sample Aggregator、Research Subcontractor、API-connected Supplier 的分类关系；明确 Audience Source 不作为当前首屏核心目标客户分类。
3. [补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md](补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md)：从 v48 R8 分支核对后吸收进 main 的设计补充说明；保留可确认的设计判断，同时标记不能原样沿用的旧文案和未验证承诺。
4. [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md)：项目背景、目标客户、设计演进、当前判断和下一步建议。
5. [补充资料归档/README.md](补充资料归档/README.md)：不在原始 Git 仓库里的桌面补充资料归档说明。
6. [补充资料归档/operations-console/README.md](补充资料归档/operations-console/README.md)：operations console 方向的版本说明和 v4.7 / v4.8 R8 方向资料。

## 当前产品共识

当前最新产品定位资料是：

[docs/surveysaas/product-positioning-summary.md](docs/surveysaas/product-positioning-summary.md)

核心判断：SurveySaaS / Sampora 不是普通问卷工具、普通项目管理系统或纯样本交易市场，而是面向在线样本服务商、Panel Providers、Sample Suppliers 和调研分包执行团队的 **Sample Operations / Panel Operations SaaS + Partner Network + Multi-party Settlement Platform**。

后续所有官网、PDF、Demo、销售话术、Agent 交接和功能包装，优先以 `product-positioning-summary.md` 为产品共识基础；涉及目标客户分类、首屏拓扑图、Sample Supplier 子类型时，同时以 `sample-supplier-taxonomy.md` 为准。早期文档中的旧版本名、旧价格和不准确术语仅作为历史参考。

## 当前主线

当前推荐方向是 `operations console`，核心判断是：

> 国际 SaaS 正版感 + 运营密度 + 产品可信。

当前基础方向资料是：

[补充资料归档/operations-console/DESIGN_STRATEGY_v4.7.md](补充资料归档/operations-console/DESIGN_STRATEGY_v4.7.md)

配套方向 demo 是：

[补充资料归档/operations-console/surveysaas_v47_direction_demo.html](补充资料归档/operations-console/surveysaas_v47_direction_demo.html)

v4.8 R8 分支中的有效设计判断已经整理到：

[补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md](补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md)

后续如果继续基于 v4.8 / R8 方向迭代，应优先读这个 reviewed notes，不要直接照搬分支里的 snapshot HTML。

对照基准是：

[补充资料归档/operations-console/09_v35_operations_console_hybrid.html](补充资料归档/operations-console/09_v35_operations_console_hybrid.html)

## 目录说明

- `docs/surveysaas/product-positioning-summary.md`：当前最新产品定位、供应链位置、客户画像、功能边界、业务闭环、术语和 Demo 主线。
- `docs/surveysaas/sample-supplier-taxonomy.md`：Sample Supplier 分类补充说明，包含首屏拓扑图建议和 Audience Source 使用边界。
- `补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md`：v48 R8 分支核对后的设计补充说明。
- `AI网页评估包/`：原始 7 个 demo 和评估入口。
- `真实页面评估输出/`：早期 demo 的桌面端 / 移动端截图、contact sheet 和页面观察 JSON。
- `补充资料归档/`：后来从桌面补进来的 Claude / GPT 方案、交接文档和聊天记录。
- `PROJECT_HANDOFF.md`：给新对话或新 agent 的总交接说明。
- `DEMO设计评估手册.html`：较大的综合设计评估手册。
- `真实页面专业评估报告.html`：早期真实页面专业评估报告。
- `build_*.js` / `evaluate_*.js` / `make_ai_review_pack.ps1`：生成评估手册、真实页面报告和评估包的脚本。

## 接手建议

不要从“7 个旧 demo 重新打分”开始。更有效的顺序是：

1. 先读 `docs/surveysaas/product-positioning-summary.md`，确认产品到底是什么、服务谁、处在供应链哪个位置，以及哪些功能/术语不能误写。
2. 再读 `docs/surveysaas/sample-supplier-taxonomy.md`，确认 Panel Provider / Sample Supplier / Survey Station / API Supplier 等角色关系，以及首页拓扑图应该如何写。
3. 再读 `补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md`，吸收 v48 R8 的可用设计判断，并避开其中已经标记不能原样沿用的旧文案。
4. 再读 `PROJECT_HANDOFF.md`。
5. 先读 v4.7 设计 / 迭代指导方案，再打开 v4.7 方向 demo。
6. 对照 v4.6、v3.5 和 `10_ops_console_overseas_saas_demo.html`，判断 SaaS 克制感、视觉记忆点和产品运行感是否平衡。
7. 再把真实业务内容替换进当前候选，而不是继续写设计说明类占位文案。

## 注意

- 不要提交压缩包、浏览器缓存、临时测试目录。
- 不要提交账号、密码、密钥、客户隐私数据。
- 这个仓库包含项目方向、定位和设计讨论资料，GitHub 仓库建议设置为 Private。
