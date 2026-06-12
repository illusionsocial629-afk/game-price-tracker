const ADMIN_KEY = "gameprice_admin_logged_in";

export function loginAdmin(email: string, password: string) {
  if (email === "admin@gameprice.com" && password === "admin123") {
    localStorage.setItem(ADMIN_KEY, "true");
    return true;
  }

  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_KEY) === "true";
}