"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const { theme } = useTheme();
  const { lang, setLanguage } = useLanguage();

  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    fetch("/api/users") 
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLanguageToggle = () => {
    setLanguage(lang === "en" ? "id" : "en");
  };

  const cardBgClass = theme === "dark" ? "bg-darkPrimary" : "bg-white";
  const tableBorderColor =
    theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";
  const textColorClass =
    theme === "dark" ? "text-darkFontColor" : "text-fontColor";

  const iconColor = theme === "dark" ? "#E5E5E5" : "#227D53";

  return (
    <nav
      className={`sticky top-0 z-10 flex h-20 w-full items-center justify-end space-x-4 px-8 ${cardBgClass} border-b ${tableBorderColor} shadow-sm ${textColorClass}`}
    >
      {/* Tombol Bahasa */}
      <button
        onClick={handleLanguageToggle}
        className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full transition-all duration-200 hover:brightness-110"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {lang === "id" ? (
            <>
              <rect x="2" y="6" width="20" height="6" fill="#EF4444" />
              <rect x="2" y="12" width="20" height="6" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <rect x="2" y="6" width="20" height="12" fill="#0A3161" />
              <path d="M2 12H22M12 6V18" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M2 6L22 18M2 18L22 6" stroke="#C8102E" strokeWidth="2" />
            </>
          )}
        </svg>
        <span className="font-semibold text-sm">{lang === "id" ? "ID" : "EN"}</span>
      </button>

      {/* Notifikasi */}
      <div
        className={`p-2 rounded-full ${cardBgClass} shadow-custom-sm border ${tableBorderColor}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 22.0001 12 22C11.6496 22.0001 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Pesan */}
      <div
        className={`p-2 rounded-full ${cardBgClass} shadow-custom-sm border ${tableBorderColor}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 6L12 13L2 6"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Garis pemisah */}
      <div
        className={`h-8 w-px ${
          theme === "dark" ? "bg-borderColorDark" : "bg-borderColorLight"
        }`}
      ></div>

      {/* Avatar + username/email dinamis */}
      <div className="flex items-center">
        <div className="relative w-10 h-10 mr-2">
          <Image
            src="/profile1.jpeg"
            alt="Avatar"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div>
          <p className="font-semibold text-sm">{user.username || "Loading..."}</p>
          <p className="text-xs text-gray-500">{user.email || "Loading..."}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
