---
name: Google image rendition limits
description: Google-hosted place photos can ignore requested size parameters and return a small rendition.
---

Google Maps/Google Photos URL parameters are not a guarantee that the returned bitmap has the requested dimensions. A URL requesting a large rendition may still return a 408px image, and the same visual photo can appear under a different host or URL.

**Why:** A square 408×408 hero source was being stretched across a wide desktop banner, causing visible blur; URL-based duplicate checks also cannot catch every cross-host representation of the same photo.

**How to apply:** Inspect the loaded image's natural dimensions before choosing a wide `object-cover` presentation. For small sources, preserve the image's aspect ratio and use a non-upscaling layout with a soft background. Shared Google Maps place-photo links embed the direct image after `!6s`; strip the following `!7i/!8i` metadata before storing, validate each extracted URL for a successful image response, then treat visual matching as separate from URL normalization when curating galleries.

For venue records that already have a Google Maps listing, prefer the direct `lh*.googleusercontent.com/gps-cs-s/...` photo URL returned by the Maps place result over third-party mirrors; keep existing gallery assets unless replacement coverage is complete.