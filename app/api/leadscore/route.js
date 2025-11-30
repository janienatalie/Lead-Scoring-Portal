import { NextResponse } from "next/server";
import data from "../../../public/prediction_results.json";
import { lineData, pieData } from "../../lib/data/dashboard";

export async function GET(req) {
  // --- 1. DATA DUMMY NAMA DIPERBANYAK (80 x 80 = 6400 Kombinasi Unik) ---
  const firstNames = [
    "Aditya",
    "Budi",
    "Citra",
    "Dewi",
    "Eko",
    "Fajar",
    "Gita",
    "Hendra",
    "Indah",
    "Joko",
    "Kartika",
    "Lestari",
    "Maya",
    "Nur",
    "Oscar",
    "Putri",
    "Rizky",
    "Siti",
    "Teguh",
    "Utami",
    "Vina",
    "Wahyu",
    "Yulia",
    "Zainal",
    "Andi",
    "Bayu",
    "Cahya",
    "Dian",
    "Erik",
    "Fitri",
    "Agus",
    "Bambang",
    "Chandra",
    "Dani",
    "Endah",
    "Farhan",
    "Galih",
    "Hana",
    "Irfan",
    "Julia",
    "Kevin",
    "Linda",
    "Mario",
    "Nadia",
    "Opick",
    "Pandu",
    "Qila",
    "Rina",
    "Sandi",
    "Tania",
    "Umar",
    "Vera",
    "Wulan",
    "Xena",
    "Yoga",
    "Zara",
    "Ahmad",
    "Bagas",
    "Cindi",
    "Dimas",
    "Elisa",
    "Fikri",
    "Gading",
    "Hesti",
    "Iman",
    "Jessica",
    "Kiki",
    "Lukman",
    "Mita",
    "Naufal",
    "Olla",
    "Prasetyo",
    "Qori",
    "Radit",
    "Sarah",
    "Tio",
    "Ujang",
    "Valen",
    "Windy",
    "Yosua",
  ];

  const lastNames = [
    "Wijaya",
    "Santoso",
    "Saputra",
    "Hidayat",
    "Kusuma",
    "Pratama",
    "Nugroho",
    "Pertiwi",
    "Utami",
    "Firmansyah",
    "Susanto",
    "Wulandari",
    "Maulana",
    "Suryana",
    "Hartono",
    "Kurniawan",
    "Setiawan",
    "Permana",
    "Anggraini",
    "Wibowo",
    "Siregar",
    "Nasution",
    "Panggabean",
    "Sinaga",
    "Tan",
    "Lim",
    "Hermawan",
    "Gunawan",
    "Lesmana",
    "Sanjaya",
    "Aditama",
    "Baskoro",
    "Cahyono",
    "Darmawan",
    "Efendi",
    "Fauzan",
    "Gumelar",
    "Hakim",
    "Irawan",
    "Junaedi",
    "Kusnadi",
    "Lazuardi",
    "Mahendra",
    "Novanto",
    "Oktavian",
    "Pangestu",
    "Qomar",
    "Rajasa",
    "Saefullah",
    "Tanjung",
    "Utomo",
    "Vivaldi",
    "Wardhana",
    "Yamin",
    "Zulkarnaen",
    "Afandi",
    "Budiman",
    "Caniago",
    "Damanik",
    "Erlangga",
    "Fachrudin",
    "Ginting",
    "Hutapea",
    "Ismail",
    "Jayadi",
    "Kamil",
    "Lubis",
    "Marbun",
    "Napitupulu",
    "Oesman",
    "Pasaribu",
    "Qodir",
    "Rahman",
    "Salim",
    "Tarihoran",
    "Usman",
    "Veronika",
    "Widodo",
    "Yusuf",
    "Zainuddin",
  ];

  // --- 2. KAMUS TRANSLASI (Bulan & Job) ---
  const monthMapEn = {
    jan: "January",
    feb: "February",
    mar: "March",
    apr: "April",
    may: "May",
    jun: "June",
    jul: "July",
    aug: "August",
    sep: "September",
    oct: "October",
    nov: "November",
    dec: "December",
  };

  const monthMapId = {
    jan: "Januari",
    feb: "Februari",
    mar: "Maret",
    apr: "April",
    may: "Mei",
    jun: "Juni",
    jul: "Juli",
    aug: "Agustus",
    sep: "September",
    oct: "Oktober",
    nov: "November",
    dec: "Desember",
  };

  const jobMapId = {
    "admin.": "Admin",
    "blue-collar": "Buruh",
    entrepreneur: "Wiraswasta",
    housemaid: "ART",
    management: "Manajemen",
    retired: "Pensiunan",
    "self-employed": "Wirausaha",
    services: "Layanan",
    student: "Pelajar",
    technician: "Teknisi",
    unemployed: "Pengangguran",
    unknown: "Tidak Diketahui",
  };

  // --- 3. OLAH DATA ---
  const tableData = [...data]
    .map((lead) => ({
      ...lead,
      leadScore: Math.round(lead.confidence),
    }))
    .sort((a, b) => b.leadScore - a.leadScore)
    .map((lead) => {
      // A. GENERATE NAMA DUMMY YANG DIJAMIN UNIK
      // Logic Matrix: Kita pasangkan Nama Depan dan Belakang secara sistematis berdasarkan ID.
      // Selama data < 6400, nama dijamin tidak akan ada yang sama persis.

      const totalCombinations = firstNames.length * lastNames.length;
      const uniqueId = lead.id % totalCombinations; // Safety net jika data > 6400

      // Index Nama Depan berputar setiap 1 data
      const fIndex = uniqueId % firstNames.length;

      // Index Nama Belakang baru bergeser setelah Nama Depan habis satu putaran (setiap 80 data)
      const lIndex =
        Math.floor(uniqueId / firstNames.length) % lastNames.length;

      const dummyName = `${firstNames[fIndex]} ${lastNames[lIndex]}`;

      // B. LOGIC TRANSLASI
      const rawMonth = lead.month ? lead.month.toLowerCase() : "";
      const rawJob = lead.job ? lead.job.toLowerCase() : "";

      const fullMonthEn = monthMapEn[rawMonth] || lead.month;
      const jobEn = lead.job.charAt(0).toUpperCase() + lead.job.slice(1);

      const fullMonthId = monthMapId[rawMonth] || fullMonthEn;
      const jobId = jobMapId[rawJob] || jobEn;

      return {
        id: lead.id,
        name: dummyName, // Nama Unik
        score: lead.leadScore,
        age: lead.age,

        job: jobEn,
        job_id: jobId,

        lastContact: fullMonthEn.charAt(0).toUpperCase() + fullMonthEn.slice(1),
        lastContact_id:
          fullMonthId.charAt(0).toUpperCase() + fullMonthId.slice(1),
      };
    });

  const totalLeads = data.length;
  const highPotentialLeads = data.filter(
    (lead) => Math.round(lead.confidence) > 50
  ).length;
  const averageLeadScore = Math.round(
    data.reduce((sum, lead) => sum + Math.round(lead.confidence), 0) /
      totalLeads
  );

  return NextResponse.json({
    tableData,
    totalLeads,
    highPotentialLeads,
    averageLeadScore,
    lineData,
    pieData,
  });
}
