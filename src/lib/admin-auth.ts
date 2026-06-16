const ADMIN_LOGGED_IN_KEY = "gameprice_admin_logged_in";
const ADMIN_TOKEN_KEY = "gameprice_admin_token";
const ADMIN_DATA_KEY = "gameprice_admin";

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_LOGGED_IN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);
}

export function isAdminLoggedIn() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  return Boolean(token);
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_DATA_KEY);

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}