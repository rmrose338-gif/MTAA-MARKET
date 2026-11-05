const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const defaultDatabaseDirectory = path.resolve(__dirname, "..", "..", "database");
const databasePath = process.env.MTAA_DATABASE_PATH
  ? path.resolve(process.env.MTAA_DATABASE_PATH)
  : path.join(defaultDatabaseDirectory, "mtaa_market.db");
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

const schemaPath = path.join(defaultDatabaseDirectory, "schema.sql");
db.exec(fs.readFileSync(schemaPath, "utf8"));

let userColumns = new Set(db.prepare("PRAGMA table_info(users)").all().map((column) => column.name));
if (!userColumns.has("phone")) {
  db.pragma("foreign_keys = OFF");
  try {
    db.transaction(() => {
      db.exec(`CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
        email TEXT UNIQUE COLLATE NOCASE,
        phone TEXT UNIQUE,
        market_area TEXT,
        public_contact INTEGER NOT NULL DEFAULT 1 CHECK(public_contact IN (0, 1)),
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('buyer', 'seller')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);
      db.exec(`INSERT INTO users_new (id, name, email, password_hash, role, created_at)
        SELECT id, name, email, password_hash, role, created_at FROM users`);
      db.exec("DROP TABLE users");
      db.exec("ALTER TABLE users_new RENAME TO users");
    })();
  } finally {
    db.pragma("foreign_keys = ON");
  }
}
userColumns = new Set(db.prepare("PRAGMA table_info(users)").all().map((column) => column.name));
if (!userColumns.has("market_area")) {
  db.exec("ALTER TABLE users ADD COLUMN market_area TEXT");
}
if (!userColumns.has("delivery_address")) {
  db.exec("ALTER TABLE users ADD COLUMN delivery_address TEXT");
}
if (!userColumns.has("public_contact")) {
  db.exec("ALTER TABLE users ADD COLUMN public_contact INTEGER NOT NULL DEFAULT 1 CHECK(public_contact IN (0, 1))");
}
if (!userColumns.has("account_status")) {
  db.exec("ALTER TABLE users ADD COLUMN account_status TEXT NOT NULL DEFAULT 'active' CHECK(account_status IN ('active', 'suspended'))");
}
if (!userColumns.has("seller_status")) {
  db.exec("ALTER TABLE users ADD COLUMN seller_status TEXT NOT NULL DEFAULT 'approved' CHECK(seller_status IN ('pending', 'approved', 'suspended'))");
}
if (!userColumns.has("portrait_url")) {
  db.exec("ALTER TABLE users ADD COLUMN portrait_url TEXT");
}
if (!userColumns.has("is_demo_profile")) {
  db.exec("ALTER TABLE users ADD COLUMN is_demo_profile INTEGER NOT NULL DEFAULT 0 CHECK(is_demo_profile IN (0, 1))");
}

const productColumns = new Set(db.prepare("PRAGMA table_info(products)").all().map((column) => column.name));
if (!productColumns.has("moderation_status")) {
  db.exec("ALTER TABLE products ADD COLUMN moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK(moderation_status IN ('pending', 'approved', 'rejected'))");
}

const complaintColumns = new Set(db.prepare("PRAGMA table_info(complaints)").all().map((column) => column.name));
if (!complaintColumns.has("customer_name")) {
  db.exec("ALTER TABLE complaints ADD COLUMN customer_name TEXT");
}
if (!complaintColumns.has("customer_phone")) {
  db.exec("ALTER TABLE complaints ADD COLUMN customer_phone TEXT");
}

const orderColumns = new Set(db.prepare("PRAGMA table_info(orders)").all().map((column) => column.name));
if (!orderColumns.has("delivery_method")) {
  db.exec("ALTER TABLE orders ADD COLUMN delivery_method TEXT NOT NULL DEFAULT 'delivery' CHECK(delivery_method IN ('delivery', 'pickup'))");
}
if (!orderColumns.has("delivery_address")) {
  db.exec("ALTER TABLE orders ADD COLUMN delivery_address TEXT");
}
if (!orderColumns.has("customer_phone")) {
  db.exec("ALTER TABLE orders ADD COLUMN customer_phone TEXT");
}
if (!orderColumns.has("delivery_option")) {
  db.exec("ALTER TABLE orders ADD COLUMN delivery_option TEXT NOT NULL DEFAULT 'seller-arranged'");
}
if (!orderColumns.has("delivery_fee")) {
  db.exec("ALTER TABLE orders ADD COLUMN delivery_fee INTEGER NOT NULL DEFAULT 0 CHECK(delivery_fee >= 0)");
}
if (!orderColumns.has("estimated_delivery")) {
  db.exec("ALTER TABLE orders ADD COLUMN estimated_delivery TEXT NOT NULL DEFAULT 'Delivery timing confirmed by seller'");
}
if (!orderColumns.has("payment_method")) {
  db.exec("ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'cash'");
}
if (!orderColumns.has("customer_name")) {
  db.exec("ALTER TABLE orders ADD COLUMN customer_name TEXT");
}
const orderSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'orders'").get()?.sql || "";
if (!orderSchema.includes("'mpesa_stk'")) {
  db.pragma("foreign_keys = OFF");
  try {
    db.transaction(() => {
      db.exec(`CREATE TABLE orders_new (
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
      )`);
      db.exec(`INSERT INTO orders_new (
        id, user_id, customer_name, total, status, delivery_method, delivery_option, delivery_fee,
        estimated_delivery, delivery_address, customer_phone, payment_method, payment_status, created_at
      ) SELECT
        id, user_id, customer_name, total, status, delivery_method, delivery_option, delivery_fee,
        estimated_delivery, delivery_address, customer_phone, payment_method,
        CASE WHEN payment_method = 'mpesa_direct' THEN 'unverified' ELSE 'not_required' END,
        created_at
      FROM orders`);
      db.exec("DROP TABLE orders");
      db.exec("ALTER TABLE orders_new RENAME TO orders");
      db.exec("CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id)");
    })();
  } finally {
    db.pragma("foreign_keys = ON");
  }
} else {
  if (!orderColumns.has("payment_status")) {
    db.exec("ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'not_required'");
  }
  if (!orderColumns.has("mpesa_checkout_request_id")) {
    db.exec("ALTER TABLE orders ADD COLUMN mpesa_checkout_request_id TEXT");
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS orders_mpesa_checkout_request_id_idx ON orders(mpesa_checkout_request_id)");
  }
  if (!orderColumns.has("mpesa_receipt_number")) {
    db.exec("ALTER TABLE orders ADD COLUMN mpesa_receipt_number TEXT");
  }
  if (!orderColumns.has("payment_result_description")) {
    db.exec("ALTER TABLE orders ADD COLUMN payment_result_description TEXT");
  }
  if (!orderColumns.has("payment_access_token_hash")) {
    db.exec("ALTER TABLE orders ADD COLUMN payment_access_token_hash TEXT");
  }
}
const orderUserIdColumn = db.prepare("PRAGMA table_info(orders)").all().find((column) => column.name === "user_id");
if (orderUserIdColumn?.notnull) {
  db.pragma("foreign_keys = OFF");
  try {
    db.transaction(() => {
      db.exec(`CREATE TABLE orders_new (
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
      )`);
      db.exec(`INSERT INTO orders_new (
        id, user_id, customer_name, total, status, delivery_method, delivery_option, delivery_fee,
        estimated_delivery, delivery_address, customer_phone, payment_method, payment_status,
        mpesa_checkout_request_id, mpesa_receipt_number, payment_result_description,
        payment_access_token_hash, created_at
      ) SELECT
        id, user_id, customer_name, total, status, delivery_method, delivery_option, delivery_fee,
        estimated_delivery, delivery_address, customer_phone, payment_method, payment_status,
        mpesa_checkout_request_id, mpesa_receipt_number, payment_result_description,
        payment_access_token_hash, created_at
      FROM orders`);
      db.exec("DROP TABLE orders");
      db.exec("ALTER TABLE orders_new RENAME TO orders");
      db.exec("CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id)");
    })();
  } finally {
    db.pragma("foreign_keys = ON");
  }
}

const paymentMigrationPath = path.join(defaultDatabaseDirectory, "migrations", "create_payments_table.sql");
db.exec(fs.readFileSync(paymentMigrationPath, "utf8"));

const cartColumns = new Set(db.prepare("PRAGMA table_info(cart_items)").all().map((column) => column.name));
if (!cartColumns.has("options")) {
  db.transaction(() => {
    db.exec(`CREATE TABLE cart_items_new (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      options TEXT NOT NULL DEFAULT '{}',
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, product_id, options)
    )`);
    db.exec(`INSERT INTO cart_items_new (user_id, product_id, quantity, created_at)
      SELECT user_id, product_id, quantity, created_at FROM cart_items`);
    db.exec("DROP TABLE cart_items");
    db.exec("ALTER TABLE cart_items_new RENAME TO cart_items");
  })();
}

const orderItemColumns = new Set(db.prepare("PRAGMA table_info(order_items)").all().map((column) => column.name));
if (!orderItemColumns.has("options")) {
  db.exec("ALTER TABLE order_items ADD COLUMN options TEXT NOT NULL DEFAULT '{}'");
}

const jobColumns = new Set(db.prepare("PRAGMA table_info(job_listings)").all().map((column) => column.name));
if (!jobColumns.has("category")) {
  db.exec("ALTER TABLE job_listings ADD COLUMN category TEXT NOT NULL DEFAULT 'other'");
}
if (!jobColumns.has("work_images")) {
  db.exec("ALTER TABLE job_listings ADD COLUMN work_images TEXT NOT NULL DEFAULT '[]'");
}

const seedPath = path.join(defaultDatabaseDirectory, "seed.sql");
db.exec(fs.readFileSync(seedPath, "utf8"));

const canonicalCleaningSeller = db.prepare("SELECT id FROM users WHERE email = ?").get("maker@example.test");
const cleaningCategory = db.prepare("SELECT id FROM categories WHERE name = ?").get("Personal Care & Cleaning");
const householdCategory = db.prepare("SELECT id FROM categories WHERE name = ?").get("Household Essentials");
if (canonicalCleaningSeller && cleaningCategory) {
  const has500MlDishwashing = db.prepare(`SELECT 1 FROM products
    WHERE seller_id = ? AND name = 'Lemon Dishwashing Liquid, 500 ml'`).get(canonicalCleaningSeller.id);
  if (!has500MlDishwashing) {
    db.prepare(`INSERT INTO products
      (seller_id, category_id, name, description, price, image_url, stock)
      VALUES (?, ?, 'Lemon Dishwashing Liquid, 500 ml',
      'A 500 ml bottle of lemon dishwashing liquid for kitchen pots and dishes.',
      220, '/images/catalog/sunlight-dishwashing-500ml.svg', 18)`).run(canonicalCleaningSeller.id, cleaningCategory.id);
  }
}

// Keep the curated household adverts in sync with their actual branded items.
db.exec(`
DELETE FROM products
WHERE name = 'Children''s Play Sneakers'
  AND id NOT IN (
    SELECT MIN(id) FROM products WHERE name = 'Children''s Play Sneakers'
  );

UPDATE products
SET name = 'Ariel 3-in-1 Laundry Detergent Pods',
    description = 'Ariel 3-in-1 laundry detergent pods for everyday machine washing.',
    image_url = '/images/catalog/photoreal/ariel.jpg'
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND name = 'Ariel Automatic Laundry Detergent, 1 kg';

UPDATE products
SET name = 'Ariel 3-in-1 Laundry Detergent Pods',
      description = 'Ariel 3-in-1 laundry detergent pods for everyday machine washing.',
      image_url = '/images/catalog/photoreal/ariel.jpg'
  WHERE id = 101;

  UPDATE products
  SET name = 'OMO Automatic Laundry Powder Packs',
      description = 'OMO automatic laundry powder packs for effective everyday machine washing.',
      image_url = '/images/catalog/photoreal/omo.jpg'
  WHERE id = 102;

  UPDATE products
  SET name = 'Lemon Dishwashing Liquid, 500 ml',
      description = 'A 500 ml bottle of lemon dishwashing liquid for greasy pots, pans, and plates.',
      image_url = '/images/catalog/photoreal/dishwashing.jpg'
  WHERE id = 141;

  UPDATE products
  SET name = 'Lemon Dishwashing Liquid, 250 ml',
      description = 'A small 250 ml bottle of lemon dishwashing liquid for everyday kitchen cleaning.',
      image_url = '/images/catalog/photoreal/dishwashing.jpg'
  WHERE id = 188;
`);

if (canonicalCleaningSeller && householdCategory) {
  db.prepare(`UPDATE products
    SET category_id = ?
    WHERE seller_id = ? AND name IN (
      'Ariel 3-in-1 Laundry Detergent Pods',
      'OMO Automatic Laundry Powder Packs',
      'Lemon Dishwashing Liquid, 250 ml',
      'Lemon Dishwashing Liquid, 500 ml'
    )`).run(householdCategory.id, canonicalCleaningSeller.id);

  db.prepare(`DELETE FROM products
    WHERE seller_id = ?
      AND name IN (
        'Ariel 3-in-1 Laundry Detergent Pods',
        'OMO Automatic Laundry Powder Packs',
        'Lemon Dishwashing Liquid, 250 ml',
        'Lemon Dishwashing Liquid, 500 ml'
      )
      AND id NOT IN (
        SELECT MIN(id) FROM products
        WHERE seller_id = ?
          AND name IN (
            'Ariel 3-in-1 Laundry Detergent Pods',
            'OMO Automatic Laundry Powder Packs',
            'Lemon Dishwashing Liquid, 250 ml',
            'Lemon Dishwashing Liquid, 500 ml'
          )
        GROUP BY name
      )`).run(canonicalCleaningSeller.id, canonicalCleaningSeller.id);
}

const sampleSeller = db.prepare("SELECT id FROM users WHERE email = ?").get("maker@example.test");
if (sampleSeller) {
  db.prepare(`UPDATE products
    SET image_url = '/images/rain-boots.jpg'
    WHERE seller_id = ? AND name = 'Rainy-Day Gumboots'`).run(sampleSeller.id);

  const productCorrections = [
    ["Wheat Grain, 1 kg", "A one-kilo portion of whole wheat kernels for milling or cooking.", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80", "Millet Porridge Flour, 1 kg"],
    ["Assorted Dry Beans, 500 g", "A half-kilo mix of assorted dry beans for soups and stews.", "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?auto=format&fit=crop&w=900&q=80", "Dry Lentils, 500 g"],
    ["Black-Eyed Peas, 500 g", "A half-kilo pack of black-eyed peas for a filling home-cooked meal.", "https://images.unsplash.com/photo-1515347272087-685ce5a1fc8b?auto=format&fit=crop&w=900&q=80", "Green Grams, 500 g"],
    ["Roasted Chickpeas, 1 kg", "A one-kilo pack of crunchy roasted chickpeas for snacks and meals.", "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80", "Dry Peas, 1 kg"],
    ["Roasted Groundnuts, 250 g", "A small serving of roasted groundnuts for breakfast and snacks.", "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=900&q=80", "Groundnut Paste, 250 g"],
    ["Wheat Porridge Flour, 500 g", "A half-kilo pack of wheat flour for warm breakfast porridge.", "https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?auto=format&fit=crop&w=900&q=80", "Home-Style Porridge Mix, 500 g"],
    ["Roasted Peanut Snack Pack", "A small, affordable pack of roasted peanuts for a quick snack.", "https://images.unsplash.com/photo-1575399872095-9363bf262e64?auto=format&fit=crop&w=900&q=80", "Small Peanut Snack Pack"],
  ];
  const correctProduct = db.prepare(`UPDATE products
    SET name = ?, description = ?, image_url = ?, moderation_status = 'approved'
    WHERE seller_id = ? AND name IN (?, ?)`);
  db.transaction(() => {
    for (const [name, description, imageUrl, previousName] of productCorrections) {
      correctProduct.run(name, description, imageUrl, sampleSeller.id, previousName, name);
    }
  })();
  db.prepare(`UPDATE products
    SET moderation_status = 'rejected'
    WHERE seller_id = ? AND name = 'Boy''s Brown Jacket and Gray Trousers Outfit'`).run(sampleSeller.id);

  db.prepare(`UPDATE products
    SET moderation_status = 'rejected'
    WHERE seller_id IN (SELECT id FROM users WHERE is_demo_profile = 1 AND id <> ?)
      AND category_id IN (
        SELECT id FROM categories
        WHERE name IN ('Fashion', 'Clothing & Accessories', 'Kids'' Clothing', 'Teen Clothing',
                       'Adult Clothing', 'Older Adults'' Clothing', 'Baby & Kids', 'Shoes & Footwear')
      )`).run(sampleSeller.id);

  db.prepare(`UPDATE products AS stale
    SET moderation_status = 'rejected'
    WHERE stale.moderation_status = 'approved'
      AND stale.seller_id IN (SELECT id FROM users WHERE is_demo_profile = 1)
      AND stale.id <> (
        SELECT candidate.id
        FROM products AS candidate
        JOIN users AS candidate_seller ON candidate_seller.id = candidate.seller_id
        WHERE candidate.moderation_status = 'approved'
          AND candidate.stock > 0
          AND candidate_seller.is_demo_profile = 1
          AND CASE WHEN instr(candidate.image_url, '?') > 0
                   THEN substr(candidate.image_url, 1, instr(candidate.image_url, '?') - 1)
                   ELSE candidate.image_url END =
              CASE WHEN instr(stale.image_url, '?') > 0
                   THEN substr(stale.image_url, 1, instr(stale.image_url, '?') - 1)
                   ELSE stale.image_url END
        ORDER BY CASE WHEN candidate.seller_id = ? THEN 0 ELSE 1 END, candidate.id DESC
        LIMIT 1
      )`).run(sampleSeller.id);

  db.prepare(`UPDATE products
    SET moderation_status = 'rejected'
    WHERE seller_id = ? AND name = 'Black Logo T-Shirt'`).run(sampleSeller.id);
}

const adminEmail = typeof process.env.ADMIN_EMAIL === "string" ? process.env.ADMIN_EMAIL.trim().toLowerCase() : "";
const adminPassword = typeof process.env.ADMIN_PASSWORD === "string" ? process.env.ADMIN_PASSWORD : "";
if (adminEmail && adminPassword) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail) || adminPassword.length < 12 || adminPassword.length > 72) {
    throw new Error("ADMIN_EMAIL must be valid and ADMIN_PASSWORD must be 12-72 characters.");
  }
  const adminExists = db.prepare("SELECT 1 FROM administrators WHERE email = ?").get(adminEmail);
  if (!adminExists) {
    const bcrypt = require("bcryptjs");
    db.prepare("INSERT INTO administrators (email, password_hash) VALUES (?, ?)").run(
      adminEmail,
      bcrypt.hashSync(adminPassword, 12),
    );
  }
}

module.exports = db;
