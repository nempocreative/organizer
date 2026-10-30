---
name: Jajan YUK voucher aliases
description: Voucher scope compatibility between the Jajan YUK product and the broader kuliner category.
---

`kuliner` and `jajan-yuk` are compatible voucher scopes. Public campaign listing, public validation, and server-side order creation must accept either spelling; merchant-specific restrictions still apply.

**Why:** Existing voucher data uses both the broader `kuliner` category and product-specific `jajan-yuk` values. Treating them as different scopes causes a code to appear valid in one checkout step and fail in another.

**How to apply:** Normalize the request type at each voucher boundary, while preserving strict rejection for unrelated categories and validating `kuliner_id` against the actual Jajan YUK merchant.