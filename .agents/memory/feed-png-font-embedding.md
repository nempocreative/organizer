---
name: Nempo Feed PNG font embedding
description: Preserve Google web fonts when rendering Nempo Feed artwork to PNG.
---

The Google Fonts stylesheet used by Nempo Feed must be CORS-enabled (`crossorigin="anonymous"`) for `html-to-image` to read its `cssRules` and embed the font faces. A CORS-blocked stylesheet can cause export-time security errors and fallback typography.

**Why:** the preview can display a loaded remote font while the export library still cannot inspect that stylesheet to copy the font data into the generated image.

**How to apply:** keep CORS enabled on the Google Fonts stylesheet link and confirm PNG exports complete without font-embedding errors.
