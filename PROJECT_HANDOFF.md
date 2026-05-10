# SurveySaaS / FenSvyG 海外官网项目交接说明

更新时间：2026-05-10

## 1. 项目一句话

这是一个面向海外市场，尤其是印度 B 端客户的市场调查 / panel / sample 运营类 SaaS 官网方向探索项目。当前核心任务不是修细节，而是确认官网整体风格、大方向和首屏体裁是否适合目标市场。

产品暂用名包括 `SurveySaaS` 和 `FenSvyG`。后续 agent 接手时，不要把它理解成单纯的“漂亮官网设计题”，它首先是一个“市场定位和购买信任”问题。

## 2. 目标客户与商业定位

已确认的目标客户优先级：

1. 海外 Panel / Sample 商和调研外包商，尤其偏印度市场 B 端客户。
2. 海外 B2B 市场调研公司 / Agency。
3. 海外品牌方市场洞察团队。

价格定位：约 150-800 美元/月，属于中端 B2B SaaS，不是低价自助工具，也不是超高端企业咨询产品。

目标客户审美偏好：印度 B 端客户通常认可“欧美 / 国际 SaaS 正版感”，但同时需要看到足够的功能密度和运营可信度。太普通会像模板，太花又会显得不专业。

## 3. 当前最重要的判断

“国际 SaaS 正版感 + 运营密度 + 产品可信”这个方向是成立的，而且比单纯追求 frontend-design 硬规则更贴近当前市场。

原因：

- 目标买家不是设计师、VC 或创意阶层，而是 panel / sample / fieldwork 运营负责人。他们更关心这个系统是否像一个能长期跑项目、盯配额、看供应商、管质量和结算的真实工具。
- 印度 B 端中端 SaaS 买家通常把“像国际 SaaS”看作信任信号，但如果页面过于极简，会被读成“功能太薄，不值这个价”。
- 调研供应链业务天然有运营密度：项目配置、供应商分发、quota、LOI、QC、fraud control、wallet / settlement、audit log。这些内容如果被做成真实的 control surface，比抽象品牌图形更有购买说服力。
- 暗色控制台、实时状态、ticker、KPI count-up、节点流向等语法，接近 Datadog / Snowflake / MongoDB Atlas / Cloudflare 这一类操作型 B2B SaaS 的可信区间，适合“认真做运营的人”的心智。

需要避免的误区：

- “越符合设计 skill 规则越正确”不成立。规则能防止模板味，但不能替代市场定位判断。
- “极客风”和“SaaS 风”不是绝对对立。很多观察类、云基础设施类、运营监控类 SaaS 本来就带暗色、数据密度和 mono 字体。关键是要让它像运营工具，而不是像黑客终端或游戏 UI。
- “像 Claude / Anthropic”不是唯一问题。更深层的问题是 v2 选了 editorial / industrial 的出版物体裁，对目标买家的工作场景错位。

## 4. 设计演进历史

### 原 7 个 demo

仓库内 `AI网页评估包/demos/` 保存了 7 个早期方向：

- 01 完整多页站：内容架构最完整，但国内宣传册味强，视觉上不适合作为海外 SaaS 主方向。
- 02 极简 F-LOGO：国际化、干净、像 Linear / Apple 一类，但偏空，运营密度不足。
- 03 极简原 LOGO：稳定但通用 SaaS 模板感明显。
- 04 科技 S-LOGO 上：品牌符号强，但 logo 抢 H1，信息层级弱。
- 05 科技 S-logo 下：比 04 稳一点，但仍偏蓝白模板。
- 06 左右布局 / 不规则：视觉记忆点比大多数早期 demo 强，曾被认为适合作设计强化版。
- 07 左右布局 / 同心圆：稳定、可信、适合作为早期主方向或 A/B 备选。

早期评估曾认为 07 同心圆最稳，06 不规则更有记忆点，02 可借结构。

### Claude v2：Editorial-Industrial

Claude 曾基于 frontend-design 规则做过 v2，方向是 `Editorial × Industrial`：

- 暖纸色、墨黑、烧橙。
- Fraunces + IBM Plex Sans + JetBrains Mono。
- dateline、Issue 号、Colophon、杂志式分栏。
- 控制室 SVG 罗盘。

v2 的问题：

