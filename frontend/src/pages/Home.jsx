import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getCategories, getProducts } from "../services/api.js";
import { getProductGroupId, productGroups } from "../utils/productGroups.js";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "buyer") {
      setLoading(false);
      setProducts([]);
      setCategories([]);
      return;
    }
    getCategories().then(setCategories).catch((err) => setError(err.message));
    getProducts({ limit: 100 })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  function handleSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  }

  const groupedCategoryNames = new Set(products.filter(getProductGroupId).map((product) => product.category_name));
  const everydayCategories = categories.filter((category) => !groupedCategoryNames.has(category.name));
  const bestSellers = products
    .filter((product) => Number(product.sold_count) > 0)
    .sort((first, second) => Number(second.sold_count) - Number(first.sold_count))
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <span className="eyebrow">{t("Your neighborhood marketplace")}</span>
          <h1>{t("Welcome to")}<br /><em>Mtaa Market.</em></h1>
          <p>{t(user?.role === "buyer" ? "Shop everyday favorites from local sellers, all in one friendly neighborhood market." : "Create a buyer account or sign in to browse products and place orders from local sellers.")}</p>
          {user?.role === "buyer" && (
            <form className="home-search" role="search" onSubmit={handleSearch}>
              <label className="sr-only" htmlFor="home-product-search">{t("Search products")}</label>
              <span aria-hidden="true">⌕</span>
              <input id="home-product-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search products")} />
              <button className="button" type="submit">{t("Search")}</button>
            </form>
          )}
          <div className="hero-actions">
            <Link to={user?.role === "buyer" ? "/products" : user ? "/register?role=buyer" : "/login"} className="button">
              {t(user?.role === "buyer" ? "Shop the market" : user ? "Create a buyer account" : "Sign in to shop")}
            </Link>
            {!user && <Link to="/register?role=buyer" className="button button-ghost">{t("Create a buyer account")}</Link>}
            <Link to="/register?role=seller" className="button button-ghost">{t("Sell in the market")} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-note">{t("Seller?")} <Link to="/register?role=seller">{t("Create a free seller account")}</Link></div>
        </div>
        <div className="hero-art" role="img" aria-label={t("Colorful local market goods")}>
          <div className="hero-art-caption"><span>{t("LOCAL FINDS")}</span><strong>{t("Made with care.")}</strong></div>
        </div>
      </section>
      {user?.role === "buyer" && <section className="container section category-section">
        <div className="section-heading">
          <div><span className="eyebrow">{t("Browse by who it's for")}</span><h2>{t("Shop clothing and shoes by section")}</h2></div>
          <Link className="text-link" to="/products">{t("See everything")} <span aria-hidden="true">→</span></Link>
        </div>
        <div className="category-pills">
          {productGroups.slice(0, 6).map((group, index) => (
            <Link key={group.id} to={`/products?group=${encodeURIComponent(group.id)}`} className={`category-pill category-${index + 1}`}>
              <span aria-hidden="true">{group.icon}</span>{t(group.label)}<span aria-hidden="true">↗</span>
            </Link>
          ))}
          {everydayCategories.map((category, index) => (
            <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`} className={`category-pill category-${index + 1}`}>
              <span aria-hidden="true">{/phone|electronic/i.test(category.name) ? "▣" : /produce|farm|agriculture/i.test(category.name) ? "♧" : /home|household/i.test(category.name) ? "⌂" : "◒"}</span>
              {t(category.name)}<span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link to="/jobs" className="category-pill category-4">
            <span aria-hidden="true">♧</span>{t("Community services")}<span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>}
      {user?.role === "buyer" && <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">{t("Handpicked for you")}</span><h2>{t("Popular around here")}</h2></div>
            <Link className="text-link" to="/products">{t("Shop all products")} <span aria-hidden="true">→</span></Link>
          </div>
          {error ? <p className="error-message" role="alert">{t("Could not load products")}: {error}</p> : loading ? (
            <div className="empty-state" role="status">{t("Finding the good things in your neighborhood…")}</div>
          ) : products.filter((product) => !getProductGroupId(product)).length ? (
            <div className="product-grid">{products.filter((product) => !getProductGroupId(product)).slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">✳</span>
              <h2>{t("The market is getting ready")}</h2>
              <p>{t("There are no products to show just yet. Check back soon or browse the market.")}</p>
              <Link className="button" to="/products">{t("Explore the market")}</Link>
            </div>
          )}
        </div>
      </section>}
      {user?.role === "buyer" && bestSellers.length > 0 && (
        <section className="container section">
          <div className="section-heading">
            <div><span className="eyebrow">{t("Customer favorites")}</span><h2>{t("Best-selling products")}</h2></div>
            <Link className="text-link" to="/products">{t("Shop all products")} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="product-grid">{bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </section>
      )}
      {user?.role === "buyer" && <section className="container maker-ad">
        <div className="maker-ad-image" role="img" aria-label={t("Fresh produce displayed at a neighborhood market")} />
        <div className="maker-ad-copy">
          <span className="eyebrow">{t("A good thing grows locally")}</span>
          <h2>{t("Meet the makers behind the market.")}</h2>
          <p>{t("From handmade homewares to pantry favorites, discover real stories and thoughtful finds from your community.")}</p>
          <Link className="button" to="/products">{t("Find your local favorite")} <span aria-hidden="true">→</span></Link>
        </div>
      </section>}
      <section className="container seller-banner">
        <div><span className="eyebrow">{t("Your neighborhood needs you")}</span><h2>{t("Looking for local work?")}</h2><p>{t("Share your skills and let nearby people contact you about work.")}</p></div>
        <Link className="button" to="/register?role=seller">{t("Advertise your skills")} <span aria-hidden="true">→</span></Link>
      </section>
    </>
  );
}
