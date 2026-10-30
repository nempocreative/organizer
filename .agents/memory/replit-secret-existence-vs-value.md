---
name: Replit secret existence vs value
description: Available-secrets listings only confirm a key exists, not that it holds a real value — verify before trusting an integration.
---

`viewEnvVars({ type: "secret" })` and the "available secrets" list shown in the environment view report whether a secret **key** exists, not whether it has a meaningful value. A secret can exist with an empty string value (e.g. a placeholder created before the user had real credentials).

**Why:** Hit this with Midtrans keys — the environment listed `MIDTRANS_CLIENT_KEY`/`MIDTRANS_SERVER_KEY` as available, but the running process saw them as empty strings (not undefined), so an API call silently returned an empty client key instead of erroring.

**How to apply:** Before relying on a secret for a live integration, verify the actual behavior (e.g. hit an endpoint that echoes derived config, or check `process.env.KEY.length` in the running app) rather than trusting existence alone. If empty, use `requestSecrets` to have the user (re)supply the real value.
