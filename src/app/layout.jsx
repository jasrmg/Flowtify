import { AuthProvider } from "@/contexts/AuthContext";

import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Flowtify",
  description:
    "Flowtify is a community-driven flood monitoring platform that enables residents and local authorities to share real-time flood reports, verify updates, and stay informed for improved public safety and disaster response.",
};

import RouteLoader from "@/components/RouteLoader/RouteLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
      </head>
      <body className={`${poppins.variable} ${inter.variable}`}>
        <AuthProvider>
          <RouteLoader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
