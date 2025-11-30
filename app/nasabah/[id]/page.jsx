'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useRouter } from "next/navigation";

const translations = {
  en: {
    leadDetails: "Lead Details",
    loading: "Loading...",
    noData: "No data found",
    lastContact: "Last Contact",
    leadsInfo: "Leads Info",
    age: "Age",
    job: "Job",
    maritalStatus: "Marital Status",
    education: "Education",
    overview: "Overview",
    leadScore: "Lead Score",
    numberOfContact: "Number of Contact",
    lastCampaign: "Last Campaign",
    leadPotentials: "Lead Potentials",
    housingLoan: "Housing Loan",
    personalLoan: "Personal Loan",
    defaultLoan: "Default Loan",
    date: "Date",
    contact: "Contact",
    result: "Result"
  },
  id: {
    leadDetails: "Detail Prospek",
    loading: "Memuat...",
    noData: "Data tidak ditemukan",
    lastContact: "Kontak Terakhir",
    leadsInfo: "Info Prospek",
    age: "Usia",
    job: "Pekerjaan",
    maritalStatus: "Status Pernikahan",
    education: "Pendidikan",
    overview: "Ikhtisar",
    leadScore: "Skor Prospek",
    numberOfContact: "Jumlah Kontak",
    lastCampaign: "Kampanye Terakhir",
    leadPotentials: "Potensi Prospek",
    housingLoan: "KPR",
    personalLoan: "Pinjaman Pribadi",
    defaultLoan: "Pinjaman Default",
    date: "Tanggal",
    contact: "Kontak",
    result: "Hasil"
  }
};

