---
name: Cafe logical separation
description: Durable compatibility decision for separating Cafe from general Kuliner.
---

Cafe is separated logically through dedicated public and admin endpoints/routes, while Cafe records remain in the existing `kuliner` table.

**Why:** Existing reservations, vouchers, internal reviews, and partner listings reference `kuliner.id` and the `kuliner` item type. Moving rows into a new table would require a risky cross-feature migration.

**How to apply:** Keep `/api/kuliner` and Kuliner admin queries excluding `category='Cafe'`; use `/api/cafe` and the dedicated Cafe admin page for Cafe data. Preserve the legacy ID and review/order relationships until those dependent systems are intentionally migrated.