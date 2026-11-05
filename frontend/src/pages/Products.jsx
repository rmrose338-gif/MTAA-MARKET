import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getCategories, getProducts } from "../services/api.js";
import { getProductFamily, getProductGroupId, productGroups } from "../utils/productGroups.js";
import { useLanguage } from "../context/LanguageContext.jsx";

function isMakeupCollection(product) {
  return product?.category_name === "Beauty & Personal Care" && /makeup/i.test(product.name);
}

function isMakeupVariant(product) {
  return product?.category_name === "Beauty & Personal Care" && /(lipstick|foundation|face powder|mascara|eyeliner|nail polish|makeup brush)/i.test(product.name);
}

export default function Products() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const group = searchParams.get("group") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getProducts({ search, category, min_price: minPrice, max_price: maxPrice }, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setProducts(items);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [search, category, minPrice, maxPrice]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "group") next.delete("category");
    if (key === "category") next.delete("group");
    setSearchParams(next);
  }

  const makeupCollection = products.find(isMakeupCollection);
  const marketProducts = products.filter((product) => {
    if (search) return true;
    if (!makeupCollection) return true;
    if (product.id === makeupCollection.id) return true;
    if (product.category_name !== "Beauty & Personal Care") return true;
    return !isMakeupVariant(product);
  });
  const collectionProducts = group
    ? marketProducts.filter((product) => getProductGroupId(product) === group)
    : [];
  const collections = productGroups
    .map((item) => ({
      ...item,
      products: marketProducts.filter((product) => getProductGroupId(product) === item.id),
    }))
    .filter((item) => item.products.length > 0);
  const otherProducts = marketProducts.filter((product) => !getProductGroupId(product));
  const categoryCollections = categories
    .map((category) => ({
      ...category,
      products: otherProducts.filter((product) => product.category_name === category.name),
    }))
    .filter((category) => category.products.length > 0);
  const visibleProducts = group ? collectionProducts : marketProducts;
  const selectedGroup = productGroups.find((item) => item.id === group);
  const familySections = [...new Set(collectionProducts.map(getProductFamily))]
    .map((family) => ({
      family,
      products: collectionProducts.filter((product) => getProductFamily(product) === family),
    }))
    .sort((first, second) => first.family.localeCompare(second.family));
  const translatedSelectedGroupLabel = t(selectedGroup?.label || "Shop local goods");
  const translatedSelectedGroupDescription = t(selectedGroup?.description || "Choose a clothing or shoe section to see items kept together, or browse all local goods.");

  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">{t("The neighborhood market")}</span>
        <h1>{translatedSelectedGroupLabel}</h1>
        <p>{translatedSelectedGroupDescription}</p>
      </div>
      <div className="catalog-toolbar">
        <label className="search-field">
          <span className="sr-only">{t("Search products")}</span>
          <span aria-hidden="true">⌕</span>
          <input type="search" value={search} onChange={(event) => updateParam("search", event.target.value)} placeholder={t("Search clothes, makeup, groceries, shoes…")} autoComplete="off" />
        </label>
        <label className="filter-select">
          <span className="sr-only">{t("Filter by product category")}</span>
          <select value={category} onChange={(event) => updateParam("category", event.target.value)}>
            <option value="">{t("All categories")}</option>
            {categories.map((item) => <option key={item.id} value={item.name}>{t(item.name)}</option>)}
          </select>
        </label>
        <label className="filter-select">
          <span className="sr-only">{t("Filter by clothing or shoe section")}</span>
          <select value={group} onChange={(event) => updateParam("group", event.target.value)}>
            <option value="">{t("All sections")}</option>
            {productGroups.map((item) => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
          </select>
        </label>
        <label className="price-filter">
          <span>{t("Min KSh")}</span>
          <input type="number" min="0" step="1" value={minPrice} onChange={(event) => updateParam("min_price", event.target.value)} aria-label={t("Minimum price in Kenyan shillings")} placeholder={t("Any")} />
        </label>
        <label className="price-filter">
          <span>{t("Max KSh")}</span>
          <input type="number" min="0" step="1" value={maxPrice} onChange={(event) => updateParam("max_price", event.target.value)} aria-label={t("Maximum price in Kenyan shillings")} placeholder={t("Any")} />
        </label>
      </div>
      {search || category || group || minPrice || maxPrice ? (
        <div className="catalog-filter-summary">
          <span>{loading ? t("Searching the market…") : `${visibleProducts.length} ${t(visibleProducts.length === 1 ? "item" : "items")} ${t("found")}`}</span>
          <button className="text-button" type="button" onClick={() => setSearchParams({})}>{t("Clear filters")}</button>
        </div>
      ) : null}
      {error ? <p className="error-message" role="alert">{error}</p> : loading ? (
        <div className="empty-state" role="status">{t("Finding what you need…")}</div>
      ) : !search && !category && !group ? (
        <>
          <div className="collection-grid">
            {collections.map((item) => (
              <Link
                className="collection-card"
                to={`/products?group=${encodeURIComponent(item.id)}`}
                key={item.id}
              >
                <img src={item.products[0].image_url} alt="" loading="lazy" />
                <span className="collection-card-info">
                  <small>{item.products.length} {item.products.length === 1 ? t("item") : t("items")}</small>
                  <strong>{t(item.label)}</strong>
                  <span>{t(item.description)}</span>
                  <b>{t("Browse section")} <span aria-hidden="true">→</span></b>
                </span>
              </Link>
            ))}
          </div>
          {categoryCollections.length > 0 && (
            <section className="market-category-section" aria-labelledby="market-category-heading">
              <div className="section-heading">
                <div><span className="eyebrow">{t("Browse everyday goods")}</span><h2 id="market-category-heading">{t("Shop by product type")}</h2></div>
              </div>
              <div className="market-category-grid">
                {categoryCollections.map((category) => (
                  <Link className="market-category-card" to={`/products?category=${encodeURIComponent(category.name)}`} key={category.id}>
                    <img src={category.products[0].image_url} alt="" loading="lazy" />
                    <span className="market-category-card-copy">
                      <small>{category.products.length} {category.products.length === 1 ? t("item") : t("items")}</small>
                      <strong>{t(category.name)}</strong>
                      <span>{t("See all")} {t(category.name.toLowerCase())} →</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : visibleProducts.length ? (
        group ? (
          <div className="family-catalog">
            {familySections.map((section) => (
              <section className="family-section" key={section.family}>
                <div className="section-heading innerwear-heading">
                  <div><span className="eyebrow">{t("Same type and audience")}</span><h2>{t(section.family)}</h2></div>
                  <span>{section.products.length} {t("items")}</span>
                </div>
                <div className="product-grid">{section.products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              </section>
            ))}
          </div>
        ) : <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : <div className="empty-state"><span aria-hidden="true">⌕</span><h2>{search || category || group || minPrice || maxPrice ? t("No matching items yet") : t("The market is getting ready")}</h2><p>{search || category || group || minPrice || maxPrice ? t("Try another search or choose different filters.") : t("There are no items to show just yet. Check back soon.")}</p>{(search || category || group || minPrice || maxPrice) && <button className="button button-soft" type="button" onClick={() => setSearchParams({})}>{t("Show all items")}</button>}</div>}
    </section>
  );
}
