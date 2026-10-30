---
name: Partnership CMS area merging
description: Durable rule for keeping saved partnership content compatible with newly added service categories.
---

Saved partnership content must be merged by area id with the current defaults. Preserve saved values for matching ids, append valid custom areas, and add any new default areas that are absent from the saved CMS payload. Validate each area before accepting it through the API.

**Why:** The CMS stores the full partnership content object. Replacing defaults with any non-empty saved array causes newly added categories to disappear from the public page until an administrator manually re-saves all content.

**How to apply:** Use the same id-based merge behavior in the public content loader and admin normalizer, and keep the API schema validation aligned with the partnership area shape.