import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProduct, getProducts } from "../services/api.js";
import { formatPrice } from "../utils/formatPrice.js";
import { getProductOptionDefinitions, getProductOptionLabel } from "../utils/productOptions.js";
import { getProductGroup, getProductGroupId, getSimilarProducts } from "../utils/productGroups.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const colorValues = {
  Black: "#222222",
  White: "#f6f5f0",
  Gray: "#858585",
  Blue: "#2474c6",
  "Light Blue": "#72b9e8",
  Navy: "#172c58",
  Red: "#d53a36",
  Maroon: "#7d1f38",
  Pink: "#e987ad",
  Purple: "#7848a5",
  Orange: "#e87832",
  Yellow: "#e5c238",
  Green: "#33834b",
  Olive: "#77783d",
  Brown: "#76513a",
  Beige: "#d5bf9b",
  Natural: "#cbb78e",
  Honey: "#bd8139",
  "Dark Brown": "#493126",
  Cream: "#f0e7d4",
  Terracotta: "#be6545",
};

const clothingPreviewMasks = {
  44: "kids-jacket",
  45: "school-uniform",
  46: "school-uniform",
  47: "school-uniform",
  48: "school-uniform",
  49: "tshirt",
  50: "jeans-flatlay",
  51: "hoodie",
  52: "dress",
  53: "track-outfit",
  54: "tshirt",
  55: "trousers",
  56: "dress",
  57: "button-shirt",
  58: "poncho",
  59: "button-shirt",
  60: "trousers",
  76: "tshirt",
  77: "trousers",
  78: "button-shirt",
  79: "hoodie",
  80: "dress",
  81: "dress",
  82: "poncho",
  83: "trousers",
  85: "kids-jacket",
  86: "school-uniform",
  87: "trousers",
};

function isMakeupCollection(product) {
  return product?.category_name === "Beauty & Personal Care" && /makeup/i.test(product.name);
}

