ALTER TABLE jajan_yuk_orders
  ADD COLUMN IF NOT EXISTS delivery_latitude NUMERIC(10, 7),
  ADD COLUMN IF NOT EXISTS delivery_longitude NUMERIC(10, 7);