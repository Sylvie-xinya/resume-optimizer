import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "简历优化助手 | Resume Optimizer",
  description: "用AI快速诊断、优化、翻译简历，提升求职竞争力",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-full">{children}</body>
    </html>
  );
}