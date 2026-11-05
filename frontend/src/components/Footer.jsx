import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-about">
          <Link className="brand footer-brand" to="/" aria-label={t("Mtaa Market home")}>
            <img className="brand-logo footer-brand-logo" src="/images/mtaa-market-logo.png" alt="Mtaa Market logo" />
          </Link>
          <p>{t("Find local goods, support your neighbors, and discover people ready to work.")}</p>
        </div>
        <div className="footer-column">
          <strong>{t("Explore")}</strong>
          <Link to="/products">{t("Shop all")}</Link>
          <Link to="/jobs">{t("Find local services and workers")}</Link>
          <Link to="/products?category=Home%20%26%20Living">{t("Home & Living")}</Link>
          <Link to="/products?category=Food%20%26%20Pantry">{t("Food & Pantry")}</Link>
        </div>
        <div className="footer-column">
          <strong>{t("Join the market")}</strong>
          <Link to="/register">{t("Create an account")}</Link>
          <Link to="/register?role=seller">{t("Sell clothes or offer skills")}</Link>
          <Link to="/cart">{t("Your shopping cart")}</Link>
          <Link to="/admin/login">{t("Admin sign in")}</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Mtaa Market</span>
        <span>{t("Made with care, close to home.")}</span>
      </div>
    </footer>
  );
}
