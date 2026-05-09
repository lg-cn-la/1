const fs = require("fs");
const path = require("path");

const workspace = __dirname;
const source = path.join(workspace, "DEMO设计评估手册.html");
const target = path.join(workspace, "DEMO设计评估完整版本.html");

let html = fs.readFileSync(source, "utf8");

const extraCss = String.raw`
    .claude-report {
      background: #0b0f1a;
      color: #e8edf5;
      border-color: #1f2d47;
    }
    .claude-report h2,
    .claude-report h3,
    .claude-report h4 { color: #f8fbff; }
    .claude-report .note { color: #91a4ba; }
    .claude-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
      margin: 18px 0 22px;
    }
    .claude-tile {
      border: 1px solid #1f2d47;
      background: #161d2e;
      border-radius: 8px;
      padding: 16px;
    }
    .claude-tile strong {
      display: block;
      font-size: 22px;
      color: #ffd166;
      margin-bottom: 4px;
    }
    .rank-list { display: flex; flex-direction: column; gap: 12px; }
    .rank-row {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) 70px;
      align-items: center;
      gap: 14px;
      background: #161d2e;
      border: 1px solid #1f2d47;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .rank-row.top1 { border-color: #3b8bff; background: linear-gradient(135deg, #0e1f3d, #111827); }
    .rank-row.top2 { border-color: rgba(0,201,167,.45); }
    .rank-num {
      font-size: 21px;
      font-weight: 900;
      color: #7a8fa8;
      text-align: center;
    }
    .top1 .rank-num { color: #3b8bff; }
    .top2 .rank-num { color: #00c9a7; }
    .rank-name { font-weight: 800; color: #fff; }
    .rank-reason { color: #91a4ba; font-size: 13px; margin-top: 3px; }
    .rank-total { color: #ffd166; font-size: 24px; font-weight: 900; text-align: right; }
    .dark-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      background: #111827;
    }
    .dark-table th,
    .dark-table td {
      border: 1px solid #1f2d47;
      padding: 10px 12px;
      vertical-align: top;
      text-align: left;
    }
    .dark-table th {
      background: rgba(255,255,255,.05);
      color: #91a4ba;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .06em;
    }
    .score-high { color: #5de3c5; font-weight: 800; }
    .score-mid { color: #7ab8ff; font-weight: 800; }
    .score-warn { color: #ffc06e; font-weight: 800; }
    .score-low { color: #f5a0a0; font-weight: 800; }
    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
      gap: 16px;
      margin-top: 18px;
    }
    .analysis-card {
      background: #161d2e;
      border: 1px solid #1f2d47;
      border-radius: 8px;
      padding: 18px;
    }
    .analysis-card.winner { border-color: #3b8bff; }
    .analysis-card h4 { margin: 0 0 8px; }
    .analysis-card ul { color: #91a4ba; }
    .tagline {
      display: inline-block;
      margin: 3px 6px 3px 0;
      padding: 3px 8px;
      border: 1px solid #1e4a8a;
      border-radius: 999px;
      color: #7ab8ff;
      background: rgba(59,139,255,.1);
      font-size: 12px;
      font-weight: 700;
    }
    .recommend-box {
      margin-top: 18px;
      border: 1px solid rgba(59,139,255,.4);
      background: linear-gradient(135deg, #0b1d3d 0%, #0d2040 100%);
      border-radius: 8px;
      padding: 20px;
    }
    .next-ai-box {
      border: 1px solid rgba(255,209,102,.35);
      background: rgba(255,209,102,.08);
      border-radius: 8px;
      padding: 16px;
      margin-top: 18px;
      color: #f5d891;
    }
    @media (max-width: 900px) {
      .rank-row { grid-template-columns: 30px minmax(0, 1fr) 56px; gap: 10px; }
      .rank-total { font-size: 20px; }
    }
`;

