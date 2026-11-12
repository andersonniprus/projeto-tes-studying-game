"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ nome, streak }: { nome?: string; streak?: number }) {
  const path = usePathname();
  if (path === "/login") return null;

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-800/40 bg-emerald-950/95">
      <div className="shell flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-emerald-300">
          Studying game
        </Link>
        <nav className="flex items-center gap-1 text-base">
          <Link
            href="/questoes"
            className="rounded-xl px-3 py-2 text-emerald-100/90 hover:bg-emerald-900/70 hover:text-white"
          >
            Questões
          </Link>
          <Link
            href="/perfil"
            className="rounded-xl px-3 py-2 text-emerald-100/90 hover:bg-emerald-900/70 hover:text-white"
          >
            Perfil
          </Link>
          {typeof streak === "number" && streak > 0 && (
            <span className="ml-1 rounded-full bg-orange-500/20 px-3 py-1.5 text-sm font-medium text-orange-200">
              {streak}d
            </span>
          )}
          {nome && (
            <span className="ml-2 hidden text-emerald-100/80 sm:inline">{nome}</span>
          )}
        </nav>
      </div>
    </header>
  );
}
