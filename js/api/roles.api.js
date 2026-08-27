import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/roles');

export const listRoles = base.list;
export const getRole = base.get;
export const createRole = base.create;
export const updateRole = base.update;
export const removeRole = base.remove;
