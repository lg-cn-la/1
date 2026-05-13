# v4.8 R8 分支内容核对后的设计补充说明

> 来源：`v48-r8-complete-homepage` 分支中的 `V48_R8_DESIGN_EVOLUTION.md` 与 `surveysaas_v48_r8_repo_snapshot.html`。  
> 本文档只保留可以确认的设计判断，并按当前最新产品定位进行修正。  
> 后续若页面继续基于 v4.8 / R8 方向迭代，应以本文和 `docs/surveysaas/product-positioning-summary.md`、`docs/surveysaas/sample-supplier-taxonomy.md` 为准。

---

## 1. 可确认并保留的设计方向

v4.8 R8 分支中可以确认的有效判断：

- 不建议回到浅色通用 SaaS 模板路线。
- 深色 Operations Console / Control Room 方向仍然成立。
- Hero 右侧应继续呈现“产品正在运行”的运营状态，而不是纯品牌图形。
- 控制台要体现多供应来源、项目执行、质检、审计记录和结算闭环。
- 供应网络不要画成真实世界地图，避免被理解为已经具备真实国家级供应网络或跨境数据流承诺。
- 用抽象拓扑表达供应类型、项目流向、QC gate 和 ledger，比用真实城市 / 国家节点更稳。
- KPI + Audit Feed 应保持主信息地位；拓扑是产品证据面板，不是唯一主菜。
- Workflow 动效应该服务“业务闭环”，不能抢 Hero 控制台注意力。
- 页面不应公开价格，Plans 区域应以销售承接和业务复杂度匹配为主。
- UI 中不能出现开发者说明、版本评审语言或内部推导语。

---

## 2. 需要按最新产品理解修正的地方

v48 分支中的部分内容与当前产品定位不完全一致，不能原样进入正式页面。

### 2.1 目标客户表达修正

原分支中出现过：

- Fieldwork agencies
- Brand insights teams
- Sample aggregators

现在应优先改成：

- Online sample suppliers
- Panel providers
- Sample aggregators
- Survey stations / execution units
- Research subcontractors
- API-connected suppliers
- Multi-entity sample operations teams

Brand insights teams 可以作为上游买方或审计证据接收方出现，但不应作为首屏核心目标客户。

Fieldwork agencies 容易让海外客户理解为线下 fieldwork / CATI / CAPI / 访问员执行管理，因此不建议作为主标签。

---

### 2.2 Hero 拓扑节点修正

原分支中拓扑节点包含 `RIVER_04` 或重复的 Panel / Aggregator 节点。

按当前最新分类，Hero 中的 `SUPPLIER POOL` 建议改为：

**SAMPLE SUPPLY POOL**

推荐节点：

```text
PANEL_01
owned panel

AGG_02
sample aggregator

STN_03
survey station

SUB_04
subcontractor

API_05
API supplier
```

不建议在首屏使用 `Audience Source / Audience Owner` 作为核心节点。它可以作为广义在线样本生态里的潜在供给来源，但不是 Sampora 当前官网首屏或核心目标客户分类。

---

### 2.3 Workflow 术语修正

原分支中使用：

```text
Launch → Route → Replace → Settle
```

这个表达有动感，但容易让产品看起来像程序化样本路由或自动流量调度工具。

根据当前已确认能力，推荐改为：

```text
Intake → Configure → Allocate → Track → Review & Settle
```

如果必须保持 4 步，可压缩为：

```text
Intake → Allocate → Track → Settle
```

原因：Sampora 已确认的项目调度能力重点是：

- 选择分配给哪些供应商
- 屏蔽哪些供应商
- 按供应商设置项目价格
- 通过 API 或 Sampora 工作台接收项目
- 追踪完成、拒绝、审核、结算和账单

不应把官网主卖点写成供应商级复杂配额、设备限制、小时流量控制或高度自动化 fallback。

---

### 2.4 合规与数据指标承诺修正

原分支中出现过类似：

- SOC 2-aligned
- GDPR / DPDP workflows
- 38 supplier networks live
- 14 currencies
- signed export logs
- sealed audit log
- verified customer metrics

