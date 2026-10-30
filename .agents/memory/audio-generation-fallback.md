---
name: Audio generation fallback
description: Local audio fallback for projects where hosted sound-generation callbacks are unavailable.
---

When hosted sound-generation is unavailable, a usable announcement can still be assembled locally with `espeak-ng` for speech and `ffmpeg` for ambience, chimes, horns, timing, and mixing.

**Why:** Audio generation callbacks may be unavailable in the current workspace mode, but the product can still ship a playable asset without adding an external integration.

**How to apply:** Prefer the hosted generator when available for natural voices; otherwise use a local Indonesian voice variant, keep the final MP3 around 12–18 seconds, and verify duration plus the copied build asset.