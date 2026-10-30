---
name: Tion Feed Story compositing
description: Face-preservation and background-removal constraints for Story composites.
---

For Tion Feed Story composites, preserve people from the supplied photos and do not reuse AI-generated composites that redraw faces. If the user declines background-removal usage, do not call a background-removal service; compose locally with the original photo pixels and softened edges, and be clear that source-background fragments may remain unless cleaner cutouts are supplied.

**Why:** The user asked for one wedding scene using original photo crops so faces would not be redrawn, then declined the background-removal confirmation.

**How to apply:** Keep the original likeness intact, use local blending only within the user's stated boundary, and set expectations about edge quality before claiming a seamless composite.
