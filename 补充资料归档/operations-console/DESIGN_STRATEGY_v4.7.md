# SurveySaaS v4.7 Refinement Strategy

## 0. Positioning

v4.7 is not a redesign. It is a refinement pass on top of v4.6.

The current direction — dark operations console, live survey supply routing, restrained control-room signals — is valid and should be preserved. The goal is to make the page feel more credible, more coherent, and more production-ready without resetting the visual identity.

## 1. Design goals

### 1.1 Preserve the core identity

Keep the following direction unchanged:

- Deep navy operations-console atmosphere.
- Cyan as the primary signal color.
- Lime / amber used only for live, warning, or success states.
- IBM Plex Sans + JetBrains Mono system.
- B2B SaaS credibility over decorative spectacle.
- Hero console as the primary memory point.

Do not convert the page into a white Apple-style SaaS page for this iteration. That would be a direction reset, not a v4.7 refinement.

### 1.2 Improve hierarchy, not motion quantity

The issue is not that the page has too much visible motion. Most motion is already subtle. The issue is that multiple small animations express similar “live operations” meaning at the same time.

v4.7 should clarify motion responsibility:

- Hero console = primary motion focus.
- Workflow line = secondary process confirmation.
- Ticker / node pulses = tertiary background telemetry.

### 1.3 Increase credibility

Any claim that could trigger enterprise buyer scrutiny should be phrased conservatively unless it is already factually supported.

Prefer:

- “SOC 2-aligned controls” over “SOC 2 Type II”.
- “GDPR / DPDP workflows” over absolute coverage claims.
- “Priority SLA support” over precise SLA numbers unless contractually guaranteed.

## 2. v4.7 priority fixes

### 2.1 Ribbon / audience strip

Current problem: the ribbon sits between hero and modules but does not clearly belong to either section. It feels like a thin annotation rather than an audience-confidence strip.

Fix direction:

- Move it visually closer to the hero.
- Increase vertical padding slightly.
- Convert the four audience labels into light segmented chips.
- Keep it subtle; do not turn it into a heavy logo wall.
- It should read as “who this platform is for,” not as a random divider.

### 2.2 Project / region / feed coherence

Current problem: project IDs rotate across IN+UK, US+DE and APAC, but some feed messages still reference fixed IN / UK markets.

Fix direction:

- Each project should define its own market metadata: primary source, fallback source, settlement partner label.
- Route, QC and settlement feed rows must derive from the current project.
- Node highlights must follow the active project region.
- Default nodes should be neutral. Only current-stage nodes should light up.

### 2.3 Motion hierarchy

Hero remains the strongest animated area.

Workflow should remain animated, but visually secondary:

- Slower cycle.
- Lower glow strength.
- Smaller head dot.
- No active-card lift that forces canvas re-measure and creates line detachment risk.

Ticker and node pulse should be background telemetry:

- Slower ticker speed.
- Neutral inactive nodes.
- Pulse only on stage-relevant nodes.

### 2.4 Performance guardrails

Avoid measuring DOM layout every animation frame.

Workflow canvas should:

- Measure card positions on load, resize, or ResizeObserver changes.
- Use cached routes while drawing animation frames.
- Avoid transform-based card lift if the canvas line is expected to remain attached to card borders.

### 2.5 Link and production-readiness cleanup

- Remove internal version strings from footer.
- Avoid 404-style placeholder links in the demo.
- Add basic favicon / OG / Twitter metadata.
- Add skip-to-content for keyboard accessibility.

## 3. Implementation constraints

Do not:

- Change the overall color direction.
- Replace the hero concept.
- Add new decorative motion.
- Add a new visual gimmick to solve a hierarchy problem.
- Expand the page into a multi-page site in this iteration.
- Make unsupported compliance promises.

Do:

- Fix coherence.
- Strengthen trust.
- Reduce accidental visual competition.
- Preserve the operations-console identity.
- Keep the page as a single-file demo until the direction is approved.

## 4. Success criteria

A v4.7 candidate can be considered successful if:

1. Ribbon no longer feels like a floating annotation.
2. Project region, node status, feed messages and settlement copy remain coherent across all three rotating projects.
3. Hero is clearly the primary motion area.
4. Workflow animation remains visible but secondary.
5. Inactive supplier nodes are visually neutral.
6. No internal version number appears in the final page UI.
7. Compliance and SLA claims are conservative enough for an early B2B SaaS website.
8. The page still feels like the same v4.6 direction, only more refined.

## 5. Version roadmap

### v4.7-alpha

Purpose: structural and credibility pass.

Scope:

- Ribbon redesign.
- Region/feed/node coherence.
- Compliance copy softening.
- Footer cleanup.
- Fake link handling.
- Basic meta / favicon / skip link.

### v4.7-beta

Purpose: motion and performance pass.

Scope:

- Cache workflow canvas measurements.
- Remove card lift or rework it without breaking border attachment.
- Tune ticker speed.
- Tune glow strength.
- Screenshot test at desktop and tablet widths.

### v4.7-release

Purpose: candidate approval pass.

Scope:

- Visual review against v4.6.
- Confirm no regression in hero quality.
- Confirm mobile readability.
- Confirm no unsupported claims remain.
- Decide whether to promote the file into the official demo index.

## 6. Risk analysis

### Risk: over-correcting motion

The page should not become static. v4.7 should clarify motion hierarchy, not remove liveliness.

### Risk: losing product-demo energy

The hero console is the strongest part of the direction. Do not flatten it while fixing workflow or ticker motion.

### Risk: visual regression while fixing logic

Region/feed/node fixes must not change unrelated layout modules.

### Risk: credibility overclaim

Security, privacy and SLA copy must remain conservative until actual certifications, legal docs and support guarantees are available.

## 7. Working rule for future iterations

When modifying this page, use this decision order:

1. Does the change preserve the dark operations-console identity?
2. Does it make the product story more coherent?
3. Does it improve trust without unsupported claims?
4. Does it preserve hero as the primary motion focus?
5. Does it avoid breaking earlier successful visual details?

If a change fails any of the above, it should not enter v4.7.
