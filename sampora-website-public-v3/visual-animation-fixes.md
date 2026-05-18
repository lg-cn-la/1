# Sampora Visual and Animation Fixes

Generated: 2026-05-18

Source folder: `sampora-website-public-v3/`

## Scope

This report records visual, navigation, topology, workflow, modal, and accessibility evidence for the public source package. Package E did not edit runtime HTML, CSS, JavaScript, assets, QA scripts, or archives.

## Browser Evidence

- `node qa-evidence/page-layer-browser-check.mjs`: status `PASS`, failures `[]`, screenshots `42`
- Evidence JSON: `qa-evidence/page-layer-browser-evidence.json`
- `node qa-evidence/resource-manuals-browser-language-check.mjs`: `resource manuals browser language check: OK`
- Resource manual evidence JSON: `qa-evidence/resource-manuals-browser-language-evidence.json`
- `node qa-evidence/lighthouse-axe-check.mjs`: status `PASS`, axe violations `8`, blocking axe violations `0`

The in-app Browser file URL attempt was blocked by policy. The Playwright-based checks above are the browser evidence for this source package.

## Workflow Evidence

`qa-evidence/page-layer-browser-evidence.json` records homepage workflow samples at 0 ms, 1000 ms, 3000 ms, and 6000 ms:

- 0 ms: Step 01 `relay-running`, Step 02 `relay-receive`
- 1000 ms: Step 02 `relay-running`, Step 03 `relay-receive`
- 3000 ms: Step 03 `relay-running`, Step 04 `relay-receive`
- 6000 ms: loop returns to Step 01 `relay-running`, Step 02 `relay-receive`

## Topology Evidence

`qa-evidence/page-layer-browser-evidence.json` records active topology animation samples for `index.html`, `solutions.html`, and `resources.html`.

- `index.html`: active flow count `8`, `flowAnimationName` `topoDash`, `scanAnimationName` `topoScan`, offset changes from `-18.0182px` at 0 ms to `-12.7196px` at 1000 ms, packet opacity `0.75`.
- `solutions.html`: active flow count `3`, `flowAnimationName` `topoDash`, `scanAnimationName` `topoScan`, offset changes from `-14.676px` at 0 ms to `-9.38px` at 1000 ms, packet opacity `0.85`.
- `resources.html`: active flow count `3`, `flowAnimationName` `topoDash`, `scanAnimationName` `topoScan`, offset changes from `-11.7765px` at 0 ms to `-5.10229px` at 1000 ms.

The screenshot set includes `index-workflow-1440.png`, `topology-index-1440.png`, `topology-solutions-1440.png`, and `topology-resources-1440.png`.

## Other Covered Areas

- Sticky navigation is included in the page-layer browser run across canonical pages and viewport widths.
- Modal close controls use stable `X` text in source and remain protected from language sweep behavior.
- The Sampora `S` product mark remains present in the topology/core UI.
- Mobile and desktop navigation screenshots cover widths including 390, 1440, 1536, and 1920.

## Accessibility Evidence

`node qa-evidence/lighthouse-axe-check.mjs` reports status `PASS`, axe violations `8`, and blocking axe violations `0`. The remaining axe findings are non-blocking and should be reviewed during the next design/accessibility pass.

