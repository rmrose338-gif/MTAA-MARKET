import { useEffect, useState } from "react";
import { getSellerSummary, getCategories, createProduct, updateSellerProduct, deleteSellerProduct, getSellerJobs, getJobCategories, createJob } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";

const emptyProduct = { name: "", description: "", price: "", category_id: "", image_url: "", stock: "1" };
const emptyJob = { category: "", title: "", skills: "", description: "", work_images: [""] };

function SellerProductEditor({ product, categories, onSave, onDelete }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: String(product.price),
    category_id: String(product.category_id),
    image_url: product.image_url,
    stock: String(product.stock),
  });
  const [busy, setBusy] = useState(false);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    await onSave(product.id, {
      ...form,
      price: Number(form.price),
      category_id: Number(form.category_id),
      stock: Number(form.stock),
    });
    setBusy(false);
  }

  async function remove() {
    if (!window.confirm(t("Delete this product listing?"))) return;
    setBusy(true);
    await onDelete(product.id);
    setBusy(false);
  }

  return (
    <details className="seller-product-editor">
      <summary>{t("Edit listing")}</summary>
      <form className="customer-profile-form" onSubmit={save}>
        <label>{t("Product name")}<input required minLength="2" maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>{t("Description")}<textarea required minLength="5" maxLength="2000" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        <div className="form-row">
          <label>{t("Price")} (KSh)<input required type="number" min="1" max="1000000" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
          <label>{t("Stock")}<input required type="number" min="0" max="1000000" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label>
        </div>
        <label>{t("Category")}<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}>{categories.map((category) => <option key={category.id} value={category.id}>{t(category.name)}</option>)}</select></label>
        <label>{t("Product photo URL")}<input required type="text" placeholder="Photo URL or existing /images asset for this item" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
        <div className="seller-product-editor-actions">
          <button className="button button-small" type="submit" disabled={busy}>{t("Save changes")}</button>
          <button className="button button-small button-outline" type="button" disabled={busy} onClick={remove}>{t("Delete listing")}</button>
        </div>
      </form>
    </details>
  );
}

function SalesChart({ sales }) {
  const { t } = useLanguage();
  const months = Array.from({ length: 6 }, (_value, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const match = sales.find((item) => item.month === key);
    return {
      key,
      label: date.toLocaleDateString(document.documentElement.lang === "sw" ? "sw-KE" : "en-KE", { month: "short" }),
      total: Number(match?.sales || 0),
    };
  });
  const maximum = Math.max(...months.map((month) => month.total), 1);

  return (
    <section className="dashboard-panel seller-sales-chart">
      <div className="customer-section-heading"><div><h2>{t("Sales performance")}</h2><p className="muted">{t("Completed sales by month for the last six months.")}</p></div></div>
      <div className="seller-chart-bars" role="img" aria-label={t("Monthly completed sales chart")}>
        {months.map((month) => (
          <div className="seller-chart-month" key={month.key}>
            <strong>{formatPrice(month.total)}</strong>
            <div className="seller-chart-track"><span style={{ height: `${Math.max((month.total / maximum) * 100, month.total ? 8 : 2)}%` }} /></div>
            <small>{month.label}</small>
          </div>
        ))}
      </div>
      <ul className="sr-only">{months.map((month) => <li key={month.key}>{month.label}: {formatPrice(month.total)}</li>)}</ul>
    </section>
  );
}

