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
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [filterScore, setFilterScore] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterResult, setFilterResult] = useState("");

  // Sorting State
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk menyimpan perubahan status/result per baris
  const [leadStatuses, setLeadStatuses] = useState({});
  const [leadResults, setLeadResults] = useState({});

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/leadscore");
        const result = await res.json();
        const tableData = result.tableData || [];

        setTableData(tableData);

        // Sinkronisasi awal untuk dropdown
        const initialStatuses = {};
        const initialResults = {};

        tableData.forEach((lead) => {
          // 1. Logika Status Awal
          const statusDB =
            lead.status === "unknown" || !lead.status
              ? "not.contacted"
              : lead.status;

          initialStatuses[lead.id] = statusDB;

          // 2. Logika Result Awal
          if (statusDB !== "contacted") {
            initialResults[lead.id] = "unknown";
          } else {
            initialResults[lead.id] = lead.result || "unknown";
          }
        });

        setLeadStatuses(initialStatuses);
        setLeadResults(initialResults);
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
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.job && item.job.toLowerCase().includes(query)) ||
      (item.job_id && item.job_id.toLowerCase().includes(query));

    const matchesJob =
      filterJob === "" || filterJob === "Job" || item.job === filterJob;

    const currentStatus = leadStatuses[item.id] || "not.contacted";
    const matchesStatus = filterStatus === "" || currentStatus === filterStatus;

    const currentResult = leadResults[item.id] || "unknown";
    const matchesResult = filterResult === "" || currentResult === filterResult;

    let matchesScore = true;
    if (filterScore === ">70") {
      matchesScore = item.score >= 70;
    } else if (filterScore === "40-69") {
      matchesScore = item.score >= 40 && item.score <= 69;
    } else if (filterScore === "<40") {
      matchesScore = item.score < 40;
    }

    return (
      matchesSearch &&
      matchesJob &&
      matchesScore &&
      matchesStatus &&
      matchesResult
    );
  });

  // --- LOGIC SORTING ---
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.score - b.score;
    } else {
      return b.score - a.score;
    }
  });

  // --- 3. LOGIC PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterJob, filterScore, filterStatus, filterResult]);

  // Mapping Bahasa
  const translations = {
    en: {
      title: "Lead Scoring",
      searchPlaceholder: "Search...", // Diperpendek agar muat
      job: "Job",
      score: "Score",
      status: "Status",
      all: "(All)",
      no: "No",
      print: "Print PDF",
      name: "Name",
      age: "Age",
      lastContact: "Last Contact",
      results: "Results",
      action: "Action",
      viewDetails: "View Details",
      statusOptions: {
        contacted: "Contacted",
        notContacted: "Not Contacted",
        attemptedContacted: "Attempted Contacted",
        interested: "Interested",
        notInterested: "Not Interested",
        followUp: "Follow Up",
      },
      leadScoreTable: "Lead Score Table",
      jobMapping: {
        admin: "Admin",
        "blue-collar": "Blue-collar",
        entrepreneur: "Entrepreneur",
        housemaid: "Housemaid",
        management: "Management",
        retired: "Retired",
        "self-employed": "Self-employed",
        services: "Services",
        student: "Student",
        technician: "Technician",
        unemployed: "Unemployed",
        unknown: "Unknown",
      },
    },
    id: {
      title: "Skor Prospek",
      searchPlaceholder: "Cari...", // Diperpendek agar muat
      job: "Pekerjaan",
      score: "Skor",
      status: "Status",
      all: "(Semua)",
      no: "No",
      print: "Cetak PDF",
      name: "Nama",
      age: "Usia",
      lastContact: "Kontak Terakhir",
      results: "Hasil",
      action: "Aksi",
      viewDetails: "Lihat Detail",
      statusOptions: {
        contacted: "Dihubungi",
        notContacted: "Belum Dihubungi",
        attemptedContacted: "Coba Dihubungi",
        interested: "Tertarik",
        notInterested: "Tidak Tertarik",
        followUp: "Tindak Lanjut",
      },
      leadScoreTable: "Tabel Skor Prospek",
      jobMapping: {
        admin: "Admin",
        "blue-collar": "Buruh",
        entrepreneur: "Pengusaha",
        housemaid: "ART",
        management: "Manajemen",
        retired: "Pensiunan",
        "self-employed": "Pekerja Lepas",
        services: "Layanan",
        student: "Pelajar",
        technician: "Teknisi",
        unemployed: "Pengangguran",
        unknown: "Tidak Diketahui",
      },
    },
  };

  const t = translations[lang];

  // --- 4. EXPORT PDF ---
  const handlePrint = () => {
    const doc = new jsPDF();
    const title = lang === "id" ? "Laporan Skor Prospek" : "Lead Score Report";
    doc.text(`${title} - Page ${currentPage}`, 14, 10);

    const tableColumn =
      lang === "id"
        ? ["No", "ID", "Nama", "Skor", "Usia", "Pekerjaan", "Kontak Terakhir"]
        : ["No", "ID", "Name", "Score", "Age", "Job", "Last Contact"];

    const tableRows = [];

    sortedData.forEach((lead, i) => {
      const jobKey = lead.job?.toLowerCase().replace(".", "") || "unknown";
      const jobDisplay = t.jobMapping[jobKey] || lead.job;
      const contactDisplay =
        lang === "id" ? lead.lastContact_id : lead.lastContact;

      const leadData = [
        i + 1,
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

  const updateStatus = async (id, value) => {
    setLeadStatuses((prev) => ({ ...prev, [id]: value }));

    if (value !== "contacted") {
      setLeadResults((prev) => ({ ...prev, [id]: "unknown" }));
      try {
        await fetch(`/api/leadscore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, result: "unknown" }),
        });
      } catch (err) {
        console.error("Failed to reset result", err);
      }
    }

    try {
      await fetch(`/api/leadscore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: value }),
      });
    } catch (err) {
      console.error("Failed to update status in DB", err);
    }
  };

  const updateResult = async (id, value) => {
    try {
      const res = await fetch(`/api/leadscore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, result: value }),
      });

      if (res.ok) {
        setLeadResults((prev) => ({ ...prev, [id]: value }));
        setTableData((prev) =>
          prev.map((lead) =>
            lead.id === id ? { ...lead, result: value } : lead
          )
        );
      } else {
        console.error("Failed to update result");
      }
    } catch (err) {
      console.error("Error updating result:", err);
    }
  };

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

  const scrollbarStyle = `
    .table-scroll-container::-webkit-scrollbar {
      height: 8px;
    }
    .table-scroll-container::-webkit-scrollbar-track {
      background: ${theme === "dark" ? "#2a2a2a" : "#f1f1f1"};
      border-radius: 10px;
    }
    .table-scroll-container::-webkit-scrollbar-thumb {
      background: ${theme === "dark" ? "#555" : "#888"};
      border-radius: 10px;
    }
    .table-scroll-container::-webkit-scrollbar-thumb:hover {
      background: ${theme === "dark" ? "#777" : "#555"};
    }
  `;

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
                {/* ✅ UPDATE: w-48 (192px) */}
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`p-2 pl-10 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} ${placeholderColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48`}
                />
              </div>

              {/* FILTER JOB */}
              {/* ✅ UPDATE: w-32 (128px) */}
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-32`}
              >
                <option value="">
                  {t.job} {t.all}
                </option>
                <option value="Admin.">{t.jobMapping["admin"]}</option>
                <option value="Blue-collar">
                  {t.jobMapping["blue-collar"]}
                </option>
                <option value="Entrepreneur">
                  {t.jobMapping["entrepreneur"]}
                </option>
                <option value="Housemaid">{t.jobMapping["housemaid"]}</option>
                <option value="Management">{t.jobMapping["management"]}</option>
                <option value="Retired">{t.jobMapping["retired"]}</option>
                <option value="Self-employed">
                  {t.jobMapping["self-employed"]}
                </option>
                <option value="Services">{t.jobMapping["services"]}</option>
                <option value="Student">{t.jobMapping["student"]}</option>
                <option value="Technician">{t.jobMapping["technician"]}</option>
                <option value="Unemployed">{t.jobMapping["unemployed"]}</option>
              </select>

              {/* FILTER STATUS */}
              {/* ✅ UPDATE: w-32 (128px) */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-32`}
              >
                <option value="">
                  {t.status} {t.all}
                </option>
                <option value="contacted">{t.statusOptions.contacted}</option>
                <option value="not.contacted">
                  {t.statusOptions.notContacted}
                </option>
                <option value="attempted.contacted">
                  {t.statusOptions.attemptedContacted}
                </option>
              </select>

              {/* FILTER RESULT */}
              {/* ✅ UPDATE: w-32 & HAPUS Pending Status */}
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-32`}
              >
                <option value="">
                  {t.results} {t.all}
                </option>
                <option value="interested">{t.statusOptions.interested}</option>
                <option value="not.interested">
                  {t.statusOptions.notInterested}
                </option>
                <option value="follow.up">{t.statusOptions.followUp}</option>
                {/* Opsi Pending/Unknown sudah dihapus dari filter */}
              </select>

              {/* FILTER SCORE */}
              {/* ✅ UPDATE: w-32 (128px) */}
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className={`p-2 rounded-md border ${inputBgColor} ${tableBorderColor} ${inputTextColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary w-32`}
              >
                <option value="">
                  {t.score} {t.all}
                </option>
                <option value=">70">&gt; 70</option>
                <option value="40-69">40 - 69</option>
                <option value="<40">&lt; 40</option>
              </select>
            </div>

            {/* PRINT BUTTON */}
            <div>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md transition-all duration-200 hover:brightness-110 text-sm whitespace-nowrap"
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
        <section
          className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
        >
          <style>{scrollbarStyle}</style>
          <h2 className="text-lg font-semibold mb-4">{t.leadScoreTable}</h2>

          <div
            className="table-scroll-container overflow-x-auto max-w-full"
            style={{ maxWidth: "995px" }}
          >
            <table className="min-w-[1100px] divide-y divide-borderColorLight dark:divide-borderColorDark">
              <thead className={tableHeaderBgClass}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.no}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.name}
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={handleSortToggle}
                  >
                    <div className="flex items-center gap-1">
                      {t.score}
                      {sortOrder === "desc" ? <span>↓</span> : <span>↑</span>}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.age}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.job}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.lastContact}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.status}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.results}
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColorLight dark:divide-borderColorDark">
                {currentItems.length > 0 ? (
                  currentItems.map((lead, index) => {
                    const currentStatus =
                      leadStatuses[lead.id] || "not.contacted";
                    const isResultDisabled = currentStatus !== "contacted";

                    return (
                      <tr
                        key={lead.id || index}
                        className={
                          theme === "dark"
                            ? "hover:bg-darkSecondary"
                            : "hover:bg-gray-50"
                        }
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {lead.name}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap font-bold">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                              lead.score >= 70
                                ? "bg-red-500"
                                : lead.score >= 40
                                ? "bg-orange-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {lead.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const jobKey =
                              lead.job?.toLowerCase().replace(".", "") ||
                              "unknown";
                            return t.jobMapping[jobKey] || lead.job;
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lang === "id"
                            ? lead.lastContact_id
                            : lead.lastContact}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              updateStatus(lead.id, e.target.value)
                            }
                            className={`border rounded-md px-2 py-2 whitespace-nowrap text-sm ${inputBgColor} ${inputTextColor} ${tableBorderColor}`}
                          >
                            <option value="contacted">
                              {t.statusOptions.contacted}
                            </option>
                            <option value="not.contacted">
                              {t.statusOptions.notContacted}
                            </option>
                            <option value="attempted.contacted">
                              {t.statusOptions.attemptedContacted}
                            </option>
                          </select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={leadResults[lead.id] || "unknown"}
                            onChange={(e) =>
                              updateResult(lead.id, e.target.value)
                            }
                            disabled={isResultDisabled}
                            className={`border rounded-md px-2 py-2 whitespace-nowrap text-sm ${inputBgColor} ${inputTextColor} ${tableBorderColor} ${
                              isResultDisabled
                                ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700"
                                : ""
                            }`}
                          >
                            <option value="unknown">
                              {lang === "id"
                                ? "Menunggu Status"
                                : "Pending Status"}
                            </option>
                            <option value="interested">
                              {t.statusOptions.interested}
                            </option>
                            <option value="not.interested">
                              {t.statusOptions.notInterested}
                            </option>
                            <option value="follow.up">
                              {t.statusOptions.followUp}
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/nasabah/${lead.id}`)}
                            className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md text-sm whitespace-nowrap"
                          >
                            {t.viewDetails}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
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
