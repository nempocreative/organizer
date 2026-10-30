---
name: Nempo Garut event_orders schema untracked
description: event_orders table (incl. Midtrans payment columns) has no CREATE TABLE/migration in the repo; changes were applied directly to the live DB.
---

The `event_orders` table in the Nempo Garut api-server has no `CREATE TABLE` statement anywhere in the codebase (unlike some other tables which are created in `src/lib/seed.ts`). Its schema — including the `payment_method`, `midtrans_transaction_id`, and `paid_at` columns added for Midtrans integration — exists only in the live Postgres database via direct `ALTER TABLE` statements.

**Why:** There is no migration file to "mirror" schema changes into for this table; the repo simply doesn't track its schema. Attempting to find a seed/migration script to update will come up empty by design, not by oversight.

**How to apply:** When changing `event_orders` (or verifying its columns), check the live DB directly (`psql \d event_orders`) rather than searching the repo for a schema definition. If reproducibility across environments becomes necessary, a migration step would need to be introduced from scratch — there is no existing pattern to extend for this table.
