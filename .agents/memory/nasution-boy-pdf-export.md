---
name: Nasution Boy PDF export
description: Requirements and pitfalls for downloading the Nasution Boy storyline as a PDF.
---

The downloadable storyline PDF must omit browser-generated URL, date, and page-number headers and keep each scene's shoot details together.

**Why:** The user's browser-print PDF still showed the Replit URL and page numbers and split scenes despite print CSS; a headless print test did not reproduce those headers.

**How to apply:** Use a dedicated PDF-generation path with deliberate scene breaks, and verify the actual browser-triggered download rather than relying only on print CSS or headless print output.

For cross-reader compatibility, keep the storyline PDF text/vector-based rather than embedding one full-page raster image per scene. A user reported clipped/white pages in iPad Files and Books/Acrobat even after changing the page images from transparent PNG to flattened JPEG. The native-text export has embedded Roboto fonts and no page images; it was verified in Poppler and Chromium, but still needs confirmation on the user's iPad.

**Why:** Reducing image resolution and removing transparency did not fix the user's iPad readers, while native text avoids page-sized image decoding and keeps the PDF selectable.

**How to apply:** Preserve one deliberate page per scene, embed fonts, and verify the browser-triggered download. Do not call mobile compatibility resolved until the exact native-text PDF is checked on the reader where the issue was reported.
