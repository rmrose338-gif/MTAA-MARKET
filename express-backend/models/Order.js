const db = require("../config/database");

function findPaymentOrderById(orderId) {
  return db.prepare(`SELECT o.id, o.user_id, o.total, o.delivery_fee, o.customer_phone,
      p.method AS payment_method, p.status AS payment_status,
      p.checkout_request_id AS mpesa_checkout_request_id,
      p.receipt_number AS mpesa_receipt_number,
      p.result_description AS payment_result_description,
      p.access_token_hash AS payment_access_token_hash
    FROM orders o JOIN payments p ON p.order_id = o.id
    WHERE o.id = ?`).get(orderId);
}

function findPaymentOrderByCheckoutRequestId(checkoutRequestId) {
  return db.prepare(`SELECT o.id, o.total, o.delivery_fee, o.customer_phone, p.status AS payment_status
    FROM orders o JOIN payments p ON p.order_id = o.id
    WHERE p.checkout_request_id = ?`).get(checkoutRequestId);
}

module.exports = { findPaymentOrderByCheckoutRequestId, findPaymentOrderById };
