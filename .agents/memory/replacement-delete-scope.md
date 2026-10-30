---
name: Replacement delete scope
description: Safe ordering and scoping for replacing curated database rows
---

When replacing a dataset, capture and delete the old rows before inserting replacements, or make the delete predicate target only the captured old IDs. Never delete by a broad category predicate after inserting the replacements.

**Why:** A category-based cleanup executed after inserting new rows can match and remove the replacements too, leaving the dataset empty.

**How to apply:** Use a transaction with an old-row snapshot and delete-before-insert, or explicitly exclude the new IDs/names from the cleanup predicate.