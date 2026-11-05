import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PaymentStatus from "../components/PaymentStatus.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getPaymentDetails, retryPaymentPrompt } from "../services/paymentService.js";
import { formatPrice } from "../utils/formatPrice.js";

export default function Payment() {
  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const initialOrder = state?.orderConfirmation;
  const [order, setOrder] = useState(
    initialOrder && String(initialOrder.id) === id ? initialOrder : null,
  );
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!order || order.payment_status !== "pending") return undefined;
    let active = true;
    const refreshPayment = async () => {
      try {
        const payment = await getPaymentDetails(order.id, order.payment_access_token);
        if (active) {
          setOrder((current) => current?.id === order.id ? { ...current, ...payment } : current);
          setError("");
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      }
    };
    refreshPayment();
    const interval = window.setInterval(refreshPayment, 3000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [order?.id, order?.payment_status, order?.payment_access_token]);

  async function retryPayment() {
    setRetrying(true);
    setError("");
    try {
      const updatedOrder = await retryPaymentPrompt(order.id, order.payment_access_token);
      setOrder((current) => ({ ...current, ...updatedOrder }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRetrying(false);
    }
  }

  if (!order) {
    return (
      <section className="container page-section payment-page">
        <div className="payment-card">
          <span className="eyebrow">{t("Payment details")}</span>
          <h1>{t("Payment session unavailable")}</h1>
          <p>{t("Open the payment confirmation from the checkout where this order was placed.")}</p>
          <Link className="button" to={user ? "/orders" : "/products"}>{t("Continue shopping")}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container page-section payment-page">
      <div className="payment-card">
        <span className="eyebrow">Order #{order.id}</span>
        <h1>{t("Complete your M-Pesa payment")}</h1>
        <p>{t("Estimated order total:")} <strong>{formatPrice(order.total + (order.delivery_fee || 0))}</strong></p>
        <PaymentStatus
          status={order.payment_status}
          message={order.payment_error || order.payment_message || order.payment_result_description}
          receipt={order.mpesa_receipt_number}
          onRetry={retryPayment}
          retrying={retrying}
        />
        {error && <p className="error-message" role="alert">{error}</p>}
        <p className="payment-safety-note">{t("Approve the payment only on your phone. Mtaa Market will never ask you to enter or share your M-Pesa PIN on this page.")}</p>
        <Link className="text-link" to="/orders">{t("View your orders")} →</Link>
      </div>
    </section>
  );
}
