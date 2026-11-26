"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ nome, streak }: { nome?: string; streak?: number }) {
  const path = usePathname();
  if (path === "/login") return null;

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-800/30 bg-emerald-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-emerald-300">
          Studying game
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/questoes" className="text-emerald-100/80 hover:text-white">
            Questões
          </Link>
          <Link href="/perfil" className="text-emerald-100/80 hover:text-white">
            Perfil
          </Link>
          {typeof streak === "number" && streak > 0 && (
            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300">
              🔥 {streak}d
            </span>
          )}
          {nome && (
            <span className="hidden text-emerald-200/70 sm:inline">{nome}</span>
          )}
        </nav>
      </div>
    </header>
  );
}
