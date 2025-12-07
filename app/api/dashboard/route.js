import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET(req) {
  try {
    // 1. Baca file json
    const filePath = path.join(
      process.cwd(),
      "public",
      "prediction_results.json"
    );
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // 2. Ambil data status & result dari DB
    const [statusRows] = await db.execute(`SELECT id, status FROM lead_status`);
    const [resultRows] = await db.execute(
      `SELECT id, results FROM lead_results`
    );

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

    // --- AGGREGATION LOGIC ---

    // A. Lead Score Distribution (Line Chart)
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

    // B. Job Distribution (Total Count) - Optional if not used
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

    // C. ✅ NEW: Job Success Potential (Average Confidence per Job)
    // Ini menggantikan data hardcoded. Kita hitung rata-rata skor per pekerjaan.
    const jobScoreMap = {}; // { admin: { total: 500, count: 10 }, ... }

    mergedData.forEach((lead) => {
      // Normalisasi nama job agar cocok dengan key translation di frontend
      // e.g., "admin." -> "admin", "blue-collar" -> "blue-collar"
      const jobKey = lead.job.toLowerCase().replace(/\.$/, "");

      if (!jobScoreMap[jobKey]) {
        jobScoreMap[jobKey] = { totalScore: 0, count: 0 };
      }
      jobScoreMap[jobKey].totalScore += lead.confidence;
      jobScoreMap[jobKey].count += 1;
    });

    // Hitung rata-rata dan format
    const jobSuccessData = Object.keys(jobScoreMap)
      .map((key) => ({
        id: key, // key untuk mapping translation (admin, student, etc)
        label: key,
        value: parseFloat(
          (jobScoreMap[key].totalScore / jobScoreMap[key].count).toFixed(1)
        ), // Rata-rata skor
      }))
      .sort((a, b) => b.value - a.value); // Urutkan dari skor tertinggi

    // D. Result Distribution (Pie/Treemap Data)
    const resultCountMap = {};
    mergedData.forEach((lead) => {
      let res = lead.result || "unknown";
      resultCountMap[res] = (resultCountMap[res] || 0) + 1;
    });
    const resultData = Object.keys(resultCountMap).map((key) => ({
      id: key,
      label: key,
      value: resultCountMap[key],
    }));

    // E. Status Distribution (Bar Chart Data)
    const statusCountMap = {};
    mergedData.forEach((lead) => {
      let stat = lead.status || "unknown";
      statusCountMap[stat] = (statusCountMap[stat] || 0) + 1;
    });
    const statusData = Object.keys(statusCountMap).map((key) => ({
      status: key,
      count: statusCountMap[key],
    }));

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
      .sort((a, b) => b.confidence - a.confidence) // Sort by confidence descending
      .slice(0, 5)
      .map((lead) => ({
        id: lead.id,
        name: lead.name,
        leadScore: Math.round(lead.confidence),
        age: lead.age,
        job: lead.job.replace(/\.$/, ""),
        lastContact: lead.month?.toLowerCase() || "-",
        status: lead.status,
        result: lead.result,
      }));

    return NextResponse.json({
      lineData,
      jobData,
      jobSuccessData, // ✅ Kirim data baru ini
      resultData,
      statusData,
      tableData,
      totalLeads,
      highPotentialLeads,
      averageLeadScore,
    });
  } catch (error) {
    console.error("DASHBOARD GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
