const db = require("../config/database");

function createForOrder({
  orderId,
  method,
  status,
  accessTokenHash = null,
}) {
  db.prepare(`INSERT INTO payments (order_id, method, status, access_token_hash)
    VALUES (?, ?, ?, ?)`).run(orderId, method, status, accessTokenHash);
}

function setCheckoutRequest(orderId, checkoutRequestId, description) {
  return db.transaction(() => {
    const payment = db.prepare(`UPDATE payments
      SET checkout_request_id = ?, result_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND status = 'pending'`).run(checkoutRequestId, description, orderId);
    if (payment.changes) {
      db.prepare(`UPDATE orders SET mpesa_checkout_request_id = ?, payment_result_description = ?
        WHERE id = ?`).run(checkoutRequestId, description, orderId);
    }
    return payment.changes;
  })();
}

function markFailed(orderId, description) {
  return db.transaction(() => {
    const payment = db.prepare(`UPDATE payments
      SET status = 'failed', result_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND status = 'pending'`).run(description, orderId);
    if (payment.changes) {
      db.prepare(`UPDATE orders SET payment_status = 'failed', payment_result_description = ?
        WHERE id = ? AND payment_status = 'pending'`).run(description, orderId);
    }
    return payment.changes;
  })();
}

function updateFromCallback(orderId, { status, description, receiptNumber = null }) {
  return db.transaction(() => {
    const payment = db.prepare(`UPDATE payments
      SET status = ?, receipt_number = COALESCE(?, receipt_number), result_description = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND status = 'pending'`).run(status, receiptNumber, description, orderId);
    if (payment.changes) {
      db.prepare(`UPDATE orders SET payment_status = ?, mpesa_receipt_number = COALESCE(?, mpesa_receipt_number),
          payment_result_description = ?
        WHERE id = ? AND payment_status = 'pending'`).run(status, receiptNumber, description, orderId);
    }
    return payment.changes;
  })();
}

function prepareRetry(orderId) {
  return db.transaction(() => {
    const payment = db.prepare(`UPDATE payments
      SET status = 'pending', checkout_request_id = NULL, result_description = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND status = 'failed'`).run(orderId);
    if (payment.changes) {
      db.prepare(`UPDATE orders SET payment_status = 'pending', mpesa_checkout_request_id = NULL,
          payment_result_description = NULL
        WHERE id = ? AND payment_status = 'failed'`).run(orderId);
    }
    return payment.changes;
  })();
}

module.exports = {
  createForOrder,
  markFailed,
  prepareRetry,
  setCheckoutRequest,
  updateFromCallback,
};
