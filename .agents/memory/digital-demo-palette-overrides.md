---
name: Digi demo palette overrides
description: Shared color overrides for Digi Nempo demo shells and root-level utility classes.
---

When changing a demo palette, utility classes placed directly on the root `<main>` need root-level selectors; descendant-only overrides do not affect those backgrounds or text colors. Keep operational shells on the Super App teal palette while preserving intentionally editorial product identities.

**Why:** Preview gates put arbitrary Tailwind color utilities on their root element, which can leave the screen background or focused border in the previous palette even when inner controls are recolored.

**How to apply:** Use the shared demo palette stylesheet for Kasir, Ticketing, and Marketing. Scope overrides by each demo root class. Preserve Invitation/Yearbook/Company accents unless the user explicitly requests a full identity change; for that request, promote the company demo to the same teal/mint Super App tokens while keeping amber/blue/violet for status meaning.