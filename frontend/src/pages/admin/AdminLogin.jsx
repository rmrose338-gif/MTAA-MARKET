import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin, createFirstAdmin, getAdminSetupStatus } from "../../services/adminApi.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const [setupAvailable, setSetupAvailable] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupStatusError, setSetupStatusError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getAdminSetupStatus()
      .then(({ setupAvailable: available }) => {
        if (active) setSetupAvailable(available);
      })
      .catch((requestError) => {
        if (active) setSetupStatusError(requestError.message);
      });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (isSettingUp && password !== confirmPassword) {
      setError(t("Passwords do not match."));
      return;
    }
    setBusy(true);
    try {
      if (isSettingUp) {
        await createFirstAdmin({ email, password });
      } else {
        await adminLogin({ password });
      }
      navigate("/admin/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <Link className="admin-brand admin-login-brand" to="/"><span className="brand-mark">M</span><span>Mtaa Market<small>{t("Administration")}</small></span></Link>
        <label className="admin-language-control">
          <span>{t("Language")}</span>
          <select aria-label={t("Language")} value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => <option key={option.code} value={option.code}>{option.name}</option>)}
          </select>
        </label>
        <h1>{isSettingUp ? t("Set up administrator") : t("Administrator sign in")}</h1>
        <p>{isSettingUp ? t("Create the first administrator account with your email and a new password.") : t("This area is only for approved Mtaa Market administrators.")}</p>
        {error && <p className="error-message" role="alert">{error}</p>}
        {setupStatusError && !isSettingUp && <p className="error-message" role="alert">{setupStatusError}</p>}
        {isSettingUp && <label>{t("Email")}<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
        <label>{isSettingUp ? t("New password (12–72 characters)") : t("Password")}<input type="password" autoComplete={isSettingUp ? "new-password" : "current-password"} minLength={isSettingUp ? 12 : undefined} maxLength={isSettingUp ? 72 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {isSettingUp && <label>{t("Confirm new password")}<input type="password" autoComplete="new-password" minLength="12" maxLength="72" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>}
        <button className="button button-full" disabled={busy}>{busy ? (isSettingUp ? t("Creating account…") : t("Signing in…")) : (isSettingUp ? t("Create administrator account") : t("Sign in"))}</button>
        {setupAvailable && <button className="admin-back-link admin-mode-toggle" type="button" onClick={() => { setIsSettingUp(!isSettingUp); setError(""); setPassword(""); setConfirmPassword(""); }}>{isSettingUp ? t("Back to sign in") : t("Set a new administrator password")}</button>}
        <Link className="admin-back-link" to="/">{t("Return to Mtaa Market")}</Link>
      </form>
    </section>
  );
}
