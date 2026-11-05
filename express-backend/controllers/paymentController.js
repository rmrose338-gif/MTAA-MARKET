const crypto = require("crypto");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { callbackTokenIsValid, hashPaymentAccessToken, initiateStkPush } = require("../services/mpesaService");
const { validatePhone } = require("../utils/validatePhone");

function hasPaymentAccess(req, order, accessToken) {
  if (req.user && order.user_id === req.user.id) return true;
  if (order.user_id !== null || typeof accessToken !== "string" || !order.payment_access_token_hash) return false;
  const suppliedHash = Buffer.from(hashPaymentAccessToken(accessToken), "hex");
  const savedHash = Buffer.from(order.payment_access_token_hash, "hex");
  return suppliedHash.length === savedHash.length && crypto.timingSafeEqual(suppliedHash, savedHash);
}

async function sendStkPush(order) {
  let payment;
  try {
    payment = await initiateStkPush({
      orderId: order.id,
      amount: order.total + order.delivery_fee,
      phone: order.customer_phone,
    });
  } catch (error) {
    Payment.markFailed(order.id, error.message.slice(0, 500));
    return {
      ...order,
      payment_status: "failed",
      payment_error: error.message,
    };
  }
  Payment.setCheckoutRequest(order.id, payment.checkoutRequestId, payment.customerMessage);
  return {
    ...order,
    payment_status: "pending",
    checkout_request_id: payment.checkoutRequestId,
    payment_message: payment.customerMessage,
  };
}

function handleMpesaCallback(req, res, next) {
  try {
    if (!callbackTokenIsValid(req.query.token)) {
      return res.status(401).json({ message: "M-Pesa callback authentication failed." });
    }
    const callback = req.body?.Body?.stkCallback;
    if (!callback?.CheckoutRequestID || callback.ResultCode === undefined) {
      return res.status(400).json({ message: "Invalid M-Pesa callback payload." });
    }
    const order = Order.findPaymentOrderByCheckoutRequestId(callback.CheckoutRequestID);
    if (!order || order.payment_status !== "pending") {
      return res.json({ ResultCode: 0, ResultDesc: "Callback received." });
    }
    if (Number(callback.ResultCode) !== 0) {
      Payment.updateFromCallback(order.id, {
        status: "failed",
        description: String(callback.ResultDesc || "M-Pesa payment was not completed.").slice(0, 500),
      });
      return res.json({ ResultCode: 0, ResultDesc: "Callback received." });
    }

    const metadata = callback.CallbackMetadata?.Item;
    const valueFor = (name) => metadata?.find((item) => item.Name === name)?.Value;
    const amount = Number(valueFor("Amount"));
    const receipt = valueFor("MpesaReceiptNumber");
    const paidPhone = validatePhone(String(valueFor("PhoneNumber") || ""));
    const expectedPhone = validatePhone(order.customer_phone);
    if (
      amount !== Math.round(order.total + order.delivery_fee)
      || typeof receipt !== "string"
      || !receipt
      || !paidPhone
      || paidPhone !== expectedPhone
    ) {
      Payment.updateFromCallback(order.id, {
        status: "failed",
        description: "M-Pesa callback did not match the expected amount, receipt, or phone number.",
      });
      return res.json({ ResultCode: 0, ResultDesc: "Callback received." });
    }
    Payment.updateFromCallback(order.id, {
      status: "paid",
      receiptNumber: receipt,
      description: "Payment confirmed by M-Pesa.",
    });
    return res.json({ ResultCode: 0, ResultDesc: "Callback received." });
  } catch (error) {
    return next(error);
  }
}

function getPaymentStatus(req, res) {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({ message: "Choose a valid order." });
  }
  const order = Order.findPaymentOrderById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (!hasPaymentAccess(req, order, req.query.access_token)) {
    return res.status(403).json({ message: "You cannot view this payment." });
  }
  return res.json({
    id: order.id,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    mpesa_receipt_number: order.mpesa_receipt_number,
    payment_result_description: order.payment_result_description,
  });
}

async function retryStkPush(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({ message: "Choose a valid order." });
    }
    const order = Order.findPaymentOrderById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (!hasPaymentAccess(req, order, req.body?.access_token)) {
      return res.status(403).json({ message: "You cannot retry this payment." });
    }
    if (order.payment_method !== "mpesa_stk") {
      return res.status(400).json({ message: "This order was not created with M-Pesa STK Push." });
    }
    if (order.payment_status === "paid") {
      return res.status(409).json({ message: "This order has already been paid." });
    }
    if (order.payment_status === "pending") {
      return res.status(409).json({ message: "An M-Pesa payment request is already pending." });
    }
    if (!Payment.prepareRetry(orderId)) {
      return res.status(409).json({ message: "This payment can no longer be retried." });
    }
    const responseOrder = {
      id: order.id,
      total: order.total,
      delivery_fee: order.delivery_fee,
      customer_phone: order.customer_phone,
      payment_method: order.payment_method,
      payment_status: "pending",
      payment_access_token: typeof req.body?.access_token === "string" ? req.body.access_token : null,
    };
    return res.json(await sendStkPush(responseOrder));
  } catch (error) {
    return next(error);
  }
}

module.exports = { getPaymentStatus, handleMpesaCallback, retryStkPush, sendStkPush };
