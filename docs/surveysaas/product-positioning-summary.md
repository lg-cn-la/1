# SurveySaaS 产品定位与市场落地摘要

> 本文档用于后续官网设计、Sales PDF、Demo 讲解脚本、海外销售材料和 Agent 交接。  
> 版本命名、套餐价格以当前最新产品策略为准；早期文档中的旧版本名和旧价格仅作为功能逻辑参考。

---

## 1. 一句话定位

### 中文定位

SurveySaaS 是面向在线样本服务商、Panel Provider、Sample Supplier 和调研分包执行团队的样本运营管理 SaaS，覆盖在线样本项目交付、客户管理、供应商管理、会员 / Panel 管理、财务结算、团队权限、API 对接、风控合规和合作资源对接。

### 英文定位

**SurveySaaS is a panel operations and partner network platform for online sample suppliers, panel providers, and research subcontracting teams.**

### 推荐英文副标题

**Manage online sample delivery, panels, suppliers, clients, teams, finance, risk controls, and partner connections in one unified SaaS platform.**

---

## 2. 产品属性判断

SurveySaaS 不应被定位为普通问卷工具、普通项目管理系统或纯样本交易平台。

更准确的产品属性是：

**Sample Operations SaaS + Panel Operations SaaS + Partner Network + Multi-party Settlement Platform**

中文可以理解为：

**在线样本交付运营系统 + Panel / 会员运营系统 + 合作资源网络 + 多方结算平台。**

---

## 3. 产品边界

### SurveySaaS 做什么

- 在线样本项目管理
- 在线样本项目接收、分发、上线、下线、分析
- 项目调度：选择供应商、屏蔽供应商、供应商级价格设置
- API 项目接收与供应商 API 分发
- 客户管理
- 供应商管理
- 会员 / Panel 管理
- 调查站 / 执行团队管理
- 财务结算、账单、发票、钱包、员工提成、会员激励
- 团队、部门、角色、权限管理
- 记录、操作日志、终止记录、回调记录
- 安检、风控、回调加密、数据安全配置
- 合作资源：帮助客户找供应商，帮助供应商找客户

### SurveySaaS 不做什么

- 不做普通问卷编辑器，不与 SurveyMonkey / Typeform 这类工具正面竞争
- 不以专业研究报告和洞察分析为核心，不替代研究分析工具
- 不做传统线下访问员执行管理系统
- 不做纯 Sample Marketplace；SurveySaaS 是带 Partner Network 的运营管理平台
- 不直接把自己包装成 Cint / PureSpectrum / Dynata 那类样本交易市场

---

## 4. 国际市场中的供应链位置

SurveySaaS 位于在线样本供应链中的**中间层与执行层**，主要服务负责样本项目承接、分包、执行、供应商管理和结算的团队。

典型链路：

```text
品牌方 / 研究公司 / 甲方
    ↓ 发布调研或样本需求
调研分包商 / Sample Operations Team
    ↓ 项目分发、供应商管理、交付追踪
Sample Supplier / Panel Provider / 执行团队
    ↓ 触达受访者、完成在线问卷
Respondent / Panel Member
```

SurveySaaS 的核心价值不是创建问卷，而是管理问卷下游的在线样本交付链路：

```text
接项目 → 配置项目 → 分配供应商 / Panel → 执行追踪 → 审核 → 结算 → 账单 → 复盘 → 合作资源拓展
```

---

## 5. 核心客户画像

### 5.1 Panel Provider / 自有样本库运营商

拥有或运营自己的受访者资源，需要管理会员、会员组、等级、账单、提现、活跃度、项目分发和会员端门户。

核心需求：

- 管理自有 Panel / 会员
- 建立受访者门户
- 接收项目并执行
- 追踪完成量、拒绝量、项目状态
- 管理会员激励、提现、账单
- 通过合作资源寻找更多客户

---

### 5.2 Sample Supplier / 样本供应商

能够为调研项目提供样本供给的一方，可能拥有自有 Panel，也可能通过渠道、调查站、合作供应商或 API 接入来供样。

核心需求：

- 接收项目
- 管理执行团队或调查站
- 追踪项目完成情况
- 控制成本、价格和回款
- 管理客户关系
- 对接上游客户或下游供应商

---

### 5.3 Research Subcontractor / 中层分包商

从甲方、研究公司或更上层分包商承接项目，再分发给供应商或执行团队。

核心需求：

- 管理多个客户和多个供应商
- 快速分配项目给合适供应商
- 针对不同供应商设置不同项目价格
- 屏蔽不适合的供应商
- 通过 API 将项目推送给供应商
- 追踪项目执行、审核、结算和账单
- 通过合作资源找到更多靠谱供应商

---

### 5.4 Customer-Supplier 双重身份团队

既承接上游项目，又有自营样本或执行能力，同时还管理外部供应商。

核心需求：

- 同时管理客户、供应商、会员、调查站
- 既要找客户，也要找供应商
- 需要完整项目执行、API、财务、组织、权限和风控能力
- 适合使用完整版本能力

---

## 6. 核心业务闭环

SurveySaaS 的完整业务闭环可以表达为：

