import { API_URL } from "./api.js";
const TOKEN_KEY = "mtaa_admin_token";

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_URL}/admin${path}`, { ...options, headers });
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Could not connect to Mtaa Market. Check that the server is running and try again.");
    throw error;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function adminLogin(credentials) {
  const result = await adminRequest("/login", { method: "POST", body: JSON.stringify(credentials) });
  localStorage.setItem(TOKEN_KEY, result.token);
  return result.admin;
}

export const getAdminSetupStatus = () => adminRequest("/setup-status");
export async function createFirstAdmin(account) {
  const result = await adminRequest("/setup", { method: "POST", body: JSON.stringify(account) });
  localStorage.setItem(TOKEN_KEY, result.token);
  return result.admin;
}

export const getAdmin = () => adminRequest("/me");
export const getAdminDashboard = () => adminRequest("/dashboard");
export const getAdminProducts = () => adminRequest("/products");
export const updateAdminProduct = (id, product) => adminRequest(`/products/${id}`, { method: "PATCH", body: JSON.stringify(product) });
export const updateAdminProductStatus = (id, status) => adminRequest(`/products/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getAdminSellers = () => adminRequest("/sellers");
export const updateSellerStatus = (id, status) => adminRequest(`/sellers/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getAdminCustomers = () => adminRequest("/customers");
export const updateCustomerStatus = (id, status) => adminRequest(`/customers/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getAdminOrders = () => adminRequest("/orders");
export const getAdminPayments = () => adminRequest("/payments");
export const updateOrderStatus = (id, status) => adminRequest(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getAdminCategories = () => adminRequest("/categories");
export const createAdminCategory = (name) => adminRequest("/categories", { method: "POST", body: JSON.stringify({ name }) });
export const updateAdminCategory = (id, name) => adminRequest(`/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
export const deleteAdminCategory = (id) => adminRequest(`/categories/${id}`, { method: "DELETE" });
export const getAdminComplaints = () => adminRequest("/complaints");
export const updateComplaintStatus = (id, status) => adminRequest(`/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getAdminAnalytics = () => adminRequest("/analytics");
export const getAdminSettings = () => adminRequest("/settings");
export const changeAdminPassword = (passwords) => adminRequest("/settings/password", { method: "POST", body: JSON.stringify(passwords) });
export const createAdminAccount = (account) => adminRequest("/settings/admins", { method: "POST", body: JSON.stringify(account) });
