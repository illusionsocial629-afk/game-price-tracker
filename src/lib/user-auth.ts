const USER_KEY = "gameprice_user";
const USERS_KEY = "gameprice_users";

export type AppUser = {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
};

export function signupUser(data: {
  email: string;
  username: string;
  password: string;
}) {
  const users = getAllUsers();

  const exists = users.some(
    (user) => user.email.toLowerCase() === data.email.toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      message: "Email already registered",
    };
  }

  const user: AppUser = {
    id: crypto.randomUUID(),
    email: data.email,
    username: data.username,
    password: data.password,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([user, ...users]));
  saveUserSession(user);

  return {
    success: true,
    user,
  };
}

export function loginUser(email: string, password: string) {
  const users = getAllUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  saveUserSession(user);

  return {
    success: true,
    user,
  };
}

export function saveUserSession(user: AppUser) {
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
}

export function getUserSession() {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAllUsers(): AppUser[] {
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}