import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import DataTable from "../../components/admin/DataTable.jsx";
import Sidebar from "../../components/admin/Sidebar.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  changeAdminPassword,
  clearAdminToken,
  createAdminAccount,
  createAdminCategory,
  deleteAdminCategory,
  getAdmin,
  getAdminAnalytics,
  getAdminCategories,
  getAdminComplaints,
  getAdminCustomers,
  getAdminDashboard,
  getAdminOrders,
  getAdminPayments,
  getAdminProducts,
  getAdminSettings,
  getAdminSellers,
  updateAdminCategory,
  updateAdminProduct,
  updateAdminProductStatus,
  updateComplaintStatus,
  updateCustomerStatus,
  updateOrderStatus,
  updateSellerStatus,
} from "../../services/adminApi.js";
import "../../styles/admin.css";

const pageInfo = {
  dashboard: ["Dashboard", "A quick view of activity across the marketplace."],
  products: ["Manage products", "Review listings, update details, approve them, or remove them from public view."],
  sellers: ["Manage sellers", "Review seller registrations and approve or suspend accounts."],
  customers: ["Manage customers", "View customer accounts and respond to account issues."],
  orders: ["Manage orders", "Track order fulfillment and update reported order status."],
  payments: ["Manage payments", "Review M-Pesa transaction references and payment results."],
  categories: ["Categories", "Add, rename, and maintain the marketplace product categories."],
  complaints: ["Reports & complaints", "Review customer and seller reports and record their resolution status."],
  analytics: ["Sales & analytics", "Review completed sales, order activity, and popular products."],
  settings: ["Settings", "Manage administrator access and review recent admin actions."],
};

function displayDate(value) {
  const locale = document.documentElement.lang === "sw" ? "sw-KE" : "en-KE";
  return value ? new Date(`${value.replace(" ", "T")}Z`).toLocaleString(locale) : "—";
}

function ProductEditor({ product, onSave }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    category_id: String(product.category_id),
  });
  return (
    <details className="admin-edit">
      <summary>{t("Edit")}</summary>
      <form onSubmit={(event) => { event.preventDefault(); onSave(product.id, { ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) }); }}>
        <label>{t("Name")}<input required maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>{t("Description")}<textarea required minLength="5" maxLength="2000" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        <div className="admin-edit-row">
          <label>{t("Price")}<input required type="number" min="1" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
          <label>{t("Stock")}<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label>
        </div>
        <button className="button button-small" type="submit">{t("Save product")}</button>
      </form>
    </details>
  );
}

