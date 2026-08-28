import { request } from './http-client.js';
import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/roles');

export const listRoles = base.list;
export const getRole = base.get;
export const createRole = base.create;
export const updateRole = base.update;
export const removeRole = base.remove;

export const grantRolePermission = (id, permissionId) => (
  request(`/roles/${id}/permissions`, { method: 'POST', body: { permissionId } })
);
export const revokeRolePermission = (id, permissionId) => (
  request(`/roles/${id}/permissions/${permissionId}`, { method: 'DELETE' })
);
