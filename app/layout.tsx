import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { I18nProvider } from "@/app/components/i18nProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "./components/themeProvider";

import Header from "@/app/components/header";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/app/components/footer"), {
  loading: () => (
    <span className="text-center font-light py-6 block text-black/40">
      Loading…
    </span>
  ),
});

const satoshi = localFont({
  src: [
    // { path: "./fonts/Satoshi-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const SITE_URL = "https://exchangoio.vercel.app";
const TITLE = "Currency Converter | exchango";
const DESCRIPTION =
  "Convert currencies with real-time rates and a clean, mobile-first interface.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "currency converter, money exchange, exchango, exchange rates, free currency converter, currency converter ghana, simple currency converter, fast currency converter, convert currencies online",
  authors: [{ name: "exchango" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  verification: {
    google: "T6EdMufxFF69EDDXSRDQ1PLZK33j2BKCRarWzzWCza0",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Exchango",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1f" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${satoshi.variable} ${outfit.variable}`}
    >
      <body className="font-satoshi">
        <ThemeProvider>
          <I18nProvider>
            <div className="min-h-screen flex flex-col">
              <div className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-lg pt-[calc(env(safe-area-inset-top)*0.8)]">
                <Header />
              </div>

              <div className="grow pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4.5rem+env(safe-area-inset-top))]">
                {children}
              </div>

              <Footer />
            </div>
          </I18nProvider>
        </ThemeProvider>

        <Analytics />
        <GoogleAnalytics gaId="G-FMVFL5HVQE" />
      </body>
    </html>
  );
}
