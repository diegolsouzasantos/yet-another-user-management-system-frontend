import { request } from './http-client.js';

export function listAuditLogs(params) {
  return request('/audit-logs', { params });
}
