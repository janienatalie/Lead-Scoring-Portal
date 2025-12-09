import pandas as pd
import joblib
import json
from faker import Faker

# Inisialisasi Faker Indonesia
fake = Faker("id_ID")

# ==========================================
# 1. Definisi Fungsi Feature Engineering
# (Harus sama persis dengan Notebook Cell 4)
# ==========================================
def feature_engineering(data):
    df_eng = data.copy()

    # 1. Age Binning
    bins = [0, 30, 50, 60, 100]
    labels = ["Young", "Adult", "Senior", "Elderly"]
    # Pastikan age numeric
    df_eng["age"] = pd.to_numeric(df_eng["age"], errors='coerce')
    df_eng["age_group"] = pd.cut(df_eng["age"], bins=bins, labels=labels)

    # 2. pdays handling (999 = belum pernah dihubungi)
    df_eng["is_contacted_previous"] = df_eng["pdays"].apply(lambda x: 0 if x == 999 else 1)

    # 3. Simplify education
    df_eng["education"] = df_eng["education"].replace(
        ["basic.4y", "basic.6y", "basic.9y"], "basic"
    )

    # 4. Quarter mapping
    month_map = {
        "mar": "Q1", "apr": "Q2", "may": "Q2", "jun": "Q2",
        "jul": "Q3", "aug": "Q3", "sep": "Q3",
        "oct": "Q4", "nov": "Q4", "dec": "Q4"
    }
    df_eng["quarter"] = df_eng["month"].map(month_map)

    return df_eng

# ==========================================
# 2. Load Model & Data
# ==========================================
print("Loading model...")
model = joblib.load("model_xgb_tuned.pkl")

# PENTING: Gunakan dataset mentah (raw) agar kita punya data asli untuk tampilan (misal: umur asli)
# sekaligus bisa kita olah untuk input model.
print("Loading data...")
try:
    # Menggunakan dataset asli bank-additional-full.csv
    # Pastikan file ini ada di folder yang sama
    df_raw = pd.read_csv("bank-additional-full.csv", delimiter=';')
except FileNotFoundError:
    print("Error: File 'bank-additional-full.csv' tidak ditemukan.")
    print("Pastikan Anda menggunakan file data mentah, bukan file hasil prediksi notebook.")
    exit()

# ==========================================
# 3. Preprocessing untuk Model
# ==========================================
print("Applying feature engineering...")
# Buat copy data untuk dimasukkan ke model
df_for_model = feature_engineering(df_raw)

# Drop kolom yang dibuang saat training (Sesuai Notebook Cell 5)
cols_to_drop = ["y", "duration", "age"]
# Hapus hanya jika kolom tersebut ada
df_for_model = df_for_model.drop(columns=[c for c in cols_to_drop if c in df_for_model.columns])

# ==========================================
# 4. Prediksi
# ==========================================
print("Predicting...")
# Pipeline model akan otomatis menangani OneHotEncoding & Scaling
proba_yes_array = model.predict_proba(df_for_model)[:, 1]

# ==========================================
# 5. Filter & Generate JSON
# ==========================================
THRESHOLD = 0.3  # Ambang batas bisnis 30%
results = []

print("Generating JSON results...")

# Iterasi menggunakan df_raw agar data yang disimpan ke JSON adalah data asli (belum di-drop/ubah)
for i, row in df_raw.iterrows():
    probability_score = proba_yes_array[i]

    if probability_score >= THRESHOLD:
        # Generate nama palsu yang konsisten berdasarkan index
        fake.seed_instance(i)
        random_name = fake.name()

        # Struktur data untuk frontend
        lead_data = {
            "id": i,
            "name": random_name,
            # Data Demografi (ambil dari data mentah)
            "age": int(row['age']), 
            "job": row['job'],
            "marital": row['marital'],
            "education": row['education'],
            
            # Status Finansial
            "default": row['default'],
            "housing": row['housing'],
            "loan": row['loan'],
            
            # Campaign Info
            "contact": row['contact'],
            "month": row['month'],
            "day_of_week": row['day_of_week'],
            "campaign": int(row['campaign']),
            "pdays": int(row['pdays']),
            "previous": int(row['previous']),
            "poutcome": row['poutcome'],
            
            # Ekonomi Makro
            "emp.var.rate": float(row['emp.var.rate']),
            "cons.price.idx": float(row['cons.price.idx']),
            "cons.conf.idx": float(row['cons.conf.idx']),
            "euribor3m": float(row['euribor3m']),
            "nr.employed": float(row['nr.employed']),
            
            # Hasil Prediksi
            "prediction": "Yes",
            "confidence": round(float(probability_score) * 100, 1)
        }
        results.append(lead_data)

# ==========================================
# 6. Simpan Output
# ==========================================
output_path = "public/prediction_results.json"
# Pastikan folder public ada, jika tidak, simpan di root atau buat foldernya
import os
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w") as f:
    json.dump(results, f, indent=2)

print(f"Selesai! {len(results)} nasabah potensial (confidence >= {THRESHOLD*100}%) disimpan ke {output_path}")