export default function NasabahDetailPage({ params: paramsPromise }) {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const t = translations[lang];
  const router = useRouter();
  const [nasabah, setNasabah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  // Tunggu params resolve
  useEffect(() => {
    async function getParams() {
      const params = await paramsPromise;
      setId(params?.id);
    }
    getParams();
  }, [paramsPromise]);

  // Fetch data setelah ID siap
  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/lead/${id}`);
        const data = await res.json();
        setNasabah(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const getPoutcomeColor = (poutcome) => {
    switch(poutcome) {
      case "success":
        return "text-green-600";
      case "unknown":
        return "text-yellow-500";
      default:
        return "text-red-600";
    }
  };

  function capitalize(str) {
    if (!str) return "-";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const bgScreen = theme === "dark" ? "bg-darkScreenColor" : "bg-screenColor";
  const bgCard = theme === "dark" ? "bg-darkPrimary" : "bg-white";
  const textMain = theme === "dark" ? "text-darkFontColor" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-textGrayDark" : "text-gray-600";
  const borderColor = theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";
  const hoverBg = theme === "dark" ? "hover:bg-darkSecondary" : "hover:bg-gray-50";

  const getScoreColor = (score) => score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const getPotentialColor = (potential) => potential === 'Hot' ? 'text-red-600' : potential === 'Warm' ? 'text-yellow-600' : 'text-blue-600';
  const [leadScore, setLeadScore] = useState(0);
  const [leadPotential, setLeadPotential] = useState("Cold");

  useEffect(() => {
    if (nasabah?.prediction) {
      setLeadScore(nasabah.prediction.leadScore);
      setLeadPotential(nasabah.prediction.leadPotential);
    }
  }, [nasabah]);

  return (
    <div className={`min-h-screen p-4 ${bgScreen}`}>
      <div className={`w-full max-w-9xl mx-auto rounded-xl shadow-custom-md border ${borderColor} ${bgCard} p-6`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-custom-sm border ${borderColor} ${hoverBg} transition`}
          >
            <ArrowLeft size={20} className={textSecondary} />
          </button>
          <h1 className={`text-2xl font-semibold ${textMain}`}>{t.leadDetails}</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="lg:col-span-1 flex flex-col">
            <div className={`rounded-xl border ${borderColor} p-6 flex flex-col h-full`}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className={textSecondary}>{t.loading}</p>
                </div>
              ) : nasabah ? (
                <>
                  <div className="flex justify-center mb-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nasabah.id}`} alt="Lead" className="w-32 h-32 rounded-full border-4 border-green-100" />
                  </div>
                  <div className="text-center mb-2">
                    <h2 className={`text-xl font-semibold ${textMain}`}>{nasabah.id}</h2>
                  </div>
                  <div className={`flex flex-col items-center text-center gap-2 ${textSecondary} text-sm mb-6 pb-6 border-b ${borderColor}`}>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{t.lastContact}: {nasabah.campaignInfo?.month ? capitalize(nasabah.campaignInfo.month) : ""}</span>
                    </div>
                    <h3 className={`font-semibold ${textMain} text-sm uppercase tracking-wide mt-6`}>
                      {t.leadsInfo}
                    </h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>{t.age}</p>
                      <p className={`${textMain} font-medium`}>{nasabah.personalInfo?.age}</p>
                    </div>
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>{t.job}</p>
                      <p className={`${textMain} font-medium capitalize`}>
                        {nasabah.personalInfo?.job?.replace(/\.$/, "")}
                      </p>
                    </div>
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>{t.maritalStatus}</p>
                      <p className={`${textMain} font-medium capitalize`}>{nasabah.personalInfo?.marital}</p>
                    </div>
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>{t.education}</p>
                      <p className={`${textMain} font-medium capitalize`}>{nasabah.personalInfo?.education?.replace(/\./g, ' ')}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={textSecondary}>{t.noData}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Overview */}
            <div className={`${bgCard} rounded-xl border ${borderColor} p-6`}>
              <h3 className={`text-lg font-semibold ${textMain} mb-6`}>{t.overview}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Lead Score */}
                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>{t.leadScore}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{leadScore}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                      +17% vs average
                    </span>
                  </div>
                </div>

                {/* Number of Contact */}
                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>{t.numberOfContact}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{nasabah?.campaignInfo?.pdays ?? 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Last Campaign */}
                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>{t.lastCampaign}</p>
                  <p className={`text-2xl font-semibold ${getPoutcomeColor(nasabah?.campaignInfo?.poutcome)}`}>
                    {capitalize(nasabah?.campaignInfo?.poutcome)}
                  </p>
                </div>

                {/* Lead Potentials */}
                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>{t.leadPotentials}</p>
                  <p className={`text-2xl font-semibold ${getPotentialColor(leadPotential)}`}>
                    {leadPotential}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110`}>
                  <span className="text-lg">✓</span> {t.housingLoan}
                </button>
                <button className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110`}>
                  <span className="text-lg">✓</span> {t.personalLoan}
                </button>
                <button className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 text-white bg-[#b3b3b3] hover:brightness-110 dark:bg-[#8a8a8a]`}>
                  <span className="text-lg">✓</span> {t.defaultLoan}
                </button>
              </div>
            </div>

            {/* Last Campaign Table */}
            <div className={`${bgCard} rounded-xl border ${borderColor} p-6 flex flex-col flex-1`}>
              <h3 className={`text-lg font-semibold ${textMain} mb-6 flex-shrink-0`}>{t.lastCampaign}</h3>

              <div className="overflow-y-auto flex-1">
                <table className="w-full table-fixed">
                  <thead className="sticky top-0 bg-inherit">
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary} w-[40%]`}>{t.date}</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary} w-[30%]`}>{t.contact}</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary} w-[30%]`}>{t.result}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${borderColor} ${hoverBg}`}>
                      <td className={`px-4 py-4 text-sm ${textMain}`}>{nasabah ? capitalize(nasabah.campaignInfo.month) : "-"}</td>
                      <td className={`px-4 py-4 text-sm ${textMain}`}>{capitalize(nasabah?.campaignInfo?.contact)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-xl ${
                          nasabah?.campaignInfo?.poutcome === "success" ? "bg-green-100 text-green-700"
                          : nasabah?.campaignInfo?.poutcome === "unknown" ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                          {capitalize(nasabah?.campaignInfo?.poutcome)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
