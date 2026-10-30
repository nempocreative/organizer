---
name: NEMPO Garut database separation
description: User's requirement to isolate NEMPO Garut from NEMPO.id Web's database.
---

NEMPO Garut must use its own PostgreSQL database, separate from NEMPO.id. The user wants the existing CMS copied into a distinct NEMPO Garut CMS artifact with its own login and data; keep the NEMPO.id CMS intact. They plan to revamp Garut gradually.

**Why:** The user explicitly repeated that the existing CMS should be copied to create a new NEMPO Garut CMS, with separate login and data.

**How to apply:** A separate artifact in this workspace still shares the workspace database, and the workspace is at its nine-artifact limit. Do not replace or remove an existing artifact without the user's explicit choice. For physical database isolation, use a separate project/API; the CMS front end may be reused, but cross-project data access must go through an API rather than a shared Replit database connection.
