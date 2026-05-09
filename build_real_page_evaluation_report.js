const fs = require("fs");
const path = require("path");

const root = __dirname;
const outRoot = path.join(root, "真实页面评估输出");
const reportPath = path.join(root, "真实页面专业评估报告.html");

const rows = [
  {
    rank: 1,
    id: "06",
    name: "左右布局 / 不规则",
    score: 8.4,
    scores: [8.5, 8.8, 8.4, 8.6, 8.9, 7.8, 8.8],
    summary: "首屏真实渲染最均衡：左侧价值主张足够强，右侧不规则轨道 Logo 装置形成记忆点，下方产品模块自然露出。",
    strengths: ["品牌视觉符号最强", "信息层级清楚", "产品截图与流程模块支撑 SaaS 可信度", "移动端虽然去掉右侧大视觉，但可读性仍好"],
    risks: ["移动端首屏失去桌面端的大视觉装置，只剩散落粒子作为暗示", "中文产品标签在英文页面中略显混杂"],
    borrow: "作为主迭代基础，保留首屏左右布局和不规则视觉符号。",
    dir: "06_左右布局 _ 不规则",
  },
  {
    rank: 2,
    id: "07",
    name: "左右布局 / 同心圆",
    score: 8.1,
    scores: [8.2, 8.5, 8.5, 8.6, 8.3, 8.1, 8.7],
    summary: "和不规则版同一套高完成度系统，首屏更稳定、更有秩序感；真实中段流程卡片比不规则版稍清晰。",
    strengths: ["同心圆表达系统闭环，B2B 信任感好", "桌面和移动端降级更可预期", "中段 workflow 卡片节奏稳"],
    risks: ["视觉记忆点弱于不规则版", "如果后续品牌要更有差异化，可能显得偏通用科技感"],
    borrow: "作为 A/B 测试备选，或在更保守客户场景中使用。",
    dir: "07_左右布局 _ 同心圆",
  },
  {
    rank: 3,
    id: "02",
    name: "极简 / F-LOGO",
    score: 7.7,
    scores: [7.4, 8.0, 7.8, 8.2, 7.7, 8.3, 7.8],
    summary: "真实页面比摘要里更有说服力：首屏产品截图质量高，Fensvyg 品牌清楚，移动端也相对稳。",
    strengths: ["产品截图是真正的 SaaS 证据", "留白和浅色系统干净", "客户头像/故事模块可用于增强可信度", "移动端可读性好"],
    risks: ["首屏字体过大，桌面左侧标题有压迫感", "整体记忆点仍主要来自产品截图，不是独立品牌符号"],
    borrow: "借用产品截图、客户证明和清爽产品证据模块。",
    dir: "02_极简 _ F-LOGO",
  },
  {
    rank: 4,
    id: "05",
    name: "科技 / S-logo-下",
    score: 7.3,
    scores: [7.1, 7.4, 7.7, 7.2, 7.1, 8.5, 7.3],
    summary: "真实首屏很干净，响应式安全，但缺少产品截图或强视觉锚点，更像标准 SaaS 模板。",
    strengths: ["信息层级集中", "移动端首屏完整、按钮和标签节奏好", "比 S-LOGO-上更少折线遮挡问题"],
    risks: ["首屏没有产品证据", "视觉差异化不足", "科技感主要来自蓝白配色和大字号"],
    borrow: "可借用其移动端排版和简洁 CTA 结构。",
    dir: "05_科技 _ S-logo-下",
  },
  {
    rank: 5,
    id: "03",
    name: "极简 / 原LOGO",
    score: 6.9,
    scores: [6.3, 7.2, 7.4, 6.7, 6.5, 8.4, 6.5],
    summary: "结构稳定、响应式安全，但真实首屏太空，缺少产品视觉证据，品牌更新空间小。",
    strengths: ["标题和 CTA 层级稳定", "移动端可读性很好", "适合作为低风险基准"],
    risks: ["首屏没有产品图或强视觉符号", "旧 Logo 方向限制品牌升级", "SaaS 可信度弱于有产品截图的方案"],
    borrow: "保留其干净排版作为 fallback，不建议作为主方向。",
    dir: "03_极简 _ 原LOGO",
  },
  {
    rank: 6,
    id: "04",
    name: "科技 / S-LOGO-上",
    score: 6.5,
    scores: [7.6, 6.6, 5.9, 6.7, 5.8, 7.7, 6.8],
    summary: "Logo 资产本身强，但真实首屏把巨型 Logo 放得太高，桌面和移动端都把 H1 推到折线附近或以下。",
    strengths: ["品牌露出强", "移动端视觉资产清楚", "整体仍有科技感"],
    risks: ["首屏信息层级失败：先看 Logo，很晚才看到产品价值主张", "桌面第一屏 H1 被截断", "装饰强于产品解释"],
    borrow: "只借用 Logo 资产，不建议保留这个首屏结构。",
    dir: "04_科技 _ S-LOGO-上",
  },
  {
    rank: 7,
    id: "01",
    name: "完整多页站 / 测试代码4(2)",
    score: 5.8,
    scores: [6.8, 5.7, 7.9, 6.4, 6.2, 3.9, 7.5],
    summary: "内容架构最完整，但真实渲染暴露较多问题：中段低对比/空白、断图、移动端宽度异常，不适合作为视觉主方案。",
    strengths: ["多页结构和业务覆盖最完整", "中文官网内容和定价/联系等路径齐全", "首屏摄影图有情绪"],
    risks: ["检测到断图", "移动端宽度异常，有横向溢出迹象", "中段大块区域低对比、近似空白", "视觉更像企业宣传页，不像产品型 SaaS 官网"],
    borrow: "只借用信息架构、页面类型和中文内容，不借用视觉系统。",
    dir: "01_完整多页站 _ 测试代码4(2)",
  },
];

