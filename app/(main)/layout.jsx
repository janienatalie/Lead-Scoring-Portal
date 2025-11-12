import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ThemeProvider } from "../../context/ThemeContext";
import { LanguageProvider } from "../../context/LanguageContext";

export const metadata = {
  title: "Lead Score Portal",
  description: "Lead Score Portal Dashboard",
};

export default function MainLayout({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex">
          <Sidebar />
          <div className="ml-64 flex-1">
            <Navbar />
            <main>{children}</main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
