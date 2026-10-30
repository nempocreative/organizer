---
name: News source image URLs
description: Official Garut press-release pages expose signed thumbnail URLs that are temporary and should not be persisted as article images.
---

When importing news from official Garut government press releases, keep the source article URL and omit the signed image URL unless a stable public asset URL is available. Serve the current image through the API proxy and persist the normalized WebP in `file_uploads`.

**Why:** The official image links are signed object-storage URLs with short expirations, so saving them makes article thumbnails fail later.

**How to apply:** Prefer a stable uploaded asset or leave `image` empty and use the source attribution; do not persist the signed URL copied from rendered page markup. Normalize remote photos to a bounded WebP before storing them, then serve the durable proxy path.