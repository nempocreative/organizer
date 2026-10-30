---
name: Nempo Feed narrow CV layout
description: Prevent content clipping in Slide 5 at narrow mobile widths.
---

Check Slide 5 at 360px as well as 402px and desktop. At 360px the profile sidebar and right column can overflow even when the 402px preview appears fine; the Software rows are especially likely to be cut.

**Why:** narrow-screen testing exposed vertical overflow that was not visible at the usual mobile preview width.

**How to apply:** keep mobile columns top-aligned with compact explicit spacing, check that the Software rows fit inside the sidebar, and confirm both columns fit in preview and PNG export. Preserve desktop spacing with responsive overrides.
