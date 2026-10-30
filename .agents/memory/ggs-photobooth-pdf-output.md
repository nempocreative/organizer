---
name: GGS photobooth print output
description: Custom-size PDF printing for the 3 × 2 m GGS Beauty backdrop.
---

**Rule:** Print the photobooth backdrop as one landscape 3000 × 2000 mm PDF page. Keep text as HTML/vector and preserve the original background artwork. For a matching digital PNG, render the 3:2 crop at 3× the 4096-pixel source width; don't describe that as 300 DPI or extra photographic detail.

**Why:** The 4096-pixel source is about 35 PPI across a 3 m print, so the large-format PDF cannot honestly claim the voucher's 300 DPI. A 3× PNG gives the matching composition a high-resolution digital export, but upscaling does not add source detail. Chromium honors the named custom page size when it is assigned to an in-flow wrapper; a fixed-position wrapper can fall back to Letter or split pages.

**How to apply:** Set the named `@page` dimensions and `page` property on a static print wrapper, normalize the app's parent layout, and wait for fonts/images before printing. Verify the generated PDF's physical page size, page count, embedded image resolution, and vector text. If the backdrop needs more detail, replace the source art with a higher-resolution image rather than merely enlarging it.
