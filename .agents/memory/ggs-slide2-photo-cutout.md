---
name: GGS slide 2 photo cutout
description: Background removal constraints for the salon haircut photo used on GGS feed slide 2.
---

Do not remove the salon photo background with a simple color key or broad flood-fill. Its pale rose backdrop is too close to skin tones and fine details; local color-based masks create holes in the face, scissors, and hair edges. AI edits of transparent cutouts may flatten the background, bake in a checkerboard, or change the canvas dimensions/aspect ratio.

**Why:** A local ImageMagick cutout was visibly damaged. AI edits have flattened transparency before, and a later edit also changed the 1024×1536 cutout to a square image with a checkerboard baked into the pixels.

**How to apply:** Use a supplied transparent PNG or a proper segmentation tool when one is available. For any localized edit, verify dimensions, aspect ratio, silhouette, and alpha before use. Restore the source alpha only when the edited subject remains aligned to the original canvas; otherwise keep the original asset.
