---
name: Circular logo transparency
description: Remove a white image matte from circular logos that reach the canvas edges without erasing the emblem's enclosed light fill.
---

For circular logos whose ring touches the source image at the top, bottom, left, and right, the exterior white matte can be split into four disconnected corner regions. Remove edge-connected background from all four corners rather than only one seed or by globally keying white. Preserve enclosed white areas that belong to the badge.

**Why:** A one-corner flood fill left three white corners visible as a square, while global white removal would damage the light interior of the logo.

**How to apply:** When preparing similar circular logos for dark backgrounds, check all four corner alpha values and inspect the scaled result before replacing the in-app asset.
