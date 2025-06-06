import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopMinder - Listes de Courses Intelligentes",
  description:
    "N'oubliez plus jamais vos articles ! ShopMinder vous aide à organiser vos listes de courses avec des catégories intelligentes et la synchronisation cloud.",
  keywords: "liste de courses, liste d'épicerie, rappel courses, listes intelligentes, application courses",
  authors: [{ name: "ShopMinder" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#6366f1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%236366f1'/><stop offset='100%' style='stop-color:%23a855f7'/></linearGradient></defs><rect width='24' height='24' rx='6' fill='url(%23grad)'/><path d='M7 8h10l-1 8H8l-1-8z' stroke='white' strokeWidth='1.5' fill='none'/><circle cx='16' cy='6' r='3' fill='%23f97316'/><path d='M15 5.5h2M16 4.5v2' stroke='white' strokeWidth='1'/></svg>"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
