import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Lexend } from 'next/font/google';
import Providers from "../context/provider";
import "./globals.css";

export const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Choose weights you need
  variable: '--font-lexend', // Optional: CSS variable
  display: 'swap',
});


export const metadata: Metadata = {
  title: "InstitutionPort",
  description: "A user-institution collaboration portal service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Institution Port</title>
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
          <footer></footer>
        </Providers>
      </body>
    </html >
  );
}
