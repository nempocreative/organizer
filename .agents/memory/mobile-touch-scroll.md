---
name: Mobile touch scroll handling
description: Avoid document-level touchmove cancellation in the public mobile website.
---

Do not intercept `touchmove` globally with a non-passive handler to distinguish horizontal swipes. A slightly diagonal finger gesture can call `preventDefault()` and make vertical page scrolling feel unresponsive, especially near the scroll boundaries.

**Why:** Native browser scrolling is more reliable when the page owns vertical gestures; horizontal overflow should be constrained with CSS on the specific slider that needs it.

**How to apply:** Keep document-level touch handlers passive or remove them. Use `touch-action`, `overscroll-behavior`, and `overflow-x-auto` on individual horizontal components instead of cancelling page gestures.