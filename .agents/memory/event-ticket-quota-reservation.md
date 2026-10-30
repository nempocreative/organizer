---
name: Event ticket quota reservation
description: How event_tickets.sold is kept race-condition-safe across the Midtrans async payment window
---

`event_tickets.sold` represents "confirmed + reserved-pending" quota, not just confirmed sales.
Quota is reserved atomically at order creation time (`UPDATE ... SET sold = sold + qty WHERE sold
+ qty <= quota RETURNING ...`, in `event-orders.ts`), before the Midtrans Snap transaction is
created. It is released (decremented) if: Midtrans transaction creation fails, the webhook marks
the order rejected/expired/cancelled, or an admin manually rejects a pending order.

**Why:** the previous flow only checked quota with a plain SELECT and incremented `sold` on
confirmation — two buyers could both pass the check for the last ticket and both get charged,
since neither pending order counted against the quota during the Midtrans async window.

**How to apply:** any new code path that creates an `event_orders` row tied to a ticket must
reserve quota the same way, and any path that finalizes an order as rejected/cancelled/deleted
must release it. Never increment `sold` again at confirmation time — it's already reserved.
