import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMpesaPaymentStatus, getOrders, retryMpesaPayment, submitComplaint } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { formatProductOptions } from "../utils/productOptions.js";

export default function MyOrders() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [reportingOrder, setReportingOrder] = useState(null);
  const [report, setReport] = useState({ subject: "", description: "", customer_name: "", customer_phone: "" });
  const [notice, setNotice] = useState("");
  const { state } = useLocation();
  const [confirmation, setConfirmation] = useState(state?.orderConfirmation || null);
  const [retryingPayment, setRetryingPayment] = useState(false);

  useEffect(() => {
    if (!confirmation?.checkout_request_id || confirmation.payment_status !== "pending") return undefined;
    let active = true;
    const refreshPayment = async () => {
      try {
        const payment = await getMpesaPaymentStatus(confirmation.id, confirmation.payment_access_token);
        if (active) setConfirmation((current) => current?.id === confirmation.id ? { ...current, ...payment } : current);
      } catch (paymentError) {
        if (active) setError(paymentError.message);
      }
    };
    refreshPayment();
    const interval = window.setInterval(refreshPayment, 3000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [confirmation?.id, confirmation?.checkout_request_id, confirmation?.payment_status, confirmation?.payment_access_token]);

  async function submitOrderReport(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await submitComplaint({ ...report, order_id: reportingOrder });
      setNotice(t("Your report for order # was sent to Mtaa Market support.").replace("#", `#${reportingOrder}`));
      setReportingOrder(null);
      setReport({ subject: "", description: "", customer_name: "", customer_phone: "" });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function retryPayment() {
    setRetryingPayment(true);
    setError("");
    try {
      const order = await retryMpesaPayment(confirmation.id, confirmation.payment_access_token);
      setConfirmation((current) => ({ ...current, ...order }));
    } catch (retryError) {
      setError(retryError.message);
    } finally {
      setRetryingPayment(false);
    }
  }

  useEffect(() => {
    if (user) getOrders().then(setOrders).catch((err) => setError(err.message));
  }, [user]);

  return (
    <section className="container page-section">
      <div className="page-heading"><span className="eyebrow">{t("Your neighborhood finds")}</span><h1>{t("My orders")}</h1><p>{t("Keep track of what you’ve ordered from local sellers.")}</p></div>
      {error && <p className="error-message">{t(error)}</p>}
      {notice && <p className="success-message" role="status">{t(notice)}</p>}
      {confirmation && (
        <aside className="order-confirmation" role="status">
          <span className="eyebrow">{t("Order received")}</span>
          <h2>{t("Your order # has been placed").replace("#", `#${confirmation.id}`)}</h2>
          <p>{t("Estimated arrival:")} {t(confirmation.estimated_delivery)}. {t("This is an estimate; the seller will confirm your delivery time.")}</p>
          <p>{t("Sample delivery fee:")} {formatPrice(confirmation.delivery_fee || 0)}. {t("Estimated total:")} {formatPrice(confirmation.total + (confirmation.delivery_fee || 0))}.</p>
          {confirmation.payment_method === "mpesa_stk" ? (
            <div className="order-payment-status" role="status">
              <p><strong>{t("M-Pesa status:")} {t(confirmation.payment_status || "pending")}</strong></p>
              {confirmation.payment_status === "paid"
                ? <p>{t("Payment confirmed")}{confirmation.mpesa_receipt_number ? ` · ${t("Receipt:")} ${confirmation.mpesa_receipt_number}` : ""}.</p>
                : confirmation.payment_status === "failed"
                  ? <><p>{t(confirmation.payment_error || confirmation.payment_result_description || "The M-Pesa payment was not completed.")}</p><button className="button button-small" type="button" disabled={retryingPayment} onClick={retryPayment}>{retryingPayment ? t("Sending prompt…") : t("Retry M-Pesa payment")}</button></>
                  : <p>{t(confirmation.payment_message || confirmation.payment_result_description || "Check your phone and enter your M-Pesa PIN to approve the payment. We’ll update this page when the payment is confirmed.")}</p>}
            </div>
          ) : confirmation.payment_method === "mpesa_direct"
            ? <p>{t("Payment is not collected or verified by this website. Confirm the seller’s M-Pesa details and total directly before sending money.")}</p>
            : <p>{t("Cash is due to the seller on delivery or pickup.")}</p>}
          {!user && <div className="order-report">
            {reportingOrder === confirmation.id ? (
              <form onSubmit={submitOrderReport}>
                <label>{t("Your name")}<input required minLength="2" maxLength="80" value={report.customer_name} onChange={(event) => setReport({ ...report, customer_name: event.target.value })} /></label>
                <label>{t("Phone used at checkout")}<input required type="tel" value={report.customer_phone} onChange={(event) => setReport({ ...report, customer_phone: event.target.value })} /></label>
                <label>{t("What is the issue?")}<input required minLength="3" maxLength="120" value={report.subject} onChange={(event) => setReport({ ...report, subject: event.target.value })} placeholder={t("For example, missing item")} /></label>
                <label>{t("Details")}<textarea required minLength="10" maxLength="2000" rows="3" value={report.description} onChange={(event) => setReport({ ...report, description: event.target.value })} /></label>
                <button className="button button-small" type="submit">{t("Send report")}</button>
                <button className="button button-small button-ghost" type="button" onClick={() => setReportingOrder(null)}>{t("Cancel")}</button>
              </form>
            ) : <button className="button button-small button-outline" type="button" onClick={() => { setReport({ subject: "", description: "", customer_name: confirmation.customer_name || "", customer_phone: "" }); setReportingOrder(confirmation.id); }}>{t("Report an issue with this order")}</button>}
          </div>}
          {user
            ? <Link className="text-link" to="/orders">{t("View saved order details")} →</Link>
            : <p>{t("Sign in with a buyer account to view and manage your orders.")}</p>}
        </aside>
      )}
      {orders.length ? <div className="orders-list">{orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div className="order-card-heading"><div><span>{t("Order #")}{order.id}</span><small>{new Date(order.created_at).toLocaleDateString()}</small></div><strong>{formatPrice(order.total + (order.delivery_fee || 0))} {t("estimated")}</strong></div>
          <div className="order-items">{order.items.map((item) => <div key={`${order.id}-${item.product_id}-${JSON.stringify(item.options)}`}><span>{item.name} {formatProductOptions(item.options) && <small>({formatProductOptions(item.options)})</small>} <small>× {item.quantity}</small></span><span>{formatPrice(Number(item.price) * item.quantity)}</span></div>)}</div>
          <p className="order-fulfillment">{order.delivery_method === "pickup" ? t("Seller pickup") : `${t("Deliver to:")} ${order.delivery_address}`} · {t(order.delivery_option === "uber" ? "Uber ride" : order.delivery_option === "motorbike" ? "Motorbike" : order.delivery_method === "pickup" ? "Pickup" : "Seller-arranged delivery")} · {t("Estimated delivery:")} {t(order.estimated_delivery)} · {t("Estimated delivery fee:")} {formatPrice(order.delivery_fee || 0)} · {order.payment_method === "mpesa_stk" ? `${t("M-Pesa STK Push:")} ${t(order.payment_status)}${order.mpesa_receipt_number ? ` · ${t("receipt")} ${order.mpesa_receipt_number}` : ""}` : order.payment_method === "mpesa_direct" ? t("M-Pesa directly to seller; not verified") : `${t("Cash due on")} ${t(order.delivery_method === "pickup" ? "pickup" : "delivery")}`} · {t("Contact:")} {order.customer_phone}</p>
          <span className={`status-badge status-${order.status}`}>{t(order.status)}</span>
          {user && <div className="order-report">
            {reportingOrder === order.id ? (
              <form onSubmit={submitOrderReport}>
                <label>{t("What is the issue?")}<input required minLength="3" maxLength="120" value={report.subject} onChange={(event) => setReport({ ...report, subject: event.target.value })} placeholder={t("For example, missing item")} /></label>
                <label>{t("Details")}<textarea required minLength="10" maxLength="2000" rows="3" value={report.description} onChange={(event) => setReport({ ...report, description: event.target.value })} /></label>
                <button className="button button-small" type="submit">{t("Send report")}</button>
                <button className="button button-small button-ghost" type="button" onClick={() => setReportingOrder(null)}>{t("Cancel")}</button>
              </form>
            ) : <button className="button button-small button-outline" type="button" onClick={() => {
              setReport({ subject: "", description: "", customer_name: "", customer_phone: "" });
              setReportingOrder(order.id);
            }}>{t("Report an issue")}</button>}
          </div>}
        </article>
      ))}</div> : !error && !confirmation && <div className="empty-state">
        <h2>{t("No orders yet")}</h2>
        <p>{t("Your next great local find is waiting.")}</p>
        <Link className="button" to="/products">{t("Browse the market")}</Link>
      </div>}
    </section>
  );
}
