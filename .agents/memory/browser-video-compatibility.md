---
name: Browser video compatibility
description: Video codec compatibility for autoplay media in the Nempo web preview
---

Autoplay video assets used in the web preview should be encoded as H.264 MP4 with yuv420p, not only HEVC.

**Why:** The attached Midnight Mystery logo video was valid MP4/HEVC but Chromium preview could fall back to its poster without visibly playing it.

**How to apply:** When a user supplies an HEVC video for a web UI, create a browser-compatible H.264 rendition and use that rendition as the source while retaining the supplied file as the original.