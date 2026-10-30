---
name: Nempo image optimization
description: Image-size and format boundaries for internal uploads, legacy media, and remote URLs.
---

Internal image uploads should be normalized to WebP with a 5 MB input limit, bounded dimensions, and a strict output-size target. Legacy database images can be converted lazily when served to avoid a risky bulk migration.

**Why:** Large user-supplied photos were a recurring page-speed risk, but arbitrary third-party image URLs cannot be reliably rewritten or converted without downloading and proxying the source.

**How to apply:** Keep upload and UI validation aligned. Apply provider-specific rendition limits only where the provider supports them (such as Google Images); use a dedicated image proxy for other remote sources before promising WebP delivery.

For print/PDF decks, photo-like PNGs should be converted to quality-controlled JPEG before embedding when transparency is not required.

**Why:** Browser-generated PDFs can retain large decoded raster payloads, making mobile PDF viewers slow even when the visible deck is only a few megabytes.

**How to apply:** Keep the source asset as a fallback, use the optimized JPEG in the deck, and validate that the PDF page count and 16:9 dimensions remain unchanged.