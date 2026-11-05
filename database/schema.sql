PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
  email TEXT UNIQUE COLLATE NOCASE,
  phone TEXT UNIQUE,
  market_area TEXT,
  public_contact INTEGER NOT NULL DEFAULT 0 CHECK(public_contact IN (0, 1)),
  portrait_url TEXT,
  is_demo_profile INTEGER NOT NULL DEFAULT 0 CHECK(is_demo_profile IN (0, 1)),
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('buyer', 'seller')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK(account_status IN ('active', 'suspended')),
  seller_status TEXT NOT NULL DEFAULT 'approved' CHECK(seller_status IN ('pending', 'approved', 'suspended')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 120),
  description TEXT NOT NULL,
  price REAL NOT NULL CHECK(price > 0),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK(moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  options TEXT NOT NULL DEFAULT '{}',
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id, options)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  customer_name TEXT,
  total REAL NOT NULL CHECK(total >= 0),
  status TEXT NOT NULL DEFAULT 'processing' CHECK(status IN ('processing', 'shipped', 'complete', 'cancelled')),
  delivery_method TEXT NOT NULL DEFAULT 'delivery' CHECK(delivery_method IN ('delivery', 'pickup')),
  delivery_option TEXT NOT NULL DEFAULT 'seller-arranged',
  delivery_fee INTEGER NOT NULL DEFAULT 0 CHECK(delivery_fee >= 0),
  estimated_delivery TEXT NOT NULL DEFAULT 'Delivery timing confirmed by seller',
  delivery_address TEXT,
  customer_phone TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK(payment_method IN ('cash', 'mpesa_direct', 'mpesa_stk')),
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK(payment_status IN ('not_required', 'unverified', 'pending', 'paid', 'failed')),
  mpesa_checkout_request_id TEXT UNIQUE,
  mpesa_receipt_number TEXT,
  payment_result_description TEXT,
  payment_access_token_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK(method IN ('cash', 'mpesa_direct', 'mpesa_stk')),
  status TEXT NOT NULL CHECK(status IN ('not_required', 'unverified', 'pending', 'paid', 'failed')),
  checkout_request_id TEXT UNIQUE,
  receipt_number TEXT,
  result_description TEXT,
  access_token_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'other',
  title TEXT NOT NULL CHECK(length(title) BETWEEN 3 AND 100),
  skills TEXT NOT NULL CHECK(length(skills) BETWEEN 2 AND 300),
  description TEXT NOT NULL CHECK(length(description) BETWEEN 10 AND 1500),
  work_images TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price REAL NOT NULL CHECK(price > 0),
  options TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS administrators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  subject TEXT NOT NULL CHECK(length(subject) BETWEEN 3 AND 120),
  description TEXT NOT NULL CHECK(length(description) BETWEEN 10 AND 2000),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'under_review', 'resolved', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER REFERENCES administrators(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products(seller_id);
CREATE INDEX IF NOT EXISTS wishlist_items_user_id_idx ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);
CREATE INDEX IF NOT EXISTS job_listings_user_id_idx ON job_listings(user_id);
CREATE INDEX IF NOT EXISTS complaints_status_idx ON complaints(status, created_at);
CREATE INDEX IF NOT EXISTS admin_activity_logs_created_at_idx ON admin_activity_logs(created_at);
