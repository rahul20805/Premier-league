import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { LiveScoreTicker } from "@/components/live-score-ticker"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "SPL - Student Premier League",
  description: "The ultimate student sports betting and league management platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <LiveScoreTicker />
        </Suspense>
        <main className="min-h-screen">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
