# SurveySaaS 官网终审交接文档

> 给后续 agent / 设计审查者使用。  
> 目标：让接手者不用重新翻完整聊天记录，也能判断最终版官网是否准确表达产品、是否和后台真实能力一致、是否存在过度承诺或定位偏差。  
> 当前基准：GitHub `lg-cn-la/1` 的 `main`，已包含后台实扫文档，最新相关提交包括 `479b7e4 docs: document supplier bill flow`、`516c3ae docs: fill backend detail gaps`、`66e8dc5 docs: add backend function map`。

## 1. 先读哪些资料

接手后优先阅读这些文件，顺序不要反：

1. `docs/surveysaas/product-positioning-summary.md`
   - 当前产品定位、目标客户、供应链位置、功能边界、业务闭环、术语。
   - 这是产品共识基线。
2. `docs/surveysaas/sample-supplier-taxonomy.md`
   - Panel Provider、Sample Supplier、Survey Station、Sample Aggregator、Research Subcontractor、API-connected Supplier 的关系。
   - 它解释为什么不能只写 “Panel Providers”。
3. `docs/surveysaas/backend-function-map.md`
   - 基于真实演示后台扫描的功能地图、字段、按钮、流程线索和仍未确认项。
   - 这是审查官网功能文案是否真实的最重要证据。
4. `README.md`
   - 当前仓库阅读顺序、主线资料和注意事项。
5. `补充资料归档/operations-console/V48_R8_REVIEWED_DESIGN_NOTES.md`
   - 设计方向补充，只用于理解视觉/叙事判断，不要拿它替代产品事实。

## 2. 一句话理解产品

SurveySaaS / Sampora 不是普通问卷工具，不是通用项目管理系统，也不是纯样本交易 marketplace。

它更准确的定位是：

**面向在线样本服务商、Panel Provider、Sample Supplier 和调研分包执行团队的 Sample Operations / Panel Operations SaaS，带 Partner Network 和多方结算能力。**

英文官网推荐方向：

**Online sample operations platform for panel providers, sample suppliers, and research subcontracting teams.**

或更完整：

**Manage online sample delivery, panels, suppliers, clients, teams, finance, risk controls, and partner connections in one unified SaaS platform.**

## 3. 目标客户和角色边界

官网不要只面向 “Panel Providers”。这会漏掉大量没有自有 Panel、但通过外部供应商/API/调查站完成样本交付的团队。

应覆盖：

- **Panel Provider**：拥有或运营自有 respondent / panel 资产，需要会员、钱包、提现、项目分发和会员端门户。
- **Sample Supplier**：更广义的样本供给方，可能有自有 panel，也可能通过渠道、调查站、API 或外部供应商供样。
- **Sample Aggregator**：整合多个样本来源，需要供应商管理、项目分配、控价、API 分发、供应商结算。
- **Research Subcontractor**：从上游客户承接项目，再分发给供应商或执行团队，重点是客户/供应商/项目/审核/结算。
- **Survey Station / Execution Unit**：偏底层执行，重点是会员、调查入口、项目记录、会员激励和提现。
- **Customer-Supplier 双重身份团队**：既接上游客户项目，也有自营样本或供应能力，需要完整版本能力。

审查官网时，如果页面只写 “for panel providers” 或让人误以为产品只是 panel 管理工具，需要改。

## 4. 产品边界：官网必须避开的误写

不要把 SurveySaaS 写成：

- SurveyMonkey / Typeform 这类问卷编辑器。
- 普通项目管理系统。
- 纯样本交易市场。
- 研究报告或洞察分析工具。
- 线下访问员/CATI/CAPI 执行系统。
- Cint / PureSpectrum / Dynata 那类样本 marketplace 的直接替代品。

可以写：

- Online sample operations platform.
- Project delivery management for online sample teams.
- Supplier allocation and settlement workflow.
- Panel, supplier, client, finance, API and partner-network operations in one platform.

## 5. 后台真实能力摘要

以下是从演示后台实扫得到的事实，官网功能表达必须能和这些事实对上。

### 首页 / 数据中心

有数据中心、客户看板、供应商看板。指标包括营业额、参与数、完成数、审核数、待处理预警、供应商排行、操作系统分布、审核趋势、类型分布、拒绝趋势、收款趋势。

