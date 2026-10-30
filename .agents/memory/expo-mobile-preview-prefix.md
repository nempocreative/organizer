---
name: Expo mobile preview prefix
description: Nested mobile artifact previews can preserve the artifact path inside Expo Router.
---

When an Expo mobile artifact has a nested preview path, include a catch-all route that renders the same root shell so the preview prefix does not fall through to Expo's not-found screen.

**Why:** The dev server can return HTTP 200 for the prefixed URL while the client router still treats that path as unknown.

**How to apply:** Keep the mobile artifact as a single website WebView shell and route unmatched preview paths to that shell; do not duplicate the website UI in native screens.