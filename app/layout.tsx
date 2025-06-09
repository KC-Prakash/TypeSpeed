import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Font configuration with performance optimizations
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Metadata for SEO and social sharing
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://type-speed-gamma.vercel.app/'  // Replace with your production domain
    : 'http://localhost:3000'),
  title: {
    default: "TypeSpeed | Typing Test & Practice",
    template: "%s | TypeSpeed",
  },
  description: "Test and improve your typing speed with real-time feedback, multiple modes, and detailed analytics.",
  applicationName: "TypeSpeed",
  keywords: ["typing test", "typing speed", "WPM test", "keyboard practice", "typing tutor"],
  authors: [{ name: "Prakash KC", url: "https://type-speed-gamma.vercel.app/" }],
  creator: "Prakash KC",
  generator: "Next.js",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TypeSpeed",
    title: "TypeSpeed | Typing Test & Practice",
    description: "Test and improve your typing speed with real-time feedback",
    images: [
      {
        url: "/logo.png",  // Now this will be properly resolved to the full URL
        width: 1200,
        height: 630,
        alt: "TypeSpeed Typing Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeSpeed | Typing Test & Practice",
    description: "Test and improve your typing speed with real-time feedback",
    images: ["/logo.png"],  // Will also be properly resolved
  },
};

// Viewport settings for responsive design
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

// Root layout component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}