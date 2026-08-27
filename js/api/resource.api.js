import { request } from './http-client.js';

export function createResourceApi(basePath) {
  return {
    list: (params) => request(basePath, { params }),
    get: (id) => request(`${basePath}/${id}`),
    create: (body) => request(basePath, { method: 'POST', body }),
    update: (id, body) => request(`${basePath}/${id}`, { method: 'PATCH', body }),
    remove: (id) => request(`${basePath}/${id}`, { method: 'DELETE' }),
  };
}
