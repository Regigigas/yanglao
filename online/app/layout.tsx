import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yanglao Terminal",
  description: "Online H5 build for the Yanglao care terminal",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
