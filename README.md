# SurveySaaS / FenSvyG 海外官网方向评估

这个仓库保存 SurveySaaS / FenSvyG 海外官网的设计 demo、真实页面评估输出、补充方案和交接文档。

后续 agent 接手时，建议先读：

1. [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md)：项目背景、目标客户、设计演进、当前判断和下一步建议。
2. [补充资料归档/README.md](补充资料归档/README.md)：不在原始 Git 仓库里的桌面补充资料归档说明。
3. [补充资料归档/operations-console/README.md](补充资料归档/operations-console/README.md)：当前 operations console 方向的 3 个版本说明。

## 当前主线

当前推荐方向是 `operations console`，核心判断是：

> 国际 SaaS 正版感 + 运营密度 + 产品可信。

当前主动迭代版本是：

[补充资料归档/operations-console/11_v4_operations_console_product_loop.html](补充资料归档/operations-console/11_v4_operations_console_product_loop.html)

它是在 v3.5 hybrid 基础上做的 v4 产品运行短循环版本，目标是在“海外 B2B SaaS 可信感”“运营控制台记忆点”和“系统正在运行的视频感”之间取得平衡。

对照基准是：

[补充资料归档/operations-console/09_v35_operations_console_hybrid.html](补充资料归档/operations-console/09_v35_operations_console_hybrid.html)

## 目录说明

- `AI网页评估包/`：原始 7 个 demo 和评估入口。
- `真实页面评估输出/`：早期 demo 的桌面端 / 移动端截图、contact sheet 和页面观察 JSON。
- `补充资料归档/`：后来从桌面补进来的 Claude / GPT 方案、交接文档和聊天记录。
- `PROJECT_HANDOFF.md`：给新对话或新 agent 的总交接说明。
- `DEMO设计评估手册.html`：较大的综合设计评估手册。
- `真实页面专业评估报告.html`：早期真实页面专业评估报告。
- `build_*.js` / `evaluate_*.js` / `make_ai_review_pack.ps1`：生成评估手册、真实页面报告和评估包的脚本。

## 接手建议

不要从“7 个旧 demo 重新打分”开始。更有效的顺序是：

1. 先读 `PROJECT_HANDOFF.md`。
2. 打开 v4 当前候选页面。
3. 对照 v3.5 和 `10_ops_console_overseas_saas_demo.html`，判断 SaaS 克制感、视觉记忆点和产品运行感是否平衡。
4. 再把真实业务内容替换进当前候选，而不是继续写设计说明类占位文案。

## 注意

- 不要提交压缩包、浏览器缓存、临时测试目录。
- 不要提交账号、密码、密钥、客户隐私数据。
- 这个仓库包含项目方向、定位和设计讨论资料，GitHub 仓库建议设置为 Private。
