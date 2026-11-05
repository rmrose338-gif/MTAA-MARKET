import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { getOrders } from "../services/api.js";
import { formatPrice } from "../utils/formatPrice.js";

export default function CustomerDashboard() {
  const { user, updateProfile } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlist, error: wishlistError } = useWishlist();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone || "",
    delivery_address: user.delivery_address || "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getOrders()
      .then((customerOrders) => { if (active) setOrders(customerOrders); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setProfile({
      name: user.name,
      phone: user.phone || "",
      delivery_address: user.delivery_address || "",
    });
  }, [user.name, user.phone, user.delivery_address]);

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await updateProfile(profile);
      setNotice(t("Your profile and delivery address have been saved."));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  const pendingOrders = orders.filter((order) => order.status === "processing").length;
  const completedOrders = orders.filter((order) => order.status === "complete").length;
  const metrics = [
    [t("Total orders"), orders.length, t("All your saved orders")],
    [t("Pending orders"), pendingOrders, t("Being prepared or delivered")],
    [t("Completed orders"), completedOrders, t("Successfully completed")],
    [t("Wishlist items"), wishlist.length, t("Products saved for later")],
  ];

  return (
    <section className="container page-section customer-dashboard">
      <div className="page-heading">
        <span className="eyebrow">{t("Your Mtaa Market account")}</span>
        <h1>{t("Customer dashboard")}</h1>
        <p>{t("Welcome back")}, {user.name}. {t("Your orders, saved products, and account details are together here.")}</p>
      </div>
      {error && <p className="error-message" role="alert">{t(error)}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}
      {wishlistError && <p className="error-message" role="alert">{t("Could not load your wishlist:")} {t(wishlistError)}</p>}

      <div className="customer-metric-grid">
        {metrics.map(([label, value, note]) => (
          <article className="customer-metric-card" key={label}>
            <span>{label}</span><strong>{value}</strong><small>{note}</small>
          </article>
        ))}
      </div>

      <nav className="customer-dashboard-links" aria-label={t("Customer dashboard sections")}>
        <a href="#customer-profile">{t("My profile")}</a>
        <Link to="/orders">{t("My orders & tracking")}</Link>
        <a href="#customer-wishlist">{t("My wishlist")}</a>
        <Link to="/cart">{t("Shopping cart")} ({itemCount})</Link>
        <a href="#customer-payments">{t("My payments")}</a>
        <a href="#customer-language">{t("Language")}</a>
      </nav>

      <div className="customer-dashboard-grid">
        <section className="dashboard-panel" id="customer-profile">
          <h2>{t("My profile and delivery address")}</h2>
          <p className="muted">{t("Save your contact details and preferred delivery location for your next order.")}</p>
          <form className="customer-profile-form" onSubmit={saveProfile}>
            <label>{t("Your name")}<input required minLength="2" maxLength="80" autoComplete="name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
            <label>{t("Phone number")}<input required type="tel" inputMode="tel" autoComplete="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
            <label>{t("Preferred delivery address")}<textarea rows="3" maxLength="300" placeholder={t("Add estate, street, town, and any helpful directions")} value={profile.delivery_address} onChange={(event) => setProfile({ ...profile, delivery_address: event.target.value })} /></label>
            <button className="button" type="submit" disabled={saving}>{saving ? t("Saving…") : t("Save changes")}</button>
          </form>
        </section>

        <section className="dashboard-panel" id="customer-payments">
          <div className="customer-section-heading"><div><h2>{t("Recent orders and payments")}</h2><p className="muted">{t("Order and payment updates from your saved history.")}</p></div><Link className="text-link" to="/orders">{t("View all")} →</Link></div>
          {orders.length ? <div className="customer-order-list">
            {orders.slice(0, 5).map((order) => (
              <article key={order.id}>
                <div><strong>{t("Order #")}{order.id}</strong><small>{new Date(order.created_at).toLocaleDateString()}</small></div>
                <span className={`customer-order-status status-${order.status}`}>{t(order.status)}</span>
                <div><strong>{formatPrice(order.total + (order.delivery_fee || 0))}</strong><small>{t(order.payment_status)}{order.mpesa_receipt_number ? ` · ${order.mpesa_receipt_number}` : ""}</small></div>
              </article>
            ))}
          </div> : <p className="muted">{t("Your saved orders and payment updates will appear here.")} <Link to="/products">{t("Browse the market")}</Link></p>}
        </section>
      </div>

      <section className="dashboard-panel customer-wishlist-panel" id="customer-wishlist">
        <div className="customer-section-heading"><div><h2>{t("My wishlist")}</h2><p className="muted">{t("Products you have saved to revisit.")}</p></div><Link className="text-link" to="/products">{t("Find products")} →</Link></div>
        {wishlist.length ? <div className="product-grid">{wishlist.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p className="muted">{t("Your wishlist is empty. Save products from the market to find them here.")} <Link to="/products">{t("Shop products")}</Link></p>}
      </section>

      <section className="dashboard-panel customer-language-panel" id="customer-language">
        <h2>{t("Language")}</h2>
        <p className="muted">{t("Choose your preferred language from the selector in the main navigation.")}</p>
      </section>
    </section>
  );
}
