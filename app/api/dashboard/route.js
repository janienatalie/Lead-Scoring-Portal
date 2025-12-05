import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET(req) {
  // Baca file json
  const filePath = path.join(process.cwd(), "public", "prediction_results.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Ambil data status dari DB
  const [statusRows] = await db.execute(`
    SELECT id, status FROM lead_status
  `);

  const [resultRows] = await db.execute(`
  SELECT id, results FROM lead_results
`);

  // Buat object status berdasarkan id
  const statusMap = {};
  statusRows.forEach((row) => {
    statusMap[row.id] = row.status;
  });

  const resultMap = {};
  resultRows.forEach(row => {
    resultMap[row.id] = row.results;
  });

  // Merge json dan db
  const mergedData = data.map((lead) => ({
    ...lead,
    status: statusMap[lead.id] || lead.status || "unknown",
    result: resultMap[lead.id] || lead.result || "interested",
  }));

  // Table data json dan database
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
      poutcome: lead.poutcome || "unknown",
      status: lead.status, 
      result: lead.result,
    }));

  const totalLeads = mergedData.length;
  const highPotentialLeads = mergedData.filter((lead) => lead.confidence >= 70).length;
  const averageLeadScore = (
    mergedData.reduce((sum, lead) => sum + lead.confidence, 0) / mergedData.length
  ).toFixed(2);

  // Grafik Job
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

  // Leadscore grafik
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

  // Mengirim semua data ke frontend
  return new Response(
    JSON.stringify({
      lineData,
      jobData,
      tableData,
      totalLeads,
      highPotentialLeads,
      averageLeadScore,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(req) {
  try {
    const { status, result } = await req.json();

// Update status jika ada
if (status !== undefined) {
  await db.execute(
    `INSERT INTO lead_status (id, status)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status)`,
    [id, status] // pastikan status bukan undefined
  );
}

// Update result jika ada
if (result !== undefined) {
  await db.execute(
    `INSERT INTO lead_results (id, results)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE results = VALUES(results)`,
    [id, result] // pastikan result bukan undefined
  );
}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE DASHBOARD ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}