- 硬规则合格，但体裁错位。它更像 AI 实验室、设计杂志、咨询年报或 Anthropic / Claude 风格页面。
- 用户明确指出“像 claude.com 复制”，这个判断应被正面接受。
- 右侧 SVG 是静帧，不是真动效。对于一个强调 control room / operations 的方向，这是明显缺陷。

结论：v2 不是最差，但不适合作为当前市场的主方向。

### v3：Operations Console

Claude 随后提出第三条路：`Operations Console`。

核心语法：

- 深色底。
- 电光青 / 琥珀信号色。
- 数据密度。
- 真实动效：KPI count-up、ticker、节点脉冲、连接线流动、罗盘慢速旋转。
- 面向 panel / sample 运营场景，而不是抽象品牌隐喻。

这个方向解决了两个关键问题：

- 避开 v2 的暖纸编辑 / Anthropic 家味。
- 避开早期蓝白 SaaS demo 的模板感。

### GPT 改版：10 号方向稿

桌面文件 `10_ops_console_overseas_saas_demo.html` 是 GPT 在 Claude v3 基础上做的方向稿，现已归档到：

`补充资料归档/operations-console/10_ops_console_overseas_saas_demo.html`

它的价值：

- 更像 SaaS，少一点极客味。
- 右侧 hero 从抽象同心圆改成命名节点 + 流向连接线，更接近真实产品界面。
- 去掉过强的 scanline / glow，改成工程网格和更克制的视觉。

它的问题：

- 视觉签名变弱，有滑向 Datadog / Splunk / New Relic 暗色 dashboard 通用词汇的风险。
- 中心 KPI 变静态，削弱了“活的运营控制台”感觉。
- 节点业务密度偏稀。

### v3.5：上一版主候选

桌面文件 `09_v35_operations_console_hybrid.html` 是 Claude 在 v3 和 GPT 改版之间做的 hybrid，现已归档到：

`补充资料归档/operations-console/09_v35_operations_console_hybrid.html`

它应该被视为 v4 的直接基准，而不是普通新增 demo。

v3.5 的取舍：

- 保留 GPT 版的命名节点、网格底、Plex 字体、克制发光和更 SaaS 的结构。
- 接回 Claude v3 的罗盘视觉签名、中心 KPI count-up、ticker、节点业务密度。
- H1 从隐喻式 `like a control room` 收敛为更产品化的 `Run survey supply from one operations console.`
- 字体收敛为 IBM Plex Sans + JetBrains Mono。

当前判断：v3.5 证明了 operations console 方向成立，v4 应继续沿着它迭代。

### v4：当前主动迭代

`11_v4_operations_console_product_loop.html` 是基于 v3.5 复制出来的新版本，现已归档到：

`补充资料归档/operations-console/11_v4_operations_console_product_loop.html`

v4 的目标不是换风格，而是回答“SRMG 那种视频感是否值得用于我们”的问题：不做品牌视频照搬，先用网页内部动效做一段产品运行短循环。

v4 的取舍：

- 保留 v3.5 的深色运营控制台、命名节点、网格、罗盘签名和 SaaS 克制感。
- 将中心 KPI 面板改为 `Launch → Route → QC → Settle` 的循环运行界面。
- 用 JS 更新当前阶段、事件记录、完成数、QC 队列和结算金额，让右侧 hero 像真实产品正在跑。
- 先以低成本拿到“运动叙事”和“系统运行感”，以后如果要做真实 WebM，可以把 v4 当作脚本和镜头分解基础。

当前判断：v4 证明产品运行短循环方向值得测试，v3.5 是低动效对照基准。

### v4.5 / v4.6：Claude 后续迭代

`12_v45_operations_console_slow_loop.html` 和 `13_v46_operations_console_workflow_canvas.html` 是 Claude 在 v4 之后做的两次补充迭代，现已归档到：

`补充资料归档/operations-console/12_v45_operations_console_slow_loop.html`

`补充资料归档/operations-console/13_v46_operations_console_workflow_canvas.html`

v4.5 的重点是把产品循环节奏放慢，并通过项目 ID 轮换缓解数字自洽问题。v4.6 的重点是把 workflow 动态流转重新接回页面，强化“项目从阶段到阶段传递”的叙事。

