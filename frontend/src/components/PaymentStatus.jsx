import { useLanguage } from "../context/LanguageContext.jsx";

export default function PaymentStatus({ status, message, receipt, onRetry, retrying = false }) {
  const { t } = useLanguage();
  const descriptions = {
    pending: "Check your phone and enter your M-Pesa PIN to approve the request. This page will refresh automatically.",
    paid: "Payment confirmed by M-Pesa.",
    failed: "The M-Pesa request was not completed. You can try sending a new prompt.",
  };
  const currentStatus = descriptions[status] ? status : "pending";

  return (
    <div className={`payment-status payment-status-${currentStatus}`} role="status" aria-live="polite">
      <div className="payment-status-heading">
        <span className="payment-status-indicator" aria-hidden="true" />
        <strong>{t("M-Pesa payment")} {t(currentStatus)}</strong>
      </div>
      <p>{t(message || descriptions[currentStatus])}</p>
      {receipt && <p className="payment-receipt">{t("Receipt:")} <strong>{receipt}</strong></p>}
      {currentStatus === "failed" && onRetry && (
        <button className="button button-small" type="button" onClick={onRetry} disabled={retrying}>
          {retrying ? t("Sending prompt…") : t("Retry M-Pesa payment")}
        </button>
      )}
    </div>
  );
}
