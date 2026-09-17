const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const STORAGE_KEY = 'potiguarmix.auth';

export function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

let unauthorizedHandler = null;
export function onUnauthorized(fn) {
  unauthorizedHandler = fn;
}

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

let refreshPromise = null;

async function doRefresh() {
  const auth = loadAuth();
  if (!auth?.refreshToken) throw new ApiError(401, 'Sessão expirada');
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: auth.refreshToken }),
  });
  if (!res.ok) throw new ApiError(res.status, 'Sessão expirada');
  const data = await res.json();
  saveAuth(data);
  return data;
}

async function request(path, { method = 'GET', body, headers = {}, retry = true } = {}) {
  const auth = loadAuth();
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (auth?.accessToken) finalHeaders.Authorization = `Bearer ${auth.accessToken}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (res.status === 401 && retry && auth?.refreshToken) {
    try {
      refreshPromise = refreshPromise || doRefresh();
      await refreshPromise;
      refreshPromise = null;
      return request(path, { method, body, headers, retry: false });
    } catch {
      refreshPromise = null;
      clearAuth();
      if (unauthorizedHandler) unauthorizedHandler();
      throw new ApiError(401, 'Sessão expirada, faça login novamente');
    }
  }

  if (!res.ok) {
    if (res.status === 401 && unauthorizedHandler) unauthorizedHandler();
    throw new ApiError(res.status, payload?.error || `Erro ${res.status}`, payload?.details);
  }

  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