适合官网表达为：

- Operational dashboard
- Delivery performance overview
- Supplier and quality monitoring

### 客户管理

客户列表支持客户 ID、客户、客户名称、公司名称、状态筛选。字段包括客户 ID、客户名称、简称、结算周期、分配模式、状态。

新增/编辑客户字段包括：客户名称、简称、公司名称、手机、邮箱、联系人、结算周期、币种、付款规则、客户分配、部门分配、状态、返点比例、前置筛选、API 客户。

客户详情含配置区域：基本配置、风险控制、安检配置、回调与重定向、发票模板。

客户行操作包括：项目、编辑、分析、删除。项目弹窗可按项目名称、项目 ID、客户来源、国家、排序查看客户关联项目。分析弹窗有项目数据、上线数、更新数、拒绝率、营业额、参与数、完成数、审核数、审核率、ID 通过率、发票概览、供应商排行。

官网可说：

- Client management with settlement rules, API-client settings, risk settings, callback settings and invoice templates.
- Client-level project and financial analytics.

### 供应商管理

供应商列表字段包括供应商、等级、区域、可用钱包、待审钱包、结算周期、B2B、状态、创建日期。

新增/编辑供应商字段包括：账户类型、账户名称、区域、电话、邮箱、结算周期、等级、联系人、首选货币、财务类型、密码。企业供应商额外包含企业名称、法人、税务编号。

项目控制包括：状态、B2B 开关、B2C 开关、控制类型、默认开放、仅指定、国家/地区开放与禁用列表。

供应商配置区域包括：基本配置、财务信息、回调与重定向。

官网可说：

- Supplier profiles, levels, wallets, settlement cycles and region availability controls.
- Control supplier access by B2B/B2C mode, country availability and project access policy.

注意：供应商等级里有百分比，但不要轻率解释为质量分或固定扣点，除非产品方确认。

### 子会员 / Panel 相关

供应商子会员列表字段包括会员 ID、供应商、供应商会员、本站会员、UID、创建时间、更新时间。

调查站模块另有会员管理、会员组、会员等级、会员财务日志、会员账单等。

官网可说：

- Panel/member operations and respondent wallet workflows.
- Survey-station mode for execution teams.

### 项目管理

项目列表字段包括项目、参与/完成/配额/准入/限量、区域、CPI、IR/LOI、客户、更新时间。

顶部操作包括新增项目、上架、下架、项目调度、项目接收。行操作包括编辑、分配、分析。

项目分析弹窗能看到操作系统、浏览器、参与、完成、审核通过等分析。

项目分配页已确认：点击“分配”后出现“分配供应商”选择器和确定按钮。当前演示项目下拉为 No data，因此未暴露供应商单独 CPI、屏蔽、配额、路由等深层字段。官网可以说有供应商分配能力，但如果要写 supplier-specific pricing / blocking，需要结合产品定位文档和其他实测证据，表达要谨慎。

官网可说：

- Manage projects from intake and setup to supplier assignment, tracking, analysis and settlement.
- Track participate / complete / quota / access / limit, CPI, IR and LOI.

不要说：

- 已确认支持复杂供应商级配额、设备限制、小时限量等。现有资料反而提示这些不是重点包装方向。

### 混合 API

混合 API 池字段包括项目 ID、项目名称、来源、供应商、国家、CPI、创建时间、刷新时间、状态。

创建池字段包括：池名称、来源选择、API 客户、本地项目、CPI 规则、CPI 币种、CPI 范围、定时刷新间隔。

官网可说：

- API-based project intake and distribution.
- Hybrid API pools with CPI rules and scheduled refresh.

### 项目结算

项目结算列表字段包括项目、名称/标识、完成数、审核数、CPI、PO/Remark、状态、日期、合计金额。

状态样例：待审核。

查看弹窗包括数据看板、完成数、通过数、拒绝数、拒绝率、供应商完成/通过/拒绝/拒绝率、项目审核流程。

审核弹窗包括 PO、修改价格、单位、备注、通过 ID、按通过 ID、按拒绝 ID、全部通过、全部拒绝、数据暂存。

官网可说：

- Settlement approval workflow.
- Review completes, rejects, supplier contribution and audit trail before billing.

### 供应商账单

