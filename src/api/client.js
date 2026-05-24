/**
 * ══════════════════════════════════════════════
 *  Scopesky Cafeteria — Frontend API Client
 *  يستبدل طبقة db.js الوهمية بـ fetch حقيقي
 * ══════════════════════════════════════════════
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/* ── Token management ── */
export const token = {
  get: () => localStorage.getItem("cafeteria_token"),
  set: (t) => localStorage.setItem("cafeteria_token", t),
  remove: () => localStorage.removeItem("cafeteria_token"),
};

/* ── Base fetch wrapper ── */
async function request(method, path, body = null, isFormData = false) {
  const headers = {};
  const tok = token.get();
  if (tok) headers["Authorization"] = `Bearer ${tok}`;

  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`${BASE_URL}${path}`, config);

  // Handle 401 — clear token and reload
  if (res.status === 401) {
    token.remove();
    window.location.href = "/login";
    throw new Error("session_expired");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
  upload: (path, formData) => request("POST", path, formData, true),
  uploadPut: (path, formData) => request("PUT", path, formData, true),
};

/* ════════════════════════════════════════════
   AUTH
════════════════════════════════════════════ */
export const authApi = {
  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),
  logout: () => api.post("/api/auth/logout"),
  me: () => api.get("/api/auth/me"),
};

/* ════════════════════════════════════════════
   ACCOUNTS
════════════════════════════════════════════ */
export const accountsApi = {
  list: () => api.get("/api/accounts"),
  getOne: (id) => api.get(`/api/accounts/${id}`),
  create: (data) => api.post("/api/accounts", data),
  update: (id, data) => api.put(`/api/accounts/${id}`, data),
  remove: (id) => api.delete(`/api/accounts/${id}`),
  updateMe: (data) => api.patch("/api/accounts/me/profile", data),
};

/* ════════════════════════════════════════════
   ITEMS
════════════════════════════════════════════ */
export const itemsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams();
    if (params.cat) q.set("cat", params.cat);
    if (params.search) q.set("q", params.search);
    if (params.orderType && params.orderType !== "custom")
      q.set("type", params.orderType);
    return api.get(`/api/items${q.toString() ? "?" + q : ""}`);
  },
  getOne: (id) => api.get(`/api/items/${id}`),

  // Create with image (multipart)
  create: (data, imageFile) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v);
    });
    if (imageFile) fd.append("image", imageFile);
    return api.upload("/api/items", fd);
  },

  // Update with optional image
  update: (id, data, imageFile) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v);
    });
    if (imageFile) fd.append("image", imageFile);
    return api.uploadPut(`/api/items/${id}`, fd);
  },

  toggle: (id) => api.patch(`/api/items/${id}/toggle`),
  remove: (id) => api.delete(`/api/items/${id}`),
};

/* ════════════════════════════════════════════
   CATEGORIES
════════════════════════════════════════════ */
export const categoriesApi = {
  list: () => api.get("/api/categories"),
  create: (data) => api.post("/api/categories", data),
  remove: (id) => api.delete(`/api/categories/${id}`),
};

/* ════════════════════════════════════════════
   ORDERS
════════════════════════════════════════════ */
export const ordersApi = {
  list: () => api.get("/api/orders"),
  getOne: (id) => api.get(`/api/orders/${id}`),
  create: (data) => api.post("/api/orders", data),
  updateStatus: (id, status) =>
    api.patch(`/api/orders/${id}/status`, { status }),
};

/* ════════════════════════════════════════════
   WALLET
════════════════════════════════════════════ */
export const walletApi = {
  deposit: (account_id, amount, note) =>
    api.post("/api/wallet/deposit", { account_id, amount, note }),
  myTransactions: () => api.get("/api/wallet/transactions"),
  userTransactions: (userId) => api.get(`/api/wallet/transactions/${userId}`),
  summary: () => api.get("/api/wallet/summary"),
};
