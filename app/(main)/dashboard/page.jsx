"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((m) => m.ResponsivePie),
  { ssr: false }
);

const DashboardPage = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  // Mapping untuk perubahan bahasa
  const translations = {
    en: {
      welcome: "Welcome Back, Kireisha!",
      date: "Thursday, 6 November 2025",
      totalLeads: "Total Leads",
      highPotentialLeads: "High Potential Leads",
      conversionRate: "Conversion Rate",
      averageLeadScore: "Average Lead Score",
      vsLastMonth: "vs last month",
      leadScoreDistribution: "Lead Score Distribution",
      leadStageConversion: "Lead Stage Conversion",
      months: "months",
      potentialLeadsTable: "Potential Leads Table",
      name: "Name",
      score: "Score",
      age: "Age",
      job: "Job",
      lastContact: "Last Contact",
      action: "Action",
      viewDetails: "View Details",
      contacted: "Contacted",
      new: "New",
      converted: "Converted",
      jobDistribution: "Job Distribution",
      others: "Others",
      jobMapping: {
        "admin": "Admin",
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
      statusMapping: {
        contacted: "Contacted",
        new: "New",
        converted: "Converted",
      }
    },
    id: {
      welcome: "Selamat Datang Kembali, Kireisha!",
      date: "Kamis, 6 November 2025",
      totalLeads: "Total Prospek",
      highPotentialLeads: "Prospek Potensial Tinggi",
      conversionRate: "Tingkat Konversi",
      averageLeadScore: "Skor Prospek Rata-rata",
      vsLastMonth: "dibanding bulan lalu",
      leadScoreDistribution: "Distribusi Skor Prospek",
      leadStageConversion: "Konversi Tahap Prospek",
      months: "bulan",
      potentialLeadsTable: "Tabel Prospek Potensial",
      name: "Nama",
      score: "Skor",
      age: "Usia",
      job: "Pekerjaan",
      lastContact: "Kontak Terakhir",
      action: "Aksi",
      viewDetails: "Lihat Detail",
      contacted: "Dihubungi",
      new: "Baru",
      converted: "Dikonversi",
      others: "Lainnya",
      jobDistributionId: "Distribusi Pekerjaan",
      jobMapping: {
        "admin": "Admin",
        "blue-collar": "Buruh",
        entrepreneur: "Wiraswasta",
        housemaid: "Pekerja Rumah Tangga",
        management: "Manajemen",
        retired: "Pensiunan",
        "self-employed": "Pekerja Lepas",
        services: "Jasa",
        student: "Mahasiswa",
        technician: "Teknisi",
        unemployed: "Pengangguran",
        unknown: "Tidak Diketahui",
      },
      statusMapping: {
        contacted: "Dihubungi",
        new: "Baru",
        converted: "Dikonversi",
      }
    },
  };

  const monthMapping = {
    en: {
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December",
    },
    id: {
      jan: "Januari",
      feb: "Februari",
      mar: "Maret",
      apr: "April",
      may: "Mei",
      jun: "Juni",
      jul: "Juli",
      aug: "Agustus",
      sep: "September",
      oct: "Oktober",
      nov: "November",
      dec: "Desember",
    },
  };

  const router = useRouter();

  const t = translations[lang];

  // Data dashboard: grafik garis, tabel prospek, dan statistik utama
  const [lineData, setLineData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [highPotentialLeads, setHighPotentialLeads] = useState(0);
  const [averageLeadScore, setAverageLeadScore] = useState(0);
  const [jobData, setJobLineData] = useState([]);

  // Ambil data dashboard dari API 
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setLineData(data.lineData);
        setTableData(data.tableData);
        setTotalLeads(data.totalLeads);      
        setHighPotentialLeads(data.highPotentialLeads); 
        setAverageLeadScore(data.averageLeadScore);
        setJobLineData(data.jobData);   
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  // State menyimpan data user
  const [user, setUser] = useState({ username: "", email: "" });

  // Ambil data user login dari API user
  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  // Styling kelas
  const textColorClass =
    theme === "dark" ? "text-darkFontColor" : "text-fontColor";
  const bgColorClass =
    theme === "dark" ? "bg-darkScreenColor" : "bg-screenColor";
  const cardBgClass = theme === "dark" ? "bg-darkPrimary" : "bg-white";
  const tableHeaderBgClass =
    theme === "dark" ? "bg-darkSecondary" : "bg-gray-50";
  const tableBorderColor =
    theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${bgColorClass} ${textColorClass}`}
    >
      <div
        className={`w-full rounded-xl shadow-custom-md border ${tableBorderColor} ${cardBgClass} p-8`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
  {lang === "id" 
    ? `Selamat Datang Kembali, ${user.username || "Loading..."}!` 
    : `Welcome Back, ${user.username || "Loading..."}!`}
</h1>

            <p className="text-sm ext-textGrayLight dark:text-darkFontColor">
              {new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Leads */}
          <div className={`p-6 w-full md:w-80 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}>

            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.totalLeads}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">{totalLeads.toLocaleString()}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                +17% {t.vsLastMonth}
              </span>
            </div>
          </div>

          {/* High Potential Leads */}
          <div className={`p-6 w-full md:w-80 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}>

            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.highPotentialLeads}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">{highPotentialLeads.toLocaleString()}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dangerRedLight text-dangerRedDark whitespace-nowrap">
                -3.8% {t.vsLastMonth}
              </span>
            </div>
          </div>

          {/* Average Lead Score */}
          <div className={`p-6 w-full md:w-80 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}>

            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.averageLeadScore}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">{averageLeadScore.toLocaleString()}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                +5% {t.vsLastMonth}
              </span>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Lead Score Distribution */}
          <div className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}>
            <h2 className="text-lg font-semibold mb-4">{t.leadScoreDistribution}</h2>
            <div className="h-64">
              {lineData.length > 0 && (
                <ResponsiveLine
                  data={lineData}
                  margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: 0, max: "auto" }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{ tickSize: 5, tickPadding: 5 }}
                  axisLeft={{ tickSize: 5, tickPadding: 5 }}
                  pointSize={8}
                  pointBorderWidth={2}
                  useMesh={true}
                  colors={["#227D53"]}
                  theme={{
                    axis: {
                      domain: {
                        line: { stroke: theme === "dark" ? "#888" : "#555" } 
                      },
                      ticks: {
                        line: { stroke: theme === "dark" ? "#888" : "#555" },
                        text: { fill: theme === "dark" ? "#E5E5E5" : "#333" }
                      },
                    },
                    grid: {
                      line: {
                        stroke: theme === "dark" ? "#666" : "#ccc", 
                        strokeWidth: 1
                      }
                    },
                    labels: { text: { fill: theme === "dark" ? "#E5E5E5" : "#333" } },
                    crosshair: {
                      line: {
                        stroke: theme === "dark" ? "#F0F0F0" : "#777",
                        strokeWidth: 1,
                        strokeDasharray: "6 6"
                      }
                    },
                    tooltip: {
                      container: {
                        background: theme === "dark" ? "#1E2D26" : "#fff",
                        color: theme === "dark" ? "#E5E5E5" : "#333",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Job Distribution Chart (Pie) */}
          <div className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {lang === "id" ? t.jobDistributionId : t.jobDistribution}
              </h2>
            </div>
            <div className="h-64">
              {jobData.length > 0 && (
                <ResponsivePie
                  data={jobData.map((j) => ({
                    id: j.label,
                    label: j.label,
                    value: j.value,
                  }))}
                  margin={{ top: 20, right: 20, bottom: 60, left: 20 }} 
                  innerRadius={0.5}
                  padAngle={1}
                  cornerRadius={5}
                  colors={{ scheme: 'paired' }}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.3]],
                  }}
                  enableArcLinkLabels={false}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]],
                  }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 40, 
                      itemsSpacing: 10,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemTextColor: theme === "dark" ? "#E5E5E5" : "#333",
                      symbolSize: 16,
                      symbolShape: 'circle',
                    },
                  ]}
                  theme={{
                    grid: { line: { stroke: theme === 'dark' ? '#444' : '#ddd' } },
                    labels: { text: { fill: theme === 'dark' ? '#E5E5E5' : '#333' } },
                    tooltip: {
                      container: {
                        background: theme === 'dark' ? '#1E2D26' : '#fff',
                        color: theme === 'dark' ? '#E5E5E5' : '#333',
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Table */}
        <section
          className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
        >
          <h2 className="text-lg font-semibold mb-4">{t.potentialLeadsTable}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderColorLight dark:divide-borderColorDark">
              <thead className={tableHeaderBgClass}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t.name}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t.score}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t.age}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t.job}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t.lastContact}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColorLight dark:divide-borderColorDark">
                {tableData.map((lead, index) => (
                  <tr key={index} className={theme === "dark" ? "hover:bg-darkSecondary" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{t.jobMapping[lead.job] || lead.job}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {monthMapping[lang][lead.lastContact.toLowerCase()] || lead.lastContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/nasabah/${lead.id || 20777}`)}
                        className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md text-sm"
                      >
                        {t.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
