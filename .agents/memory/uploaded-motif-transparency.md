---
name: Uploaded motif transparency
description: Handling supplied decorative PNGs that visually show transparency but contain a baked checkerboard.
---

Supplied PNGs can show a transparency checkerboard while actually being opaque RGB images. Before using one as a cutout, isolate the artwork into alpha and test it composited over the target surface. When the checker is neutral and the subject is colored, a guarded chroma mask can work better than guessing the checker tile dimensions; a periodic-pattern mask may leave visible grid artifacts.

**Why:** Keeping the source PNG unchanged makes the checkerboard appear in the design. A locally inferred checker grid can be slightly irregular or resampled and leave visible residual squares, while a chroma-based mask removed a neutral checker cleanly from a saturated illustrated portrait.

**How to apply:** Inspect the image for an alpha channel first. Derive opacity from color-vs-neutral difference when the subject/background contrast supports it; protect dark subject pixels with a brightness guard, then inspect the alpha and composite over the actual target color. Do not trust a transparent preview alone.