```text
Partner Network
    ↓ 建立合作
Internal Client / Supplier
    ↓ 项目创建或接收
Project Management
    ↓ 项目调度：分配、屏蔽、控价
API / Workspace Receiving
    ↓ 执行追踪：参与量、完成量、拒绝量、IR、LOI、CPI
Review & Quality Control
    ↓ 自动审核或人工复审
Settlement
    ↓ 账单、发票、钱包、回款、供应商结算
Business Dashboard
    ↓ 客户、供应商、项目、财务复盘
Partner Network Growth
```

---

## 7. 已确认的重要功能边界

### 7.1 合作资源 / Partner Network

合作资源不是普通黄页，也不是单纯资源展示页。

它的业务逻辑是：

- 客户可通过合作资源寻找供应商
- 供应商可通过合作资源寻找客户
- 不同版本展示不同入口
- 完整版本可同时看到云客户和云供应商
- 云供应商后续会展示参与数、完成数、拒绝率、星级等指标
- 云客户后续会展示合作总数、审核率、项目上线数、付款及时率、付款周期等指标
- 一旦建立合作，外部供应商 / 客户会转为内部供应商 / 客户
- 转入内部后，后续项目分配、控价、结算、账单、状态管理都和普通内部供应商 / 客户一致

推荐英文命名：

| 中文 | 推荐英文 |
|---|---|
| 合作资源 | Partner Network |
| 云供应商 | Supplier Network |
| 云客户 | Client Network / Buyer Network |
| 解锁联系方式 | Unlock Contact Details / Contact Unlocks |
| 星级 | Ratings |
| 合作历史 | Collaboration History |
| 付款及时率 | Payment Reliability |
| 拒绝率 | Rejection Rate |
| 完成数 | Completes Delivered |

---

### 7.2 项目管理 / Project Delivery Management

项目管理不是普通任务列表，而是在线样本项目交付中枢。

已确认包含：

- 按 Project ID、项目名称 / 别名、客户、区域、部门筛选
- 新增项目
- 上线 / 下线项目
- 项目接收 / Project Intake
- 项目调度
- 项目分析
- 项目分配
- CPI、IR、LOI、Region、Client、Update Time、状态等字段
- Participate / Complete / Quota / Access / Limit 等执行指标

推荐英文表达：

**Project Delivery Management**

说明文案：

**Manage online sample projects from intake and setup to supplier allocation, tracking, analysis, and settlement.**

---

### 7.3 项目调度 / Supplier Allocation & Pricing

项目调度的重点不是复杂的供应商级配额或设备限制，而是真实业务中最有用的三件事：

- 指定项目分配给哪些供应商
- 屏蔽哪些供应商
- 针对不同供应商设置不同价格

已确认不支持、也不需要重点包装为供应商级配额、设备、小时进入量、小时完成量等复杂参数，因为这些在真实业务场景中意义有限。

推荐英文表达：

**Supplier Allocation & Pricing**

说明文案：

**Allocate projects to selected suppliers, block unsuitable suppliers, and set supplier-specific pricing for each project. Connected suppliers can receive projects through API integrations or directly inside their SurveySaaS workspace.**

---

### 7.4 API 供应商与系统内供应商

供应商接收项目有两种情况：

1. 供应商未使用 SurveySaaS，但已与客户系统 API 对接：项目分配后，供应商可通过 API 接收到项目，并在自己的系统里看到项目。
2. 供应商也使用 SurveySaaS：项目分配后，供应商可以在自己的 SurveySaaS 工作台中看到并管理项目。

对外表达：

**Distribute projects to connected suppliers through API integrations or directly inside SurveySaaS workspaces.**

---

### 7.5 项目结算 / Settlement Workflow

项目结算支持两种模式：

- 根据客户配置自动生成结算并推送到账单
- 自动审核后，再由人工复审一遍，然后进入账单

推荐英文表达：

**Flexible Settlement Approval Workflow**

说明文案：

**Support fully automated bill generation from approved project results, or run automated review first and require manual recheck before billing.**

---

### 7.6 财务系统 / Finance & Settlement

SurveySaaS 的财务能力是核心差异化之一，不只是简单账单。

可对外强调：

- 客户发票
- 供应商账单
- 供应商财务日志
- 员工账单
- 员工财务日志
- 会员账单
- 会员财务日志
- 钱包余额
- 待审核钱包
- 结算周期，如 Net60 / Net90
- 批量开票、导出、审核
- 多方结算：客户、供应商、员工、会员

推荐英文表达：

**Finance & Multi-party Settlement**

---

### 7.7 IR / LOI / CPI 术语修正

早期文档中提到的“AI 值 / Acceptance Index”不应作为正式对外表达。

实际项目管理中应使用：

| 缩写 | 英文 | 中文 |
|---|---|---|
| IR | Incidence Rate | 目标人群命中率 / 甄别通过率 |
| LOI | Length of Interview | 问卷预计作答时长 |
| CPI | Cost Per Interview / Cost Per Complete | 单个有效完成样本价格 |

后续官网、PDF、Demo 脚本中不要再把 AI Value 作为核心指标表达，以免被误解为 Artificial Intelligence。

---

