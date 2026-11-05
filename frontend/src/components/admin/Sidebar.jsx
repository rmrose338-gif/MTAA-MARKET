import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";

const sections = [
  ["dashboard", "Dashboard"],
  ["products", "Manage products"],
  ["sellers", "Manage sellers"],
  ["customers", "Manage customers"],
  ["orders", "Manage orders"],
  ["payments", "Manage payments"],
  ["categories", "Categories"],
  ["complaints", "Reports & complaints"],
  ["analytics", "Sales & analytics"],
  ["settings", "Settings"],
];

export default function Sidebar({ onSignOut }) {
  const { language, setLanguage, languageOptions, t } = useLanguage();
  return (
    <aside className="admin-sidebar">
      <NavLink className="admin-brand" to="/admin/dashboard"><span className="brand-mark">M</span><span>Mtaa Market<small>{t("Administration")}</small></span></NavLink>
      <label className="admin-language-control">
        <span>{t("Language")}</span>
        <select aria-label={t("Language")} value={language} onChange={(event) => setLanguage(event.target.value)}>
          {languageOptions.map((option) => <option key={option.code} value={option.code} disabled={option.disabled}>{option.name}</option>)}
        </select>
      </label>
      <nav aria-label={t("Admin pages")}>{sections.map(([path, label]) => (
        <NavLink key={path} to={`/admin/${path}`} className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}>{t(label)}</NavLink>
      ))}</nav>
      <button className="admin-signout" type="button" onClick={onSignOut}>{t("Sign out")}</button>
    </aside>
  );
}
