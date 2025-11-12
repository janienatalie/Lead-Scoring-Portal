"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en"); // Default language

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  // Fungsi untuk set bahasa secara eksplisit (en/id)
  const setCurrentLanguage = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
