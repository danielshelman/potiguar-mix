import { api } from './client';

const qs = (params = {}) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
};

export function list(resource, params) {
  return api.get(`/${resource}${qs(params)}`);
}

export function get(resource, id) {
  return api.get(`/${resource}/${id}`);
}

export function create(resource, data) {
  return api.post(`/${resource}`, data);
}

export function update(resource, id, data) {
  return api.patch(`/${resource}/${id}`, data);
}

export function remove(resource, id) {
  return api.delete(`/${resource}/${id}`);
}

export async function listAll(resource, params = {}) {
  const res = await list(resource, { ...params, limit: 200, page: 1 });
  return res?.data || [];
}
