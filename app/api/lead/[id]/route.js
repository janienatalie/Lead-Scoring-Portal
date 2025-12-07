import fs from "fs";
import path from "path";
import db from "../../../lib/db"; // sesuaikan

export async function GET(req, context) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Invalid ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // === 1. Ambil data JSON ===
    const filePath = path.join(process.cwd(), "public", "prediction_results.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const lead = data.find(item => String(item.id) === String(id));

    if (!lead) {
      return new Response(
        JSON.stringify({ error: "Lead not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // === 2. Ambil status + result dari database ===
    const [rows] = await db.execute(
      `SELECT ls.status, lr.results
       FROM lead_status ls
       LEFT JOIN lead_results lr ON lr.id = ls.id
       WHERE ls.id = ?`,
      [id]
    );

    const dbStatus = rows?.[0]?.status ?? "unknown"; // fallback kalau belum ada
    const dbResult = rows?.[0]?.results ?? "-";      // fallback kalau belum ada

    // === 3. Merge JSON + DB (Override status & result) ===
    const finalStatus = dbStatus;
    const finalResult = dbResult;

    // === 4. Format response ===
    const formatted = {
      id: lead.id,

      personalInfo: {
        name: lead.name,
        age: lead.age,
        job: lead.job,
        marital: lead.marital,
        education: lead.education,
      },

      financialInfo: {
        hasDefault: lead.default,
        hasHousing: lead.housing,
        hasLoan: lead.loan,
      },

      campaignInfo: {
        contact: lead.contact,
        month: lead.month,
        dayOfWeek: lead.day_of_week,
        campaign: lead.campaign,
        pdays: lead.pdays,
        previous: lead.previous,
        poutcome: lead.poutcome,
        status: finalStatus, // override dari DB
        result: finalResult, // override dari DB
      },

      economicInfo: {
        empVarRate: lead["emp.var.rate"],
        consPriceIdx: lead["cons.price.idx"],
        consConfIdx: lead["cons.conf.idx"],
        euribor3m: lead.euribor3m,
        nrEmployed: lead["nr.employed"],
      },

      prediction: {
        confidence: lead.confidence,
        leadScore: Math.round(lead.confidence),
        leadPotential:
          lead.confidence >= 70
            ? "Hot"
            : lead.confidence >= 40
              ? "Warm"
              : "Cold",
      },
    };

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
