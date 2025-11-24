// logout: menghapus cookie server-side
export const logoutUser = async () => {
  await fetch("/api/logout", { method: "POST" });
};
