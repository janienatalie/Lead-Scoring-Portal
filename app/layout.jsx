import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar"; // <-- 1. IMPORT NAVBAR
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lead Score Portal",
  description: "Lead Score Portal Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            {/* --- 2. MODIFIKASI STRUKTUR LAYOUT --- */}
            <div className="flex">
              <Sidebar />
              {/* Area konten utama di sebelah kanan sidebar */}
              <div className="ml-64 flex-1">
                {" "}
                {/* ml-64 = lebar sidebar */}
                <Navbar /> {/* <-- 3. TAMBAHKAN NAVBAR DI SINI */}
                <main>
                  {" "}
                  {/* Halaman (children) akan di-render di bawah navbar */}
                  {children}
                </main>
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
