const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
let authToken = localStorage.getItem("mtaa_token");

export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  const timeoutMs = options.timeoutMs || 12000;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => {
    controller.abort(new Error("The server took too long to respond. Please try again."));
  }, timeoutMs);
  const abortFromCaller = () => controller.abort(options.signal.reason);
  if (options.signal?.aborted) abortFromCaller();
  else options.signal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    const { timeoutMs: _timeoutMs, ...fetchOptions } = options;
    const response = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers, signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Could not connect to Mtaa Market. Check that the server is running and try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abortFromCaller);
  }
}

export const getProducts = (filters = {}, options = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  return request(`/products${params.size ? `?${params}` : ""}`, options);
};
export const getProduct = (id) => request(`/products/${encodeURIComponent(id)}`);
export const getCategories = () => request("/categories");
export const loginRequest = (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
export const registerRequest = (details) => request("/auth/register", { method: "POST", body: JSON.stringify(details) });
export const getCurrentUser = () => request("/auth/me");
export const updateProfileRequest = (profile) => request("/auth/me", { method: "PATCH", body: JSON.stringify(profile) });
export const getWishlist = () => request("/wishlist");
export const saveWishlistItem = (product_id) => request("/wishlist", { method: "POST", body: JSON.stringify({ product_id }) });
export const removeWishlistItem = (productId) => request(`/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
export const getCart = () => request("/cart");
export const addCartItem = (product_id, quantity, options = {}) => request("/cart", { method: "POST", body: JSON.stringify({ product_id, quantity, options }) });
export const updateCartItem = (productId, quantity, options = {}) => request(`/cart/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity, options }) });
export const removeCartItem = (productId, options = {}) => request(`/cart/${productId}?options=${encodeURIComponent(JSON.stringify(options))}`, { method: "DELETE" });
export const createOrder = (checkoutDetails) => request("/orders", {
  method: "POST",
  body: JSON.stringify(checkoutDetails),
  timeoutMs: 35000,
});
export const getPaymentOptions = () => request("/orders/payment-options");
export const getOrders = () => request("/orders");
export const getMpesaPaymentStatus = (orderId, accessToken) => {
  const params = new URLSearchParams();
  if (accessToken) params.set("access_token", accessToken);
  return request(`/orders/${encodeURIComponent(orderId)}/payment-status${params.size ? `?${params}` : ""}`);
};
export const retryMpesaPayment = (orderId, accessToken) => request(`/orders/${encodeURIComponent(orderId)}/mpesa`, {
  method: "POST",
  body: JSON.stringify({ access_token: accessToken }),
  timeoutMs: 35000,
});
export const getPaymentStatus = (orderId, accessToken) => {
  const params = new URLSearchParams();
  if (accessToken) params.set("access_token", accessToken);
  return request(`/payments/${encodeURIComponent(orderId)}/status${params.size ? `?${params}` : ""}`);
};
export const retryPayment = (orderId, accessToken) => request(`/payments/${encodeURIComponent(orderId)}/stk`, {
  method: "POST",
  body: JSON.stringify({ access_token: accessToken }),
  timeoutMs: 35000,
});
export const submitComplaint = (complaint) => request("/complaints", { method: "POST", body: JSON.stringify(complaint) });
export const getSellerSummary = () => request("/orders/seller/summary");
export const createProduct = (product) => request("/products", { method: "POST", body: JSON.stringify(product) });
export const updateSellerProduct = (id, product) => request(`/products/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(product) });
export const deleteSellerProduct = (id) => request(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
export const getJobs = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  return request(`/jobs${params.size ? `?${params}` : ""}`);
};
export const getJobCategories = () => request("/jobs/categories");
export const getSellerJobs = () => request("/jobs/mine");
export const createJob = (job) => request("/jobs", { method: "POST", body: JSON.stringify(job) });