供应商账单字段包括账单日期、账单 ID、供应商、币种、账期、账单金额、手续费、实际支付、账单状态。

截图确认状态包括：待处理、已支付。

待处理行操作包括：编辑、已收发票、支付、拒绝。已支付行只剩编辑。

批量支付：选择账单后弹出确认信息，文案是“确认支付选中账单吗？”，有取消/确定。

批量拒绝：选择账单后弹出确认信息，文案是“确认拒绝选中账单吗？”，有取消/确定。

编辑供应商账单抽屉字段包括账单 ID、账单金额、手续费、实际支付、账单状态、创建时间，截图中为只读/禁用态。

官网可说：

- Supplier bills with payment/rejection workflow and invoice-received marker.
- Track billing amount, fees, actual payment and bill status.

不要说：

- 已实测最终点击确定后的完整状态流转。我们没有执行最终确认，以免改变演示数据。

### 客户发票

客户发票列表字段包括 ID、客户、发票编号、金额、已收款、手续费、开票人、状态、日期、备注。

新增客户发票字段包括发票编号、客户、发票金额、实收款、手续费、状态、备注。

官网可说：

- Client invoices and receivables tracking.

### 记录 / 审计

记录模块包括调查记录、操作日志、终止记录、回调记录。

官网可说：

- Audit logs, callback logs, termination records and delivery traceability.

### 辅助工具

包括文章公告、通知中心、IP 查询、UID 解析、UID 分拣、链路解析。

官网可作为产品细节证据，但不要放在首页主卖点。

### 组织权限

包括员工管理、部门管理、角色管理、提成规则。

官网可说：

- Team, department, role and commission management.

权限差异未测，不要写“已验证不同角色权限矩阵”。

### 调查站

调查站包括数据看板、数据分析、项目管理、调查记录、终止记录、站点设置、项目调度、会员管理、会员组、会员等级、会员财务日志、员工财务日志、会员账单、员工账单、调查站组织。

官网可说：

- Survey-station mode for execution units and member-based operations.

### 配置

系统设置：项目首选货币、是否使用别名、项目别名前缀、切换模式、样本模式、工作室模式。另有基础配置、汇率表、供应商配置、站点配置、高级配置。

数据字典：支持云端同步和新增字典，包含国家编码、B2B 分类、通用字典、行业/角色、货币、题库等。

前置问卷库：可云端同步、筛选、增删改问卷；新增问卷进入完整问卷设计器，含逻辑、JSON 编辑器、题型工具箱、题库、调查设置、国家、说明、标题显示、只读、默认语言、Cookie、防重复提交、宽度模式等。

三方配置：短信、邮箱、钉钉、企业微信、云存储、三方登录、CDN。

事件通知：事件名称、描述、变量、渠道配置。已见事件包括忘记密码、注册、修改密码，变量 CODE，渠道邮件/短信。

安检配置：优先级、产品名称、前端 SDK 配置、凭证配置、默认阻止规则、状态；添加配置包含安检产品、优先级、启用状态。

官网可说：

- Reusable dictionaries, pre-screening questionnaires, event notifications, third-party integrations and security checks.

不要把这些全部堆在首页。它们适合放在产品详情、平台能力、企业版或安全/集成模块。

### 合作云资源

入口在账号下拉菜单。页面目前有“成为云供应商”和“云客户入驻”两个卡片。

因为用户明确说仍在持续开发中，不要在最终官网过度强调或写成成熟 marketplace。可以轻描淡写为 Partner Network / partner connections，避免具体承诺。

## 6. 官网终审核心判断标准

后续 agent 审最终官网时，逐条检查：

1. 首屏是否清楚说明这是 online sample operations，而不是 survey builder。
2. 首屏是否同时覆盖 panel providers、sample suppliers、research subcontractors，不要只写 panel。
3. 是否体现“项目交付 + 供应商 + 客户 + 财务 + 风控 + API + Partner Network”的完整闭环。
4. 是否有足够真实功能密度，让目标买家相信这不是空壳 SaaS 模板。
5. 是否避免把未完全实测的功能写成确定承诺。
6. 是否避免把合作云资源写成成熟 marketplace。
7. 是否正确使用 CPI / IR / LOI，不要写 AI Value / Acceptance Index。
8. 是否把配置、字典、UID 工具等细节放在合适层级，而不是抢首页主叙事。
9. 是否有清晰的 finance / settlement 价值，而不是只说 dashboard。
10. 是否能从后台实扫文档找到每个官网卖点的证据。

