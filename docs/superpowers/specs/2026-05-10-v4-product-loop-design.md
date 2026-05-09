# V4 product loop design

## Goal

Create a new `operations console` iteration that keeps v3.5 as the main reference, but turns the hero from a static dashboard impression into a short-running product loop. The page should feel like a real survey supply system is actively routing traffic, catching QC issues, replacing blocked responses, and closing settlement.

## Strategic position

The direction remains:

> International SaaS legitimacy + operational density + product trust.

This version should not copy SRMG's cinematic brand-video pattern. For SurveySaaS, motion should look like software evidence: event stages, live routing, quota fill, QC hold, fraud block, replacement route, and settlement batch close.

## Page approach

Keep the file as a standalone HTML/CSS/JS demo so it remains easy for a future agent to open and compare. Preserve `09_v35_operations_console_hybrid.html` untouched, then create `11_v4_operations_console_product_loop.html` as the active iteration.

The hero will use:

- The existing dark navy console identity, cyan as the primary signal, amber only for warnings, and lime only for live/success.
- A new `live-runner` area inside the console window with four repeating stages: Launch, Route, QC, Settle.
- Realistic operations microcopy, not design-direction copy.
- CSS transform/opacity animations only, with a `prefers-reduced-motion` fallback.
- A small JavaScript loop that updates the active stage, current event label, completion count, QC queue, settlement amount, and stage progress.

## Success criteria

- First viewport still says clearly what the product is.
- Right-side visual reads as product UI, not an abstract brand film.
- Motion supports "the system is running" rather than feeling decorative.
- v3.5 remains available for direct comparison.
- Mobile layout stays readable and does not hide core CTA or make the console feel cramped.
