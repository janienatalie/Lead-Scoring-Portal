"use client";

import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";

const LeadScorePage = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  const translations = {
    en: {
      title: "Lead Scoring",
      searchPlaceholder: "Search anything...",
      job: "Job",
      score: "Score",
      print: "Print",
      name: "Name",
      age: "Age",
      lastContact: "Last Contact",
      action: "Action",
      viewDetails: "View Details",
      technician: "Technician",
      daysAgo: "days ago",
      manager: "Manager",
      designer: "Designer",
      developer: "Developer",
    },
    id: {
      title: "Skor Prospek",
      searchPlaceholder: "Cari apa saja...",
      job: "Pekerjaan",
      score: "Skor",
      print: "Cetak",
      name: "Nama",
      age: "Usia",
      lastContact: "Kontak Terakhir",
      action: "Aksi",
      viewDetails: "Lihat Detail",
      technician: "Teknisi",
      daysAgo: "hari lalu",
      manager: "Manajer",
      designer: "Desainer",
      developer: "Pengembang",
    },
  };

  const t = translations[lang];

  // Mock data untuk tabel
  const tableData = [
    {
      name: "John Doe",
      score: 90,
      age: 40,
      job: t.technician,
      lastContact: `2 ${t.daysAgo}`,
    },
    {
      name: "Jane Smith",
      score: 85,
      age: 32,
      job: t.designer,
      lastContact: `1 ${t.daysAgo}`,
    },
    {
      name: "Michael Bay",
      score: 82,
      age: 45,
      job: t.manager,
      lastContact: `3 ${t.daysAgo}`,
    },
    {
      name: "Sarah Lee",
      score: 78,
      age: 29,
      job: t.developer,
      lastContact: `5 ${t.daysAgo}`,
    },
    {
      name: "David Kim",
      score: 75,
      age: 37,
      job: t.technician,
      lastContact: `4 ${t.daysAgo}`,
    },
    {
      name: "Emily White",
      score: 70,
      age: 28,
      job: t.designer,
      lastContact: `6 ${t.daysAgo}`,
    },
    {
      name: "Chris Evans",
      score: 68,
      age: 42,
      job: t.manager,
      lastContact: `6 ${t.daysAgo}`,
    },
    {
      name: "Anna Scott",
      score: 65,
      age: 33,
      job: t.developer,
      lastContact: `7 ${t.daysAgo}`,
    },
  ];

  // Definisi kelas untuk styling
  const textColorClass =
    theme === "dark" ? "text-darkFontColor" : "text-fontColor";
  const bgColorClass =
    theme === "dark" ? "bg-darkScreenColor" : "bg-screenColor";
  const cardBgClass = theme === "dark" ? "bg-darkPrimary" : "bg-white";
  const tableHeaderBgClass =
    theme === "dark" ? "bg-darkSecondary" : "bg-gray-50";
  const tableBorderColor =
    theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";
  const inputBgColor =
    theme === "dark"
      ? "bg-darkSecondary border-borderColorDark"
      : "bg-gray-50 border-borderColorLight";
  const inputTextColor =
    theme === "dark" ? "text-darkFontColor" : "text-fontColor";
  const placeholderColor =
    theme === "dark" ? "placeholder-textGrayDark" : "placeholder-textGrayLight";

  return (
    // Latar belakang utama (abu-abu/hitam)
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${bgColorClass} ${textColorClass}`}
    >
      {/* Kartu konten utama (putih/abu gelap) */}
      <div
        className={`w-full rounded-lg shadow-custom-md border ${tableBorderColor} ${cardBgClass} p-8`}
      >
        {/* Header: Judul dan Kontrol */}
        <div className="mb-6">
          {/* Baris 1: Judul */}
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>

          {/* Baris 2: Kontrol */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            {/* Kontrol Kiri: Search & Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-textGrayLight"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className={`p-2 pl-10 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} ${placeholderColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary`}
                />
              </div>

              {/* Dropdown Job (Lebar ditambah) */}
              <select
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40`}
              >
                <option>{t.job}</option>
                <option>{t.technician}</option>
                <option>{t.designer}</option>
                <option>{t.manager}</option>
                <option>{t.developer}</option>
              </select>
              {/* Dropdown Score (Lebar ditambah) */}
              <select
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40`}
              >
                <option>{t.score}</option>
                <option>90+</option>
                <option>80-89</option>
                <option>70-79</option>
              </select>
            </div>

            {/* Kontrol Kanan: Print */}
            <div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md transition-all duration-200 hover:brightness-110 text-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9V2H18V9" />
                  <path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" />
                  <path d="M6 14H18V22H6V14Z" />
                </svg>
                {t.print}
              </button>
            </div>
          </div>
        </div>

        {/* Tabel */}
        <section>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderColorLight dark:divide-borderColorDark">
              <thead className={tableHeaderBgClass}>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.name}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-1">
                      {t.score}
                      {/* Ikon Sortir */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 3V18M8 3L4 7M8 3L12 7M16 21V6M16 21L12 17M16 21L20 17" />
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.age}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.job}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.lastContact}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-borderColorLight dark:divide-borderColorDark`}
              >
                {tableData.map((lead, index) => (
                  <tr
                    key={index}
                    className={
                      theme === "dark"
                        ? "hover:bg-darkSecondary"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.job}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.lastContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md transition-all duration-200 hover:brightness-110 text-sm">
                        {t.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- AWAL PERUBAHAN PAGINATION --- */}
        <section className="flex justify-center items-center mt-6">
          <nav className="flex items-center space-x-2">
            {/* Tombol Kiri (Baru) */}
            <a
              href="#"
              className="p-2 rounded-md border border-borderColorLight dark:border-borderColorDark text-textGrayLight dark:text-textGrayDark hover:text-primary dark:hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </a>

            {/* Halaman 1 (Aktif) */}
            <a
              href="#"
              className="px-3 py-1 rounded-md text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white"
            >
              01
            </a>
            {/* Halaman 2 (Inaktif) */}
            <a
              href="#"
              className="px-3 py-1 rounded-md text-sm font-medium text-textGrayLight dark:text-textGrayDark hover:text-primary dark:hover:text-white"
            >
              02
            </a>
            {/* Halaman 3 (Inaktif) */}
            <a
              href="#"
              className="px-3 py-1 rounded-md text-sm font-medium text-textGrayLight dark:text-textGrayDark hover:text-primary dark:hover:text-white"
            >
              03
            </a>
            <span className="text-textGrayLight dark:text-textGrayDark">
              ...
            </span>
            {/* Halaman 6 (Inaktif) */}
            <a
              href="#"
              className="px-3 py-1 rounded-md text-sm font-medium text-textGrayLight dark:text-textGrayDark hover:text-primary dark:hover:text-white"
            >
              06
            </a>

            {/* Tombol Kanan (Baru) */}
            <a
              href="#"
              className="p-2 rounded-md border border-borderColorLight dark:border-borderColorDark text-textGrayLight dark:text-textGrayDark hover:text-primary dark:hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </nav>
        </section>
        {/* --- AKHIR PERUBAHAN PAGINATION --- */}
      </div>
    </div>
  );
};

export default LeadScorePage;
