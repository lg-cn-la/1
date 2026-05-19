# SurveySaaS v4.8 R8 设计演进记录

本文记录从仓库中既有 operations-console 方向到 v4.8 R8 的主要设计判断、问题修正和后续迭代约束。

## 1. 基线判断

当前官网方向不再回到浅色通用 SaaS 风格，而是继续沿用深色 Operations Control Room 路线。

核心原因：SurveySaaS 的产品价值不是普通问卷工具，而是面向样本供应链、供应商协同、项目路由、QC 替换、审计证据和结算账本的一套运营控制层。

因此主视觉应继续表达：

- 控制台感
- 实时运营状态
- 多供应商网络
- 审计与结算可信度
- 工程精密与 B2B 专业感

## 2. 从 v4.7 到 v4.8 的核心变化

v4.7 解决的是基础方向：

- 保留深色控制室风格
- 修正 ribbon 的悬浮感
- 让项目、region、feed 和 node 状态自洽
- 降低合规和 SLA 文案的过度承诺
- 去掉内部版本号

v4.8 在此基础上引入 A+C 混合路线：

- A = Operations Control Room，作为页面骨架和设计系统
- C = Supply Network Topology，作为 hero 控制台中的产品证据面板

最终结论：不把 C 做成整张世界地图，而是把它降级为控制台内部的“供应网络拓扑”模块。

## 3. 为什么不是纯地图方向

地图方向有记忆点，但风险很高：

- 容易被理解成真实国家供应网络承诺
- 容易引发跨境数据和 GDPR / DPDP 质疑
- 容易从“产品控制台”变成“全球化营销图”

因此 v4.8 R8 采用抽象拓扑，而非真实地理地图。

节点表达从城市代码切换为角色节点，例如：

- PANEL_01 / PANEL_02
- AGG_03 / AGG_05
- RIVER_04
- QC_GATE
- LEDGER

这样能表达供应商角色、质检关口和结算流，而不是暗示真实地理数据流。

## 4. Hero 右侧控制台的结构原则

v4.8 R8 的 hero 右侧应保持三层结构：

1. Run header：项目 ID、当前状态、region / vertical 上下文
2. Supplier network topology：抽象供应网络拓扑
3. KPI + Audit feed：Completes、QC pass、CPI avg、Settlement、审计日志

其中 KPI + Audit feed 必须保持信息主导权。拓扑是产品证据面板，不是整个页面的主菜。

## 5. Workflow 动效修正记录

早期尝试用外部 SVG 覆盖在卡片上方画边框流动，出现了明显问题：

- SVG 坐标与真实 DOM 卡片边框无法 100% 对齐
- 在第 3 / 第 4 张卡片左侧出现多余竖线
- 最后一张卡片右侧曾出现向虚空延伸的线条
- 部分版本把边框做成高速绕圈，视觉负担过重

R8 的约束：

- 不再使用覆盖式 SVG 画卡片边框
- 卡片自身只做轻量 active 高亮
- 卡片之间保留短连接线
- 短连接线必须从左向右流动，表达“当前步骤 → 下一步骤”
- 最后一张卡片不再向右延伸
- workflow 动效属于次级动效，不得抢 hero 控制台注意力

## 6. 导航栏策略

完整首页需要比 hero demo 更完整的导航，但不能过载。

R8 采用：

- Platform
- Network
- Workflow
- Customers
- Plans

Security、Docs、Resources 暂不作为主导航项，避免顶部过重。安全能力通过状态条、平台模块、FAQ 或后续独立页面承接。

## 7. 语言切换策略

R8 补回语言切换：

- EN
- 中文
- हिन्दी

英文是主版本；中文用于内部评审和中文团队理解；Hindi 暂作为印度市场本地化入口，后续需要进一步完整翻译，而不是长期保留英文占位。

## 8. 客户案例策略

客户案例必须补回。原因：

- 只有产品控制台会显得像强 demo，但缺少信任证明
- B2B SaaS 首页需要让访客知道“谁在用 / 哪类角色会买 / 解决什么结果”
- 早期版本有客户证明结构，后续缺失会降低完整官网感

R8 采用 operator proof 方向，不做空泛 testimonial：

- Regional fieldwork agency
- Brand insights team
- Sample aggregator

每张卡包含：头像、角色、组织类型、反馈、结果指标。

头像当前为 demo 素材；正式版应替换为统一风格的真实商务头像素材。

## 9. Pricing / Plans 策略

根据定价与市场推进方案，正式页面不直接公开价格，而是通过销售承接。

页面只展示三档定位：

- Panel：自有 Panel 运营层
- Supplier Network：主销专业版，多来源供应协同和路由管理
- Enterprise：多团队 / 多实体治理与审计层

CTA 应统一导向：

- Talk to sales
- Book a demo
- Contact sales

避免在官网直接展示 $149 / $399 / $799，防止客户在未理解价值前直接用价格过滤。

## 10. UI 文案约束

最终 UI 中不得出现开发者说明、设计过程说明或内部评审语言。

禁止出现类似：

- “这个按钮是否合理”
- “这个 section 应该做什么”
- “这里用于证明……”
- “上一版的问题是……”

这些内容只应进入设计文档，不应进入官网页面。

## 11. R8 当前状态

R8 是当前完整首页候选方向，不是最终定稿。

已包含：

- 深色 Operations Control Room hero
- 抽象供应网络拓扑
- KPI + Audit feed
- 语言切换
- Audience strip
- Platform modules
- Workflow card section
- Customer proof
- Plans section
- Final CTA / FAQ

仍需后续精修：

- 客户头像素材质量
- Hindi 完整本地化
- 各浏览器真实预览
- 手机端布局细节
- 文案最终销售化
- 与真实产品能力的逐项核对

## 12. 后续迭代原则

后续迭代必须遵守以下顺序：

1. 先保证产品逻辑真实可信
2. 再保证视觉层级稳定
3. 再增强动效和记忆点
4. 不为炫技牺牲清晰度
5. 不把内部讨论语言写进 UI
6. 不让 workflow 动效抢 hero 控制台的主视觉
7. 不公开价格，除非市场策略发生变化

