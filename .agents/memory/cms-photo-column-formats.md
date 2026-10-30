---
name: CMS photo column formats
description: Database formats and update-safety rules for CMS-managed image galleries.
---

CMS gallery columns are not uniform: tourism and culinary galleries use JSONB, while influencer galleries use PostgreSQL TEXT arrays. Legacy rows may also contain JSON text or PostgreSQL-array text.

**Why:** A format-specific reader can make an existing gallery look empty in the admin editor, and saving that edit can silently replace real photos with an empty list.

**How to apply:** Normalize photo lists at the API boundary, accept JSONB/TEXT[]/legacy text representations, and preserve the existing image/gallery when an update request omits those fields. Treat an explicitly supplied empty list as an intentional clear.