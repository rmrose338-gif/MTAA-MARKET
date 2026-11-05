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

CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);

INSERT OR IGNORE INTO payments (
  order_id, method, status, checkout_request_id, receipt_number,
  result_description, access_token_hash, created_at
)
SELECT
  id, payment_method, payment_status, mpesa_checkout_request_id,
  mpesa_receipt_number, payment_result_description, payment_access_token_hash, created_at
FROM orders;
