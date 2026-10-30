---
name: Berita published_at timezone
description: PostgreSQL formats berita published_at in UTC, so local Bandung publication dates need a 07:00 UTC timestamp.
---

When storing a publication date intended to display as a West Indonesia calendar date, write the timestamp at 07:00 UTC (or equivalent +07:00 local midnight) because the API formats the value in UTC.

**Why:** Saving local midnight with a +07:00 offset displayed the previous calendar day in the public API.

**How to apply:** Verify the formatted API date after importing or updating berita records, especially when source pages publish dates in WIB.