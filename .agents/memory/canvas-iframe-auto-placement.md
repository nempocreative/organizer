---
name: Canvas iframe auto-placement
description: Verify auto-placed iframe positions on a crowded canvas before making them live.
---

After creating iframe placeholders with auto-placement, inspect their coordinates with `getCanvasState` and confirm they do not overlap each other or existing shapes. If they overlap, reposition only the shapes created for the current task into a checked clear area before marking them live.

**Why:** On the Nempo canvas, consecutive auto-created frames reused the same coordinates and landed over existing slide frames. The issue was caught by inspecting the occupied region before publishing the previews.

**How to apply:** After `create-auto`, query the relevant canvas area and verify all new frame bounds against nearby shapes. Do not assume auto-placement found an empty spot.
