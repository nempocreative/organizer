CREATE TABLE jajan_yuk_menu_items (
  id SERIAL PRIMARY KEY,
  kuliner_id INTEGER NOT NULL REFERENCES kuliner(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price > 0),
  image TEXT,
  option_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX jajan_yuk_menu_items_merchant_active_idx
  ON jajan_yuk_menu_items (kuliner_id, active);

CREATE TABLE jajan_yuk_orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(40) NOT NULL UNIQUE,
  tracking_token_hash CHAR(64) NOT NULL,
  kuliner_id INTEGER REFERENCES kuliner(id) ON DELETE SET NULL,
  merchant_name_snapshot VARCHAR(200) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  delivery_area VARCHAR(160) NOT NULL DEFAULT 'Garut Kota',
  delivery_address TEXT NOT NULL,
  delivery_latitude NUMERIC(10, 7),
  delivery_longitude NUMERIC(10, 7),
  customer_note TEXT,
  admin_note TEXT,
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  delivery_fee INTEGER NOT NULL DEFAULT 9000 CHECK (delivery_fee >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  delivery_eta VARCHAR(120),
  order_status VARCHAR(32) NOT NULL DEFAULT 'pending_confirmation'
    CHECK (order_status IN (
      'pending_confirmation', 'confirmed', 'preparing', 'driver_assigned',
      'picked_up', 'on_the_way', 'delivered', 'rejected'
    )),
  payment_status VARCHAR(24) NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'expired', 'failed')),
  payment_type VARCHAR(60),
  midtrans_order_id VARCHAR(60) UNIQUE,
  midtrans_transaction_id VARCHAR(100),
  snap_token TEXT,
  payment_attempt INTEGER NOT NULL DEFAULT 0,
  driver_name VARCHAR(120),
  driver_phone VARCHAR(32),
  driver_vehicle VARCHAR(120),
  driver_plate VARCHAR(32),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX jajan_yuk_orders_status_created_idx
  ON jajan_yuk_orders (order_status, created_at DESC);
CREATE INDEX jajan_yuk_orders_payment_status_idx
  ON jajan_yuk_orders (payment_status);

CREATE TABLE jajan_yuk_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES jajan_yuk_orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES jajan_yuk_menu_items(id) ON DELETE SET NULL,
  item_name VARCHAR(120) NOT NULL,
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total INTEGER NOT NULL CHECK (line_total >= 0),
  selected_options JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX jajan_yuk_order_items_order_idx
  ON jajan_yuk_order_items (order_id);