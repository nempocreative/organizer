---
name: GGS Q Card PDF output
description: Print resolution, typography sizing, and page setup for GGS Q Card covers.
---

**Rule:** Print two 210 × 148.5 mm Q Card covers on one A4 page. Use a 300-DPI crop for the artwork and keep title/label text as vector HTML sized for the physical card, not the browser viewport. Keep the element that assigns the named print page in normal flow.

**Why:** The square 1024-pixel source becomes roughly 124 DPI when cropped to a half-A4 cover. `vw`-based type also shrinks in the print viewport, and a fixed-position page wrapper can make Chromium ignore the named page size and split the layout onto Letter pages.

**How to apply:** Preserve the current preview artwork and crop position; regenerate the print crop if the cover ratio or crop position changes. Keep print typography overrides proportional to the 210 mm card width, and verify the browser PDF is one A4 page with 300-DPI artwork and embedded vector text.
