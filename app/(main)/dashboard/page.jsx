"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Chart Components
const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);
const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((m) => m.ResponsivePie),
  { ssr: false }
);
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

const DashboardPage = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const router = useRouter();

  // --- TRANSLATIONS ---
  const translations = {
    en: {
      welcome: "Welcome Back, Kireisha!",
      date: "Thursday, 6 November 2025",
      totalLeads: "Total Leads",
      highPotentialLeads: "High Potential Leads",
      averageLeadScore: "Average Lead Score",
      leadScoreDistribution: "Lead Score Distribution",
      jobDistribution: "Job Distribution",
      resultDistribution: "Result Distribution",
      statusDistribution: "Status Distribution",
      potentialLeadsTable: "Potential Leads Table",
      name: "Name",
      score: "Score",
      age: "Age",
      job: "Job",
      lastContact: "Last Contact",
      status: "Status",
      results: "Results",
      action: "Action",
      viewDetails: "View Details",
      count: "Count",
      statusOptions: {
        contacted: "Contacted",
        notContacted: "Not Contacted",
        attemptedContacted: "Attempted Contacted",
        interested: "Interested",
        notInterested: "Not Interested",
        followUp: "Follow Up",
      },
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
      statusLabelMapping: {
        contacted: "Contacted",
        "not.contacted": "Not Contacted",
        "attempted.contacted": "Attempted",
      },
      resultLabelMapping: {
        interested: "Interested",
        "not.interested": "Not Interested",
        "follow.up": "Follow Up",
        unknown: "Pending",
      },
    },
    id: {
      welcome: "Selamat Datang Kembali, Kireisha!",
      date: "Kamis, 6 November 2025",
      totalLeads: "Total Prospek",
      highPotentialLeads: "Prospek Potensial Tinggi",
      averageLeadScore: "Skor Prospek Rata-rata",
      leadScoreDistribution: "Distribusi Skor Prospek",
      jobDistribution: "Distribusi Pekerjaan",
      resultDistribution: "Distribusi Hasil",
      statusDistribution: "Distribusi Status",
      potentialLeadsTable: "Tabel Prospek Potensial",
      name: "Nama",
      score: "Skor",
      age: "Usia",
      job: "Pekerjaan",
      lastContact: "Kontak Terakhir",
      status: "Status",
      results: "Hasil",
      action: "Aksi",
      viewDetails: "Lihat Detail",
      count: "Jumlah",
      statusOptions: {
        contacted: "Dihubungi",
        notContacted: "Belum Dihubungi",
        attemptedContacted: "Coba Dihubungi",
        interested: "Tertarik",
        notInterested: "Tidak Tertarik",
        followUp: "Tindak Lanjut",
      },
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
      statusLabelMapping: {
        contacted: "Dihubungi",
        "not.contacted": "Belum Dihubungi",
        "attempted.contacted": "Coba Hubungi",
      },
      resultLabelMapping: {
        interested: "Tertarik",
        "not.interested": "Tidak Tertarik",
        "follow.up": "Tindak Lanjut",
        unknown: "Menunggu",
      },
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

  const t = translations[lang];

  // --- STATE ---
  const [lineData, setLineData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [jobData, setJobLineData] = useState([]);

  // State Charts
  const [resultChartData, setResultChartData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);

  const [totalLeads, setTotalLeads] = useState(0);
  const [highPotentialLeads, setHighPotentialLeads] = useState(0);
  const [averageLeadScore, setAverageLeadScore] = useState(0);
  const [leadStatuses, setLeadStatuses] = useState({});
  const [leadResults, setLeadResults] = useState({});
  const [user, setUser] = useState({ username: "", email: "" });

  // --- FETCH DATA ---
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setLineData(data.lineData || []);
        setJobLineData(data.jobData || []);

        // 1. STATUS DATA (BAR CHART)
        const rawStatusData = data.statusData || [];
        const requiredStatuses = [
          "contacted",
          "not.contacted",
          "attempted.contacted",
        ];

        // Hitung manual agar unknown masuk ke not.contacted
        const statusCounts = {
          contacted: 0,
          "not.contacted": 0,
          "attempted.contacted": 0,
        };

        rawStatusData.forEach((item) => {
          if (item.status === "contacted") {
            statusCounts["contacted"] += item.count;
          } else if (item.status === "attempted.contacted") {
            statusCounts["attempted.contacted"] += item.count;
          } else {
            statusCounts["not.contacted"] += item.count;
          }
        });

        const finalStatusData = [
          { status: "contacted", count: statusCounts["contacted"] },
          { status: "not.contacted", count: statusCounts["not.contacted"] },
          {
            status: "attempted.contacted",
            count: statusCounts["attempted.contacted"],
          },
        ];
        setStatusChartData(finalStatusData);

        // 2. RESULT DATA (PIE CHART) - ✅ Format untuk Pie Chart
        const resultPieData = (data.resultData || []).map((item) => ({
          id: item.id,
          label: item.label,
          value: item.value,
        }));
        setResultChartData(resultPieData);

        setTableData(data.tableData || []);
        setTotalLeads(data.totalLeads || 0);
        setHighPotentialLeads(data.highPotentialLeads || 0);
        setAverageLeadScore(data.averageLeadScore || 0);

        const statuses = {};
        const results = {};
        data.tableData?.forEach((lead) => {
          const statusDB =
            lead.status === "unknown" || !lead.status
              ? "not.contacted"
              : lead.status;
          statuses[lead.id] = statusDB;
          results[lead.id] =
            statusDB !== "contacted" ? "unknown" : lead.result || "unknown";
        });
        setLeadStatuses(statuses);
        setLeadResults(results);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const updateStatus = async (leadId, newStatus) => {
    setLeadStatuses((prev) => ({ ...prev, [leadId]: newStatus }));
    if (newStatus !== "contacted") {
      setLeadResults((prev) => ({ ...prev, [leadId]: "unknown" }));
      try {
        await fetch(`/api/dashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: leadId, result: "unknown" }),
        });
      } catch (err) {}
    }
    try {
      await fetch(`/api/dashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
    } catch (err) {}
  };

  const updateResult = async (leadId, newResult) => {
    setLeadResults((prev) => ({ ...prev, [leadId]: newResult }));
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, result: newResult }),
      });
    } catch (err) {}
  };

  // --- STYLING ---
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

  const chartTextColor = theme === "dark" ? "#E5E5E5" : "#333";
  const gridLineColor = theme === "dark" ? "#444" : "#ddd";
  const tooltipBg = theme === "dark" ? "#1E2D26" : "#fff";

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${bgColorClass} ${textColorClass}`}
    >
      <div
        className={`w-full rounded-xl shadow-custom-md border ${tableBorderColor} ${cardBgClass} p-8`}
      >
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            {lang === "id"
              ? `Selamat Datang Kembali, ${user.username || "..."}!`
              : `Welcome Back, ${user.username || "..."}!`}
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

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: t.totalLeads, value: totalLeads },
            { title: t.highPotentialLeads, value: highPotentialLeads },
            { title: t.averageLeadScore, value: averageLeadScore },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 w-full rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
            >
              <h2 className="text-sm ext-textGrayLight dark:text-darkFontColor mb-4 min-h-6">
                {stat.title}
              </h2>
              <p className="text-3xl font-bold">
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        {/* CHARTS GRID (2 Kolom x 2 Baris = 4 Chart) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 1. LEAD SCORE DISTRIBUTION (LINE) */}
          <div
            className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-lg font-semibold mb-4">
              {t.leadScoreDistribution}
            </h2>
            <div className="h-72">
              {lineData.length > 0 && (
                <ResponsiveLine
                  data={lineData}
                  margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: 0, max: "auto" }}
                  axisBottom={{ tickSize: 5, tickPadding: 5 }}
                  axisLeft={{ tickSize: 5, tickPadding: 5 }}
                  pointSize={8}
                  pointBorderWidth={2}
                  useMesh={true}
                  colors={["#227D53"]}
                  theme={{
                    axis: { ticks: { text: { fill: chartTextColor } } },
                    grid: { line: { stroke: gridLineColor } },
                    tooltip: {
                      container: {
                        background: tooltipBg,
                        color: chartTextColor,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* 2. JOB DISTRIBUTION (DONUT PIE - Berlubang) */}
          <div
            className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t.jobDistribution}</h2>
            </div>
            <div className="h-72">
              {jobData.length > 0 && (
                <ResponsivePie
                  data={jobData.map((j) => ({
                    id: t.jobMapping[j.label.toLowerCase()] || j.label,
                    label: t.jobMapping[j.label.toLowerCase()] || j.label,
                    value: j.value,
                  }))}
                  margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
                  innerRadius={0.6} // ✅ Donut (Berlubang)
                  padAngle={0.5}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "paired" }}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  enableArcLinkLabels={false}
                  enableArcLabels={true}
                  legends={[
                    {
                      anchor: "right",
                      direction: "column",
                      translateX: 120,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: chartTextColor,
                      symbolSize: 12,
                      symbolShape: "circle",
                    },
                  ]}
                  theme={{
                    tooltip: {
                      container: {
                        background: tooltipBg,
                        color: chartTextColor,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* 3. STATUS DISTRIBUTION (BAR CHART - KIRI) */}
          <div
            className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-lg font-semibold mb-4">
              {t.statusDistribution}
            </h2>
            <div className="h-72">
              {statusChartData.length > 0 ? (
                <ResponsiveBar
                  data={statusChartData.map((s) => ({
                    status: t.statusLabelMapping[s.status] || s.status,
                    count: s.count,
                  }))}
                  keys={["count"]}
                  indexBy="status"
                  margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "set2" }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: t.count,
                    legendPosition: "middle",
                    legendOffset: -60,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  theme={{
                    axis: {
                      ticks: { text: { fill: chartTextColor } },
                      legend: { text: { fill: chartTextColor } },
                    },
                    // ✅ FIX: Menambahkan grid line color untuk Dark Mode
                    grid: { line: { stroke: gridLineColor } },
                    tooltip: {
                      container: {
                        background: tooltipBg,
                        color: chartTextColor,
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No Data
                </div>
              )}
            </div>
          </div>
          {/* 4. RESULT DISTRIBUTION (SOLID PIE CHART - KANAN) */}
          <div
            className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
          >
            <h2 className="text-lg font-semibold mb-4">
              {t.resultDistribution}
            </h2>
            <div className="h-72">
              {resultChartData.length > 0 ? (
                <ResponsivePie
                  data={resultChartData.map((r) => ({
                    id: t.resultLabelMapping[r.id] || r.id,
                    label: t.resultLabelMapping[r.id] || r.id,
                    value: r.value,
                  }))}
                  margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
                  // ✅ UBAH: innerRadius={0} agar menjadi Pie Penuh (Tidak Bolong)
                  innerRadius={0}
                  padAngle={0.5}
                  cornerRadius={3}
                  colors={{ scheme: "nivo" }}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  enableArcLinkLabels={false}
                  // Legend tetap di kanan agar konsisten
                  legends={[
                    {
                      anchor: "right",
                      direction: "column",
                      translateX: 120,
                      itemsSpacing: 5,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: chartTextColor,
                      symbolSize: 12,
                      symbolShape: "circle",
                    },
                  ]}
                  theme={{
                    tooltip: {
                      container: {
                        background: tooltipBg,
                        color: chartTextColor,
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No Data
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section
          className={`p-6 rounded-xl shadow-custom-sm border ${tableBorderColor} ${cardBgClass}`}
        >
          <style>{`
            .table-scroll-container::-webkit-scrollbar { height: 8px; }
            .table-scroll-container::-webkit-scrollbar-track { background: ${
              theme === "dark" ? "#2a2a2a" : "#f1f1f1"
            }; border-radius: 10px; }
            .table-scroll-container::-webkit-scrollbar-thumb { background: ${
              theme === "dark" ? "#555" : "#888"
            }; border-radius: 10px; }
          `}</style>
          <h2 className="text-lg font-semibold mb-4">
            {t.potentialLeadsTable}
          </h2>
          <div
            className="table-scroll-container overflow-x-auto max-w-full"
            style={{ maxWidth: "995px" }}
          >
            <table className="min-w-[1000px] divide-y divide-borderColorLight dark:divide-borderColorDark">
              <thead className={tableHeaderBgClass}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.name}
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    {t.score}
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
                {tableData.map((lead, index) => {
                  const currentStatus =
                    leadStatuses[lead.id] || "not.contacted";
                  const isResultDisabled = currentStatus !== "contacted";
                  return (
                    <tr
                      key={index}
                      className={
                        theme === "dark"
                          ? "hover:bg-darkSecondary"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {lead.name}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap font-bold">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                            lead.leadScore >= 70
                              ? "bg-red-500"
                              : lead.leadScore >= 40
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {lead.leadScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {lead.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {t.jobMapping[lead.job] || lead.job}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {monthMapping[lang][lead.lastContact.toLowerCase()] ||
                          lead.lastContact}
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
                          onClick={() =>
                            router.push(`/nasabah/${lead.id || 20777}`)
                          }
                          className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary rounded-md text-sm whitespace-nowrap"
                        >
                          {t.viewDetails}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
