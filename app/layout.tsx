import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TypeSpeed",
  description: "Test and improve your typing speed with real-time feedback, multiple modes, and detailed analytics.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png?v=2" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
<Analytics />

