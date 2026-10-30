---
name: Nempo Feed aspect-ratio previews
description: Keep current 3:4 (1080 × 1440) feed artwork intact in variable-size previews.
---

Preserve the artwork's 3:4 ratio (1080 × 1440) and scale it to fit the available preview dimensions. Use a contrasting surrounding background so letterboxing does not visually merge with the poster or look like part of the artwork.

**Why:** The user specified 1080 × 1440 px as the current Nempo feed size; a short preview can crop its edges, while filling the preview with black makes the whole screen look like one large dark block.

**How to apply:** When a Nempo Feed slide is shown in a variable-size iframe or mobile preview, constrain the poster by both viewport width and height, retain its 3:4 aspect ratio, and choose an outer background that separates it from the poster.
