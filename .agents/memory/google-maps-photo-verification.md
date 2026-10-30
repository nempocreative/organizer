---
name: Google Maps photo verification
description: Direct Google Maps photo URLs can be malformed or render through server-side resizing, so validate the URL and visible result.
---

Google Maps place searches can resolve to a similarly named branch, so search using the street address and verify the returned place name, address, rating, and photo together. Photo URLs should also be checked with an actual image request and rendered preview before treating a listing as synchronized.

**Why:** A small transcription error in a long `googleusercontent.com` URL can leave the record looking configured while serving the wrong image or a fallback, while a broad name-only search can silently select the wrong venue.

**How to apply:** Query Maps with a name plus address, verify the returned identity and rating, then verify the API value, request the image successfully, and inspect the public card/detail view.

When the normal `api=1` Maps page is only a client shell, its linked `tbm=map&pb=...` response exposes the place result and direct `lh*.googleusercontent.com/gps-cs-s` renditions. Select a rendition whose adjacent label matches the venue, and retry a fresh address-scoped lookup if a direct image request transiently returns 400.

**Why:** The rendered Maps shell does not reliably expose place photos to a server-side fetch, while the internal map-result payload provides the same direct photo rendition used by existing records. Google may also reject a previously fetched rendition intermittently.

**How to apply:** Search with the venue name plus street address, parse only the labeled `gps-cs-s` result for that venue, request the image, inspect it, and store the verified direct URL rather than a third-party mirror.

Long Google photo URLs must be re-requested after they are persisted, not only when first collected. A single mistyped token can leave one gallery tile broken while the other photos still work; retry the same address-scoped search and replace or remove the bad rendition before presenting the page.

**Why:** A Bogor gallery contained one transcribed URL that looked structurally correct but returned HTTP 400, which was only visible in the rendered three-photo hero.

**How to apply:** Validate every stored main and gallery URL with an image request, then screenshot a detail page that renders multiple photos before considering a batch complete.

Do not download or copy Google Maps photos into Nempo's database. Keep external photos as links only where permitted; use cafe-supplied images with publication permission or other properly licensed files for durable storage.

**Why:** Direct Maps photo URLs can become inaccessible, and copying media into app-controlled storage raises source-permission and platform-policy concerns.

**How to apply:** If a Maps image fails, use an explicit UI fallback until the cafe provides an approved photo; store approved uploads through the existing CMS flow instead of copying Maps media.

For failed public food-place photos, use the warm-to-dark vertical gradient shown in the supplied reference with a subtle category icon centered in the photo area: a coffee cup for Cafe and crossed utensils for Kuliner. Do not add an explanatory placeholder caption. Preserve the existing location, category, and rating overlays.

**Why:** The user clarified that a coffee-cup icon is appropriate for Cafe photo failures and called out blank Kuliner cards as unclear; an icon communicates the category without a broken-image block or placeholder text.

**How to apply:** Reuse the same discreet gradient treatment anywhere a Cafe or Kuliner photo fails, including listings, home carousels, and detail views.