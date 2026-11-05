import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: searchParams.get("role") === "seller" ? "seller" : "buyer",
    market_area: "",
    public_contact: false,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      const returnTo = location.state?.from;
      const destination = form.role === "buyer" && returnTo
        ? `${returnTo.pathname || "/"}${returnTo.search || ""}${returnTo.hash || ""}`
        : form.role === "seller" ? "/seller" : "/customer";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">{t("Join the neighborhood")}</span>
        <h1>{t("Make yourself at home")}</h1>
        <p>{t("Seller accounts are for listing products and services. To shop and place orders, create a buyer account or sign in.")}</p>
        {error && <p className="error-message" role="alert">{error}</p>}
        <label>{t("I want to")}
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="buyer">{t("Shop as a customer")}</option>
            <option value="seller">{t("Sell clothes or offer my skills")}</option>
          </select>
        </label>
        <label>{t(form.role === "seller" ? "Your name or shop name" : "Your name")}<input autoComplete="name" required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>{t("Phone number")}<input type="tel" inputMode="tel" autoComplete="tel" required placeholder="0712 345 678" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><small>{t("Use a Kenyan mobile number. A number can only be linked to one seller account.")}</small></label>
        {form.role === "seller" && (
          <>
            <label>{t("Shop or market area (optional)")}<input type="text" maxLength="100" placeholder={t("For example, Gikomba, Nairobi")} value={form.market_area} onChange={(event) => setForm({ ...form, market_area: event.target.value })} /></label>
            <label className="auth-checkbox">
              <input type="checkbox" checked={form.public_contact} onChange={(event) => setForm({ ...form, public_contact: event.target.checked })} />
              <span>{t("Show my phone number and market area on my public product and service adverts.")}</span>
            </label>
          </>
        )}
        <label>{t("Password")}<input type="password" autoComplete="new-password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button className="button button-full" disabled={busy}>{busy ? t("Creating account…") : t("Create an account")}</button>
        <p className="auth-switch">{t("Already have an account?")} <Link to="/login" state={location.state}>{t("Sign in")}</Link></p>
      </form>
    </section>
  );
}
