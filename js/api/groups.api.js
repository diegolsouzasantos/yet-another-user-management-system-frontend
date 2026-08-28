import { request } from './http-client.js';
import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/groups');

export const listGroups = base.list;
export const getGroup = base.get;
export const createGroup = base.create;
export const updateGroup = base.update;
export const removeGroup = base.remove;

export const addGroupUser = (id, userId) => request(`/groups/${id}/users`, { method: 'POST', body: { userId } });
export const removeGroupUser = (id, userId) => request(`/groups/${id}/users/${userId}`, { method: 'DELETE' });

export const grantGroupPermission = (id, permissionId) => (
  request(`/groups/${id}/permissions`, { method: 'POST', body: { permissionId } })
);
export const revokeGroupPermission = (id, permissionId) => (
  request(`/groups/${id}/permissions/${permissionId}`, { method: 'DELETE' })
);