export default function SellerDashboard() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [summary, setSummary] = useState({ products: [], orders: [], sales_by_month: [], totals: { sales: 0, order_count: 0, pending_orders: 0 } });
  const [categories, setCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone || "",
    market_area: user.market_area || "",
    public_contact: Boolean(user.public_contact),
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    const [data, categoryList, jobList, serviceList] = await Promise.all([
      getSellerSummary(), getCategories(), getSellerJobs(), getJobCategories(),
    ]);
    setSummary(data);
    setCategories(categoryList);
    setJobs(jobList);
    setServiceCategories(serviceList);
    if (!form.category_id && categoryList.length) setForm((current) => ({ ...current, category_id: String(categoryList[0].id) }));
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setProfile({
      name: user.name,
      phone: user.phone || "",
      market_area: user.market_area || "",
      public_contact: Boolean(user.public_contact),
    });
  }, [user.name, user.phone]);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await updateProfile(profile);
      setNotice("Your public seller profile has been updated.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) });
      setForm({ ...emptyProduct, category_id: form.category_id });
      setNotice("Your product was submitted for administrator review. It will appear in the marketplace after approval.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleProductUpdate(id, product) {
    setError("");
    setNotice("");
    try {
      const result = await updateSellerProduct(id, product);
      setNotice(t(result.message));
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleProductDelete(id) {
    setError("");
    setNotice("");
    try {
      const result = await deleteSellerProduct(id);
      setNotice(t(result.message));
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleJobSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const workImages = jobForm.work_images.map((image) => image.trim()).filter(Boolean);
      await createJob({ ...jobForm, work_images: workImages });
      setJobForm(emptyJob);
      setNotice("Your work advert is now public.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleServiceChange(categorySlug) {
    const service = serviceCategories.find((item) => item.slug === categorySlug);
    setJobForm((current) => ({
      ...current,
      category: categorySlug,
      title: service?.sample_title || "",
      skills: service?.sample_skills || "",
      description: service?.sample_description || "",
    }));
  }

  const selectedService = serviceCategories.find((category) => category.slug === jobForm.category);
  const selectedCategory = categories.find((category) => String(category.id) === form.category_id);
  const isClothingCategory = ["Fashion", "Clothing & Accessories", "Kids' Clothing", "Teen Clothing", "Adult Clothing", "Older Adults' Clothing", "Baby & Kids", "Shoes & Footwear"].includes(selectedCategory?.name);

  return (
    <section className="container page-section">
      <div className="page-heading"><span className="eyebrow">{t("Your little corner of the market")}</span><h1>{t("Seller space")}</h1><p>{t("Manage your listings and keep up with customer orders.")}</p></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      {notice && <p className="success-message">{notice}</p>}
      <div className="seller-stats">
        <div><span>{t("Total products")}</span><strong>{summary.products.length}</strong></div>
        <div><span>{t("Total orders")}</span><strong>{summary.totals.order_count}</strong></div>
        <div><span>{t("Total sales")} ({t("completed")})</span><strong>{formatPrice(summary.totals.sales)}</strong></div>
        <div><span>{t("Pending orders")}</span><strong>{summary.totals.pending_orders}</strong></div>
      </div>
      <SalesChart sales={summary.sales_by_month} />
      <form className="dashboard-panel add-product-form seller-contact-form" onSubmit={handleProfileSubmit}>
        <h2>{t("Your seller profile and contact permissions")}</h2>
        <p className="muted">{t("Choose whether your phone number and market area appear publicly on your product adverts.")}</p>
        <div className="form-row">
          <label>{t("Your name")}<input required minLength="2" maxLength="80" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
          <label>{t("Phone number")}<input required type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
        </div>
        <label>{t("Shop or market area")}<input maxLength="100" placeholder={t("For example, Gikomba, Nairobi")} value={profile.market_area} onChange={(event) => setProfile({ ...profile, market_area: event.target.value })} /></label>
        <label className="auth-checkbox">
          <input type="checkbox" checked={profile.public_contact} onChange={(event) => setProfile({ ...profile, public_contact: event.target.checked })} />
          <span>{t("Show my phone number and market area on public product adverts.")}</span>
        </label>
        <button className="button button-soft" type="submit">{t("Save seller profile")}</button>
      </form>
      <div className="seller-dashboard-grid">
        <div className="dashboard-panel"><h2>{t("My products and stock")}</h2><p className="muted">{t("New or edited products are reviewed by an administrator before shoppers can see them.")}</p>{summary.products.length ? <div className="seller-products">{summary.products.map((product) => <article className="seller-product-row" key={product.id}><div><img src={product.image_url} alt="" /><span>{product.name}<small>{product.stock} {t("in stock")} · {t(product.moderation_status)}</small></span><strong>{formatPrice(product.price)}</strong></div><SellerProductEditor product={product} categories={categories} onSave={handleProductUpdate} onDelete={handleProductDelete} /></article>)}</div> : <p className="muted">{t("No listings yet. Add your first product.")}</p>}</div>
        <form className="dashboard-panel add-product-form" onSubmit={handleSubmit}>
          <h2>{t("Advertise a product")}</h2>
          <p className="muted">{t("Add a clear product photo, honest description, fair KSh price, and available stock so customers can find and order your work. For clothing and shoes, use the item's original photo; shoppers choose a size, not a color filter.")}</p>
          <label>{t("Product name")}<input required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>{t("Description")}<textarea required rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <div className="form-row"><label>Price (KSh)<input required type="number" min={isClothingCategory ? "30" : "1"} max={isClothingCategory ? "1000" : "1000000"} step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />{isClothingCategory && <small>Keep clothing and footwear affordable: KSh 30–1,000.</small>}</label><label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label></div>
          <label>Category<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>{t("Product photo URL")}<input required type="text" placeholder="https://… (public photo of this exact item)" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
          <button className="button button-full">{t("Publish in the market")}</button>
        </form>
      </div>
      <div className="seller-dashboard-grid job-dashboard-grid">
        <div className="dashboard-panel">
          <h2>{t("Your work adverts")}</h2>
          {jobs.length ? <div className="seller-job-list">{jobs.map((job) => <article key={job.id}><span className="eyebrow">{t(serviceCategories.find((category) => category.slug === job.category)?.name || "Local service")}</span><strong>{t(job.title)}</strong>{job.work_images?.length > 0 && <div className="seller-job-images">{job.work_images.map((image, index) => <img key={`${job.id}-${index}`} src={image} alt={`${t("Work sample")} ${index + 1}`} />)}</div>}<small>{t("Services:")} {t(job.description)}</small><small>{t("Skills:")} {t(job.skills)}</small>{job.worker_phone ? <div className="seller-job-contact"><a href={`tel:${job.worker_phone}`}>{t("Call")} {job.worker_phone}</a></div> : <small>{t("Add a public phone number to your profile to let customers contact you.")}</small>}</article>)}</div> : <p className="muted">{t("No work adverts yet. Share your skills so people nearby can contact you.")}</p>}
        </div>
        <form className="dashboard-panel add-product-form" onSubmit={handleJobSubmit}>
          <h2>{t("Advertise your skills")}</h2>
          <p className="muted">{t("Choose the service you provide. We’ll fill in an editable example advert to help you get started. Change it to describe your own work and availability.")}</p>
          <p className={profile.public_contact ? "muted" : "error-message"}>{profile.public_contact ? t("Your public profile phone number will appear on this advert so customers can call you.") : t("To publish a public service advert, first allow your phone number to be shown in the seller profile above.")}</p>
          <label>{t("Service category")}<select required value={jobForm.category} onChange={(event) => handleServiceChange(event.target.value)}><option value="" disabled>{t("Choose a service")}</option>{serviceCategories.map((category) => <option key={category.slug} value={category.slug}>{t(category.name)}</option>)}</select>{selectedService && <small>{t(selectedService.summary)} {t("Examples:")} {t(selectedService.examples)}</small>}</label>
          {selectedService && (
            <aside className="service-advert-sample" aria-live="polite">
              <strong>{t("Example advert — edit before publishing")}</strong>
              <span>{t(selectedService.sample_title || "Add a clear title for your service")}</span>
              <small>{t("For example:")} {t(selectedService.examples)}</small>
            </aside>
          )}
          <label>{t("Advert title")}<input required minLength="3" maxLength="100" placeholder={t(selectedService ? `For example, ${selectedService.name} available nearby` : "For example, house cleaning available nearby")} value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} /></label>
          <label>{t("Skills you offer")}<input required minLength="2" maxLength="300" placeholder={t("For example, sewing, repairs, cooking")} value={jobForm.skills} onChange={(event) => setJobForm({ ...jobForm, skills: event.target.value })} /></label>
          <label>{t("Services and work details")}<textarea required minLength="10" maxLength="1500" rows="4" placeholder={t("Describe your services, experience, location, and when customers can reach you.")} value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} /><small>{t("This will appear on your public advert so customers know what service you provide.")}</small></label>
          <fieldset className="work-image-fields">
            <legend>{t("Photos of your work")}</legend>
            <small>{t("Add one to three real photos that show work you have done. Use HTTPS photo links.")}</small>
            {jobForm.work_images.map((image, index) => (
              <label key={index}>{`${t("Work photo")} ${index + 1}`}<input required={index === 0} type="url" maxLength="2000" placeholder="https://…" value={image} onChange={(event) => setJobForm((current) => ({ ...current, work_images: current.work_images.map((currentImage, currentIndex) => currentIndex === index ? event.target.value : currentImage) }))} /></label>
            ))}
            {jobForm.work_images.length < 3 && <button className="button button-small button-outline" type="button" onClick={() => setJobForm((current) => ({ ...current, work_images: [...current.work_images, ""] }))}>{t("Add another photo")}</button>}
          </fieldset>
          <button className="button button-full" type="submit">{t("Publish work advert")}</button>
        </form>
      </div>
      <div className="dashboard-panel seller-orders"><h2>{t("My orders")}</h2>{summary.orders.length ? summary.orders.map((order) => <div className="seller-order-row" key={order.id}><span>{t("Order #")}{order.id} · <strong>{t(order.status)}</strong><small>{order.customer_name} · {new Date(order.created_at).toLocaleDateString()} · {t("Items:")} {order.product_choices} · {order.delivery_method === "pickup" ? t("Seller pickup") : order.delivery_address} · {order.delivery_option === "uber" ? t("Uber ride") : order.delivery_option === "motorbike" ? t("Motorbike") : t("Seller-arranged delivery")} · {t("Estimated fee")} {formatPrice(order.delivery_fee || 0)} · {t(order.estimated_delivery)} · {order.payment_method === "mpesa_stk" ? `${t("M-Pesa STK Push:")} ${t(order.payment_status)}${order.mpesa_receipt_number ? ` · ${t("Receipt:")} ${order.mpesa_receipt_number}` : ""}` : order.payment_method === "mpesa_direct" ? t("Customer plans M-Pesa direct to seller; payment not verified") : `${t("Cash due on")} ${order.delivery_method === "pickup" ? t("pickup") : t("delivery")}`} · {order.customer_phone}</small></span><strong>{formatPrice(order.total)}</strong></div>) : <p className="muted">{t("Orders for your products will appear here.")}</p>}</div>
    </section>
  );
}
