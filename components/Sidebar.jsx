"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logoutUser } from "../app/lib/auth"; // <-- Path ini mungkin perlu disesuaikan

const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const { lang, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const translations = {
    en: {
      dashboard: "Dashboard",
      leadScore: "Lead Score",
      settings: "SETTINGS",
      logout: "Logout",
      light: "Light",
      dark: "Dark",
      indonesian: "Indonesian",
      english: "English",
      mainMenu: "MAIN MENU",
      // --- TAMBAHAN ---
      logoutConfirm: "Are you sure you want to log out?",
    },
    id: {
      dashboard: "Dasbor",
      leadScore: "Skor Prospek",
      settings: "PENGATURAN",
      logout: "Keluar",
      light: "Terang",
      dark: "Gelap",
      indonesian: "Indonesia",
      english: "Inggris",
      mainMenu: "MENU UTAMA",
      // --- TAMBAHAN ---
      logoutConfirm: "Apakah Anda yakin ingin keluar?",
    },
  };

  const t = translations[lang];

  const handleThemeSwitch = (newTheme) => {
    setTheme(newTheme);
  };

  // --- FUNGSI HANDLE LOGOUT DIPERBARUI ---
  const handleLogout = () => {
    // Tampilkan pesan konfirmasi
    if (window.confirm(t.logoutConfirm)) {
      logoutUser(); // Hapus cookie
      router.push("/"); // Arahkan ke halaman login
    }
    // Jika "Cancel", tidak terjadi apa-apa
  };
  // --- AKHIR FUNGSI ---

  const inactiveIconColor = theme === "dark" ? "#A0A0A0" : "#888";

  return (
    <div
      className={`fixed h-screen w-64 p-6 shadow-custom-md flex flex-col justify-between ${
        theme === "dark"
          ? "bg-darkPrimary text-darkFontColor"
          : "bg-white text-fontColor"
      } transition-colors duration-300 border-r ${
        theme === "dark" ? "border-borderColorDark" : "border-borderColorLight"
      }`}
    >
      {/* Top Section: Logo and Main Menu */}
      <div>
        {/* Logo (Menggunakan 2 versi) */}
        <div className="flex items-center mb-10 pl-2">
          <Image
            src={theme === "dark" ? "/Logo-dark.png" : "/Logo-light.png"}
            alt="Lead Score Portal Logo"
            width={140}
            height={40}
            className="mr-0"
            priority
          />
        </div>

        {/* Main Menu (Gradasi) */}
        <nav className="mb-10 pl-2">
          <h3 className="text-xs font-semibold uppercase mb-4 text-textGrayLight">
            {t.mainMenu}
          </h3>
          <ul>
            {/* ... (Link Dashboard & Lead Score tidak berubah) ... */}
            <li className="mb-2">
              <Link
                href="/dashboard"
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 
                ${
                  pathname === "/dashboard"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-custom-sm"
                    : theme === "dark"
                    ? "hover:bg-darkSecondary"
                    : "hover:bg-gray-100"
                }
              `}
              >
                <span className="mr-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                      stroke={
                        pathname === "/dashboard" ? "white" : inactiveIconColor
                      }
                    />
                  </svg>
                </span>
                {t.dashboard}
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/leadscore"
                className={`flex items-center p-2 rounded-lg transition-colors duration-200
                ${
                  pathname === "/leadscore"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-custom-sm"
                    : theme === "dark"
                    ? "hover:bg-darkSecondary"
                    : "hover:bg-gray-100"
                }
                `}
              >
                <span className="mr-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 17L9 11L13 15L21 7M21 7H15M21 7V13"
                      stroke={
                        pathname === "/leadscore" ? "white" : inactiveIconColor
                      }
                    />
                  </svg>
                </span>
                {t.leadScore}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Section: Settings, Logout, Theme */}
      <div className="pl-2">
        <h3 className="text-xs font-semibold uppercase mb-4 text-textGrayLight">
          {t.settings}
        </h3>

        <ul className="mb-6">
          {/* Tombol Logout (tidak berubah, tapi fungsinya sudah diupdate) */}
          <li className="mb-3">
            <button
              onClick={handleLogout}
              className={`flex items-center p-2 rounded-lg ${
                theme === "dark"
                  ? "hover:bg-darkSecondary"
                  : "hover:bg-gray-100"
              } w-full text-left transition-colors duration-200`}
            >
              <span className="mr-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 16L21 12L17 8"
                    stroke={inactiveIconColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke={inactiveIconColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke={inactiveIconColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {t.logout}
            </button>
          </li>
        </ul>

        {/* Theme Toggle (Tidak berubah) */}
        <div
          className={`p-1 rounded-full flex relative transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-darkSecondary" // Latar belakang abu gelap
              : "bg-gray-200"
          }
        `}
        >
          <div
            className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-in-out bg-gradient-to-r from-primary to-secondary shadow-sm
            ${
              theme === "light"
                ? "left-1" // Posisi Light
                : "left-[calc(50%+3px)]" // Posisi Dark
            }
          `}
          ></div>

          <button
            onClick={() => handleThemeSwitch("light")}
            className={`flex-1 py-2 px-2 text-center text-sm font-medium rounded-full relative z-10 transition-colors duration-300
              flex items-center justify-center space-x-1
              ${
                theme === "light"
                  ? "text-white" // Aktif (di atas gradasi)
                  : "text-textGrayDark hover:text-white" // Inaktif (di atas bg-darkSecondary)
              }
            `}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2V4"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 20V22"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.92993 4.92993L6.34993 6.34993"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.6501 17.65L19.0701 19.07"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12H4"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 12H22"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.92993 19.07L6.34993 17.65"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.6501 6.34993L19.0701 4.92993"
                stroke={theme === "light" ? "white" : inactiveIconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.light}</span>
          </button>

          <button
            onClick={() => handleThemeSwitch("dark")}
            className={`flex-1 py-2 px-2 text-center text-sm font-medium rounded-full relative z-10 transition-colors duration-300
              flex items-center justify-center space-x-1
              ${
                theme === "dark"
                  ? "text-white" // Aktif (di atas gradasi)
                  : "text-textGrayDark hover:text-black" // Inaktif (di atas bg-gray-200)
              }
            `}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                stroke={theme === "dark" ? "white" : inactiveIconColor} // Ikon jadi putih saat aktif
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.dark}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
