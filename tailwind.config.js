/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 🌤️ Light Mode (Tetap sama)
        primary: "#13452D",
        secondary: "#227D53",
        fontColor: "#000000",
        screenColor: "#F7F7F7",
        successGreenLight: "#D1FAE5",
        successGreenDark: "#065F46",
        dangerRedLight: "#FEE2E2",
        dangerRedDark: "#991B1B",

        // --- AWAL PERUBAHAN ---
        // 🌙 Dark Mode Baru (Dominan Hitam & Netral)
        // Latar belakang utama (tergelap)
        darkScreenColor: "#121212",
        // Latar belakang Sidebar & Kartu (sedikit lebih terang)
        darkPrimary: "#1A1A1A",
        // Latar belakang untuk hover, dropdown, dll.
        darkSecondary: "#2A2A2A",
        // Teks utama (putih pudar)
        darkFontColor: "#E5E5E5",
        // Border pemisah antar elemen
        borderColorDark: "#3A3A3A",
        // Teks sekunder (abu-abu)
        textGrayDark: "#A0A0A0",
        // --- AKHIR PERUBAHAN ---

        // Warna pendukung (Tetap sama)
        statGreen: "#34A853",
        statRed: "#EA4335",
        borderColorLight: "#E0E0E0",
        textGrayLight: "#6B7280",

        // Warna pie chart (Tetap sama)
        pieContacted: "#227D53",
        pieNew: "#13452D",
        pieConverted: "#5CB85C",
        pieOthers: "#808080",
      },
      boxShadow: {
        "custom-sm": "0 1px 2px 0 rgba(137, 132, 132, 0.05)",
        "custom-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
