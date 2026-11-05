import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder, getPaymentOptions } from "../services/api.js";
import { formatPrice } from "../utils/formatPrice.js";
import { formatProductOptions, productOptionsKey } from "../utils/productOptions.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const deliveryOptions = {
  motorbike: {
    name: "Boda boda delivery",
    image: "/images/motorbike-delivery.jpg",
    price: 150,
    arrival: "A local boda boda courier; about 30–60 minutes after the seller accepts",
  },
  uber: {
    name: "Uber delivery",
    image: "/images/uber-delivery-car.jpg",
    price: 350,
    arrival: "An Uber ride; about 45–90 minutes after the seller accepts",
  },
  pickup: {
    name: "Collect from the seller",
    image: null,
    price: 0,
    arrival: "Collection time confirmed by the seller",
  },
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("motorbike");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.delivery_address || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentOptions, setPaymentOptions] = useState(null);
  const [paymentOptionsError, setPaymentOptionsError] = useState("");
  const selectedDelivery = deliveryOptions[deliveryOption];
  const isPickup = deliveryOption === "pickup";

  useEffect(() => {
    getPaymentOptions()
      .then(setPaymentOptions)
      .catch((availabilityError) => setPaymentOptionsError(availabilityError.message));
  }, []);

  useEffect(() => {
    if (user) {
      setCustomerPhone(user.phone || "");
      setDeliveryAddress(user.delivery_address || "");
    }
  }, [user]);

  if (!items.length && !busy) return <Navigate to="/cart" replace />;

  async function placeOrder(event) {
    event.preventDefault();
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (!/^\+?[\d\s()-]{7,20}$/.test(customerPhone.trim()) || phoneDigits.length < 7) {
      setError(t("Enter a valid phone number so the seller can contact you."));
      return;
    }
    if (!isPickup && deliveryAddress.trim().length < 8) {
      setError(t("Enter a delivery location with at least 8 characters."));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const order = await createOrder({
        delivery_method: isPickup ? "pickup" : "delivery",
        delivery_option: deliveryOption,
        delivery_address: isPickup ? "" : deliveryAddress.trim(),
        customer_phone: customerPhone.trim(),
        payment_method: paymentMethod,
      });
      await clearCart();
      if (paymentMethod === "mpesa_stk") {
        navigate(`/payment/${order.id}`, { replace: true, state: { orderConfirmation: order } });
        return;
      }
      navigate("/orders", { replace: true, state: { orderConfirmation: order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container page-section">
      <Link className="back-link" to="/cart">← {t("Back to cart")}</Link>
      <div className="page-heading"><span className="eyebrow">{t("Almost yours")}</span><h1>{t("Checkout")}</h1><p>{t("Choose delivery or pickup and pay by cash, direct to the seller, or securely with an M-Pesa phone prompt.")}</p></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      <form className="cart-layout checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-details">
          <section className="checkout-panel">
            <h2>1. {t("Choose delivery or pickup")}</h2>
            <div className="delivery-options" role="radiogroup" aria-label={t("Delivery method")}>
              {Object.entries(deliveryOptions).map(([key, option]) => (
                <label className={`delivery-option${deliveryOption === key ? " delivery-option-selected" : ""}`} key={key}>
                  <input type="radio" name="delivery-option" value={key} checked={deliveryOption === key} onChange={() => setDeliveryOption(key)} />
                  {option.image
                    ? <img src={option.image} alt="" />
                    : <span className="pickup-illustration" aria-hidden="true">⌂</span>}
                  <span className="delivery-option-info">
                    <strong>{t(option.name)}</strong>
                    <span>{t(option.arrival)}</span>
                    <strong>{option.price ? `${t("Sample fee")}: ${formatPrice(option.price)}` : t("Free")}</strong>
                  </span>
                </label>
              ))}
            </div>
            {!isPickup && (
              <label className="checkout-field">{t("Delivery location")}
                <textarea required rows="3" minLength="8" maxLength="300" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder={t("Estate, street, town, and any directions")} />
              </label>
            )}
            <label className="checkout-field">{t("Phone number")}
              <input required type="tel" autoComplete="tel" maxLength="20" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder={t("For example, 0712 345 678")} />
              {paymentMethod === "mpesa_stk" && <small>{t("The M-Pesa payment prompt will be sent to this Kenyan number.")}</small>}
            </label>
            <p className="delivery-note">{t("These are sample charges and arrival windows, not live Uber quotes or a booked courier. The seller confirms the final delivery cost and timing with you.")}</p>
          </section>
          <section className="checkout-panel">
            <h2>2. {t("Payment")}</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input type="radio" name="payment" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                <span><strong>{t(`Cash ${isPickup ? "on pickup" : "on delivery"}`)}</strong><small>{t("Pay the seller in person when your order arrives or you collect it.")}</small></span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" value="mpesa_stk" checked={paymentMethod === "mpesa_stk"} disabled={paymentOptions?.mpesa_stk_enabled === false} onChange={() => setPaymentMethod("mpesa_stk")} />
                <span>
                  <strong>{t("Pay with M-Pesa")}{paymentOptions?.mpesa_stk_enabled ? ` (${paymentOptions.mpesa_environment})` : ""}</strong>
                  <small>{t("We’ll send an STK Push to your phone. Enter your M-Pesa PIN only on your phone; never share it here. The request includes the estimated delivery fee.")}</small>
                  {paymentOptions?.mpesa_stk_enabled === false && (
                    <small>
                      {t("M-Pesa checkout is unavailable. Configure these API settings in express-backend/.env, then restart the API:")}
                      {" "}{paymentOptions.mpesa_missing_settings.join(", ")}.
                      {" "}{t("The callback URL must be a publicly reachable HTTPS address.")}
                    </small>
                  )}
                  {paymentOptionsError && <small role="status">{t("Could not check M-Pesa setup:")} {t(paymentOptionsError)}. {t("You can still try selecting it.")}</small>}
                </span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" value="mpesa_direct" checked={paymentMethod === "mpesa_direct"} onChange={() => setPaymentMethod("mpesa_direct")} />
                <span><strong>{t("M-Pesa directly to the seller")}</strong><small>{t("Ask the seller to confirm their payment details and the final total before sending money.")}</small></span>
              </label>
            </div>
            {paymentMethod === "mpesa_stk"
              ? <p className="delivery-note">{t("Your order is marked paid only after the M-Pesa callback confirms the transaction. If the prompt expires or is declined, you can retry it from the order confirmation.")}</p>
              : <p className="delivery-note">{t("Direct-to-seller M-Pesa is not collected or verified by this website. Confirm the seller’s payment details and final total before sending money.")}</p>}
          </section>
        </div>
        <aside className="order-summary checkout-summary">
          <h2>{t("Your items")}</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div className="checkout-item" key={`${item.product_id}-${productOptionsKey(item.options)}`}>
              <span>{item.name}{formatProductOptions(item.options) && <small>{formatProductOptions(item.options)}</small>}<small>{t("Qty")} {item.quantity}</small></span>
                <strong>{formatPrice(Number(item.price) * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-total"><span>{t("Items")}</span><strong>{formatPrice(total)}</strong></div>
          <div className="checkout-fee"><span>{t(isPickup ? "Pickup" : "Sample delivery fee")}</span><strong>{formatPrice(selectedDelivery.price)}</strong></div>
          <div className="checkout-grand-total"><span>{t("Estimated total")}</span><strong>{formatPrice(total + selectedDelivery.price)}</strong></div>
          <p>{t("Delivery fee and arrival time are estimates until the seller confirms them. ETA starts after seller acceptance.")}</p>
          <button className="button button-full" type="submit" disabled={busy}>{busy ? paymentMethod === "mpesa_stk" ? t("Sending M-Pesa prompt…") : t("Placing order…") : paymentMethod === "mpesa_stk" ? t("Place order & pay with M-Pesa") : t("Place order")}</button>
        </aside>
      </form>
    </section>
  );
}
