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


