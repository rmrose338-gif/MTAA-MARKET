import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLanguage();
  return <section className="container not-found"><span className="eyebrow">404 · {t("Wrong turn")}</span><h1>{t("This corner is still being built.")}</h1><p>{t("Let’s take you back to the good finds.")}</p><Link className="button" to="/">{t("Back to the market")}</Link></section>;
}
