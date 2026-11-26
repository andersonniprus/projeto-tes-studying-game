import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-0">
          {children}
        </div>
      </body>
    </html>
  );
}