function rel(file) {
  return path.relative(path.dirname(reportPath), file).replace(/\\/g, "/");
}

function shot(dir, name) {
  return rel(path.join(outRoot, "screenshots", dir, name));
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreClass(score) {
  if (score >= 8) return "high";
  if (score >= 7) return "mid";
  if (score >= 6) return "warn";
  return "low";
}

const scoreHeads = ["品牌识别", "视觉完成度", "信息层级", "SaaS可信度", "首屏吸引力", "响应式安全", "定位匹配"];

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>真实页面专业评估报告</title>
  <style>
    :root { --bg:#0b1020; --panel:#121a2b; --card:#172033; --line:#2a3a58; --text:#eef4ff; --muted:#91a4ba; --blue:#4f9cff; --green:#31d0aa; --gold:#ffd166; --warn:#ffb86b; --low:#ff8585; }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font-family:"Microsoft YaHei","PingFang SC",Arial,sans-serif;line-height:1.65}
    header{padding:48px 5vw 36px;background:linear-gradient(135deg,#0b1020,#10264a);border-bottom:1px solid var(--line)}
    main{width:min(1440px,94vw);margin:24px auto 60px}
    h1{margin:0 0 10px;font-size:36px;letter-spacing:0}
    h2{margin:0 0 12px;font-size:24px}
    h3{margin:0 0 8px;font-size:18px}
    p{margin:8px 0;color:var(--muted)}
    section{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:22px;margin:18px 0}
    table{width:100%;border-collapse:collapse;background:#101827;font-size:13px}
    th,td{border:1px solid var(--line);padding:9px 10px;text-align:left;vertical-align:top}
    th{color:#b8c6d9;background:rgba(255,255,255,.05)}
    .rank{display:grid;grid-template-columns:44px 1fr 80px;gap:14px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px;margin:10px 0}
    .rank:first-child{border-color:var(--blue);background:linear-gradient(135deg,#10264a,#172033)}
    .num{font-size:24px;font-weight:900;color:var(--blue);text-align:center}
    .total{font-size:25px;font-weight:900;color:var(--gold);text-align:right}
    .tag{display:inline-block;margin:3px 6px 3px 0;padding:3px 8px;border-radius:999px;background:rgba(79,156,255,.12);border:1px solid rgba(79,156,255,.38);color:#9bc8ff;font-weight:700;font-size:12px}
    .score.high{color:var(--green);font-weight:900}.score.mid{color:#9bc8ff;font-weight:900}.score.warn{color:var(--warn);font-weight:900}.score.low{color:var(--low);font-weight:900}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:16px}
    article{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px}
    article.winner{border-color:var(--blue)}
    ul{margin:8px 0;padding-left:20px;color:#c9d6e8}
    li{margin:5px 0}
    .shots{display:grid;grid-template-columns:1fr 220px;gap:10px;margin-top:12px;align-items:start}
    figure{margin:0;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff}
    img{display:block;width:100%;height:auto}
    figcaption{background:#0f1727;color:#aab7c8;padding:6px 8px;font-size:12px}
    .notice{background:rgba(255,209,102,.08);border-color:rgba(255,209,102,.35)}
    .matrix{overflow-x:auto}
    a{color:#9bc8ff}
    @media(max-width:800px){.rank{grid-template-columns:32px 1fr 58px}.shots{grid-template-columns:1fr}.total{font-size:20px}}
  </style>
</head>
<body>
  <header>
    <h1>真实页面专业评估报告</h1>
    <p>基于实际打开 7 个 DEMO 后生成的 42 张截图：桌面 1440×1000 与移动端 390×844，各取首屏、中段、底部。评估口径按 web-design-evaluator + frontend-skill：先看真实首屏和产品证据，再看信息层级、响应式、安全感和品牌记忆点。</p>
    <p>生成物：<a href="${rel(path.join(outRoot, "contact_sheet.png"))}">首屏总览图</a> · <a href="${rel(path.join(outRoot, "contact_sheet.html"))}">首屏总览 HTML</a> · 截图目录 <code>真实页面评估输出/screenshots</code></p>
  </header>
  <main>
    <section class="notice">
      <h2>核心结论</h2>
      <p>Claude 的第一名判断仍然成立：<strong>左右布局 / 不规则</strong> 是最值得作为主迭代基础的方案。但真实渲染后，多页完整站不应排第二，它的视觉和技术问题明显；更合理的第二名是 <strong>左右布局 / 同心圆</strong>，第三名是 <strong>极简 / F-LOGO</strong>。</p>
    </section>

    <section>
      <h2>综合排名</h2>
      ${rows.map(r => `<div class="rank"><div class="num">${r.rank}</div><div><h3>${esc(r.name)}</h3><p>${esc(r.summary)}</p></div><div class="total">${r.score.toFixed(1)}</div></div>`).join("\n")}
    </section>

    <section>
      <h2>评分矩阵</h2>
      <div class="matrix">
        <table>
          <thead><tr><th>排名</th><th>方案</th>${scoreHeads.map(h => `<th>${h}</th>`).join("")}<th>综合</th></tr></thead>
          <tbody>
            ${rows.map(r => `<tr><td>${r.rank}</td><td><strong>${esc(r.name)}</strong></td>${r.scores.map(s => `<td class="score ${scoreClass(s)}">${s.toFixed(1)}</td>`).join("")}<td class="score ${scoreClass(r.score)}">${r.score.toFixed(1)}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2>逐方案分析</h2>
      <div class="cards">
        ${rows.map(r => `
          <article class="${r.rank === 1 ? "winner" : ""}">
            <h3>${r.rank}. ${esc(r.name)} · ${r.score.toFixed(1)}</h3>
            <span class="tag">${r.rank === 1 ? "首选主线" : r.rank <= 3 ? "强参考" : r.rank <= 5 ? "局部借鉴" : "谨慎使用"}</span>
            <p>${esc(r.summary)}</p>
            <h3>核心优点</h3>
            <ul>${r.strengths.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <h3>主要风险</h3>
            <ul>${r.risks.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <p><strong>建议：</strong>${esc(r.borrow)}</p>
            <div class="shots">
              <figure><img src="${shot(r.dir, "desktop_first.png")}"><figcaption>Desktop first viewport</figcaption></figure>
              <figure><img src="${shot(r.dir, "mobile_first.png")}"><figcaption>Mobile first viewport</figcaption></figure>
            </div>
          </article>`).join("\n")}
      </div>
    </section>

    <section>
      <h2>推荐迭代路径</h2>
      <ul>
        <li>以 <strong>左右布局 / 不规则</strong> 为主视觉和首页基础，保留左文案 + 右品牌装置 + 下方产品模块露出的结构。</li>
        <li>保留 <strong>同心圆</strong> 作为稳健版 A/B 测试：如果目标客户更偏传统 B2B，它可能转化更稳。</li>
        <li>从 <strong>F-LOGO</strong> 借产品截图质量、客户证明和更明确的产品证据模块。</li>
        <li>从 <strong>多页完整站</strong> 借信息架构：产品页、定价页、联系我们、供应商/调查站/管理后台分页面；不要借当前视觉系统。</li>
        <li>放弃 <strong>S-LOGO-上</strong> 当前首屏结构：Logo 太强，产品价值主张来得太晚。可只保留 Logo 资产。</li>
      </ul>
    </section>

    <section>
      <h2>与 Claude 报告的差异</h2>
      <ul>
        <li>一致：DEMO 6 仍是第一，且适合作为主迭代基础。</li>
        <li>调整：DEMO 1 从第二降到第七。原因不是内容少，而是真实页面有断图、低对比中段、移动端横向溢出迹象，视觉完成度不足。</li>
        <li>调整：DEMO 7 升到第二。真实渲染看，它和 DEMO 6 共用成熟结构，风险更低。</li>
        <li>调整：DEMO 5 高于 DEMO 4。DEMO 4 的大 Logo 首屏结构在真实视口中压低 H1，信息层级更差。</li>
      </ul>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(reportPath, html, "utf8");
console.log(JSON.stringify({ report: reportPath, rows: rows.length }, null, 2));
