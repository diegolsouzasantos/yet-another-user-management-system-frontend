import { isAuthenticated, setActor, clearSession } from './session.js';
import { me } from '../api/auth.api.js';
import { hasPermission } from './permissions.js';

export async function requireSession(permission) {
  if (!isAuthenticated()) {
    window.location.href = '/pages/login/login.html';
    return null;
  }

  let actor;
  try {
    actor = await me();
  } catch (error) {
    clearSession();
    window.location.href = '/pages/login/login.html';
    return null;
  }

  setActor(actor);

  if (permission && !hasPermission(actor, permission)) {
    window.location.href = '/pages/home/home.html';
    return null;
  }

  return actor;
}
