"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LeadScorePage = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [tableData, setTableData] = useState([]); // Menampung RIBUAN data
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [filterScore, setFilterScore] = useState("");

  // Sorting State (Baru)
  // 'desc' = Descending (90, 80, 70) - Default
  // 'asc' = Ascending (40, 50, 60)
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Batas data per halaman

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/leadscore");
        const result = await res.json();
        setTableData(result.tableData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. LOGIC FILTERING ---
  const filteredData = tableData.filter((item) => {
    // A. Search (Mencari di Nama, Job Inggris, atau Job Indo)
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.job && item.job.toLowerCase().includes(query)) ||
      (item.job_id && item.job_id.toLowerCase().includes(query));

    // B. Filter Job (Mencocokkan dengan Job Inggris - Canonical Value)
    const matchesJob =
      filterJob === "" || filterJob === "Job" || item.job === filterJob;

    // C. Filter Score (3 Kategori)
    let matchesScore = true;
    if (filterScore === ">70") {
      matchesScore = item.score >= 70;
    } else if (filterScore === "40-69") {
      matchesScore = item.score >= 40 && item.score <= 69;
    } else if (filterScore === "<40") {
      matchesScore = item.score < 40;
    }

    return matchesSearch && matchesJob && matchesScore;
  });

  // --- LOGIC SORTING (BARU) ---
  // Mengurutkan filteredData berdasarkan sortOrder
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.score - b.score; // Kecil ke Besar
    } else {
      return b.score - a.score; // Besar ke Kecil (Default)
    }
  });

  // --- 3. LOGIC PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // GUNAKAN 'sortedData' UNTUK PAGINATION (Bukan filteredData lagi)
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handler untuk mengubah urutan saat Header Score diklik
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterJob, filterScore]);

  // --- 4. EXPORT PDF ---
  const handlePrint = () => {
    const doc = new jsPDF();

    const title = lang === "id" ? "Laporan Skor Prospek" : "Lead Score Report";
    doc.text(`${title} - Page ${currentPage}`, 14, 10);

    // Header Tabel PDF sesuai bahasa
    const tableColumn =
      lang === "id"
        ? ["ID", "Nama", "Skor", "Usia", "Pekerjaan", "Kontak Terakhir"]
        : ["ID", "Name", "Score", "Age", "Job", "Last Contact"];

    const tableRows = [];

    // Gunakan 'sortedData' agar urutan di PDF sesuai tampilan layar
    sortedData.forEach((lead) => {
      // Pilih bahasa yang tepat untuk data di PDF
      const jobDisplay = lang === "id" ? lead.job_id : lead.job;
      const contactDisplay =
        lang === "id" ? lead.lastContact_id : lead.lastContact;

      const leadData = [
        lead.id,
        lead.name,
        lead.score,
        lead.age,
        jobDisplay,
        contactDisplay,
      ];
      tableRows.push(leadData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("lead_score_report.pdf");
  };

  // --- TRANSLATIONS ---
  const translations = {
    en: {
      title: "Lead Scoring",
      searchPlaceholder: "Search ID, name, job...",
      job: "Job",
      score: "Score",
      print: "Print PDF",
      name: "Name",
      age: "Age",
      lastContact: "Last Contact",
      action: "Action",
      viewDetails: "View Details",
      // Opsi Job
      admin: "Admin",
      bluecollar: "Blue-collar",
      entrepreneur: "Entrepreneur",
      housemaid: "Housemaid",
      manager: "Management",
      retired: "Retired",
      selfemployed: "Self-employed",
      services: "Services",
      student: "Student",
      technician: "Technician",
      unemployed: "Unemployed",
    },
    id: {
      title: "Skor Prospek",
      searchPlaceholder: "Cari ID, nama, pekerjaan...",
      job: "Pekerjaan",
      score: "Skor",
      print: "Cetak PDF",
      name: "Nama",
      age: "Usia",
      lastContact: "Kontak Terakhir",
      action: "Aksi",
      viewDetails: "Lihat Detail",
      // Opsi Job
      admin: "Admin",
      bluecollar: "Buruh",
      entrepreneur: "Wiraswasta",
      housemaid: "ART",
      manager: "Manajemen",
      retired: "Pensiunan",
      selfemployed: "Wirausaha",
      services: "Layanan",
      student: "Pelajar",
      technician: "Teknisi",
      unemployed: "Pengangguran",
    },
  };

  const t = translations[lang];

  // Styling Classes
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

  if (loading)
    return (
      <div className={`min-h-screen p-8 ${bgColorClass} ${textColorClass}`}>
        Loading data...
      </div>
    );

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${bgColorClass} ${textColorClass}`}
    >
      <div
        className={`w-full rounded-lg shadow-custom-md border ${tableBorderColor} ${cardBgClass} p-8`}
      >
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              {/* SEARCH */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-textGrayLight"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`p-2 pl-10 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} ${placeholderColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-60`}
                />
              </div>

              {/* FILTER JOB */}
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40`}
              >
                {/* Value tetap bahasa Inggris agar match dengan backend, tapi label diterjemahkan */}
                <option value="">{t.job} (All)</option>
                <option value="Admin.">{t.admin}</option>
                <option value="Blue-collar">{t.bluecollar}</option>
                <option value="Entrepreneur">{t.entrepreneur}</option>
                <option value="Housemaid">{t.housemaid}</option>
                <option value="Management">{t.manager}</option>
                <option value="Retired">{t.retired}</option>
                <option value="Self-employed">{t.selfemployed}</option>
                <option value="Services">{t.services}</option>
                <option value="Student">{t.student}</option>
                <option value="Technician">{t.technician}</option>
                <option value="Unemployed">{t.unemployed}</option>
              </select>

              {/* FILTER SCORE */}
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40`}
              >
                <option value="">{t.score} (All)</option>
                <option value=">70">&gt; 70</option>
                <option value="40-69">40 - 69</option>
                <option value="<40">&lt; 40</option>
              </select>
            </div>

            {/* PRINT BUTTON */}
            <div>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md transition-all duration-200 hover:brightness-110 text-sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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

        {/* TABEL */}
        <section>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderColorLight dark:divide-borderColorDark">
              <thead className={tableHeaderBgClass}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider">
                    {t.name}
                  </th>

                  {/* HEADER SCORE (INTERAKTIF UNTUK SORTING) */}
                  <th
                    scope="col"
                    onClick={handleSortToggle}
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      {t.score}
                      {/* Ikon Panah yang berputar sesuai sortOrder */}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider">
                    {t.age}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider">
                    {t.job}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider">
                    {t.lastContact}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-textGrayDark uppercase tracking-wider">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColorLight dark:divide-borderColorDark">
                {currentItems.length > 0 ? (
                  currentItems.map((lead, index) => (
                    <tr
                      key={lead.id || index}
                      className={
                        theme === "dark"
                          ? "hover:bg-darkSecondary"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        {/* --- UPDATE WARNA ORANGE --- */}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                            lead.score >= 70
                              ? "bg-red-500"
                              : lead.score >= 40
                              ? "bg-orange-500" // Menggunakan Orange agar kontras dengan teks putih
                              : "bg-blue-500"
                          }`}
                        >
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.age}
                      </td>

                      {/* LOGIC: Tampilkan Job sesuai bahasa */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lang === "id" ? lead.job_id : lead.job}
                      </td>

                      {/* LOGIC: Tampilkan Bulan sesuai bahasa */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lang === "id" ? lead.lastContact_id : lead.lastContact}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/nasabah/${lead.id}`)}
                          className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:brightness-110 text-sm"
                        >
                          {t.viewDetails}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-textGrayLight"
                    >
                      {lang === "id" ? "Data tidak ditemukan" : "No data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* PAGINATION */}
        <section className="flex justify-center items-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${tableBorderColor} ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-primary dark:hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            {/* Smart Pagination */}
            {(() => {
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, startPage + 4);

              if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
              }

              return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((number) => {
                if (number < 1 || number > totalPages) return null;
                return (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === number
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "text-textGrayLight dark:text-textGrayDark hover:text-primary dark:hover:text-white"
                    }`}
                  >
                    {number}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 rounded-md border ${tableBorderColor} ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-primary dark:hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default LeadScorePage;
