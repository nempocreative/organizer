---
name: Nempo Feed responsive export scaling
description: Preserve responsive preview layout and visual proportions in high-resolution Nempo Feed PNG exports.
---

For responsive Nempo Feed artwork, capture at its current rendered DOM size and scale the raster to the 3× target. Avoid forcing a larger CSS canvas size during DOM capture; it can change responsive overlays, type, and top badges relative to the preview. Preserve font embedding, then inspect the actual downloaded PNG.

**Why:** Slide 30's fixed-canvas export visibly changed its header and badge proportions compared with the active preview, despite producing the expected pixel dimensions.

**How to apply:** derive the capture scale from the artwork element's rendered width and target output width, then verify 3240 × 4320 output and compare it to the preview at the same viewport.
