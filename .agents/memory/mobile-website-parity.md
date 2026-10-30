---
name: Mobile website parity
description: The mobile artifact must stay identical to the full public Nempo website across routes, forms, and transactions.
---

When the requirement is full parity with the public website, the mobile artifact should use the website itself through a WebView rather than reimplementing its screens in React Native.

**Why:** The public site contains many routes and stateful flows—authentication, checkout, payments, tickets, forms, and service demos. A second native implementation would quickly diverge in content, styling, and behavior.

**How to apply:** Keep the mobile artifact as a thin Expo shell around the configured Nempo web origin. Use the website's own responsive layout and bottom navigation, avoid adding a second native navigation bar, and validate the native WebView separately for cookies, uploads, payments, external links, and safe areas.