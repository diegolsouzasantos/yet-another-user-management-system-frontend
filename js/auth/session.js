const STORAGE_KEY = 'yaums.session';

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function write(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession() {
  return read();
}

export function setTokens(accessToken, refreshToken) {
  write({ ...read(), accessToken, refreshToken });
}

export function setActor(actor) {
  write({ ...read(), actor });
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(read().accessToken);
}
