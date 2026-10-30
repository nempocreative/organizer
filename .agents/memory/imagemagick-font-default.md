---
name: ImageMagick default font
description: ImageMagick montage may not have a usable default font for annotations.
---

When ImageMagick montage fails with `unable to read font ''`, pass an explicit installed TTF path with `-font`, even when the composition has no visible labels.

**Why:** In this workspace, montage repeatedly failed with an empty default font, while supplying the DejaVu Sans font path worked.

**How to apply:** For contact sheets or other ImageMagick annotations in this environment, resolve an installed font (for example with `fc-match`) and pass its path explicitly.
