'use client';

import React from "react";
import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "next/navigation";

export default function NasabahDetailPage({ params: paramsPromise }) {
  const { theme } = useTheme();
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
        return "text-yellow-500"; // warning
      default: // "failure" atau lainnya
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
      {/* Wrapper Card  */}
      <div className={`w-full max-w-9xl mx-auto rounded-xl shadow-custom-md border ${borderColor} ${bgCard} p-6`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-custom-sm border ${borderColor} ${hoverBg} transition`}
            >
              <ArrowLeft size={20} className={textSecondary} />
            </button>
          <h1 className={`text-2xl font-semibold ${textMain}`}>Lead Details</h1>
        </div>

        {/* Main Content Grid - items-stretch untuk sejajar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* Left Panel */}
          <div className="lg:col-span-1 flex flex-col">
            <div className={`rounded-xl border ${borderColor} p-6 flex flex-col h-full`}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className={textSecondary}>Loading...</p>
                </div>
              ) : nasabah ? (
                <>
                  <div className="flex justify-center mb-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nasabah.id}`} alt="Lead" className="w-32 h-32 rounded-full border-4 border-green-100" />
                  </div>
                  <div className="text-center mb-2">
                    <h2 className={`text-xl font-semibold ${textMain}`}>{nasabah.id}</h2>
                    <p className={`${textSecondary} text-sm`}>{nasabah.personalInfo?.job}</p>
                  </div>
                  <div className={`flex flex-col items-center text-center gap-2 ${textSecondary} text-sm mb-6 pb-6 border-b ${borderColor}`}>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Last Contact: {nasabah.campaignInfo?.month} {nasabah.campaignInfo?.dayOfWeek}</span>
                    </div>
                    <h3 className={`font-semibold ${textMain} text-sm uppercase tracking-wide mt-6`}>
                      Leads Info
                    </h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>Age</p>
                      <p className={`${textMain} font-medium`}>{nasabah.personalInfo?.age}</p>
                    </div>
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>Job</p>
                      <p className={`${textMain} font-medium capitalize`}>{nasabah.personalInfo?.job}</p>
                    </div>
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>Marital Status</p>
                      <p className={`${textMain} font-medium capitalize`}>{nasabah.personalInfo?.marital}</p>
                    </div>
                    <div>
                      <p className={`${textSecondary} text-sm mb-1`}>Education</p>
                      <p className={`${textMain} font-medium capitalize`}>{nasabah.personalInfo?.education?.replace(/\./g, ' ')}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={textSecondary}>No data found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 flex flex-col space-y-6">

            {/* Overview */}
            <div className={`${bgCard} rounded-xl border ${borderColor} p-6`}>
              <h3 className={`text-lg font-semibold ${textMain} mb-6`}>Overview</h3>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Lead Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${getScoreColor(leadScore)}`}>
                      {leadScore}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                      +17% vs average
                    </span>
                  </div>
                </div>

                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Last Campaign</p>
                  <p className={`text-2xl font-semibold ${getPoutcomeColor(nasabah?.campaignInfo?.poutcome)}`}>
                    {capitalize(nasabah?.campaignInfo?.poutcome)}
                  </p>
                </div>

                <div className={`rounded-xl shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Lead Potentials</p>
                  <p className={`text-2xl font-semibold ${getPotentialColor(leadPotential)}`}>
                    {leadPotential}
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-start-2 rounded-xl shadow-custom-sm border p-4 
                                mx-auto w-full max-w-full
                                ${borderColor} ${bgCard}">
                  <p className={`${textSecondary} text-sm mb-2`}>Number of contact</p>
                  <p className="text-3xl font-bold text-green-600">
                    {nasabah?.campaignInfo?.pdays ?? 0}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110`}
                >
                  <span className="text-lg">✓</span>
                  Housing Loan
                </button>
                <button
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110`}
                >
                  <span className="text-lg">✓</span>
                  Personal Loan
                </button>
              </div>
            </div>

            {/* Last Campaign */}
            <div className={`${bgCard} rounded-xl border ${borderColor} p-6 flex flex-col flex-1`}>
              <h3 className={`text-lg font-semibold ${textMain} mb-6 flex-shrink-0`}>Last Campaign</h3>

              <div className="overflow-y-auto flex-1">
                <table className="w-full">
                  <thead className="sticky top-0 bg-inherit">
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>Date</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>Contact</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>Duration</th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>Result</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className={`border-b ${borderColor} ${hoverBg}`}>
                      <td className={`px-4 py-4 text-sm ${textMain}`}>{nasabah ? `${capitalize(nasabah.campaignInfo.dayOfWeek)}, ${capitalize(nasabah.campaignInfo.month)}` : "-"}</td>
                      <td className={`px-4 py-4 text-sm ${textMain}`}>{capitalize(nasabah?.campaignInfo?.contact)}</td>
                      <td className={`px-4 py-4 text-sm ${textMain}`}>04:30</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-xl ${
                          nasabah?.campaignInfo?.poutcome === "success" ? "bg-green-100 text-green-700" :
                          nasabah?.campaignInfo?.poutcome === "unknown" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
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