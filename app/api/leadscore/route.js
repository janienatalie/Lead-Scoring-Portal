import { NextResponse } from "next/server";
import data from "../../../public/prediction_results.json";
import { lineData, pieData } from "../../lib/data/dashboard";

export async function GET(req) {
  // --- Mapping bulan ---
  const monthMapEn = {
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
  };

  const monthMapId = {
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
  };

  const jobMapId = {
    "admin.": "Admin",
    "blue-collar": "Buruh",
    entrepreneur: "Wiraswasta",
    housemaid: "ART",
    management: "Manajemen",
    retired: "Pensiunan",
    "self-employed": "Wirausaha",
    services: "Layanan",
    student: "Pelajar",
    technician: "Teknisi",
    unemployed: "Pengangguran",
    unknown: "Tidak Diketahui",
  };

  // --- Olah data ---
  const tableData = data
    .map((lead) => ({
      ...lead,
      score: Math.round(lead.confidence), // skor tetap ada
      name: lead.name, // ambil langsung dari JSON
      age: lead.age,
      job: lead.job ? lead.job.charAt(0).toUpperCase() + lead.job.slice(1) : "",
      job_id: lead.job ? jobMapId[lead.job.toLowerCase()] || lead.job : "",
      lastContact: lead.month ? monthMapEn[lead.month.toLowerCase()] || lead.month : "",
      lastContact_id: lead.month
        ? monthMapId[lead.month.toLowerCase()] || monthMapEn[lead.month.toLowerCase()] || lead.month
        : "",
    }))
    .sort((a, b) => b.leadScore - a.leadScore);

  // --- Statistik utama ---
  const totalLeads = data.length;
  const highPotentialLeads = data.filter((lead) => lead.leadScore > 50).length;
  const averageLeadScore = Math.round(
    data.reduce((sum, lead) => sum + Math.round(lead.confidence), 0) / totalLeads
  );

  return NextResponse.json({
    tableData,
    totalLeads,
    highPotentialLeads,
    averageLeadScore,
    lineData,
    pieData,
  });
}
