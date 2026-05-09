$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root ".skill_install_payload"
$dest = Join-Path $env:USERPROFILE ".codex\skills"
$skills = @("frontend-skill", "screenshot", "web-design-evaluator")

if (-not (Test-Path -LiteralPath $src)) {
  throw "Skill payload directory not found: $src"
}

if (-not (Test-Path -LiteralPath $dest)) {
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

foreach ($name in $skills) {
  $from = Join-Path $src $name
  $to = Join-Path $dest $name
  if (-not (Test-Path -LiteralPath $from)) {
    throw "Missing skill directory: $from"
  }
  if (Test-Path -LiteralPath $to) {
    Remove-Item -LiteralPath $to -Recurse -Force
  }
  Copy-Item -LiteralPath $from -Destination $to -Recurse -Force
  Write-Output "Installed: $name"
}

Write-Output ""
Write-Output "Done. Restart Codex to load the new skills."