function AdminDashboard() {
  const { t } = useLanguage();
  const { section = "dashboard" } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "" });
  const title = t(pageInfo[section]?.[0] || "Dashboard");
  const description = t(pageInfo[section]?.[1] || pageInfo.dashboard[1]);

  const loadSection = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loaders = {
        dashboard: getAdminDashboard,
        products: getAdminProducts,
        sellers: getAdminSellers,
        customers: getAdminCustomers,
        orders: getAdminOrders,
        payments: getAdminPayments,
        categories: getAdminCategories,
        complaints: getAdminComplaints,
        analytics: getAdminAnalytics,
        settings: getAdminSettings,
      };
      const result = await (loaders[section] || loaders.dashboard)();
      setData(result);
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401) {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, section]);

  useEffect(() => {
    if (!localStorage.getItem("mtaa_admin_token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    let active = true;
    getAdmin()
      .then((currentAdmin) => {
        if (active) setAdmin(currentAdmin);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
        } else {
          setError(requestError.message);
        }
      });
    return () => { active = false; };
  }, [navigate]);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  async function perform(action, successMessage, reload = true) {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const result = await action();
      setNotice(t(successMessage || result?.message || "Saved."));
      if (reload) await loadSection();
      return result;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  if (!pageInfo[section] && section !== "dashboard") return <Navigate to="/admin/dashboard" replace />;

  const products = Array.isArray(data) ? data : [];
  return (
    <div className="admin-shell">
      <Sidebar onSignOut={signOut} />
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            {section !== "dashboard" && <Link className="admin-back-button" to="/admin/dashboard" aria-label={t("Back to dashboard")}><span aria-hidden="true">←</span> {t("Back to dashboard")}</Link>}
            <span className="eyebrow">{t("Mtaa Market admin")}</span><h1>{title}</h1>
          </div>
          <span className="admin-identity">{t("Administrator")}</span>
        </header>
        <p className="admin-page-description">{description}</p>
        {error && <p className="error-message" role="alert">{error}</p>}
        {notice && <p className="success-message" role="status">{notice}</p>}
        {loading ? <p className="admin-loading">{t("Loading")} {title.toLowerCase()}…</p> : (
          <>
            {section === "dashboard" && data && <DashboardPage data={data} />}
            {section === "products" && <ProductsPage products={products} busy={busy} perform={perform} />}
            {section === "sellers" && <SellersPage sellers={products} busy={busy} perform={perform} />}
            {section === "customers" && <CustomersPage customers={products} busy={busy} perform={perform} />}
            {section === "orders" && <OrdersPage orders={products} busy={busy} perform={perform} />}
            {section === "payments" && <PaymentsPage payments={products} />}
            {section === "categories" && (
              <CategoriesPage
                categories={products}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                busy={busy}
                perform={perform}
              />
            )}
            {section === "complaints" && <ComplaintsPage complaints={products} busy={busy} perform={perform} />}
            {section === "analytics" && data && <AnalyticsPage data={data} />}
            {section === "settings" && data && (
              <SettingsPage
                data={data}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                newAdmin={newAdmin}
                setNewAdmin={setNewAdmin}
                busy={busy}
                perform={perform}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function DashboardPage({ data }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const metrics = [
    [t("Total sales"), `KSh ${Number(data.total_sales || 0).toLocaleString()}`, t("Orders marked complete")],
    [t("Total orders"), data.orders, `${data.orders_last_7_days || 0} ${t("in the last 7 days")}`],
    [t("Total customers"), data.customers || 0, t("Registered buyer accounts")],
    [t("Total sellers"), data.sellers, `${data.pending_sellers || 0} ${t("awaiting approval")}`],
    [t("Total products"), data.products, `${data.pending_products || 0} ${t("awaiting review")}`],
    [t("Pending orders"), data.pending_orders || 0, t("Being prepared or delivered")],
  ];
  return (
    <div className="admin-dashboard">
      <div className="admin-stat-grid">
        {metrics.map(([label, value, note]) => <StatCard key={label} label={label} value={value} note={note} />)}
      </div>

      <section className="admin-dashboard-section">
        <div className="admin-section-heading"><div><h2>{t("What needs attention")}</h2><p>{t("Priority work to keep the marketplace useful, safe, and trustworthy.")}</p></div></div>
        <div className="admin-recommendations">
          {(data.recommendations || []).map((item) => (
            <article key={item.title} className={`admin-recommendation priority-${item.priority}`}>
              <span>{item.priority}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-dashboard-columns">
        <section className="admin-dashboard-section">
          <div className="admin-section-heading"><h2>{t("Low / empty stock")}</h2><button className="admin-link-button" onClick={() => navigate("/admin/products")}>{t("Manage products")} →</button></div>
          {data.low_stock_products?.length ? <div className="admin-list">
            {data.low_stock_products.map((product) => (
              <div key={product.id} className="admin-list-row">
                <div><strong>{product.name}</strong><small>{product.category_name} · {product.seller_name}</small></div>
                <span className={`admin-stock ${product.stock === 0 ? "empty" : "low"}`}>{product.stock === 0 ? t("Out of stock") : `${product.stock} ${t("left")}`}</span>
              </div>
            ))}
          </div> : <p className="admin-empty-inline">{t("No approved products have critically low stock.")}</p>}
        </section>

        <section className="admin-dashboard-section">
          <div className="admin-section-heading"><h2>{t("Recent activity")}</h2><button className="admin-link-button" onClick={() => navigate("/admin/orders")}>{t("View orders")} →</button></div>
          {data.recent_orders?.length ? <div className="admin-list">
            {data.recent_orders.map((order) => (
              <div key={order.id} className="admin-list-row">
                <div><strong>{t("Order")} #{order.id} · {order.customer_name || order.account_name || t("Guest")}</strong><small>{displayDate(order.created_at)} · KSh {Number(order.total).toLocaleString()}</small></div>
                <span className={`admin-status status-${order.status}`}>{t(order.status)}</span>
              </div>
            ))}
          </div> : <p className="admin-empty-inline">{t("No orders have been placed yet.")}</p>}
        </section>
      </div>

      <div className="admin-dashboard-columns">
        <section className="admin-dashboard-section">
          <div className="admin-section-heading"><h2>{t("Category coverage")}</h2><button className="admin-link-button" onClick={() => navigate("/admin/categories")}>{t("Edit categories")} →</button></div>
          <div className="admin-category-list">
            {(data.category_coverage || []).map((category) => (
              <div key={category.name}><span>{t(category.name)}</span><strong>{category.product_count} {t("approved")}</strong></div>
            ))}
          </div>
        </section>
        <section className="admin-dashboard-section">
          <div className="admin-section-heading"><h2>{t("Market launch readiness")}</h2></div>
          <ul className="admin-checklist">
            <li>{t("Define refund, cancellation, and dispute rules.")}</li>
            <li>{t("Verify at least 10 useful listings across priority categories.")}</li>
            <li>{t("Set seller identity, quality, and M-Pesa verification checks.")}</li>
            <li>{t("Back up the SQLite database and test restoration.")}</li>
            <li>{t("Publish support phone/email and monitor complaints daily.")}</li>
            <li>{t("Restrict admin access and use a unique strong password.")}</li>
            <li>{t("Monitor failed M-Pesa payments and callback delivery.")}</li>
          </ul>
        </section>
      </div>

      {data.activity?.length > 0 && <section className="admin-dashboard-section">
        <div className="admin-section-heading"><h2>{t("Latest administrator actions")}</h2><button className="admin-link-button" onClick={() => navigate("/admin/settings")}>{t("View audit log")} →</button></div>
        <div className="admin-list">
          {data.activity.slice(0, 6).map((item) => <div key={item.id} className="admin-list-row"><div><strong>{item.admin_email || t("Administrator")}</strong><small>{t(item.action)} · {t(item.entity_type)} #{item.entity_id}</small></div><small>{displayDate(item.created_at)}</small></div>)}
        </div>
      </section>}
    </div>
  );
}

function PaymentsPage({ payments }) {
  const { t } = useLanguage();
  const columns = [
    { key: "order_id", label: t("Order"), render: (row) => <strong>#{row.order_id}</strong> },
    { key: "customer", label: t("Customer"), render: (row) => <>{row.customer_name || row.account_name || t("Guest")}<small>{row.customer_phone || "—"}</small></> },
    { key: "amount", label: t("Amount"), render: (row) => `KSh ${Number(row.total).toLocaleString()}` },
    { key: "method", label: t("Method"), render: (row) => t(row.method) },
    { key: "status", label: t("Payment status"), render: (row) => <span className={`admin-status status-${row.status}`}>{t(row.status)}</span> },
    { key: "receipt_number", label: t("M-Pesa receipt"), render: (row) => row.receipt_number || "—" },
    { key: "checkout_request_id", label: t("Transaction reference"), render: (row) => row.checkout_request_id || "—" },
    { key: "result_description", label: t("Result"), render: (row) => row.result_description || "—" },
  ];
  return <DataTable columns={columns} rows={payments} emptyMessage={t("No payment records are available yet.")} />;
}

function ProductsPage({ products, busy, perform }) {
  const { t } = useLanguage();
  const columns = [
    { key: "product", label: t("Product"), render: (row) => <div className="admin-product-cell"><img src={row.image_url} alt="" /><span><strong>{row.name}</strong><small>{t(row.category_name)} · {row.seller_name}</small></span></div> },
    { key: "price", label: t("Price / stock"), render: (row) => <>KSh {Number(row.price).toLocaleString()}<small className="admin-cell-note">{row.stock} {t("available")}</small></> },
    { key: "moderation_status", label: t("Review status"), render: (row) => <span className={`admin-status status-${row.moderation_status}`}>{t(row.moderation_status)}</span> },
    { key: "actions", label: t("Actions"), render: (row) => (
      <div className="admin-actions">
        <ProductEditor product={row} onSave={(id, fields) => perform(() => updateAdminProduct(id, fields), "Product updated.")} />
        {row.moderation_status !== "approved" && <button className="button button-small" disabled={busy} onClick={() => perform(() => updateAdminProductStatus(row.id, "approved"), t("Product approved."))}>{t("Approve")}</button>}
        {row.moderation_status !== "rejected" && <button className="button button-small button-danger" disabled={busy} onClick={() => perform(() => updateAdminProductStatus(row.id, "rejected"), t("Product removed from the marketplace."))}>{t("Remove")}</button>}
        {row.moderation_status === "rejected" && <button className="button button-small button-outline" disabled={busy} onClick={() => perform(() => updateAdminProductStatus(row.id, "pending"), t("Product returned to review."))}>{t("Return to review")}</button>}
      </div>
    ) },
  ];
  return <DataTable columns={columns} rows={products} emptyMessage={t("No products have been listed yet.")} />;
}

function SellersPage({ sellers, busy, perform }) {
  const { t } = useLanguage();
  const columns = [
    { key: "name", label: t("Seller"), render: (row) => <><strong>{row.name}</strong><small className="admin-cell-note">{row.email || row.phone || t("No contact supplied")}</small></> },
    { key: "market_area", label: t("Market area"), render: (row) => row.market_area || t("Not provided") },
    { key: "product_count", label: t("Listings") },
    { key: "seller_status", label: t("Status"), render: (row) => <span className={`admin-status status-${row.seller_status}`}>{t(row.seller_status)}</span> },
    { key: "actions", label: t("Actions"), render: (row) => <div className="admin-actions">
      {row.seller_status !== "approved" && <button className="button button-small" disabled={busy} onClick={() => perform(() => updateSellerStatus(row.id, "approved"), t("Seller approved."))}>{t("Approve")}</button>}
      {row.seller_status !== "suspended" && <button className="button button-small button-danger" disabled={busy} onClick={() => perform(() => updateSellerStatus(row.id, "suspended"), t("Seller suspended."))}>{t("Suspend")}</button>}
      {row.seller_status === "suspended" && <button className="button button-small button-outline" disabled={busy} onClick={() => perform(() => updateSellerStatus(row.id, "approved"), t("Seller reinstated."))}>{t("Reinstate")}</button>}
    </div> },
  ];
  return <DataTable columns={columns} rows={sellers} emptyMessage={t("No seller accounts yet.")} />;
}

function CustomersPage({ customers, busy, perform }) {
  const { t } = useLanguage();
  const columns = [
    { key: "name", label: t("Customer"), render: (row) => <><strong>{row.name}</strong><small className="admin-cell-note">{row.email || row.phone || t("No contact supplied")}</small></> },
    { key: "created_at", label: t("Joined"), render: (row) => displayDate(row.created_at) },
    { key: "order_count", label: t("Orders") },
    { key: "account_status", label: t("Account"), render: (row) => <span className={`admin-status status-${row.account_status}`}>{t(row.account_status)}</span> },
    { key: "actions", label: t("Actions"), render: (row) => <button className={`button button-small ${row.account_status === "active" ? "button-danger" : "button-outline"}`} disabled={busy} onClick={() => perform(() => updateCustomerStatus(row.id, row.account_status === "active" ? "suspended" : "active"), t(row.account_status === "active" ? "Customer suspended." : "Customer reactivated."))}>{t(row.account_status === "active" ? "Suspend" : "Reactivate")}</button> },
  ];
  return <DataTable columns={columns} rows={customers} emptyMessage={t("No customer accounts yet.")} />;
}

function OrdersPage({ orders, busy, perform }) {
  const { t } = useLanguage();
  const columns = [
    { key: "id", label: t("Order"), render: (row) => <><strong>#{row.id}</strong><small className="admin-cell-note">{displayDate(row.created_at)}</small></> },
    { key: "customer_name", label: t("Customer"), render: (row) => <>{row.customer_name || row.account_name || t("Guest")}<small className="admin-cell-note">{row.customer_phone || ""}</small></> },
    { key: "items", label: t("Items"), render: (row) => row.items || t("Order items unavailable") },
    { key: "total", label: t("Total"), render: (row) => `KSh ${Number(row.total).toLocaleString()}` },
    { key: "status", label: t("Status"), render: (row) => <select aria-label={`${t("Order")} ${row.id} ${t("status")}`} value={row.status} disabled={busy} onChange={(event) => perform(() => updateOrderStatus(row.id, event.target.value), t("Order updated."))}>
      {["processing", "shipped", "complete", "cancelled"].map((status) => <option key={status} value={status}>{t(status)}</option>)}
    </select> },
  ];
  return <DataTable columns={columns} rows={orders} emptyMessage={t("No orders have been placed yet.")} />;
}

function CategoriesPage({ categories, categoryName, setCategoryName, busy, perform }) {
  const { t } = useLanguage();
  const columns = [
    { key: "name", label: t("Category"), render: (row) => <input aria-label={`${t("Category")} ${row.name}`} defaultValue={row.name} maxLength="80" onBlur={(event) => {
      const name = event.target.value.trim();
      if (name && name !== row.name) perform(() => updateAdminCategory(row.id, name), t("Category renamed."));
    }} /> },
    { key: "product_count", label: t("Products") },
    { key: "actions", label: t("Actions"), render: (row) => <button className="button button-small button-danger" disabled={busy || row.product_count > 0} title={t(row.product_count > 0 ? "Move or remove products in this category first." : "Delete category")} onClick={() => {
      if (window.confirm(`${t("Delete category")} “${row.name}”?`)) perform(() => deleteAdminCategory(row.id), t("Category deleted."));
    }}>{t("Delete")}</button> },
  ];
  return (
    <>
      <form className="admin-inline-form" onSubmit={(event) => {
        event.preventDefault();
        if (!categoryName.trim()) return;
        perform(() => createAdminCategory(categoryName.trim()), "Category added.").then((result) => { if (result) setCategoryName(""); });
      }}>
        <label htmlFor="admin-category-name">{t("Add a category")}</label>
        <input id="admin-category-name" required minLength="2" maxLength="80" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
        <button className="button button-small" disabled={busy}>{t("Add category")}</button>
      </form>
      <DataTable columns={columns} rows={categories} emptyMessage={t("No product categories found.")} />
    </>
  );
}

function ComplaintsPage({ complaints, busy, perform }) {
  const { t } = useLanguage();
  const columns = [
    { key: "id", label: t("Report"), render: (row) => <><strong>#{row.id} · {row.subject}</strong><small className="admin-cell-note">{row.customer_name || t("Account unavailable")}{row.customer_phone ? ` · ${row.customer_phone}` : ""} {row.order_id ? `· ${t("Order")} #${row.order_id}` : ""}</small><span className="admin-complaint-description">{row.description}</span></> },
    { key: "created_at", label: t("Received"), render: (row) => displayDate(row.created_at) },
    { key: "status", label: t("Status"), render: (row) => <select aria-label={`${t("Report")} ${row.id} ${t("status")}`} value={row.status} disabled={busy} onChange={(event) => perform(() => updateComplaintStatus(row.id, event.target.value), t("Report updated."))}>
      {["open", "under_review", "resolved", "closed"].map((status) => <option key={status} value={status}>{t(status.replace("_", " "))}</option>)}
    </select> },
  ];
  return <DataTable columns={columns} rows={complaints} emptyMessage={t("No reports or complaints have been received.")} />;
}

function AnalyticsPage({ data }) {
  const { t } = useLanguage();
  const summary = data.summary || {};
  const monthlySales = data.monthly_sales || [];
  const maxSales = Math.max(...monthlySales.map((row) => Number(row.sales) || 0), 0);
  const monthLabel = (month) => new Date(`${month}-01T00:00:00`).toLocaleDateString(
    document.documentElement.lang === "sw" ? "sw-KE" : "en-KE",
    { month: "short", year: "2-digit" },
  );
  const monthlyColumns = [
    { key: "month", label: t("Month"), render: (row) => monthLabel(row.month) },
    { key: "orders", label: t("Orders") },
    { key: "completed_orders", label: t("Completed orders") },
    { key: "sales", label: t("Completed sales"), render: (row) => `KSh ${Number(row.sales).toLocaleString()}` },
  ];
  const productColumns = [
    { key: "name", label: t("Product") },
    { key: "units_sold", label: t("Units sold") },
    { key: "sales", label: t("Sales"), render: (row) => `KSh ${Number(row.sales).toLocaleString()}` },
  ];
  const metrics = [
    [t("Completed sales"), `KSh ${Number(summary.completed_sales || 0).toLocaleString()}`],
    [t("Completed orders"), Number(summary.completed_orders || 0).toLocaleString()],
    [t("Average completed order"), `KSh ${Number(summary.average_order_value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
    [t("All orders"), Number(summary.total_orders || 0).toLocaleString()],
  ];
  return (
    <div className="admin-analytics">
      <div className="admin-stat-grid admin-analytics-stats">
        {metrics.map(([label, value]) => <StatCard key={label} label={label} value={value} />)}
      </div>
      <section className="admin-dashboard-section admin-sales-chart">
        <div className="admin-section-heading"><div><h2>{t("Completed sales by month")}</h2><p>{t("Last 12 months, based on completed orders.")}</p></div></div>
        {maxSales > 0 ? (
          <div className="admin-sales-chart-grid" role="img" aria-label={t("Monthly completed sales chart")}>
            {monthlySales.map((row) => {
              const sales = Number(row.sales) || 0;
              const barHeight = maxSales ? Math.max((sales / maxSales) * 100, sales ? 3 : 0) : 0;
              return (
                <div className="admin-sales-chart-column" key={row.month} title={`${monthLabel(row.month)}: KSh ${sales.toLocaleString()}`}>
                  <span className="admin-sales-chart-value">{sales ? `KSh ${sales.toLocaleString()}` : "—"}</span>
                  <div className="admin-sales-chart-track"><span style={{ height: `${barHeight}%` }} /></div>
                  <span className="admin-sales-chart-month">{monthLabel(row.month)}</span>
                </div>
              );
            })}
          </div>
        ) : <p className="admin-empty-inline">{t("Completed sales will appear here when an order is marked complete.")}</p>}
      </section>
      <section className="admin-dashboard-section">
        <div className="admin-section-heading"><div><h2>{t("Monthly marketplace activity")}</h2><p>{t("Order volume and completed sales for each month.")}</p></div></div>
        <DataTable columns={monthlyColumns} rows={monthlySales} emptyMessage={t("No order activity in the last 12 months.")} />
      </section>
      <section className="admin-dashboard-section">
        <div className="admin-section-heading"><div><h2>{t("Top completed products")}</h2><p>{t("Products ranked by units sold in completed orders.")}</p></div></div>
        <DataTable columns={productColumns} rows={data.top_products || []} emptyMessage={t("Completed product sales will appear here.")} />
      </section>
    </div>
  );
}

function SettingsPage({ data, passwordForm, setPasswordForm, newAdmin, setNewAdmin, busy, perform }) {
  const { t } = useLanguage();
  return (
    <div className="admin-settings-grid">
      <form className="admin-settings-card" onSubmit={(event) => {
        event.preventDefault();
        perform(() => changeAdminPassword(passwordForm), t("Password changed. Sign in again next time with the new password.")).then((result) => { if (result) setPasswordForm({ current_password: "", new_password: "" }); });
      }}>
        <h2>{t("Change your password")}</h2>
        <label>{t("Current password")}<input required type="password" autoComplete="current-password" value={passwordForm.current_password} onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })} /></label>
        <label>{t("New password")}<input required type="password" minLength="12" maxLength="72" autoComplete="new-password" value={passwordForm.new_password} onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })} /></label>
        <button className="button button-small" disabled={busy}>{t("Update password")}</button>
      </form>
      <form className="admin-settings-card" onSubmit={(event) => {
        event.preventDefault();
        perform(() => createAdminAccount(newAdmin), t("Administrator account created.")).then((result) => { if (result) setNewAdmin({ email: "", password: "" }); });
      }}>
        <h2>{t("Add an administrator")}</h2>
        <p>{t("Only share administrator credentials with trusted platform staff.")}</p>
        <label>{t("Email address")}<input required type="email" value={newAdmin.email} onChange={(event) => setNewAdmin({ ...newAdmin, email: event.target.value })} /></label>
        <label>{t("Temporary password")}<input required type="password" minLength="12" maxLength="72" value={newAdmin.password} onChange={(event) => setNewAdmin({ ...newAdmin, password: event.target.value })} /></label>
        <button className="button button-small" disabled={busy}>{t("Create administrator")}</button>
      </form>
      <section className="admin-settings-card admin-settings-wide">
        <h2>{t("Administrator accounts")}</h2>
        <DataTable columns={[
          { key: "email", label: t("Email") },
          { key: "created_at", label: t("Created"), render: (row) => displayDate(row.created_at) },
        ]} rows={data.admins} emptyMessage={t("No administrators configured.")} />
      </section>
      <section className="admin-settings-card admin-settings-wide">
        <h2>{t("Recent admin activity")}</h2>
        <DataTable columns={[
          { key: "action", label: t("Action") },
          { key: "entity_type", label: t("Record") },
          { key: "details", label: t("Details"), render: (row) => row.details || (row.entity_id ? `#${row.entity_id}` : "—") },
          { key: "admin_email", label: t("Administrator") },
          { key: "created_at", label: t("When"), render: (row) => displayDate(row.created_at) },
        ]} rows={data.activity} emptyMessage={t("Admin actions will be recorded here.")} />
      </section>
    </div>
  );
}

export default AdminDashboard;
