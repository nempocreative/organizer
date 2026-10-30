---
name: Cafe duplicate cleanup
description: Durable policy for legacy place records duplicated across Cafe and other kuliner categories.
---

When a legacy kuliner record is the same place as a canonical Cafe record, deactivate the legacy row instead of deleting it; keep the canonical Cafe row public.

**Why:** Existing reviews, wishlists, vouchers, and orders can reference the old `kuliner.id`, so deletion risks breaking historical relationships even when the public duplicate is unwanted.

**How to apply:** Match by normalized name and location, preserve the Cafe record when its identity is verified, set the duplicate non-Cafe row inactive, and verify public endpoints no longer return duplicate places.