"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 1. Default awal bahasa Inggris
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false); // Tambahan state mounted

  // 2. Saat pertama kali dimuat (Mounting)
  useEffect(() => {
    // Cek apakah ada simpanan bahasa di Local Storage
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLang(savedLang);
    }
    setMounted(true); // Tandai bahwa komponen sudah siap
  }, []);

  // 3. Simpan ke Local Storage setiap kali bahasa berubah
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", lang);
    }
  }, [lang, mounted]);

  const setCurrentLanguage = (newLang) => {
    setLang(newLang);
  };

  // 4. PENTING: Mencegah error "Text content does not match server-rendered HTML"
  // Jangan render anak komponen sampai kita tahu bahasa apa yang harus dipakai
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
