import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Félix AUTANT - Développeur Web Fullstack",
  description:
    "Portfolio de Félix AUTANT, développeur web fullstack spécialisé en Symfony et Laravel.",
  keywords: [
    "développeur fullstack",
    "symfony",
    "laravel",
    "nextjs",
    "portfolio",
    "freelance",
  ],
  authors: [{ name: "Félix AUTANT" }],
  openGraph: {
    title: "Félix AUTANT - Développeur Web Fullstack",
    description: "Portfolio et projets de développement web",
    url: "https://felixautant.dev",
    siteName: "Portfolio Félix AUTANT",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Félix AUTANT - Développeur Web Fullstack",
    description: "Portfolio et projets de développement web",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
