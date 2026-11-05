import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function handleBack() {
    setMenuOpen(false);
    navigate(location.key === "default" ? "/" : -1);
  }

  return (
    <header className="site-header">
      <nav className={`navbar container${menuOpen ? " menu-open" : ""}`} aria-label={t("Main navigation")}>
        <div className="nav-brand-group">
          <button className="nav-history-button" type="button" onClick={handleBack} aria-label={t("Go back")} title={t("Go back")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6M9 12h12" /></svg>
          </button>
          <Link className="nav-history-button" to="/" aria-label={t("Go home")} title={t("Go home")} onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" /></svg>
          </Link>
          <Link className="brand" to="/" aria-label={t("Mtaa Market home")}>
            <img className="brand-logo" src="/images/mtaa-market-logo.png" alt="Mtaa Market logo" />
          </Link>
        </div>
        <label className="language-control">
          <span className="sr-only">{t("Language")}</span>
          <select aria-label={t("Language")} value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => <option key={option.code} value={option.code} disabled={option.disabled}>{option.name}</option>)}
          </select>
        </label>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t("Close navigation menu") : t("Open navigation menu")}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div className="nav-links" id="primary-navigation">
          <NavLink to="/products">{t("Shop")}</NavLink>
          <NavLink to="/jobs">{t("Services & jobs")}</NavLink>
          {user?.role === "buyer" && <NavLink to="/customer">{t("My dashboard")}</NavLink>}
          {user?.role === "buyer" && <NavLink to="/orders">{t("My orders")}</NavLink>}
          {user?.role === "seller" && <NavLink to="/seller">{t("Seller space")}</NavLink>}
        </div>
        <div className="nav-actions">
          {user?.role !== "seller" && (
            <Link className="cart-link" to="/cart" aria-label={`${t("Cart")}, ${itemCount} items`} title={t("Cart")} onClick={() => setMenuOpen(false)}>
              <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6" />
                <circle cx="10" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>
              <span className="sr-only">{t("Cart")}</span>
              <span className="cart-count">{itemCount}</span>
            </Link>
          )}
          {user ? (
            <>
              <span className="nav-user">{t("Hi")}, {user.name.split(" ")[0]}</span>
              <button className="button button-small button-outline" type="button" onClick={handleLogout}>{t("Sign out")}</button>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login" onClick={() => setMenuOpen(false)}>{t("Sign in")}</Link>
              <Link className="button button-small" to="/register?role=seller" onClick={() => setMenuOpen(false)}>{t("Sell with us")}</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
