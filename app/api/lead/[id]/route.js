import data from "../../../../public/prediction_results.json";

export async function GET(req, context) {
  try {
    // Await params jika Promise, atau langsung gunakan jika bukan
    const params = await Promise.resolve(context.params);
    const id = params?.id;

    // Validasi ID
    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid ID", 
          message: "ID parameter is required",
          received: { id, paramsType: typeof context.params }
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Cari data prediction
    const predictionResult = data.find(item => String(item.id) === String(id));

    if (!predictionResult) {
      return new Response(
        JSON.stringify({ 
          error: "Lead not found", 
          message: `No prediction data found for ID: ${id}` 
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Transform prediction data ke format yang lebih user-friendly
    const transformedData = {
      id: predictionResult.id,
      // Personal Info
      personalInfo: {
        age: predictionResult.age,
        job: predictionResult.job,
        marital: predictionResult.marital,
        education: predictionResult.education,
      },
      // Financial Info
      financialInfo: {
        hasDefault: predictionResult.default,
        hasHousing: predictionResult.housing,
        hasLoan: predictionResult.loan,
      },
      // Campaign Info
      campaignInfo: {
        contact: predictionResult.contact,
        month: predictionResult.month,
        dayOfWeek: predictionResult.day_of_week,
        campaign: predictionResult.campaign,
        pdays: predictionResult.pdays,
        previous: predictionResult.previous,
        poutcome: predictionResult.poutcome,
      },
      // Economic Info
      economicInfo: {
        empVarRate: predictionResult["emp.var.rate"],
        consPriceIdx: predictionResult["cons.price.idx"],
        consConfIdx: predictionResult["cons.conf.idx"],
        euribor3m: predictionResult.euribor3m,
        nrEmployed: predictionResult["nr.employed"],
      },
      // Prediction Result
      prediction: {
        result: predictionResult.prediction,
        confidence: predictionResult.confidence,
        leadScore: Math.round(predictionResult.confidence), // Bisa disesuaikan
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
        "Cache-Control": "public, max-age=3600", // Cache 1 jam
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}