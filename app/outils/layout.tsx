import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./outils.css";
import "./lexique.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Mes outils",
  robots: { index: false, follow: false },
};

export default function OutilsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`outils-root ${serif.variable} ${sans.variable} ${mono.variable}`}>{children}</div>;
}
