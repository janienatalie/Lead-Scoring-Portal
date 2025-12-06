import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET(req) {
  // 1. Baca file json
  const filePath = path.join(
    process.cwd(),
    "public",
    "prediction_results.json"
  );
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // 2. Ambil data status & result dari DB
  const [statusRows] = await db.execute(`SELECT id, status FROM lead_status`);
  const [resultRows] = await db.execute(`SELECT id, results FROM lead_results`);

  const statusMap = {};
  statusRows.forEach((row) => (statusMap[row.id] = row.status));

  const resultMap = {};
  resultRows.forEach((row) => (resultMap[row.id] = row.results));

  // 3. Merge data
  const mergedData = data.map((lead) => ({
    ...lead,
    status: statusMap[lead.id] || lead.status || "unknown",
    result: resultMap[lead.id] || lead.result || "unknown",
    confidence: lead.confidence || 0,
  }));

  // --- LOGIKA BARU UNTUK CHART ---

  // A. Data Grafik Job (Sudah ada)
  const jobCountMap = {};
  mergedData.forEach((lead) => {
    const jobName =
      lead.job.charAt(0).toUpperCase() + lead.job.slice(1).replace(/\./g, "");
    jobCountMap[jobName] = (jobCountMap[jobName] || 0) + 1;
  });
  const jobData = Object.keys(jobCountMap).map((job) => ({
    label: job,
    value: jobCountMap[job],
  }));

  // B. Data Grafik Lead Score (Sudah ada)
  const leadScoreBuckets = Array(11).fill(0);
  mergedData.forEach((lead) => {
    const score = Math.round(lead.confidence);
    const index = Math.min(Math.floor(score / 10), 10);
    leadScoreBuckets[index]++;
  });
  const lineData = [
    {
      id: "Lead Score",
      data: leadScoreBuckets.map((count, i) => ({
        x: `${i * 10}-${i * 10 + 9}`,
        y: count,
      })),
    },
  ];

  // C. ✅ DATA BARU: Grafik Result Distribution (Pie Chart)
  const resultCountMap = {};
  mergedData.forEach((lead) => {
    // Default ke 'unknown' jika kosong
    let res = lead.result || "unknown";
    resultCountMap[res] = (resultCountMap[res] || 0) + 1;
  });
  const resultData = Object.keys(resultCountMap).map((key) => ({
    id: key, // Nivo Pie butuh 'id'
    label: key,
    value: resultCountMap[key],
  }));

  // D. ✅ DATA BARU: Grafik Status Distribution (Bar Chart)
  const statusCountMap = {};
  mergedData.forEach((lead) => {
    let stat = lead.status || "unknown";
    statusCountMap[stat] = (statusCountMap[stat] || 0) + 1;
  });
  // Format khusus Nivo Bar: [{ status: "contacted", count: 120 }, ...]
  const statusData = Object.keys(statusCountMap).map((key) => ({
    status: key,
    count: statusCountMap[key],
  }));

  // -----------------------------

  // Statistik Utama
  const totalLeads = mergedData.length;
  const highPotentialLeads = mergedData.filter(
    (lead) => lead.confidence >= 70
  ).length;
  const averageLeadScore = (
    mergedData.reduce((sum, lead) => sum + lead.confidence, 0) /
    mergedData.length
  ).toFixed(2);

  // Table Data (Top 5)
  const tableData = [...mergedData]
    .map((lead) => ({
      ...lead,
      leadScore: Math.round(lead.confidence),
    }))
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 5)
    .map((lead) => ({
      id: lead.id,
      name: lead.name,
      leadScore: lead.leadScore,
      age: lead.age,
      job: lead.job.replace(/\./g, ""),
      lastContact: lead.month?.toLowerCase() || "-",
      status: lead.status,
      result: lead.result,
    }));

  return new Response(
    JSON.stringify({
      lineData,
      jobData,
      resultData, // ✅ Kirim ke frontend
      statusData, // ✅ Kirim ke frontend
      tableData,
      totalLeads,
      highPotentialLeads,
      averageLeadScore,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// ... POST function tetap sama ...
export async function POST(req) {
  try {
    const { id, status, result } = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID Required" }, { status: 400 });

    if (status !== undefined) {
      await db.execute(
        `INSERT INTO lead_status (id, status) VALUES (?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [id, status]
      );
    }

    if (result !== undefined) {
      await db.execute(
        `INSERT INTO lead_results (id, results) VALUES (?, ?) ON DUPLICATE KEY UPDATE results = VALUES(results)`,
        [id, result]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
