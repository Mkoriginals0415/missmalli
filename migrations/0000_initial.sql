-- Miss Malli Cloudflare D1 Initial Migration

CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_on_home INTEGER DEFAULT 1,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  collection_id INTEGER REFERENCES collections(id),
  collection_slug TEXT DEFAULT 'silk',
  fabric TEXT NOT NULL,
  length TEXT DEFAULT '5.5 meters saree + 0.8 meter blouse piece',
  care TEXT DEFAULT 'Dry clean only. Store wrapped in a muslin cloth.',
  price INTEGER NOT NULL,
  sale_price INTEGER,
  description TEXT,
  status TEXT DEFAULT 'live',
  is_featured INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_cover INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  blouse_option TEXT NOT NULL,
  stock_count INTEGER DEFAULT 2,
  price_override INTEGER
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_number TEXT NOT NULL UNIQUE,
  secret_token TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'needs_reply',
  total_amount INTEGER NOT NULL,
  source TEXT DEFAULT 'buy_now',
  internal_note TEXT,
  tracking_note TEXT,
  is_payment_received INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS request_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER REFERENCES requests(id) ON DELETE CASCADE,
  product_id INTEGER,
  variant_id INTEGER,
  product_name TEXT NOT NULL,
  variant_details TEXT NOT NULL,
  price_at_request INTEGER NOT NULL,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  offer_text TEXT NOT NULL,
  banner_image TEXT,
  collection_slug TEXT,
  start_date TEXT,
  end_date TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