当前判断：v4.6 是完整页面体验上的最新本地候选，但仍有局部需要校准，例如 operating layer ribbon 的视觉重量、节点业务自洽、真实文案、移动端和可访问性。

### v4.7：GPT 方向策略与 demo

`DESIGN_STRATEGY_v4.7.md` 和 `surveysaas_v47_direction_demo.html` 来自远端分支 `v47-strategy-demo`，现已合并归档到：

`补充资料归档/operations-console/DESIGN_STRATEGY_v4.7.md`

`补充资料归档/operations-console/surveysaas_v47_direction_demo.html`

v4.7 更像“方向收敛方案 + 轻量方向样张”，不是替代 v4.6 的完整页面终稿。后续 agent 应先读 v4.7 策略，再把 v4.7 demo 与 v4.6 完整页、v3.5 稳定页一起对照评估。

## 5. 当前资料归档位置

新增归档目录：

`补充资料归档/`

里面包含：

- `operations-console/09_v3_operations_console.html`：Claude v3 原始 operations console 方向。
- `operations-console/10_ops_console_overseas_saas_demo.html`：GPT 修改版，更像 SaaS 的方向验证稿。
- `operations-console/09_v35_operations_console_hybrid.html`：v3.5 hybrid，v4 的对照基准。
- `operations-console/11_v4_operations_console_product_loop.html`：v4 产品运行短循环版本。
- `operations-console/12_v45_operations_console_slow_loop.html`：v4.5 调速版本。
- `operations-console/13_v46_operations_console_workflow_canvas.html`：v4.6 工作流强化版本。
- `operations-console/DESIGN_STRATEGY_v4.7.md`：v4.7 设计 / 迭代指导方案。
- `operations-console/surveysaas_v47_direction_demo.html`：v4.7 方向 demo。
- `handoff/1778316283238__HANDOFF.md`：Claude Cowork 交接文档。
- `handoff/claude聊天.txt`：用户和 Claude Chat 的完整聊天记录。

仓库原有核心资料：

- `AI网页评估包/评估入口.html`：早期 demo 总入口。
- `AI网页评估包/demos/`：原 7 个 demo。
- `真实页面评估输出/`：截图和页面观察输出。
- `真实页面专业评估报告.html`：早期综合评估报告。

## 6. 后续工作建议

如果后续 agent 接手，建议不要重新从“7 个 demo 哪个最好”开始，而是按以下顺序推进：

1. 先读 `DESIGN_STRATEGY_v4.7.md`，理解 v4.7 想解决 v4.6 的哪些问题。
2. 打开 `surveysaas_v47_direction_demo.html` 和 `13_v46_operations_console_workflow_canvas.html`，对比 v4.7 的收敛方向是否真的优于 v4.6 的完整页面体验。
3. 再打开 `09_v35_operations_console_hybrid.html`，对比高动效版本的“视频感收益”是否真的超过 v3.5 的简洁稳定。
4. 对比 `10_ops_console_overseas_saas_demo.html`，确认新版本没有丢掉 SaaS 克制感。
5. 如果继续做页面，应优先把真实业务内容替换进去，而不是继续写“设计语言”占位文案。
6. 重点完善首屏之后的产品证据：模块、工作流、供应商路由、反作弊、财务结算、合规、客户案例。
7. 检查移动端和窄屏：不要让暗色数据密度变成拥挤或无法阅读。
8. 继续保持真实动效，但动效要像运营状态，不要像装饰。

## 7. 质量标准

后续修改要优先满足：

- 第一屏明确说明产品是什么。
- 页面看起来像可购买的国际 SaaS，不像实验稿、咨询年报或设计作品集。
- 有足够运营密度，让 panel / sample / fieldwork 买家觉得懂他们的日常工作。
- 有一个可记忆的视觉签名，但不能压过产品本身。
- 动效服务于“系统正在运行”的感知。
- 移动端信息可读，CTA 可点，语言切换触控区足够。

## 8. 我的当前建议

继续以 v4.7 的策略方案作为最新方向参考，同时保留 v4.6 作为完整页面体验候选、v3.5 作为低动效对照基准。

不要回到 v2 的 editorial warm-paper 路线；也不要完全退回早期 03-07 的蓝白圆角 SaaS 模板。最有潜力的路是：克制的 operations console，加真实业务内容，加国际 SaaS 信息架构。
