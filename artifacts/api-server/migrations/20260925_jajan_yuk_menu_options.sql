ALTER TABLE jajan_yuk_menu_items
  ADD COLUMN IF NOT EXISTS option_groups JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE jajan_yuk_order_items
  ADD COLUMN IF NOT EXISTS selected_options JSONB NOT NULL DEFAULT '[]'::jsonb;