## 7. 最容易出问题的官网文案

以下表述需要警惕：

- “Create beautiful surveys”  
  错。产品不是问卷创作工具。

- “For panel providers”  
  太窄。应至少写 “Panel providers and sample suppliers”。

- “Sample marketplace”  
  容易误导。应写 operations platform with partner network。

- “AI-powered acceptance index”  
  不建议。正式指标应是 CPI / IR / LOI / completes / rejects / audit。

- “Automatically manage every supplier price, quota and route”  
  过度。供应商分配入口已确认，但当前演示项目下拉无数据，深层价格/屏蔽/配额未完整实测。

- “Partner cloud resources are ready marketplace”  
  过度。合作云资源仍在开发。

- “Enterprise-grade permission matrix verified”  
  过度。角色权限差异未测。

## 8. 建议官网信息架构

推荐首页主线：

1. Hero：Online sample operations platform for panel providers and sample suppliers.
2. Product loop：Intake -> Setup -> Allocate -> Track -> Review -> Settle.
3. Project Delivery Management：项目、CPI/IR/LOI、区域、客户、状态、分析。
4. Supplier Operations：供应商档案、等级、钱包、结算周期、B2B/B2C、区域控制。
5. Client Operations：客户档案、付款规则、API 客户、风险/回调/发票模板。
6. Finance & Settlement：项目结算、审核、供应商账单、客户发票、支付/拒绝流程。
7. API & Hybrid Pools：API 客户、本地项目、CPI 规则、定时刷新。
8. Risk & Traceability：回调、操作日志、终止记录、安检配置、前置问卷。
9. Survey Station / Member Operations：会员、会员组、等级、会员财务、调查站项目。
10. Partner Network：谨慎表达为连接客户与供应商，不要写成成熟交易市场。

## 9. 审查最终版时必须对照的事实

如果官网出现以下卖点，需要能在 `backend-function-map.md` 找到证据：

- Project delivery management
- Supplier allocation
- Client management
- Supplier management
- Hybrid API pools
- Project settlement
- Supplier bills
- Client invoices
- Event notifications
- Security checks
- Data dictionary
- Pre-screen library
- Survey-station/member management
- Audit/callback/termination logs

如果找不到证据，要么删掉，要么改成更谨慎的“planned / configurable / under development”表达。

## 10. 当前仍需谨慎的未确认点

这些点不要当成最终确定能力大写特写：

- 项目分配页在当前演示数据里供应商下拉为 No data。可确认有分配入口，但供应商级 CPI、屏蔽、配额、路由等未完整实测。
- 供应商账单批量支付/拒绝只确认到弹窗和操作入口，未点击最终确定，因此最终状态流转未实测。
- 不同角色账号权限差异未测。
- 合作云资源仍在持续开发，不要过度包装。

## 11. 给后续 agent 的工作方式建议

审最终官网时，不要只看页面“好不好看”。要按下面顺序：

1. 先读 `product-positioning-summary.md`，确认定位。
2. 再读 `sample-supplier-taxonomy.md`，确认目标客户写法。
3. 再读 `backend-function-map.md`，确认每个功能卖点是否有后台证据。
4. 打开最终官网，逐屏标记：定位是否准确、功能是否真实、承诺是否过度、文案是否像目标客户会买的 B2B SaaS。
5. 最后再看视觉：是否有国际 SaaS 正版感、运营密度、产品可信度。

最终审查输出建议按四类写：

- P0：定位错误或严重误导。
- P1：功能承诺与后台事实不一致。
- P2：文案空泛、证据不足、卖点顺序不合理。
- P3：视觉/表达细节优化。

## 12. 一句话结论

SurveySaaS 官网最终版的成败，不在于做得像一个漂亮 SaaS 模板，而在于是否让 panel providers、sample suppliers 和 research subcontractors 一眼相信：

**这个系统真的懂在线样本项目从接收、配置、供应商分配、执行追踪、审核、结算、账单、风控到合作资源拓展的完整运营闭环。**

