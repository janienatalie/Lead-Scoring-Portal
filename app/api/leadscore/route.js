import data from "../../../public/prediction_results.json";
import { lineData, pieData } from "../../lib/data/dashboard";

export async function GET(req) {
  // Ambil top 5 lead berdasarkan confidence
  const tableData = [...data]
    .map((lead) => ({
      ...lead,
      leadScore: Math.round(lead.confidence),
    }))
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 8)
    .map((lead) => ({
      id: lead.id,
      name: `Lead ${lead.id}`,
      score: lead.leadScore,
      age: lead.age,
      job: lead.job.charAt(0).toUpperCase() + lead.job.slice(1),
      lastContact: `${lead.day_of_week.charAt(0).toUpperCase() + lead.day_of_week.slice(1)}, ${lead.month.charAt(0).toUpperCase() + lead.month.slice(1)}`,
    }));

  const totalLeads = data.length;
  const highPotentialLeads = data.filter(lead => Math.round(lead.confidence) > 50).length;
  const averageLeadScore = Math.round(
    data.reduce((sum, lead) => sum + Math.round(lead.confidence), 0) / totalLeads
  );

  return new Response(
    JSON.stringify({ tableData, totalLeads, highPotentialLeads, averageLeadScore, lineData, pieData }),
    { headers: { "Content-Type": "application/json" } }
  );
}
