import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) return <div className="container state-message">{t("Loading your account…")}</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  if (role === "seller" && user.seller_status !== "approved") {
    return <section className="container page-section"><div className="empty-state"><h1>{t("Seller account under review")}</h1><p>{t("An administrator must approve your seller account before you can manage listings or orders.")}</p></div></section>;
  }
  return children;
}
