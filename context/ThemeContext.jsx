"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Atur tema default ke "light" dan cek apakah komponen sudah siap
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // 2. Ambil tema yang tersimpan di Local Storage saat pertama kali dimuat
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    setMounted(true); // Tandai kalau komponen siap
  }, []);

  // 3. Terapkan tema ke HTML root dan simpan ke Local Storage tiap tema berubah
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const setCurrentTheme = (newTheme) => setTheme(newTheme);

  // 4. Tunggu sampai komponen siap supaya tidak muncul error saat render awal
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook untuk akses tema dari komponen mana pun
export const useTheme = () => useContext(ThemeContext);
