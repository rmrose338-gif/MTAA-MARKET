import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from?.pathname || "";
  const shoppingSignIn = returnPath === "/cart" || returnPath === "/checkout" || returnPath.startsWith("/products");
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login({ ...form, phone: form.name.trim() });
      const returnTo = location.state?.from;
      const destination = user.role === "buyer" && returnTo
        ? `${returnTo.pathname || "/"}${returnTo.search || ""}${returnTo.hash || ""}`
        : user.role === "seller" ? "/seller" : "/customer";
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
        <span className="eyebrow">{t("Welcome back")}</span>
        <h1>{t("Sign in to your account")}</h1>
        <p>{t(shoppingSignIn ? "Sign in with a buyer account to shop and add products to your cart. You will return to the item after signing in." : "Each customer and seller uses their own account. New here? Create a free account to get started.")}</p>
        {error && <p className="error-message" role="alert">{error}</p>}
        <label>{t("Name")}<input type="text" autoComplete="username" placeholder={t("Enter your name or seller phone number")} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <p className="auth-help">{t("Customers sign in with their name and password. Sellers can enter their registered phone number in the same field.")}</p>
        <label>{t("Password")}<input type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button className="button button-full" disabled={busy}>{busy ? t("Signing in…") : t("Sign in")}</button>
        <p className="auth-switch">{t("New to Mtaa Market?")} <Link to="/register" state={location.state}>{t("Create an account")}</Link></p>
      </form>
    </section>
  );
}
