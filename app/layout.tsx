import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { LanguageProvider } from "./context/language-context";

export const metadata: Metadata = {
  icons: {
    icon: "/icons8-star.gif",
  },
  title: "Task Manager",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ height: "100vh" }}>
        <LanguageProvider>
          <Header />

          <main style={{ maxWidth: "1800px", margin: "0 auto" }}>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
