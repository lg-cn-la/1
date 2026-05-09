$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$outerZip = Join-Path $root "网页.zip"
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$work = Join-Path $root ".ai_review_pack_work_$stamp"
$outer = Join-Path $work "outer"
$extract = Join-Path $work "extract"
$pack = Join-Path $root "AI网页评估包"
$demosOut = Join-Path $pack "demos"
$zipOut = Join-Path $root "AI网页评估包.zip"

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Web

function New-Dir($p) {
  if (!(Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

function Clean-Dir($p) {
  if (Test-Path -LiteralPath $p) { Remove-Item -LiteralPath $p -Recurse -Force }
  New-Dir $p
}

function Escape-Html($s) {
  if ($null -eq $s) { return "" }
  return [System.Web.HttpUtility]::HtmlEncode([string]$s)
}

function Clean-Text($s) {
  if ($null -eq $s) { return "" }
  $x = [regex]::Replace([string]$s, "<script[\s\S]*?</script>", " ", "IgnoreCase")
  $x = [regex]::Replace($x, "<style[\s\S]*?</style>", " ", "IgnoreCase")
  $x = [regex]::Replace($x, "<[^>]+>", " ")
  $x = [System.Web.HttpUtility]::HtmlDecode($x)
  return ([regex]::Replace($x, "\s+", " ").Trim())
}

function First-Match($text, $pattern) {
  $m = [regex]::Match($text, $pattern, "IgnoreCase,Singleline")
  if ($m.Success) { return Clean-Text $m.Groups[1].Value }
  return ""
}

function Rel-Path($base, $target) {
  $b = (Resolve-Path -LiteralPath $base).Path
  $t = (Resolve-Path -LiteralPath $target).Path
  if (!$b.EndsWith([IO.Path]::DirectorySeparatorChar)) { $b += [IO.Path]::DirectorySeparatorChar }
  $u1 = [Uri]::new($b)
  $u2 = [Uri]::new($t)
  return [Uri]::UnescapeDataString($u1.MakeRelativeUri($u2).ToString()).Replace("/", "\")
}

function Copy-WithParents($src, $fromRoot, $toRoot) {
  if (!(Test-Path -LiteralPath $src)) { return }
  $rel = Rel-Path $fromRoot $src
  $dst = Join-Path $toRoot $rel
  New-Dir (Split-Path -Parent $dst)
  Copy-Item -LiteralPath $src -Destination $dst -Force
}

function Get-LocalRefs($html) {
  $refs = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in [regex]::Matches($html, '(?:src|href|data-src)=["'']([^"'']+)["'']', "IgnoreCase")) {
    [void]$refs.Add($m.Groups[1].Value)
  }
  foreach ($m in [regex]::Matches($html, 'url\(([^)]+)\)', "IgnoreCase")) {
    $v = $m.Groups[1].Value.Trim(" ", "'", '"')
    [void]$refs.Add($v)
  }
  return $refs
}

function Should-SkipRef($ref) {
  if ([string]::IsNullOrWhiteSpace($ref)) { return $true }
  $r = $ref.Trim()
  if ($r.StartsWith("#")) { return $true }
  if ($r -match '^(https?:|mailto:|tel:|data:|javascript:)') { return $true }
  if ($r -match '\.(docx|doc|pdf|xlsx|pptx|zip|rar|7z)(\?|#|$)') { return $true }
  return $false
}

function Resolve-RefPath($htmlFile, $ref) {
  $clean = $ref.Split("#")[0].Split("?")[0]
  $clean = [Uri]::UnescapeDataString($clean)
  $clean = $clean -replace '/', '\'
  return [IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $htmlFile) $clean))
}

function Analyze-Html($htmlFile) {
  $raw = Get-Content -LiteralPath $htmlFile -Raw -Encoding UTF8
  return [ordered]@{
    file = $htmlFile
    title = First-Match $raw "<title[^>]*>([\s\S]*?)</title>"
    h1 = First-Match $raw "<h1[^>]*>([\s\S]*?)</h1>"
    html = $raw
  }
}

Clean-Dir $work
Clean-Dir $pack
New-Dir $outer
New-Dir $extract
New-Dir $demosOut

[IO.Compression.ZipFile]::ExtractToDirectory($outerZip, $outer)
$nested = @(Get-ChildItem -LiteralPath $outer -Recurse -File -Filter "*.zip" | Sort-Object FullName)

$rows = @()
$demoIndex = 0
foreach ($zip in $nested) {
  $demoIndex++
  $category = Split-Path -Leaf (Split-Path -Parent $zip.FullName)
  if ($category -eq "网页") { $category = "完整多页站" }
  $name = [IO.Path]::GetFileNameWithoutExtension($zip.Name)
  $safeName = ("{0:00}_{1}_{2}" -f $demoIndex, $category, $name) -replace '[\\/:*?"<>|]', '_'
  $demoExtract = Join-Path $extract $safeName
  $demoTarget = Join-Path $demosOut $safeName
  New-Dir $demoExtract
  New-Dir $demoTarget
  [IO.Compression.ZipFile]::ExtractToDirectory($zip.FullName, $demoExtract)

  $htmlFiles = @(Get-ChildItem -LiteralPath $demoExtract -Recurse -File | Where-Object { $_.Extension -match '^\.(html|htm)$' } | Sort-Object FullName)
  $pages = @()
  $copied = New-Object System.Collections.Generic.HashSet[string]
  foreach ($hf in $htmlFiles) {
    $info = Analyze-Html $hf.FullName
    $pages += $info
    Copy-WithParents $hf.FullName $demoExtract $demoTarget
    [void]$copied.Add((Resolve-Path -LiteralPath $hf.FullName).Path.ToLowerInvariant())

    foreach ($ref in Get-LocalRefs $info.html) {
      if (Should-SkipRef $ref) { continue }
      $rp = Resolve-RefPath $hf.FullName $ref
      if (Test-Path -LiteralPath $rp -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($rp).ToLowerInvariant()
        if ($ext -match '^\.(png|jpg|jpeg|webp|svg|gif|css|js|woff|woff2|ttf|otf)$') {
          Copy-WithParents $rp $demoExtract $demoTarget
          [void]$copied.Add((Resolve-Path -LiteralPath $rp).Path.ToLowerInvariant())
        }
      }
    }
  }

  $entry = $null
  $entryCandidates = @($pages | Where-Object { (Split-Path -Leaf $_.file) -match 'index|首页|home' })
  if ($entryCandidates.Count -gt 0) { $entry = $entryCandidates[0] } elseif ($pages.Count -gt 0) { $entry = $pages[0] }
  $entryRel = ""
  if ($entry) {
    $entryRel = ("demos/" + (Rel-Path $demosOut $entry.file).Replace("\","/"))
    $entryRel = "demos/" + (Rel-Path $demoExtract $entry.file).Replace("\","/")
    $entryRel = "demos/$safeName/" + (Rel-Path $demoExtract $entry.file).Replace("\","/")
  }
  $assetCount = @(Get-ChildItem -LiteralPath $demoTarget -Recurse -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp|svg|gif|css|js|woff|woff2|ttf|otf)$' }).Count
  $pageTitles = @($pages | ForEach-Object {
    $t = if ($_.title) { $_.title } else { Split-Path -Leaf $_.file }
    $h = if ($_.h1) { " / H1: $($_.h1)" } else { "" }
    "$t$h"
  })
  $rows += [ordered]@{
    index = $demoIndex
    category = $category
    name = $name
    safe = $safeName
    entry = $entryRel
    pages = $pages.Count
    assets = $assetCount
    titles = $pageTitles
  }
}

$claudeRank = @(
  "1. 左右布局 / 不规则：视觉完成度最高，首屏冲击力强，最适合作为主迭代方向。",
  "2. 测试代码4(2) 多页完整站：信息架构最完整，适合作为内容骨架。",
  "3. 左右布局 / 同心圆：更稳定可信，适合作为 A/B 测试备选。",
  "4. 科技 / S-LOGO-上：响应式与标准 SaaS 感更稳。",
  "5. 科技 / S-logo-下：动效方向有潜力，但与上版差异不足。",
  "6. 极简 / F-LOGO：干净国际化，但记忆点弱。",
  "7. 极简 / 原LOGO：适合作为基准参考，不建议作为主方向。"
)

$cards = ""
foreach ($r in $rows) {
  $titleItems = ($r.titles | ForEach-Object { "<li>$(Escape-Html $_)</li>" }) -join "`n"
  if (!$titleItems) { $titleItems = "<li>未提取到 HTML 页面标题。</li>" }
  $cards += @"
      <article class="demo-card">
        <div class="demo-top">
          <span>DEMO $($r.index)</span>
          <b>$(Escape-Html "$($r.category) / $($r.name)")</b>
        </div>
        <p>页面数：$($r.pages) · 已保留网页引用资源：$($r.assets)</p>
        <ul>$titleItems</ul>
        <a class="open-btn" href="$(Escape-Html $r.entry)" target="_blank">打开实际 DEMO</a>
      </article>
"@
}

$rankItems = ($claudeRank | ForEach-Object { "<li>$(Escape-Html $_)</li>" }) -join "`n"

$entryHtml = @"
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI 网页评估入口</title>
  <style>
    :root { --bg:#0b1020; --panel:#121a2b; --card:#172033; --line:#263550; --text:#eef4ff; --muted:#8fa2ba; --blue:#4f9cff; --green:#26d0aa; --gold:#ffd166; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:"Microsoft YaHei", "PingFang SC", Arial, sans-serif; line-height:1.7; }
    header { padding:46px 5vw 34px; background:linear-gradient(135deg,#0b1020,#10264a); border-bottom:1px solid var(--line); }
    main { width:min(1280px,94vw); margin:24px auto 54px; }
    h1 { margin:0 0 10px; font-size:34px; }
    h2 { margin:0 0 12px; font-size:23px; }
    p { color:var(--muted); margin:8px 0; }
    section { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:22px; margin:18px 0; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:14px; }
    .demo-card { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:16px; }
    .demo-top span { display:block; color:var(--green); font-size:12px; font-weight:800; letter-spacing:.06em; }
    .demo-top b { display:block; font-size:18px; margin:2px 0 8px; }
    ul { padding-left:20px; color:#cdd9ea; }
    li { margin:5px 0; }
    .open-btn { display:inline-block; margin-top:10px; padding:8px 12px; border-radius:6px; background:var(--blue); color:white; text-decoration:none; font-weight:800; }
    .notice { border-color:rgba(255,209,102,.45); background:rgba(255,209,102,.08); color:#ffe1a0; }
    .notice p { color:#ffe1a0; }
    code { background:#0d1424; border:1px solid var(--line); border-radius:5px; padding:2px 5px; }
  </style>
</head>
<body>
  <header>
    <h1>AI 网页评估入口</h1>
    <p>这个包是从原始 <code>网页.zip</code> 精简出来的：保留实际网页 HTML 和网页引用到的必要资源，移除了产品文档、原始嵌套 zip、未引用的大量资料文件。</p>
    <p>使用方法：先看下面的评估口径和 Claude 参考结论，再逐个点击“打开实际 DEMO”查看真实页面，最后基于真实页面重新评分。</p>
  </header>
  <main>
    <section class="notice">
      <h2>重要说明</h2>
      <p>不要只依据摘要下最终结论。网页设计最终要看真实 HTML：首屏、滚动节奏、模块连接、动效、导航状态和移动端表现都需要实际打开确认。</p>
    </section>
    <section>
      <h2>统一评估维度</h2>
      <ul>
        <li>品牌识别度：Logo、品牌名、视觉符号是否容易记住。</li>
        <li>视觉完成度：排版、色彩、间距、图片质量、模块一致性。</li>
        <li>信息层级：首屏主张、功能解释、产品证据和 CTA 是否顺畅。</li>
        <li>SaaS 产品可信度：是否传达专业、稳定、可交付、适合 B2B 决策。</li>
        <li>首屏吸引力：第一眼是否有记忆点，并能说明产品做什么。</li>
        <li>响应式/可读性风险：复杂图形、长文本、导航和卡片在小屏是否稳定。</li>
        <li>定位匹配度：是否匹配 FenSvyG / SurveySaaS 的调查分发、项目运营、供应商协同定位。</li>
      </ul>
    </section>
    <section>
      <h2>Claude 参考结论</h2>
      <p>这是参考，不是最终结论。最终评估应以实际打开页面后的观察为准。</p>
      <ol>$rankItems</ol>
    </section>
    <section>
      <h2>打开实际 DEMO</h2>
      <div class="grid">
$cards
      </div>
    </section>
    <section>
      <h2>建议给 AI 的最终评估提示词</h2>
      <p>请逐个打开本评估包里的 7 个 DEMO 页面，不要只看入口页摘要。打开每个页面后，观察首屏、滚动模块、导航、图片质量、动效和移动端适配，然后按统一评估维度输出综合排名、每个方案的优点/风险/适用场景，以及如果只能选一个作为后续迭代基础的推荐。</p>
    </section>
  </main>
</body>
</html>
"@

[IO.File]::WriteAllText((Join-Path $pack "评估入口.html"), $entryHtml, [Text.Encoding]::UTF8)

if (Test-Path -LiteralPath $zipOut) { Remove-Item -LiteralPath $zipOut -Force }
Compress-Archive -Path (Join-Path $pack "*") -DestinationPath $zipOut -CompressionLevel Optimal

$sourceSize = (Get-Item -LiteralPath $outerZip).Length
$packSize = (Get-Item -LiteralPath $zipOut).Length
$packFiles = @(Get-ChildItem -LiteralPath $pack -Recurse -File)
$docFiles = @($packFiles | Where-Object { $_.Extension -match '^\.(docx|doc|pdf|zip|rar|7z)$' })

[ordered]@{
  output = $zipOut
  outputBytes = $packSize
  sourceBytes = $sourceSize
  demos = $rows.Count
  filesInPack = $packFiles.Count
  removedDocsCheck = $docFiles.Count
  packageFolder = $pack
  tempWork = $work
} | ConvertTo-Json -Depth 4


