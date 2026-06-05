# Sampora 官网修复与验收规则

更新时间：2026-06-05

本文用于约束 Sampora 官网修复、Codex patch、handoff、smoke check 和验收表述。后续任何页面修复或 SEO 改动，都不要把局部检查说成完整验收。

## 1. 当前主包与资料边界

当前官网修复和检查应以实际工作包为准：

- 主包：`sampora-website-public.zip` 或当前明确指定的 `sampora-website-public-v3/`。
- `handoff.zip`：只能作为最终文档一致性参考，不能作为页面验收证明。
- `verification-report.md` 或 “0 failures”：不能单独证明页面已通过完整五层验收。

旧的 SurveySaaS / FenSvyG demo 和归档文档只作历史参考，不得覆盖当前 Sampora 品牌、术语和页面结构。

## 2. 问题分类规则

执行修复前，问题应先分类：

- `CONFIRMED`：已确认存在，可修改页面源。
- `VERIFY-FIRST`：先验证，不直接改页面。
- `STRATEGY`：只改文档、QA 规则或打包策略，不改页面源。
- `REGRESSION`：作为回归检查项；只有失败时才修。
- `REMOVED`：已移除内容，不得重新引入。
- `OUT-OF-SCOPE`：本轮不处理。
- `BLOCKED`：受工具、环境、权限或缺失资料限制，不能完成。

Codex 指令不要写成“fix everything”。必须写清 owner package、文件范围、Done 条件和不能触碰的区域。

## 3. 五层验证定义

完整五层验证必须覆盖：

1. 静态完整性：文件集、redirect、链接、canonical、meta、JS 语法、图片引用、footer 法务一致。
2. 视觉与动效运行态：浏览器打开页面、截图或运行态观察、动画采样、拓扑和 workflow 实际运动。
3. 业务路径：CTA、Contact 表单、trial/demo/sales 路径和必要 fallback。
4. 文案术语：EN / ZH / HI 或当前启用语言的一致性，业务术语不漂移。
5. 上线可用性：redirect、canonical、legal、i18n、favicon、assets、sitemap 等上线相关项。

如果只做 grep、source review、static check 或 smoke check，必须写：

> not acceptance-reviewed / 未做完整验收

不得写“五层验证完成”。

## 4. 固定回归项

后续修复和 SEO patch 必须保护以下项目：

- 首页 topology 中产品 S mark 必须存在。
- topology modal close 必须显示 ASCII `X`，不能变乱码。
- workflow 必须在 6 秒内推进。
- topology 动效必须有真实 dash / scan / packet motion，不只是静态线。
- Plans navigation 滚动后必须保持 sticky。
- Contact hero 不应出现顶部大空白。
- Contact 表单 endpoint、intent fields、analytics attributes 和提交反馈不得破坏。
- footer 公司信息必须统一：`安徽省嘉禹企业服务有限公司 / Anhui Jiayu Enterprise Service Co., Ltd.`。
- 当前海外服务器阶段不要添加 ICP。
- Resource Manuals 不得出现 `????` 或通用模板手册文案。
- public root 不要重新加入中文物理 redirect HTML，除非用户明确要求。
- 官网文案不得漂移到 generic survey distribution、traffic monetization 或普通 SaaS 定位。

## 5. SEO patch 的验收边界

SEO 文案 patch 可以做 smoke check，但不能自动等同完整验收。

SEO patch 后最低检查：

- `git diff --name-status` 确认只改允许文件。
- `git diff --check` 无空白错误。
- touched HTML 的 inline script 如有变动需 parse check。
- EN / ZH language switch 后 title、hero、footer 不明显错位。
- Contact 表单能正常显示。
- 不新增隐藏关键词、doorway page 或无关 HTML。
- JSON-LD、canonical、og:url、OG/Twitter image 如不在任务范围内必须保持不动。

报告必须明确写：

- 实际修改文件。
- 已执行命令。
- 未完成项。
- 未触碰范围。
- 是否只是 smoke check。
- 是否未做完整五层验收。

## 6. 文案和视觉修复原则

- 不要为了 SEO 破坏原有高级感和业务语义。
- 不要把自然 B2B 官网文案改成关键词堆砌。
- 不要把中文翻译成机械腔。
- 不要把旧 Apple-like、极简白蓝或早期 SurveySaaS 方向当作当前默认风格。
- 当前页面应优先保持 Sampora 最新公开品牌、深色 SaaS / operations workspace 语境和现有页面结构。

## 7. Handoff 记录规则

可以追加简短 handoff log，但不要让 handoff 代替验收。

handoff 应说明：

- 本轮处理范围。
- 哪些项已改。
- 哪些项跳过。
- 哪些 guard 未触碰。
- 哪些检查只是 smoke check。
- 哪些检查需要后续真实浏览器运行态确认。