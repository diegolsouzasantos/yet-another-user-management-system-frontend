import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/permissions');

export const listPermissions = base.list;
export const getPermission = base.get;
