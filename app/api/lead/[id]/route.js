import fs from "fs";
import path from "path";

export async function GET(req, context) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Invalid ID", message: "ID parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Baca file JSON terbaru 
    const filePath = path.join(process.cwd(), "public", "prediction_results.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Cari data prediction
    const predictionResult = data.find(item => String(item.id) === String(id));

    if (!predictionResult) {
      return new Response(
        JSON.stringify({ error: "Lead not found", message: `No prediction data found for ID: ${id}` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const transformedData = {
      id: predictionResult.id,
      personalInfo: {
        name: predictionResult.name,
        age: predictionResult.age,
        job: predictionResult.job,
        marital: predictionResult.marital,
        education: predictionResult.education,
      },
      financialInfo: {
        hasDefault: predictionResult.default,
        hasHousing: predictionResult.housing,
        hasLoan: predictionResult.loan,
      },
      campaignInfo: {
        contact: predictionResult.contact,
        month: predictionResult.month,
        dayOfWeek: predictionResult.day_of_week,
        campaign: predictionResult.campaign,
        pdays: predictionResult.pdays,
        previous: predictionResult.previous,
        poutcome: predictionResult.poutcome,
      },
      economicInfo: {
        empVarRate: predictionResult["emp.var.rate"],
        consPriceIdx: predictionResult["cons.price.idx"],
        consConfIdx: predictionResult["cons.conf.idx"],
        euribor3m: predictionResult.euribor3m,
        nrEmployed: predictionResult["nr.employed"],
      },
      prediction: {
        result: predictionResult.prediction,
        confidence: predictionResult.confidence,
        leadScore: Math.round(predictionResult.confidence),
        leadPotential: 
          predictionResult.confidence >= 70 ? "Hot" : 
          predictionResult.confidence >= 40 ? "Warm" : 
          "Cold",
      },
    };

    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