function isMakeupVariant(product) {
  return product?.category_name === "Beauty & Personal Care" && /(lipstick|foundation|face powder|mascara|eyeliner|nail polish|makeup brush)/i.test(product.name);
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isSaved, toggleItem } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
  const [relatedProductsError, setRelatedProductsError] = useState("");
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState({});

  useEffect(() => {
    let active = true;
    setProduct(null);
    setRelatedProducts([]);
    setRelatedProductsLoading(true);
    setRelatedProductsError("");
    setError("");
    setOptions({});
    getProduct(id).then((item) => {
      if (!active) return;
      setProduct(item);
      const definitions = getProductOptionDefinitions(item);
      setOptions(Object.fromEntries(Object.entries(definitions).map(([key, values]) => [key, values[0]])));
      const isCollection = isMakeupCollection(item);
      const productGroup = getProductGroup(item);
      getProducts({ category: item.category_name, limit: 100, include_makeup_variants: isCollection }).then((items) => {
        if (!active) return;
        const suggestions = isCollection
          ? items
            .filter((candidate) => String(candidate.id) !== String(item.id))
            .filter((candidate) => candidate.category_name === "Beauty & Personal Care" && isMakeupVariant(candidate))
            .slice(0, 12)
          : getSimilarProducts(item, items);
        setRelatedProducts(suggestions.slice(0, 12));
        setRelatedProductsLoading(false);
      }).catch((err) => {
        if (active) {
          setRelatedProductsError(err.message);
          setRelatedProductsLoading(false);
        }
      });
    }).catch((err) => {
      if (active) setError(err.message);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) return <div className="container page-section"><p className="error-message">{t(error)}</p><Link to="/products">{t("Back to the market")}</Link></div>;
  if (!product) return <div className="container page-section state-message">{t("Loading product…")}</div>;

  async function handleAdd() {
    setAdding(true);
    setCartError("");
    const result = await addItem(product, options);
    if (typeof result === "string") setCartError(result);
    setAdding(false);
  }

  async function handleWishlist() {
    if (!user) {
      navigate("/login");
      return;
    }
    setSaving(true);
    setCartError("");
    const result = await toggleItem(product);
    if (typeof result === "string") setCartError(result);
    setSaving(false);
  }

  const productGroupId = getProductGroupId(product);
  const productGroup = getProductGroup(product);
  const productName = product.name.toLowerCase();
  const hasColorOption = Boolean(getProductOptionDefinitions(product).color);
  const isShoeGroup = productGroupId?.includes("shoes");
  const isClothingGroup = productGroupId?.includes("clothing") || productGroupId?.includes("attire");
  const clothingPreviewMask = clothingPreviewMasks[product.id];
  const previewShape = isShoeGroup
    ? /trainer|sneaker|everyday shoes/.test(productName)
      ? "sneaker"
      : /boot/.test(productName)
        ? "boots"
        : /flat shoes|slippers/.test(productName)
          ? "heels"
          : /clog|sandal/.test(productName)
            ? "sandals"
            : "footwear"
    : hasColorOption && isClothingGroup
      ? clothingPreviewMask || (/trouser|pants|jeans/.test(productName)
        ? "trousers"
        : /dress|gown/.test(productName)
          ? "dress"
          : /skirt/.test(productName)
            ? "skirt"
            : "clothing")
      : productName.includes("basket")
        ? "basket"
        : productName.includes("throw")
          ? "throw"
          : "";
  const browseProductsUrl = productGroup
    ? `/products?group=${encodeURIComponent(productGroup.id)}`
    : `/products?category=${encodeURIComponent(product.category_name)}`;
  const browseProductsLabel = productGroup?.label || product.category_name;
  const translatedName = t(product.name);
  const translatedCategory = t(product.category_name);

  return (
    <section className="container page-section">
      <Link className="back-link" to="/products">← {t("Back to the market")}</Link>
      <div className="product-detail">
        <div className="detail-image">
          <img
            src={product.image_url}
            alt={translatedName || product.name}
          />
          {options.color && previewShape && (
            <span
              className={`product-color-preview product-color-preview-${previewShape}${clothingPreviewMask ? " product-color-preview-masked" : ""}`}
              style={{
                backgroundColor: colorValues[options.color] || options.color.toLowerCase(),
                mixBlendMode: options.color === "Black" ? "multiply" : options.color === "White" ? "screen" : "color",
                ...(clothingPreviewMask && {
                  maskImage: `url("/images/color-masks/${clothingPreviewMask}.svg")`,
                  WebkitMaskImage: `url("/images/color-masks/${clothingPreviewMask}.svg")`,
                }),
              }}
              aria-label={`Preview in ${options.color}`}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="detail-content">
          <span className="eyebrow">{translatedCategory || t(product.category_name)}</span>
          <h1>{translatedName || product.name}</h1>
          <p className="detail-seller">{t("Made by")} <strong>{product.seller_name}</strong></p>
          {product.seller_area && <p className="detail-seller">{t("Market area:")} {product.seller_area}</p>}
          {product.seller_phone && (
            <p className="seller-contact-detail">
              {t("Contact seller:")} <a href={`tel:${product.seller_phone}`}>{product.seller_phone}</a>
            </p>
          )}
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          {Object.entries(getProductOptionDefinitions(product)).map(([key, values]) => key === "color" ? (
            <fieldset className="product-color-field" key={key}>
              <legend>{t("Choose a color:")} <strong>{t(options.color)}</strong></legend>
              <div className="color-swatches" role="group" aria-label={t("Choose a color")}>
                {values.map((value) => (
                  <button
                    className={`color-swatch${options.color === value ? " color-swatch-selected" : ""}`}
                    key={value}
                    type="button"
                    style={{ "--swatch-color": colorValues[value] || value.toLowerCase() }}
                    aria-label={`${t("Choose")} ${t(value)}`}
                    aria-pressed={options.color === value}
                    title={value}
                    onClick={() => setOptions((current) => ({ ...current, color: value }))}
                  />
                ))}
              </div>
            </fieldset>
          ) : (
            <label className="product-option-field" key={key}>
              {`${t("Choose")} ${t(getProductOptionLabel(key).toLowerCase())}`}
              <select value={options[key] || ""} onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.value }))}>
                {values.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          ))}
          {options.color && <p className="color-preview-note" aria-live="polite">{t("Color preview:")} {t(options.color)}</p>}
          <p className="stock-note">{product.stock > 0 ? `${product.stock} ${t("available")}` : t("Currently out of stock")}</p>
          <button className="button" disabled={product.stock < 1 || adding} onClick={handleAdd}>{product.stock < 1 ? t("Out of stock") : adding ? t("Adding…") : t("Add to cart")}</button>
          <button className="button button-soft" type="button" disabled={saving} onClick={handleWishlist}>
            {saving ? t("Saving…") : isSaved(product.id) ? t("Remove from wishlist") : t("Add to wishlist")}
          </button>
          {cartError && <p className="error-message" role="alert">{t(cartError)}</p>}
        </div>
      </div>
      <section className="related-products" aria-labelledby="related-products-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {relatedProductsLoading
                ? t("Finding similar samples")
                : `${relatedProducts.length} ${t("more")} ${t((productGroup?.label || product.category_name).toLowerCase())} ${t(relatedProducts.length === 1 ? "item" : "items")}`}
            </span>
            <h2 id="related-products-heading">
              {t(isMakeupCollection(product) ? "Inside this makeup collection" : "Similar items you may like")}
            </h2>
          </div>
          <Link className="text-link" to={browseProductsUrl}>
            {t("View all")} {t(browseProductsLabel.toLowerCase())}
          </Link>
        </div>
        {relatedProductsLoading ? (
          <p className="state-message">{t("Finding similar items to choose from…")}</p>
        ) : relatedProductsError ? (
          <p className="error-message" role="alert">
            {t("Could not load similar items:")} {t(relatedProductsError)}{" "}
            <Link to={browseProductsUrl}>{t("Browse the category")}</Link>
          </p>
        ) : relatedProducts.length > 0 ? (
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}
          </div>
        ) : (
          <p className="state-message">
            {t("No similar samples are available yet.")}{" "}
            <Link className="text-link" to={browseProductsUrl}>{t("Browse all")} {t(browseProductsLabel.toLowerCase())}</Link>
          </p>
        )}
      </section>
    </section>
  );
}
