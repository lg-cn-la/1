# Sampora 产品边界与业务流程共识

更新时间：2026-06-05

本文用于固化 Sampora 当前已确认的产品能力、业务边界和官网文案可写范围。后续官网、SEO、Sales PDF、Demo、Codex patch 和 Agent 交接应以本文为准。

## 1. 产品做什么

Sampora 是面向在线样本运营团队的 B2B SaaS 工作台，覆盖：

- 在线样本项目接收、创建、配置、上线、下线和状态跟踪。
- 供应商分配、供应商排除规则、供应商级项目价格和交付追踪。
- API 项目接收与 API-connected supplier 项目分发。
- 客户管理、供应商管理、自有样本库 / 会员管理。
- 交付审核、callback 记录、review notes、termination records 和操作日志。
- 结算记录、供应商账单、客户发票、wallet 和 finance logs。
- 团队、部门、角色、权限和工作流协作。
- Partner Network / 合作资源，用于帮助客户找供应商、帮助供应商找客户。

## 2. 产品不做什么

Sampora 不应被包装成普通问卷编辑器、通用项目管理工具、纯样本交易市场、研究报告工具、线下访问员管理系统，或 Cint / PureSpectrum / Dynata 那类 marketplace。

官网文案可以说明 Sampora 支持在线样本项目下游的运营管理，但不要暗示它替代问卷编辑、样本交易市场、研究分析或线下 fieldwork 系统。

## 3. 核心业务闭环

```text
Partner Network / Cooperation Resources
  -> establish cooperation
Internal Client / Internal Supplier
  -> project intake or project creation
Project Management
  -> supplier routing, exclusion rules, pricing
Delivery Tracking
  -> completes, rejects, callbacks, status
Review & Quality Control
  -> automated review or manual recheck
Settlement Workflow
  -> supplier bills, client invoices, finance logs
Operational Review
  -> dashboard, records, exports
Partner Network Growth
```

## 4. Partner Network / 合作资源口径

Partner Network 不是普通黄页，也不是纯资源展示页。

已确认规则：

- 外部客户可通过合作资源寻找供应商。
- 外部供应商可通过合作资源寻找客户。
- 不同产品版本可以展示不同入口。
- Enterprise / 完整版本可同时看到 Client Network 和 Supplier Network。
- 外部供应商或客户建立合作后，会转为内部供应商或内部客户。
- 转入内部后，后续项目分配、控价、交付追踪、审核、结算、账单和状态管理与普通内部供应商 / 客户一致。

建议英文写法：

> Discover cooperation resources, establish supplier or client relationships, and continue managing delivery, review, billing, and settlement inside the same workspace.

建议中文写法：

> 通过合作资源发现客户或供应商，建立合作后继续在同一工作台中管理交付、审核、账单和结算。

## 5. 供应商项目控制边界

已确认支持：

- 选择项目分配给哪些供应商。
- 对特定供应商设置排除规则。
- 设置供应商级项目价格。
- 跟踪供应商交付、callback、review、termination 和结算记录。

不支持，也不建议作为官网卖点强调：

- 每供应商 quota 限额。
- 每供应商设备限制。
- 每小时 traffic / completion 限制。

原因：这些控制在真实业务场景中意义有限，容易让文案偏离 Sampora 当前核心价值。

## 6. API-connected supplier 口径

当项目分配给 API-connected supplier 时：

- 如果供应商不使用 Sampora，也可以通过 API 接收或查看项目。
- 如果供应商也使用 Sampora，可以在自己的 Sampora 工作台中接收、查看和管理被分配项目。

建议英文写法：

> Assign projects to API-connected suppliers, whether they operate through their own system or manage the work inside Sampora.

建议中文写法：

> 项目可分配给 API 对接供应商；供应商可通过自己的系统接收，也可在 Sampora 工作台中管理。

## 7. 结算流程口径

已确认结算有两种路径：

1. 按客户配置自动生成结算记录，并推入 bills。
2. 先由系统自动审核，再人工复核，确认后进入账单。

官网不要承诺“完全自动结算无人工介入”。更稳妥的写法是：

> Prepare settlement-ready records from reviewed delivery evidence, with automated generation or review-first workflows depending on customer configuration.

中文可写：

> 基于已审核交付记录准备可结算依据，并按客户配置走自动生成或先审后复核流程。

## 8. 版本架构

当前公开版本口径：

- Sampora Panel：面向自有样本库运营。
- Sampora Supplier Network：面向外部样本供应商和供应商网络运营。
- Sampora Enterprise：面向客户、供应商、自有样本库、API、财务、权限和合作资源的综合运营团队。

不要把版本写成互相割裂的三个产品；它们是按团队运营复杂度分层的 Sampora 版本。