import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "./Hooks/AuthProvider";
import { PwaRegister } from "./Components/PwaRegister";

export const metadata: Metadata = {
  title: "Handleliste",
  description: "En enkel handleliste som holder oversikt over det du trenger.",
  applicationName: "Handleliste",
  appleWebApp: {
    capable: true,
    title: "Handleliste",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F7A57",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body>
        <PwaRegister />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
