import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";
import { getProductOptionDefinitions, getProductOptionLabel } from "../utils/productOptions.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isSaved, toggleItem } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isMakeupCollection = product.category_name === "Beauty & Personal Care" && /makeup/i.test(product.name);
  const optionDefinitions = getProductOptionDefinitions(product);
  const needsOptions = Object.keys(optionDefinitions).length > 0;
  const [options, setOptions] = useState(() => Object.fromEntries(
    Object.entries(optionDefinitions).map(([key, values]) => [key, values[0]]),
  ));
  const translatedName = t(product.name);
  const translatedCategory = t(product.category_name);

  async function handleAdd() {
    setAdding(true);
    setAdded(false);
    setError("");
    const result = await addItem(product);
    setAdded(result === true);
    if (typeof result === "string") setError(result);
    setAdding(false);
  }

  async function handleWishlist() {
    if (!user) {
      navigate("/login");
      return;
    }
    setSaving(true);
    setError("");
    const result = await toggleItem(product);
    if (typeof result === "string") setError(result);
    setSaving(false);
  }

  return (
    <article className="product-card">
      <Link className="product-image-wrap" to={`/products/${product.id}`}>
        <img
          src={product.image_url}
          alt={translatedName || product.name}
          loading="lazy"
        />
      </Link>
      <div className="product-card-body">
        <div className="maker-identity">
          <div>
            <span className="maker-offering"><strong>{product.seller_name || t("Local maker")}</strong> {t("offers")}</span>
            <Link className="product-title" to={`/products/${product.id}`}>{translatedName || product.name}</Link>
          </div>
        </div>
        <div className="product-title-row">
          {product.seller_area && <span className="product-seller-area">{product.seller_area}</span>}
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <button className="wishlist-toggle" type="button" disabled={saving} onClick={handleWishlist}>
          {saving ? t("Saving…") : isSaved(product.id) ? t("Remove from wishlist") : t("Add to wishlist")}
        </button>
        {product.seller_phone && (
          <div className="product-contact-links">
            <a className="seller-contact" href={`tel:${product.seller_phone}`}>{t("Call seller")}</a>
          </div>
        )}
        {isMakeupCollection ? (
          <Link className="button button-full button-soft" to={`/products/${product.id}`}>{t("View collection")}</Link>
        ) : (
          <>
            {needsOptions && (
              <div className="product-card-options">
                {Object.entries(optionDefinitions).map(([key, values]) => (
                  <label key={key}>
                    <span>{t(getProductOptionLabel(key))}</span>
                    <select
                      aria-label={`${t("Choose")} ${t(getProductOptionLabel(key).toLowerCase())} ${t("for")} ${translatedName}`}
                      value={options[key]}
                      onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.value }))}
                    >
                      {values.map((value) => <option key={value} value={value}>{t(value)}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            )}
          <button
            className="button button-full button-soft"
            type="button"
            disabled={product.stock < 1 || adding}
            onClick={handleAdd}
          >
            {product.stock < 1 ? t("Out of stock") : adding ? t("Adding…") : added ? t("Added to cart") : t("Add to cart")}
          </button>
          </>
        )}
        {error && <p className="cart-inline-error" role="alert">{error}</p>}
      </div>
    </article>
  );
}
