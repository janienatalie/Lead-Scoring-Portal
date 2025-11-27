import pandas as pd
import joblib
import json

# 1. Load Model & Data
model = joblib.load("model_xgb_tuned.pkl") 
df = pd.read_csv("predicted_leads_tuned.csv")

# 2. Threshold Bisnis
THRESHOLD = 0.3  # 30%

# 3. Ambil probabilitas 'Yes'
proba_yes_array = model.predict_proba(df)[:, 1]

# 4. Gabungkan Hasil
results = []

for i, row in df.iterrows():

    probability_score = proba_yes_array[i]

    # Jika peluang >= 0.3, masukkan sebagai nasabah potensial
    if probability_score >= THRESHOLD:
        results.append({
            "id": i,
            "age": int(row['age']),
            "job": row['job'],
            "marital": row['marital'],
            "education": row['education'],
            "default": row['default'],
            "housing": row['housing'],
            "loan": row['loan'],
            "contact": row['contact'],
            "month": row['month'],
            "day_of_week": row['day_of_week'],
            "campaign": int(row['campaign']),
            "pdays": int(row['pdays']),
            "previous": int(row['previous']),
            "poutcome": row['poutcome'],
            "emp.var.rate": float(row['emp.var.rate']),
            "cons.price.idx": float(row['cons.price.idx']),
            "cons.conf.idx": float(row['cons.conf.idx']),
            "euribor3m": float(row['euribor3m']),
            "nr.employed": float(row['nr.employed']),
            "prediction": "Yes",
            "confidence": round(float(probability_score) * 100, 1)
        })

# 5. Simpan ke JSON
output_path = "public/prediction_results.json"
with open(output_path, "w") as f:
    json.dump(results, f, indent=2)

print(f"Selesai! {len(results)} nasabah potensial (score >= {THRESHOLD*100}%) disimpan ke {output_path}")
