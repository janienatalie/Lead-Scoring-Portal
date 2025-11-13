import "./globals.css";

export const metadata = {
  title: "Lead Score Portal",
  description: "Login to your account",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
