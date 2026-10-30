---
name: City filter legacy data
description: Why location filtering needs both precise city boundaries and a guarded fallback for older Nempo records.
---

Nempo's current content data is Garut-focused, but some older records store only a district or street (for example, a street address without the word Garut). City filtering therefore needs a legacy fallback or selecting Garut can incorrectly hide valid existing records.

**Why:** A substring matcher makes city names overlap (for example, Bandung matching Bandung Barat), while requiring the city keyword everywhere breaks older Garut records.

**How to apply:** Match complete city keywords first, including Indonesian/English administrative qualifiers such as `Kota Bogor`, `Kabupaten Bogor`, `Bogor City`, and `Bogor Regency`. Only fall back to Garut when a record has no recognized city keyword; if an address explicitly names another supported city, never classify it as Garut through the fallback.