---
name: GGS coupon PDF output
description: Print resolution, PDF size, and browser print behavior for repeated GGS coupon artwork.
---

**Rule:** For a print sheet with many identical coupon photos, compose the photo backgrounds once per sheet at 300 DPI and keep text and borders as vector HTML.

**Why:** Chromium/Skia can embed repeated per-coupon photos separately and create very large PDFs. A3 and A4 sheet composites preserved 300 DPI output and reduced the tested files to about 11 MB and 5.8 MB. Print styling can also hide every coupon if its visibility override is less specific than the global `body:has(...) *` rule.

**How to apply:** Keep full-sheet and final-sheet background variants aligned with the physical coupon grid; regenerate them if card dimensions, page margins, gaps, or page counts change. Wait for fonts and images to decode before printing, and keep the print visibility override at higher specificity than the global hide rule.