这些表达在未完全验证前不应进入正式官网。

更稳的表达：

- Security controls
- Role-based permissions
- Audit logs
- Callback encryption
- Configurable risk settings
- Exportable review and settlement records
- Multi-party settlement support
- API-ready supplier delivery
- Demo metrics shown for illustration

如果后续确实完成合规认证、真实连接数、多币种能力或签名机制，再升级文案。

---

### 2.5 Customer Proof 修正

原分支中使用姓名、职位和具体指标的 testimonial 风格内容。

如果没有真实授权和可验证数据，不建议这样写。

当前更稳的方向是：

**Use cases by operating role**

可按角色展示：

- Sample operations manager
- Supplier manager
- Finance operator
- Panel / station operator
- API operations lead

用场景说明替代看起来像真实客户证言的 quote。

---

## 3. 可保留的页面结构

v48 分支的整体页面结构仍可作为候选骨架：

1. Hero / Operations Console
2. Operating layer audience strip
3. Pain → Outcome / Use cases
4. Platform modules
5. Workflow
6. Product surfaces / Workspaces
7. Role scenarios / Use cases
8. Plans
9. FAQ / Contact

但必须补强或单独新增：

**Partner Network / 合作资源 section**

因为 Sampora 的核心差异化之一是：帮助客户找供应商、帮助供应商找客户，且外部云供应商 / 云客户建立合作后会转为内部供应商 / 客户，进入后续项目分配、控价、结算和账单流程。

---

## 4. 推荐下一版页面主线

### Hero

建议从 `survey supply live layer` 调整为更明确的：

**Manage sample delivery, suppliers, clients, and settlement in one platform.**

或：

**The operating platform for online sample delivery.**

副标题需覆盖：

- projects
- suppliers
- clients
- panels / members
- finance
- API delivery
- partner connections

---

### Platform Modules

建议模块从原来的 setup / routing / QC / ledger / reporting / compliance 改为：

1. Project Delivery Management
2. Supplier Allocation & Pricing
3. Client & Supplier Management
4. Panel & Member Operations
5. Finance & Multi-party Settlement
6. Partner Network

如果需要 8 个模块，可增加：

7. API-based Project Intake & Distribution
8. Risk Control & Traceability

---

### Workflow

推荐：

```text
Project Intake
→ Delivery Configuration
→ Supplier Allocation & Pricing
→ Field Progress Tracking
→ Review & Settlement
→ Billing / Finance
```

---

### Plans

版本命名以最新产品策略为准。若仍使用三类逻辑，可按：

- Panel Operations
- Supplier Network Operations
- Full Operations / Enterprise

避免把旧版本名、旧价格或分支中的 demo 价格写死。

---

## 5. 对 v48 分支文件的处理判断

### 可吸收进 main 的内容

- 深色 Operations Console 方向继续成立。
- 抽象供应网络拓扑优于真实地图。
- Hero 控制台结构：Run header + Supply topology + KPI + Audit feed。
- Workflow 动效应降级为辅助表达。
- 不公开价格。
- 不在 UI 中出现内部评审语言。
- 需要语言切换 EN / 中文 / Hindi，但 Hindi 不能长期半翻译。

### 不建议原样吸收的内容

- `surveysaas_v48_r8_repo_snapshot.html` 中的旧文案、旧目标客户标签、SOC2/DPDP/38 connectors/14 currencies 等未验证表达。
- `RIVER_04` 或 `Audience Source` 作为首屏核心节点。
- 看起来像真实客户证言的 demo testimonial。
- 过度路由化 / 自动 fallback / auto re-route 的表达。

---

## 6. 最终判断

v48 R8 分支的设计方向有价值，但内容不能原样作为主干产品事实。

主干应保留其设计判断和页面骨架经验，同时用最新产品定位进行修正：

**Sampora / SurveySaaS 不是普通问卷工具，也不是纯样本 marketplace，而是面向 Panel Providers & Sample Suppliers 的 Online Sample Operations Platform，覆盖项目交付、供应商分配与控价、客户/供应商管理、Panel/会员运营、API、Partner Network 和多方结算。**
