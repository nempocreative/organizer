---
name: Bulk data sync validation
description: A durable guardrail for importing external place data into PostgreSQL.
---

When importing external place records with many nullable fields, keep the source-to-column mapping explicit and run a focused SELECT immediately after the write to catch shifted values before the data reaches the public API. Treat a write response containing only column headers as inconclusive until the inserted rows are queried.

**Why:** Positional parameter arrays can still produce valid SQL while placing a price, website, or facilities value in the wrong column, and a CTE-based write can appear successful even when its returned-row output is empty or incomplete.

**How to apply:** Prefer named object mappings during preparation, parameterized SQL for the write, and an immediate verification query covering the fields most likely to be misaligned.