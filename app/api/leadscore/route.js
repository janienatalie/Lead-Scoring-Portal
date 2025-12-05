import { NextResponse } from "next/server";
import data from "../../../public/prediction_results.json";
import { lineData } from "../../lib/data/dashboard";
import db from "../../lib/db";

export async function GET(req) {
  // Ambil semua status/result dari DB
  const [statusRows] = await db.execute("SELECT id, status FROM lead_status");
  const [resultRows] = await db.execute("SELECT id, results FROM lead_results");

  const statusMap = {};
  statusRows.forEach(r => (statusMap[r.id] = r.status));

  const resultMap = {};
  resultRows.forEach(r => (resultMap[r.id] = r.results));
  
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
  const tableData = data.map(lead => ({
    ...lead,
    score: Math.round(lead.confidence),
    name: lead.name,
    age: lead.age,
    job: lead.job ? lead.job.charAt(0).toUpperCase() + lead.job.slice(1) : "",
    job_id: lead.job ? jobMapId[lead.job.toLowerCase()] || lead.job : "",
    lastContact: lead.month ? monthMapEn[lead.month.toLowerCase()] || lead.month : "",
    lastContact_id: lead.month
      ? monthMapId[lead.month.toLowerCase()] || monthMapEn[lead.month.toLowerCase()] || lead.month
      : "",
    status: statusMap[lead.id] || "unknown",
    result: resultMap[lead.id] || "interested",
  }));

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
    lineData
  });
}

export async function POST(req) {
  try {
    const { id, status, result } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID lead wajib ada" }, { status: 400 });
    }

    // Update status jika ada
    if (status !== undefined) {
      await db.execute(
        `INSERT INTO lead_status (id, status)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [id, status] // ✅ array, bukan object
      );
    }

    // Update result jika ada
    if (result !== undefined) {
      await db.execute(
        `INSERT INTO lead_results (id, results)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE results = VALUES(results)`,
        [id, result] // ✅ array
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE DASHBOARD ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
