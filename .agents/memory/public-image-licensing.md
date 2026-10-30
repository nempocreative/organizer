---
name: Public image licensing fallback
description: A practical fallback for sourcing real public photos when the image-search integration is unavailable.
---

When the image-search integration cannot run, Wikimedia Commons' API can locate reusable photos and return direct thumbnails, source pages, creator names, and license metadata. Save chosen images locally and include visible creator/license attribution with the source links.

**Why:** Image-search availability can depend on the current session, while Commons exposes reusable image metadata through its public API.

**How to apply:** Query Commons for destination-specific photos, inspect the actual image and its license details, then preserve the attribution and license wherever the image is used.