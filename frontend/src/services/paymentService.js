import { getPaymentStatus, retryPayment } from "./api.js";

export function getPaymentDetails(orderId, accessToken) {
  return getPaymentStatus(orderId, accessToken);
}

export function retryPaymentPrompt(orderId, accessToken) {
  return retryPayment(orderId, accessToken);
}
