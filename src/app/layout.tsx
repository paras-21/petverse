import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";

const body = Pixelify_Sans({
  variable: "--font-pixel-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const display = Press_Start_2P({
  variable: "--font-pixel-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bits | 8-bit Pet",
  description: "Hatch, raise and battle an 8-bit voxel pet.",
};

export const viewport: Viewport = {
  themeColor: "#eef3fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
