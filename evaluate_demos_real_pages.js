const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const root = __dirname;
const packRoot = path.join(root, "AI网页评估包");
const outRoot = path.join(root, "真实页面评估输出");
const shotRoot = path.join(outRoot, "screenshots");
const chromePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const demos = [
  {
    id: "01",
    label: "完整多页站 / 测试代码4(2)",
    entry: path.join(packRoot, "demos", "01_完整多页站_测试代码4(2)", "测试代码4", "首页.html"),
  },
  {
    id: "02",
    label: "极简 / F-LOGO",
    entry: path.join(packRoot, "demos", "02_极简_F-LOGO", "fensvyg_fixed_v4", "index.html"),
  },
  {
    id: "03",
    label: "极简 / 原LOGO",
    entry: path.join(packRoot, "demos", "03_极简_原LOGO", "surveysaas_v29_logo_restored", "surveysaas_v30_upgraded.html"),
  },
  {
    id: "04",
    label: "科技 / S-LOGO-上",
    entry: path.join(packRoot, "demos", "04_科技_S-LOGO-上", "surveysaas_v50_clean_accessible_responsive", "surveysaas_v50_clean_accessible_responsive", "surveysaas_v30_upgraded.html"),
  },
  {
    id: "05",
    label: "科技 / S-logo-下",
    entry: path.join(packRoot, "demos", "05_科技_S-logo-下", "surveysaas_v38_refined_flow_and_flyin (2)", "surveysaas_v38_refined_flow_and_flyin", "surveysaas_v38_refined_flow_and_flyin", "surveysaas_v30_upgraded.html"),
  },
  {
    id: "06",
    label: "左右布局 / 不规则",
    entry: path.join(packRoot, "demos", "06_左右布局_不规则", "surveysaas_v66_doubled_outward_locked_orbit", "index.html"),
  },
  {
    id: "07",
    label: "左右布局 / 同心圆",
    entry: path.join(packRoot, "demos", "07_左右布局_同心圆", "surveysaas_v63_concentric_orbit_stories_rectified", "index.html"),
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000, scale: 1, mobile: false },
  { name: "mobile", width: 390, height: 844, scale: 2, mobile: true },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function fileUrl(filePath) {
  return new URL(`file://${path.resolve(filePath).replace(/\\/g, "/")}`).href;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function waitForChrome(port) {
  for (let i = 0; i < 80; i++) {
    try {
      return await httpJson(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome remote debugging endpoint did not start");
}

let msgId = 0;
function cdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    ws.onopen = () => {
      resolve({
        send(method, params = {}) {
          const id = ++msgId;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((res, rej) => pending.set(id, { res, rej, method }));
        },
        close() {
          ws.close();
        },
      });
    };
    ws.onerror = reject;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const item = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) item.rej(new Error(`${item.method}: ${JSON.stringify(msg.error)}`));
        else item.res(msg.result);
      }
    };
  });
}

async function evaluateExpression(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result?.value;
}

async function capture(client, vp, outFile, scrollY) {
  await evaluateExpression(client, `window.scrollTo(0, ${Math.max(0, Math.floor(scrollY))}); new Promise(r => setTimeout(r, 260));`);
  const shot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  fs.writeFileSync(outFile, Buffer.from(shot.data, "base64"));
}

