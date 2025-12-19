import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Chart",
  description: "Momentum for your life",
};

import { SidebarProvider } from "@/context/sidebar-context";
import { LayoutWrapper } from "@/components/layout-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${spaceMono.variable} ${inter.variable} antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#000] to-[#050505] text-white relative min-h-screen`}
        suppressHydrationWarning
      >
        <SidebarProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SidebarProvider>
      </body>
    </html>
  );
}
