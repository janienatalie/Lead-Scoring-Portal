import fs from "fs";
import path from "path";

export async function GET(req) {
  // Baca file JSON 
  const filePath = path.join(process.cwd(), "public", "prediction_results.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Hitung leadScore 
  const tableData = [...data]
    .map((lead) => ({
      ...lead,
      leadScore: Math.round(lead.confidence),
    }))
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 5)
    .map((lead) => ({
      id: lead.id,
      name: lead.name, 
      age: lead.age,
      job: lead.job.replace(/\./g, ""), 
      lastContact: lead.month?.toLowerCase() || "-", 
    }));

  // Total Leads
  const totalLeads = data.length;

  // High Potentials
  const highPotentialLeads = data.filter((lead) => lead.confidence >= 70).length;

  // Average Score
  const averageLeadScore = (
    data.reduce((sum, lead) => sum + lead.confidence, 0) / data.length
  ).toFixed(2);

  // Hitung job distribution
  const jobCountMap = {};
  data.forEach((lead) => {
    const jobName = lead.job.charAt(0).toUpperCase() + lead.job.slice(1);
    jobCountMap[jobName] = (jobCountMap[jobName] || 0) + 1;
  });
  const jobData = Object.keys(jobCountMap).map((job) => ({
    label: job,
    value: jobCountMap[job],
  }));

  // Lead score distribution 
  const leadScoreBuckets = Array(11).fill(0);
  data.forEach((lead) => {
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
