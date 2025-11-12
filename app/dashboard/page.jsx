"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import dynamic from "next/dynamic";

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
      name: "Nama",
      score: "Score",
      age: "Age",
      job: "Job",
      lastContact: "Last Contact",
      action: "Action",
      viewDetails: "View Details",
      contacted: "Contacted",
      new: "New",
      converted: "Converted",
      others: "Others",
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
    },
  };

  const t = translations[lang];

  // Data untuk chart dan tabel
  const lineData = [
    {
      id: "leads",
      data: [
        { x: 0, y: 5000 },
        { x: 10, y: 8000 },
        { x: 20, y: 12000 },
        { x: 30, y: 18000 },
        { x: 40, y: 15000 },
        { x: 50, y: 20000 },
        { x: 60, y: 17000 },
        { x: 70, y: 22000 },
        { x: 80, y: 19000 },
        { x: 90, y: 24000 },
        { x: 100, y: 22000 },
      ],
    },
  ];

  const pieData = [
    { id: t.contacted, value: 40, color: "#227D53" }, // pieContacted
    { id: t.new, value: 25, color: "#13452D" }, // pieNew
    { id: t.converted, value: 20, color: "#5CB85C" }, // pieConverted
    { id: t.others, value: 15, color: "#808080" }, // pieOthers
  ];

  const tableData = [
    {
      name: "John Doe",
      score: 90,
      age: 40,
      job: "Technician",
      lastContact: "2 days ago",
    },
    {
      name: "John Doe",
      score: 90,
      age: 40,
      job: "Technician",
      lastContact: "2 days ago",
    },
    {
      name: "John Doe",
      score: 90,
      age: 40,
      job: "Technician",
      lastContact: "2 days ago",
    },
    {
      name: "John Doe",
      score: 90,
      age: 40,
      job: "Technician",
      lastContact: "2 days ago",
    },
    {
      name: "John Doe",
      score: 90,
      age: 40,
      job: "Technician",
      lastContact: "2 days ago",
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

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${bgColorClass} ${textColorClass}`}
    >
      {/* Kotak Konten Utama */}
      <div
        className={`w-full rounded-lg shadow-custom-md border ${tableBorderColor} ${cardBgClass} p-8`}
      >
        {/* Teks sapaan */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{t.welcome}</h1>
          <p className="text-sm ext-textGrayLight dark:text-darkFontColor">
            {t.date}
          </p>
        </div>

        {/* Stats Cards (Ini adalah versi terbaru Anda dengan min-h-6) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Leads Card */}
          <div
            className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.totalLeads}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">45,213</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                +17% {t.vsLastMonth}
              </span>
            </div>
          </div>

          {/* High Potential Leads Card */}
          <div
            className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.highPotentialLeads}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">1,362</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dangerRedLight text-dangerRedDark whitespace-nowrap">
                -3.8% {t.vsLastMonth}
              </span>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div
            className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.conversionRate}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">7.6%</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                +1.3% {t.vsLastMonth}
              </span>
            </div>
          </div>

          {/* Average Lead Score Card */}
          <div
            className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
              {t.averageLeadScore}
            </h2>
            <div className="flex justify-between items-baseline flex-wrap gap-y-3 gap-x-2">
              <p className="text-3xl font-bold">64</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                +5% {t.vsLastMonth}
              </span>
            </div>
          </div>
        </section>
        {/* --- AKHIR: PERBAIKAN STATS CARDS --- */}

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {t.leadScoreDistribution}
              </h2>
              <select
                className={`p-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-darkSecondary border-borderColorDark text-darkFontColor"
                    : "bg-gray-50 border-borderColorLight text-fontColor"
                }`}
              >
                <option>6 {t.months}</option>
                <option>3 {t.months}</option>
                <option>12 {t.months}</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveLine
                data={lineData}
                margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: 0,
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "",
                  legendOffset: 36,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "",
                  legendOffset: -40,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true} // Ini yang mengaktifkan tooltip & crosshair
                colors={["#227D53"]} // pieContacted (atau secondary)
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: theme === "dark" ? "#888" : "#ccc",
                      },
                    },
                    ticks: {
                      line: {
                        stroke: theme === "dark" ? "#888" : "#ccc",
                      },
                      text: {
                        fill: theme === "dark" ? "#E5E5E5" : "#333333",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: theme === "dark" ? "#3A3A3A" : "#eee",
                    },
                  },
                  legends: {
                    text: {
                      fill: theme === "dark" ? "#E5E5E5" : "#333333",
                    },
                  },
                  tooltip: {
                    container: {
                      background: theme === "dark" ? "#1E2D26" : "#fff",
                      color: theme === "dark" ? "#E5E5E5" : "#333333",
                    },
                  },
                  // --- AWAL PERUBAHAN ---
                  crosshair: {
                    line: {
                      // Ini adalah garis putus-putus vertikal saat hover
                      stroke: theme === "dark" ? "#ffffff" : "#555555", // Putih di dark mode, abu-abu di light mode
                      strokeWidth: 1,
                      strokeDasharray: "6 6", // Membuatnya putus-putus
                    },
                  },
                  // --- AKHIR PERUBAHAN ---
                }}
              />
            </div>
          </div>
          <div
            className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t.leadStageConversion}</h2>
              <select
                className={`p-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-darkSecondary border-borderColorDark text-darkFontColor"
                    : "bg-gray-50 border-borderColorLight text-fontColor"
                }`}
              >
                <option>6 {t.months}</option>
                <option>3 {t.months}</option>
                <option>12 {t.months}</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsivePie
                data={pieData}
                margin={{ top: 20, right: 60, bottom: 80, left: 80 }}
                innerRadius={0.7}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={
                  theme === "dark" ? "#ffffff" : "#333333"
                }
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={theme === "dark" ? "#ffffff" : "#333333"}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: theme === "dark" ? "#ffffff" : "#333333",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor:
                            theme === "dark" ? "#a3a1a1ff" : "#000000",
                        },
                      },
                    ],
                  },
                ]}
                // --- AWAL PERUBAHAN ---
                theme={{
                  labels: {
                    text: {
                      fill: theme === "dark" ? "#ffffff" : "#333333",
                    },
                  },
                  legends: {
                    text: {
                      fill: theme === "dark" ? "#ffffff" : "#333333",
                    },
                  },
                  tooltip: {
                    container: {
                      background: "#ffffff", // Latar belakang tooltip selalu putih
                      color: "#333333", // Teks tooltip selalu hitam/gelap
                    },
                  },
                }}
                // --- AKHIR PERUBAHAN ---
              />
            </div>
          </div>
        </section>

        {/* Potential Leads Table */}
        <section
          className={`p-6 rounded-lg shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
        >
          <h2 className="text-lg font-semibold mb-4">
            {t.potentialLeadsTable}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-borderColorLight dark:divide-borderColorDark">
              <thead className={tableHeaderBgClass}>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-textGrayLight dark:text-darkFontColor dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.name}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium ext-textGrayLight dark:text-darkFontColor dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.score}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium ext-textGrayLight dark:text-darkFontColor dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.age}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium ext-textGrayLight dark:text-darkFontColor dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.job}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium ext-textGrayLight dark:text-darkFontColor dark:text-textGrayDark uppercase tracking-wider"
                  >
                    {t.lastContact}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium ext-textGrayLight dark:text-darkFontColor dark:text-textGrayDark uppercase tracking-wider"
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
                      {/* --- AWAL PERUBAHAN --- */}
                      <button className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md transition-all duration-200 hover:brightness-110 text-sm">
                        {t.viewDetails}
                      </button>
                      {/* --- AKHIR PERUBAHAN --- */}
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
