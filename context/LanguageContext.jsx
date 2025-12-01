"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 1. Atur bahasa default ke Inggris
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false); // Cek apakah komponen sudah siap tampil

  // 2. Saat komponen pertama kali dimuat, ambil bahasa yang tersimpan di Local Storage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLang(savedLang);
    setMounted(true); // Tandai kalau komponen siap
  }, []);

  // 3. Simpan pilihan bahasa ke Local Storage setiap berubah
  useEffect(() => {
    if (mounted) localStorage.setItem("language", lang);
  }, [lang, mounted]);

  const setCurrentLanguage = (newLang) => setLang(newLang);

  // 4. Tunggu sampai bahasa siap supaya nggak muncul error server/client mismatch
  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook untuk akses bahasa dari komponen manapun
export const useLanguage = () => useContext(LanguageContext);
