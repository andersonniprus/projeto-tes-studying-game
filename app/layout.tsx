import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studying game — Vestibular gamificado",
  description:
    "Estude para vestibulares e concursos de forma menos cansativa, estilo Duolingo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}
