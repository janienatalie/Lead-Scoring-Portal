import Sidebar from "../../../components/Sidebar";
import { ThemeProvider } from "../../../context/ThemeContext";
import { LanguageProvider } from "../../../context/LanguageContext";

export default function NasabahLayout({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex">
          <Sidebar />
          <div className="ml-64 flex-1">
            <main>{children}</main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
