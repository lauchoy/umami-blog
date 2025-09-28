import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SkipLink from "@/components/accessibility/SkipLink";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Umami Culinary - Discover Your Perfect Recipe",
  description: "Mobile-first platform for personalized culinary experiences. Discover recipes, cooking tutorials, and ingredient recommendations tailored to your taste and skill level.",
  keywords: ["recipes", "cooking", "culinary", "food", "ingredients", "tutorials"],
  authors: [{ name: "Umami Culinary Team" }],
  openGraph: {
    title: "Umami Culinary",
    description: "Discover your perfect recipe with personalized recommendations",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <SkipLink targetId="main-content">
          Skip to main content
        </SkipLink>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}