'use client';

import React from "react";
import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";
import Link from 'next/link';

export default function NasabahDetailPage({ params }) {
  const { theme } = useTheme();
  const { id } = React.use(params);

  // Data dummy
  const [nasabah] = useState({
    id: id,
    name: 'Rusdi Ngawi',
    position: 'Project Manager',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rusdi',
    lastContact: '2 Jan 2021',
    email: 'rusdingawi@gmail.com',
    phone: '+62 89572398572',
    age: 42,
    maritalStatus: 'Married',
    stage: 'Contacted',
    leadScore: 90,
    leadScoreChange: '+17%',
    lastCampaign: 'Success',
    leadPotentials: 'Hot',
    averageYearlyBalance: '€ 106,35',
    numberOfContact: 4,
    products: [
      { name: 'Housing Loan', status: 'active' },
      { name: 'Personal Loan', status: 'active' },
      { name: 'Credit Default', status: 'inactive' }
    ],
    campaigns: [
      { date: '15 March 2024', contact: 'Cellular', duration: '04:30', result: 'Success' },
      { date: '15 March 2024', contact: 'Cellular', duration: '04:30', result: 'Success' },
      { date: '15 March 2024', contact: 'Cellular', duration: '04:30', result: 'Success' }
    ]
  });

  const bgScreen = theme === "dark" ? "bg-darkScreenColor" : "bg-screenColor";
  const bgCard = theme === "dark" ? "bg-darkPrimary" : "bg-white";
  const textMain = theme === "dark" ? "text-darkFontColor" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-textGrayDark" : "text-gray-600";
  const borderColor = theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";
  const hoverBg = theme === "dark" ? "hover:bg-darkSecondary" : "hover:bg-gray-50";

  const getScoreColor = (score) => score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const getPotentialColor = (potential) => potential === 'Hot' ? 'text-red-600' : potential === 'Warm' ? 'text-yellow-600' : 'text-blue-600';

  return (
    <div className={`min-h-screen p-4 ${bgScreen}`}>
      {/* Wrapper Card  */}
      <div className={`w-full max-w-9xl mx-auto rounded-lg shadow-custom-md border ${borderColor} ${bgCard} p-6`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/nasabah">
            <button className={`w-10 h-10 flex items-center justify-center rounded-full shadow-custom-sm border ${borderColor} ${hoverBg} transition`}>
              <ArrowLeft size={20} className={textSecondary} />
            </button>
          </Link>
          <h1 className={`text-2xl font-semibold ${textMain}`}>Lead Details</h1>
        </div>

        {/* Main Content Grid - items-stretch untuk sejajar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* Left Panel */}
          <div className="lg:col-span-1 flex flex-col">
            <div className={`rounded-lg border ${borderColor} p-6 flex flex-col h-full`}>
              <div className="flex justify-center mb-6">
                <img src={nasabah.image} alt={nasabah.name} className="w-32 h-32 rounded-full border-4 border-green-100" />
              </div>
              <div className="text-center mb-2">
                <h2 className={`text-xl font-semibold ${textMain}`}>{nasabah.name}</h2>
                <p className={`${textSecondary} text-sm`}>{nasabah.position}</p>
              </div>
              <div className={`flex flex-col items-center text-center gap-2 ${textSecondary} text-sm mb-6 pb-6 border-b ${borderColor}`}>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Last Contact: {nasabah.lastContact}</span>
                </div>
                <h3 className={`font-semibold ${textMain} text-sm uppercase tracking-wide mt-6`}>
                  Leads Info
                </h3>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <div className={`flex items-center gap-2 ${textSecondary} text-sm mb-1`}>
                    <Mail size={16} />
                    <span>Email</span>
                  </div>
                  <p className="text-blue-600 text-sm ml-6">{nasabah.email}</p>
                </div>
                <div>
                  <div className={`flex items-center gap-2 ${textSecondary} text-sm mb-1`}>
                    <Phone size={16} />
                    <span>Phone</span>
                  </div>
                  <p className="text-blue-600 text-sm ml-6">{nasabah.phone}</p>
                </div>
                <div>
                  <p className={`${textSecondary} text-sm mb-1`}>Age</p>
                  <p className={`${textMain} font-medium`}>{nasabah.age}</p>
                </div>
                <div>
                  <p className={`${textSecondary} text-sm mb-1`}>Marital Status</p>
                  <p className={`${textMain} font-medium`}>{nasabah.maritalStatus}</p>
                </div>
                <div>
                  <p className={`${textSecondary} text-sm mb-1`}>Stage</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{nasabah.stage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 flex flex-col space-y-6">

            {/* Overview */}
            <div className={`${bgCard} rounded-lg border ${borderColor} p-6`}>
              <h3 className={`text-lg font-semibold ${textMain} mb-6`}>Overview</h3>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className={`rounded-lg shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Lead Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${getScoreColor(nasabah.leadScore)}`}>
                      {nasabah.leadScore}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-successGreenLight text-successGreenDark whitespace-nowrap">
                      {nasabah.leadScoreChange} vs average
                    </span>
                  </div>
                </div>

                <div className={`rounded-lg shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Last Campaign</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {nasabah.lastCampaign}
                  </p>
                </div>

                <div className={`rounded-lg shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Lead Potentials</p>
                  <p className={`text-2xl font-semibold ${getPotentialColor(nasabah.leadPotentials)}`}>
                    {nasabah.leadPotentials}
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`rounded-lg shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Average Yearly Balance</p>
                  <p className="text-3xl font-bold text-green-600">
                    {nasabah.averageYearlyBalance}
                  </p>
                </div>

                <div className={`rounded-lg shadow-custom-sm border ${borderColor} p-4 ${bgCard}`}>
                  <p className={`${textSecondary} text-sm mb-2`}>Number of contact</p>
                  <p className="text-3xl font-bold text-green-600">
                    {nasabah.numberOfContact}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="flex flex-wrap gap-3 justify-center">
                {nasabah.products.map((product, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      product.status === "active"
                        ? "text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-lg">✓</span>
                    {product.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Last Campaign */}
            <div className={`${bgCard} rounded-lg border ${borderColor} p-6 flex flex-col flex-1`}>
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
                    {nasabah.campaigns.map((campaign, idx) => (
                      <tr key={idx} className={`border-b ${borderColor} ${hoverBg}`}>
                        <td className={`px-4 py-4 text-sm ${textMain}`}>{campaign.date}</td>
                        <td className={`px-4 py-4 text-sm ${textMain}`}>{campaign.contact}</td>
                        <td className={`px-4 py-4 text-sm ${textMain}`}>{campaign.duration}</td>
                        <td className="px-4 py-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                            {campaign.result}
                          </span>
                        </td>
                      </tr>
                    ))}
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