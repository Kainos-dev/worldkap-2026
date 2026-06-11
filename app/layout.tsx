import "./globals.css";

import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/NavBar.js";

import { Bebas_Neue, Inter } from 'next/font/google'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <NextAuthSessionProvider>
          <Navbar />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}