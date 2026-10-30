---
name: Tion Feed export sizing
description: Keep exported Tion Feed posters aligned with their responsive preview.
---

Do not pass `width` or `height` to `html-to-image` for Tion Feed artwork. Those options resize the cloned poster container before capture, changing container-query (`cqi`) layout and shifting centered logos and titles away from the preview. `html-to-image` multiplies `canvasWidth` and `canvasHeight` by `pixelRatio`: the current 1080 × 1350 target with ratio 3 produces 3240 × 4050 PNGs. Keep these settings shared across slides so new exports match existing ones, and verify actual saved dimensions rather than inferring them from the canvas target.

**Why:** Forcing export viewport dimensions made the logo and headline shift toward the upper-left, while preview-sized capture keeps their placement correct. A browser download test also confirmed that the 1080 × 1350 canvas target is multiplied by the 3× pixel ratio.

**How to apply:** When changing Tion Feed exports, compare a downloaded PNG with the active slide preview, avoid resizing the root capture node, and use the preceding slide's actual downloaded PNG as the resolution baseline.
