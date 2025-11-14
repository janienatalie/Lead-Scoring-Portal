import Cookies from "js-cookie";

// FUNGSI BARU: Menyimpan token yang diterima dari backend
export const saveToken = (token) => {
  Cookies.set("auth_token", token, { expires: 1 }); // expires: 1 hari
};

// FUNGSI LAMA: loginUser (Sudah dihapus, logikanya pindah ke backend)

// FUNGSI LAMA: logoutUser (Tetap sama)
export const logoutUser = () => {
  Cookies.remove("auth_token");
};

// FUNGSI LAMA: isAuthenticated (Tetap sama)
export const isAuthenticated = () => {
  const token = Cookies.get("auth_token");
  return !!token; // Return true hanya jika token ada
};

// FUNGSI LAMA: getAuthToken (Tetap sama)
export const getAuthToken = () => {
  return Cookies.get("auth_token");
};