## 8. 版本拆分的业务逻辑

版本命名和价格以当前最新策略为准，旧文档中的 A / B / C 名称仅作为理解业务对象的参考。

核心拆分逻辑是：

### 执行 / Panel 型客户

- 重点管理会员 / Panel
- 有客户管理
- 不需要管理下级供应商
- 需要自己的门户网站
- 需要通过合作资源寻找客户

### 分包 / Customer 型客户

- 重点管理供应商
- 从甲方或上游客户承接项目后分发出去
- 不直接管理会员和调查站
- 需要供应商管理、项目分发、安全合规、结算
- 需要通过合作资源寻找供应商

### Customer-Supplier 完整型客户

- 同时承接上游项目，也有自营样本或调查站
- 同时管理客户、供应商、会员、调查站
- 需要完整项目、API、财务、权限、风控、合作资源能力
- 同时需要找客户和找供应商

---

## 9. 与市场上其他工具的关系

### 9.1 与问卷工具的区别

问卷工具主要解决：创建问卷、发放问卷、收集数据。

SurveySaaS 主要解决：在线样本项目的供应链执行管理，包括客户、项目、供应商、会员、API、审核、结算和合作资源。

建议对外表达：

**Not another survey builder. Built for online sample operations.**

---

### 9.2 与 Panel Provider / Sample Marketplace 的区别

Cint、PureSpectrum、Dynata 等更偏样本市场、样本供给、交易和程序化采样。

SurveySaaS 不是纯 marketplace，而是帮助样本服务商和分包团队管理自身业务流程的平台，并带有 Partner Network。

建议对外表达：

**Not a pure sample marketplace. SurveySaaS is an operations platform with a built-in partner network.**

---

### 9.3 与 Forsta / Voxco / Nebu 这类执行平台的区别

Forsta / Voxco / Nebu 更偏大型 research execution、survey execution、CATI / CAPI / CAWI、多模式数据采集或大型研究平台。

SurveySaaS 更聚焦在线样本供应链中的中间层和执行层：

- 项目分包
- 供应商协作
- API 分发
- 供应商控价
- 供应商 / 客户账单
- 多方钱包和结算
- 合作资源转内部供应商 / 客户

因此更适合用“替代方案分析”而不是只做“直接竞品分析”。

---

## 10. 官网与销售材料推荐主线

### 官网首页应优先强调

1. Online Sample Delivery Operations
2. Project Delivery Management
3. Supplier Allocation & Pricing
4. Client & Supplier Management
5. Finance & Multi-party Settlement
6. Partner Network
7. API-based Project Intake & Distribution
8. Risk Control & Traceability

### 不建议首页重点展示

- 数据字典
- UID 解析
- 链路解析
- 操作日志细节
- 三方配置细节
- 过细的系统配置项

这些适合放在产品详情页、Demo、FAQ 或企业版说明里。

---

## 11. Demo 讲解主线建议

Demo 不需要重新开发独立系统，而是在现有产品基础上配置不同版本、不同角色、不同数据的演示账号。

推荐 Demo 讲解路径：

```text
1. Data Center / Business Dashboard
2. Project Intake / Project Management
3. Project Setup: CPI, IR, LOI, country, client, payment rule, risk setting
4. Supplier Allocation & Pricing: assign, block, set price
5. API / Workspace Receiving
6. Delivery Tracking: completes, rejects, status, callback records
7. Review & Settlement
8. Billing / Finance / Wallet
9. Supplier / Client Management
10. Partner Network: find suppliers / find clients
```

Demo 的重点不是逐个菜单介绍，而是讲清楚业务闭环。

---

## 12. 对外英文术语建议

| 中文 | 推荐英文 |
|---|---|
| 项目管理 | Project Delivery Management |
| 项目接收 | Project Intake / Incoming Projects |
| 项目调度 | Supplier Allocation & Pricing |
| 项目结算 | Settlement Workflow / Project Settlement |
| 合作资源 | Partner Network |
| 云供应商 | Supplier Network |
| 云客户 | Client Network / Buyer Network |
| 财务结算 | Finance & Multi-party Settlement |
| 供应商钱包 | Supplier Wallet |
| 会员钱包 | Member Wallet / Respondent Wallet |
| 员工钱包 | Employee Wallet |
| 回调记录 | Callback Logs |
| 操作日志 | Audit Logs / Operation Logs |
| 安检配置 | Security Checks / Risk Controls |
| 前置问卷库 | Pre-screening Library |
| 调查站 | Survey Station / Fieldwork Unit / Execution Unit |
| 会员 | Panel Member / Respondent |

---

## 13. 当前最重要的产品判断

SurveySaaS 的差异化不只是“能管理项目”，而是把以下能力放进同一个系统：

- 项目交付
- 供应商分配与控价
- 客户管理
- 供应商管理
- 会员 / Panel 管理
- API 接收与分发
- 风控与回调
- 结算与账单
- 团队角色权限
- 合作资源网络

一句话总结：

**SurveySaaS 的核心机会不是替代问卷工具，而是把在线样本服务商和调研分包团队的供应链运营流程产品化、标准化、协同化、可追踪化和可结算化。**
