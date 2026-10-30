---
name: Cross-source photo duplicates
description: Duplicate detection for venue photos sourced from multiple image CDNs
---

Photo URLs are not reliable identities across sources. Google Maps and Wanderlog can serve the same venue photo through different hosts, renditions, compression, or delivery sizes.

**Why:** URL normalization and byte hashes can miss visually identical photos, allowing the same image to appear more than once in a venue gallery.

**How to apply:** Keep canonical URL checks for fast exact matches, and use a bounded perceptual image fingerprint when validating trusted external venue-photo URLs. Restrict remote verification to approved image hosts and use timeouts.