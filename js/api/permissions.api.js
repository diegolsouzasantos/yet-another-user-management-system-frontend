import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/permissions');

export const listPermissions = base.list;
export const getPermission = base.get;
export const createPermission = base.create;
export const updatePermission = base.update;
export const removePermission = base.remove;
