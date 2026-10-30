---
name: Halloween pitch deck print layout
description: Print CSS for the nested proposal deck must preserve the full multi-page 16:9 flow.
---

For the Halloween pitch deck, keep print mode in normal document flow: render the proposal with a minimal Layout chrome mode, keep the proposal page static with auto height, and make each slide a fixed 13.333in × 7.5in page with explicit page-break fallbacks.

**Why:** Making the body or proposal page a fixed single-slide height caused Chromium PDF output to contain only the first slide.

**How to apply:** When changing print styles, validate a headless PDF has 22 pages at 960 × 540 pt, check the first/last slide markers, and confirm no site chrome text appears in extracted PDF text.