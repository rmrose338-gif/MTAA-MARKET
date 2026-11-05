import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { formatProductOptions, productOptionsKey } from "../utils/productOptions.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Cart() {
  const { t } = useLanguage();
  const { items, updateQuantity, removeItem, total, cartError, clearCartError } = useCart();
  const navigate = useNavigate();

  return (
    <section className="container page-section">
      <div className="page-heading"><span className="eyebrow">{t("Your picks")}</span><h1>{t("Shopping cart")}</h1></div>
      {cartError && <p className="error-message" role="alert">{t(cartError)} <button className="text-button" type="button" onClick={clearCartError}>{t("Dismiss")}</button></p>}
      {!items.length ? (
        <div className="empty-state"><span aria-hidden="true">♡</span><h2>{t("Your cart is taking a little break")}</h2><p>{t("Find something lovely from a local seller.")}</p><Link className="button" to="/products">{t("Explore products")}</Link></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-row" key={`${item.product_id}-${productOptionsKey(item.options)}`}>
                <img src={item.image_url} alt="" />
                <div className="cart-item-info"><Link to={`/products/${item.product_id}`}>{item.name}</Link><span>{item.seller_name}</span>{formatProductOptions(item.options) && <small>{formatProductOptions(item.options)}</small>}<strong>{formatPrice(item.price)}</strong></div>
                <label className="quantity-control"><span className="sr-only">{t("Quantity")}: {item.name}</span><input type="number" min="1" max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(item, Number(event.target.value))} /></label>
                <button className="remove-button" onClick={() => removeItem(item)} aria-label={`${t("Remove")} ${item.name}`}>{t("Remove")}</button>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <h2>{t("Order summary")}</h2>
            <div><span>{t("Items")}</span><strong>{formatPrice(total)}</strong></div>
            <p>{t("Choose delivery or seller pickup and confirm your payment method at checkout.")}</p>
            <button className="button button-full" onClick={() => navigate("/checkout")}>{t("Continue to checkout")}</button>
          </aside>
        </div>
      )}
    </section>
  );
}
