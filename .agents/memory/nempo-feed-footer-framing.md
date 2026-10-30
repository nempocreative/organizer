---
name: Nempo feed footer framing
description: The compact Instagram feed footer uses a short viewport crop for its landscape and mascot artwork.
---

Keep generated footer artwork, especially the otter, fully inside the lower horizontal band rather than placing the subject tall in the square source image.

**Why:** the compact footer uses `object-cover` inside a 23% page-height container, so a square image exposes only a narrow vertical slice; a tall subject can lose its head or feet even when the source PNG looks correct.

**How to apply:** ask image generation to concentrate the illustration in the bottom quarter or adjust `object-position` only after checking the rendered feed preview.