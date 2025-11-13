import Cookies from "js-cookie";

export const loginUser = async (email, password) => {
  // Simulasi API call
  if (email === "admin@leadscore.com" && password === "password123") {
    const token = "mock-jwt-token-" + Date.now();
    Cookies.set("auth_token", token, { expires: 1 });
    return { success: true, token };
  }

  return { success: false, message: "Invalid email or password" };
};

export const logoutUser = () => {
  Cookies.remove("auth_token");
};

export const isAuthenticated = () => {
  return !!Cookies.get("auth_token");
};

export const getAuthToken = () => {
  return Cookies.get("auth_token");
};
