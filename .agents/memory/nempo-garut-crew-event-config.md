---
name: Nempo Garut crew/tiketing active event
description: How the crew scanning/OTS-tiketing pages know which event they're operating on
---

The crew-facing pages/endpoints (`/event-orders/crew-*`, `/event-orders/ots-order`) operate on
a single "current" event, chosen via the `events.crew_active` boolean column (only one row can be
true at a time — enforced in the events create/update routes). Admin panel toggles it via a
checkbox on the event edit form ("Event Aktif untuk Crew/Tiketing").

**Why:** these endpoints used to hardcode `event_id = 9`, which silently broke once that event's
date passed and a different event needed crew tooling — a real bug hit in production data.

**How to apply:** when adding new crew/on-site-ticketing features, resolve the target event via
`getCrewEventId()` (queries `crew_active`) instead of hardcoding an id. If no event is flagged
active, these endpoints should fail loudly (409/empty), not silently target a stale event.
