import data from "../../../public/prediction_results.json";

// --- Hitung leadScore ---
const tableData = [...data]
  .map((lead) => ({
    ...lead,
    leadScore: Math.round(lead.confidence),
  }))
  .sort((a, b) => b.leadScore - a.leadScore)
  .slice(0, 5)
  .map((lead) => ({
    id: lead.id,
    name: `Lead ${lead.id}`,
    score: lead.leadScore,
    age: lead.age,
    job: lead.job
    .replace(/\./g, "")              
    .charAt(0).toUpperCase() + 
    lead.job.replace(/\./g, "").slice(1),
    lastContact: lead.month?.charAt(0).toUpperCase() + lead.month?.slice(1) || "-"
  }));

// --- Total leads ---
const totalLeads = data.length;

// --- High potential ---
const highPotentialLeads = data.filter(
  (lead) => lead.confidence >= 70
).length;


// --- Average score ---
const averageLeadScore = (
  data.reduce((sum, lead) => sum + lead.confidence, 0) / data.length
).toFixed(2);  // dua desimal, lebih rapi


// --- Hitung job distribution ---
const jobCountMap = {};
data.forEach((lead) => {
  const jobName = lead.job.charAt(0).toUpperCase() + lead.job.slice(1);
  jobCountMap[jobName] = (jobCountMap[jobName] || 0) + 1;
});
const jobData = Object.keys(jobCountMap).map((job) => ({
  label: job,
  value: jobCountMap[job],
}));

// --- Hitung lead score distribution untuk line chart ---
const leadScoreBuckets = Array(11).fill(0); // 0-10, 11-20, ..., 100
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

export async function GET(req) {
  return new Response(
    JSON.stringify({
      lineData,    // sekarang dinamis
      jobData,
      tableData,
      totalLeads,
      highPotentialLeads,
      averageLeadScore,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