const reportSection = String.raw`
    <section class="claude-report" id="claude-evaluation">
      <p class="eyebrow">Claude Sonnet 4 · 二次评估报告</p>
      <h2>官网设计方案综合评估</h2>
      <p class="note">本节根据 Claude 对《DEMO 设计评估手册》的二次评估整理而成。Claude 明确将品牌/Logo 权重降至 0.5，重点看视觉完成度、信息架构、B2B SaaS 可信度和首屏吸引力。</p>

      <div class="claude-summary">
        <div class="claude-tile"><strong>首选</strong><span>左右布局 / 不规则</span></div>
        <div class="claude-tile"><strong>备选</strong><span>测试代码4(2) 的多页内容骨架</span></div>
        <div class="claude-tile"><strong>策略</strong><span>用 DEMO 6 的视觉语言整合 DEMO 1 的信息架构</span></div>
        <div class="claude-tile"><strong>注意</strong><span>仍建议让 AI 或人工打开实际 HTML 复核首屏、滚动和移动端</span></div>
      </div>

      <h3>综合排名</h3>
      <div class="rank-list">
        <div class="rank-row top1"><div class="rank-num">1</div><div><div class="rank-name">左右布局 / 不规则</div><div class="rank-reason">视觉完成度最高、首屏冲击力强、产品资源最丰富、信息叙事清晰。不规则轨道装置是最有记忆点的视觉符号。</div></div><div class="rank-total">8.1</div></div>
        <div class="rank-row top2"><div class="rank-num">2</div><div><div class="rank-name">多页完整站 / 测试代码4(2)</div><div class="rank-reason">唯一多页完整方案，信息架构最完整，产品解释力最强，适合作为内容骨架参考。</div></div><div class="rank-total">7.4</div></div>
        <div class="rank-row"><div class="rank-num">3</div><div><div class="rank-name">左右布局 / 同心圆</div><div class="rank-reason">与不规则版本共用高完成度资产，同心圆更稳定、B2B 信赖感强，但记忆点弱一些。</div></div><div class="rank-total">7.2</div></div>
        <div class="rank-row"><div class="rank-num">4</div><div><div class="rank-name">科技 / S-LOGO-上</div><div class="rank-reason">响应式和可访问性最佳，标准 SaaS 风格稳健，字体选择加分，但视觉独特性不足。</div></div><div class="rank-total">7.0</div></div>
        <div class="rank-row"><div class="rank-num">5</div><div><div class="rank-name">科技 / S-logo-下</div><div class="rank-reason">流动动效方向有潜力，但与 S-LOGO-上差异不够明显，移动端动效风险更高。</div></div><div class="rank-total">6.8</div></div>
        <div class="rank-row"><div class="rank-num">6</div><div><div class="rank-name">极简 / F-LOGO</div><div class="rank-reason">最干净、国际化，但视觉记忆点弱，产品截图质量是否足够说服力是关键变量。</div></div><div class="rank-total">6.6</div></div>
        <div class="rank-row"><div class="rank-num">7</div><div><div class="rank-name">极简 / 原LOGO</div><div class="rank-reason">完成度不低，但产品截图少、旧品牌延续限制定位更新空间，更适合作为基准参考。</div></div><div class="rank-total">6.0</div></div>
      </div>

      <h3 style="margin-top:24px">详细评分矩阵</h3>
      <div style="overflow-x:auto">
        <table class="dark-table">
          <thead><tr><th>方案</th><th>品牌识别</th><th>视觉完成度</th><th>信息层级</th><th>SaaS可信度</th><th>首屏吸引力</th><th>响应式安全</th><th>定位匹配</th><th>综合</th></tr></thead>
          <tbody>
            <tr><td>左右布局 / 不规则</td><td class="score-mid">7</td><td class="score-high">9</td><td class="score-high">8</td><td class="score-high">9</td><td class="score-high">9</td><td class="score-warn">6</td><td class="score-high">9</td><td class="score-high">8.1</td></tr>
            <tr><td>测试代码4(2) 多页站</td><td class="score-warn">6.5</td><td class="score-warn">6</td><td class="score-high">9</td><td class="score-high">8.5</td><td class="score-warn">5.5</td><td class="score-warn">5.5</td><td class="score-high">9</td><td class="score-high">7.4</td></tr>
            <tr><td>左右布局 / 同心圆</td><td class="score-warn">6.5</td><td class="score-high">8</td><td class="score-high">8.5</td><td class="score-high">8.5</td><td class="score-mid">7.5</td><td class="score-mid">7</td><td class="score-high">8</td><td class="score-mid">7.2</td></tr>
            <tr><td>科技 / S-LOGO-上</td><td class="score-mid">7</td><td class="score-mid">7.5</td><td class="score-mid">7.5</td><td class="score-mid">7</td><td class="score-mid">7</td><td class="score-high">8.5</td><td class="score-mid">7.5</td><td class="score-mid">7.0</td></tr>
            <tr><td>科技 / S-logo-下</td><td class="score-warn">6</td><td class="score-mid">7.5</td><td class="score-mid">7</td><td class="score-mid">7</td><td class="score-mid">7.5</td><td class="score-warn">6.5</td><td class="score-mid">7</td><td class="score-warn">6.8</td></tr>
            <tr><td>极简 / F-LOGO</td><td class="score-warn">6</td><td class="score-mid">7</td><td class="score-mid">7</td><td class="score-mid">7</td><td class="score-warn">6</td><td class="score-high">9</td><td class="score-mid">7</td><td class="score-warn">6.6</td></tr>
            <tr><td>极简 / 原LOGO</td><td class="score-low">5</td><td class="score-mid">7</td><td class="score-mid">7</td><td class="score-warn">6</td><td class="score-warn">6</td><td class="score-high">9</td><td class="score-warn">5.5</td><td class="score-warn">6.0</td></tr>
          </tbody>
        </table>
      </div>
      <p class="note">说明：品牌识别度按 0.5 权重参与综合分；响应式安全分越高代表风险越低。</p>

      <h3 style="margin-top:24px">各方案深度分析</h3>
      <div class="analysis-grid">
        <article class="analysis-card winner">
          <h4>左右布局 / 不规则 · 8.1</h4>
          <span class="tagline">首选迭代基础</span><span class="tagline">产品截图最全</span><span class="tagline">移动端需补强</span>
          <ul><li>核心优点：不规则轨道装置最有品牌记忆点，产品截图覆盖 supplier/project/finance/analytics，B2B 叙事成熟。</li><li>主要风险：视觉复杂度较高，移动端降级方式需要专项设计。</li><li>适用场景：作为官网主视觉和后续整体迭代基础。</li></ul>
        </article>
        <article class="analysis-card">
          <h4>测试代码4(2) 多页站 · 7.4</h4>
          <span class="tagline">内容骨架参考</span><span class="tagline">信息架构蓝图</span>
          <ul><li>核心优点：唯一多页方案，覆盖首页、后台、调查站、供应商、定价、联系，产品解释力最强。</li><li>主要风险：视觉精致度不如单页方案，中文路径和多页一致性需要复核。</li><li>适用场景：作为完整官网的信息架构来源。</li></ul>
        </article>
        <article class="analysis-card">
          <h4>左右布局 / 同心圆 · 7.2</h4>
          <span class="tagline">稳健备选</span><span class="tagline">可信赖感强</span>
          <ul><li>核心优点：同心圆传达系统闭环和秩序感，B2B 信赖感强，移动端降级路径更可预期。</li><li>主要风险：记忆点弱于不规则版本，容易变成通用科技感。</li><li>适用场景：作为 DEMO 6 的 A/B 测试备选。</li></ul>
        </article>
        <article class="analysis-card">
          <h4>科技 / S-LOGO-上 · 7.0</h4>
          <span class="tagline">响应式安全</span><span class="tagline">字体加分</span>
          <ul><li>核心优点：响应式和可访问性最稳，S Logo 识别路径直接，Bricolage Grotesque 字体有个性。</li><li>主要风险：首屏缺少独立视觉符号，科技感主要停留在配色和卡片层面。</li><li>适用场景：作为安全稳健的标准 SaaS 参考。</li></ul>
        </article>
        <article class="analysis-card">
          <h4>科技 / S-logo-下 · 6.8</h4>
          <span class="tagline">动效潜力</span><span class="tagline">差异不足</span>
          <ul><li>核心优点：流动动效方向有差异化潜力。</li><li>主要风险：和 S-LOGO-上差异不够大，Logo 下置可能削弱首屏品牌识别。</li><li>适用场景：仅作为动效策略参考。</li></ul>
        </article>
        <article class="analysis-card">
          <h4>极简 / F-LOGO · 6.6</h4>
          <span class="tagline">噪音最低</span><span class="tagline">客户真实感</span>
          <ul><li>核心优点：最干净、国际化友好，有客户头像和 webp 产品截图。</li><li>主要风险：系统字体过于通用，极简到缺少视觉记忆点。</li><li>适用场景：借鉴客户证明模块和清爽留白。</li></ul>
        </article>
        <article class="analysis-card">
          <h4>极简 / 原LOGO · 6.0</h4>
          <span class="tagline">基准参考</span><span class="tagline">差异化最低</span>
          <ul><li>核心优点：结构稳定，可作为基准版本参考。</li><li>主要风险：产品截图最少，旧品牌延续限制更新空间，独特视觉符号不足。</li><li>适用场景：仅作为低风险基础方案对照。</li></ul>
        </article>
      </div>

      <div class="recommend-box">
        <h3>最终建议：以“左右布局 / 不规则”为主线迭代</h3>
        <p>Claude 的建议是：用 DEMO 6 的视觉框架作为主基础，修复移动端降级逻辑；从 DEMO 1 引入多页信息架构；从 DEMO 2 借鉴真实客户证明模块；从 DEMO 4/5 借鉴字体和响应式安全性；保留 DEMO 7 作为同心圆视觉的 A/B 测试备选。</p>
        <ol>
          <li>先用 DEMO 6 的不规则轨道建立品牌记忆点。</li>
          <li>将 DEMO 1 的首页、产品页、定价页、联系页扩展成完整站点结构。</li>
          <li>移动端把复杂轨道装置降级为静态产品截图或更简化的视觉符号。</li>
          <li>补充统一的高质量产品截图、WebP 压缩、懒加载和 reduced-motion 处理。</li>
        </ol>
      </div>

      <div class="next-ai-box">
        <strong>重要复核建议：</strong>为了让评估更接近真实设计判断，下一轮最好把每个 DEMO 的实际 HTML 页面也交给 AI 或人工打开复核，重点看首屏真实渲染、滚动后的模块连接、动效、导航状态和移动端表现。当前 Claude 报告适合作为方向判断，不应替代最终视觉验收。
      </div>
    </section>
`;

html = html.replace("<title>DEMO 设计评估手册</title>", "<title>DEMO 设计评估完整版本</title>");
html = html.replace("</style>", `${extraCss}\n  </style>`);
html = html.replace(
  '    <section>\n      <h2>可复制给其他 AI 的评估提示词</h2>',
  `${reportSection}\n\n    <section>\n      <h2>可复制给其他 AI 的评估提示词</h2>`
);

fs.writeFileSync(target, html, "utf8");
console.log(JSON.stringify({
  output: target,
  bytes: fs.statSync(target).size,
  hasClaudeReport: html.includes("Claude Sonnet 4 · 二次评估报告"),
  hasOriginalHandbook: html.includes("快速目录"),
}, null, 2));
