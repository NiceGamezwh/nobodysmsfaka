import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "NobodySMS 官方卡密 — 付款即发卡",
  description: "NobodySMS 官方卡密，基于智能合约的自动发卡，支付宝支付，卡密链上唯一、永久有效，付款后即时发放。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full bg-[#0A0A0A]">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full bg-[#0A0A0A] overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
