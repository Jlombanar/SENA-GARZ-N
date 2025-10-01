export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function getStoredToken() {
  try {
    const token = localStorage.getItem('token');
    return token || null;
  } catch (_) {
    return null;
  }
}


// ─── Manejo de Sesión con Expiración por Inactividad ─────────────────────────
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export function initAuthSession() {
  try {
    const now = Date.now();
    localStorage.setItem('authStart', String(now));
    localStorage.setItem('lastActivity', String(now));
    sessionStorage.removeItem('sessionExpiredNotice');
  } catch (_) {}
}

export function touchActivity() {
  try {
    const now = Date.now();
    localStorage.setItem('lastActivity', String(now));
  } catch (_) {}
}

export function isSessionExpired() {
  try {
    const last = Number(localStorage.getItem('lastActivity') || '0');
    if (!last) return false;
    return Date.now() - last > THIRTY_MINUTES_MS;
  } catch (_) {
    return false;
  }
}

export function clearAuthSession(markNotice = false) {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authStart');
    localStorage.removeItem('lastActivity');
    if (markNotice) sessionStorage.setItem('sessionExpiredNotice', '1');
  } catch (_) {}
}

export const AUTH_TIMEOUT_MS = THIRTY_MINUTES_MS;


