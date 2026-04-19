import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { PWARegister } from "@/components/PWARegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Campus VMS — Visitor Management System",
  description:
    "Intelligent Visitor Management System for Smart Campuses. Register, scan QR, track visits in real-time.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Campus VMS",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-full bg-gray-50 text-gray-900 antialiased`}
      >
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
        <PWARegister />
      </body>
    </html>
  );
}
