import { createResourceApi } from './resource.api.js';

const base = createResourceApi('/groups');

export const listGroups = base.list;
export const getGroup = base.get;
export const createGroup = base.create;
export const updateGroup = base.update;
export const removeGroup = base.remove;
