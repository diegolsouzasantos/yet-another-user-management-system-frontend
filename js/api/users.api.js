import { request } from './http-client.js';
import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/users');

export const listUsers = base.list;
export const getUser = base.get;
export const createUser = base.create;
export const updateUser = base.update;
export const removeUser = base.remove;

export function transferOwnership(targetUserId, currentPassword) {
  return request('/users/owner-transfer', { method: 'POST', body: { targetUserId, currentPassword } });
}

export const addUserGroup = (id, groupId) => request(`/users/${id}/groups`, { method: 'POST', body: { groupId } });
export const removeUserGroup = (id, groupId) => request(`/users/${id}/groups/${groupId}`, { method: 'DELETE' });

export const grantUserPermission = (id, permissionId) => (
  request(`/users/${id}/permissions`, { method: 'POST', body: { permissionId } })
);
export const revokeUserPermission = (id, permissionId) => (
  request(`/users/${id}/permissions/${permissionId}`, { method: 'DELETE' })
);