async function processPage(browserPort, demo) {
  const targetInfo = await httpJson(`http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent("about:blank")}`, "PUT");
  const client = await cdp(targetInfo.webSocketDebuggerUrl);
  const demoOut = path.join(shotRoot, `${demo.id}_${demo.label.replace(/[\\/:*?"<>|]/g, "_")}`);
  ensureDir(demoOut);
  const result = {
    id: demo.id,
    label: demo.label,
    entry: demo.entry,
    exists: fs.existsSync(demo.entry),
    title: "",
    h1: "",
    bodyTextSample: "",
    brokenImages: 0,
    linkCount: 0,
    imageCount: 0,
    dimensions: {},
    screenshots: [],
    errors: [],
  };
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    for (const vp of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.scale,
        mobile: vp.mobile,
      });
      await client.send("Emulation.setTouchEmulationEnabled", { enabled: vp.mobile });
      await client.send("Page.navigate", { url: fileUrl(demo.entry) });
      await sleep(1300);
      await evaluateExpression(client, "document.fonts && document.fonts.ready ? document.fonts.ready : true");
      await sleep(300);
      const metrics = await evaluateExpression(
        client,
        `(() => {
          const doc = document.documentElement, body = document.body;
          const imgs = [...document.images];
          return {
            title: document.title || "",
            h1: (document.querySelector("h1")?.innerText || "").trim(),
            bodyTextSample: (document.body?.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 600),
            scrollHeight: Math.max(doc.scrollHeight, body ? body.scrollHeight : 0),
            scrollWidth: Math.max(doc.scrollWidth, body ? body.scrollWidth : 0),
            viewportWidth: innerWidth,
            viewportHeight: innerHeight,
            brokenImages: imgs.filter(img => !img.complete || img.naturalWidth === 0).length,
            imageCount: imgs.length,
            linkCount: document.links.length,
            navText: ([...document.querySelectorAll("nav, header")].map(e => e.innerText).join(" | ")).replace(/\\s+/g, " ").trim().slice(0, 500)
          };
        })()`
      );
      if (!result.title) result.title = metrics.title;
      if (!result.h1) result.h1 = metrics.h1;
      if (!result.bodyTextSample) result.bodyTextSample = metrics.bodyTextSample;
      result.brokenImages = Math.max(result.brokenImages, metrics.brokenImages);
      result.linkCount = Math.max(result.linkCount, metrics.linkCount);
      result.imageCount = Math.max(result.imageCount, metrics.imageCount);
      result.dimensions[vp.name] = metrics;
      const points = [
        ["first", 0],
        ["middle", Math.max(0, (metrics.scrollHeight - vp.height) * 0.45)],
        ["bottom", Math.max(0, metrics.scrollHeight - vp.height)],
      ];
      for (const [name, y] of points) {
        const outFile = path.join(demoOut, `${vp.name}_${name}.png`);
        await capture(client, vp, outFile, y);
        result.screenshots.push({ viewport: vp.name, position: name, path: outFile });
      }
    }
  } catch (err) {
    result.errors.push(String(err.stack || err.message || err));
  } finally {
    client.close();
  }
  return result;
}

function renderContactSheet(results) {
  const cells = [];
  for (const r of results) {
    const first = r.screenshots.find((s) => s.viewport === "desktop" && s.position === "first");
    const mobile = r.screenshots.find((s) => s.viewport === "mobile" && s.position === "first");
    cells.push(`
      <article>
        <h2>${r.id}. ${r.label}</h2>
        <p>${escapeHtml(r.title)} · H1: ${escapeHtml(r.h1)}</p>
        <div class="pair">
          <figure><img src="${path.relative(outRoot, first.path).replace(/\\/g, "/")}"><figcaption>Desktop first viewport</figcaption></figure>
          <figure><img src="${path.relative(outRoot, mobile.path).replace(/\\/g, "/")}"><figcaption>Mobile first viewport</figcaption></figure>
        </div>
      </article>
    `);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#101826;color:#eaf1fb;font-family:Arial,"Microsoft YaHei",sans-serif}
    main{width:1800px;margin:0 auto;padding:28px}
    h1{font-size:34px;margin:0 0 24px}
    article{break-inside:avoid;background:#172033;border:1px solid #2a3a58;border-radius:12px;padding:18px;margin:0 0 22px}
    h2{font-size:22px;margin:0 0 6px}
    p{color:#9db0c8;margin:0 0 12px}
    .pair{display:grid;grid-template-columns:1fr 360px;gap:16px;align-items:start}
    figure{margin:0;background:#fff;border-radius:8px;overflow:hidden}
    img{display:block;width:100%;height:auto}
    figcaption{background:#0f1727;color:#aab7c8;padding:8px;font-size:13px}
  </style></head><body><main><h1>7 个 DEMO 真实首屏对照</h1>${cells.join("\n")}</main></body></html>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  rmDir(outRoot);
  ensureDir(shotRoot);
  const profile = path.join(outRoot, "chrome-profile");
  const port = 9223 + Math.floor(Math.random() * 1000);
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ], { stdio: "ignore" });
  try {
    await waitForChrome(port);
    const results = [];
    for (const demo of demos) {
      results.push(await processPage(port, demo));
    }
    fs.writeFileSync(path.join(outRoot, "page_observations.json"), JSON.stringify(results, null, 2), "utf8");
    fs.writeFileSync(path.join(outRoot, "contact_sheet.html"), renderContactSheet(results), "utf8");

    const contactTarget = await httpJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(fileUrl(path.join(outRoot, "contact_sheet.html")))}`, "PUT");
    const client = await cdp(contactTarget.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await sleep(1200);
    await client.send("Emulation.setDeviceMetricsOverride", { width: 1800, height: 5200, deviceScaleFactor: 1, mobile: false });
    await sleep(200);
    const shot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true });
    const contactPng = path.join(outRoot, "contact_sheet.png");
    fs.writeFileSync(contactPng, Buffer.from(shot.data, "base64"));
    client.close();

    console.log(JSON.stringify({
      output: outRoot,
      observations: path.join(outRoot, "page_observations.json"),
      contactSheet: contactPng,
      demos: results.length,
      screenshots: results.reduce((n, r) => n + r.screenshots.length, 0),
      errors: results.flatMap(r => r.errors).length,
    }, null, 2));
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
