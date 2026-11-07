// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../app/actions/auth";
import Gatekeeper from "./Gatekeeper";

interface HeaderAppProps {
  isUnlocked?: boolean;
}

export default function HeaderApp({ isUnlocked = false }: HeaderAppProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                isUnlocked ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                isUnlocked ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isUnlocked
                ? "Architecture Mission Control • Live Backend"
                : "Architecture Mission Control • Modo Simulación"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Backend & Cloud Architecture Hub
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Java • Spring Boot • Microservicios • Next.js Full-Stack
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono">
            <span className="text-zinc-500 block">ESTRATEGIA FINOPS</span>
            <span className="text-amber-400 font-semibold">Scale-to-Zero ($0 Idle)</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono">
            <span className="text-zinc-500 block">INFRAESTRUCTURA</span>
            <span className="text-cyan-400 font-semibold">Cloud Run + Neon</span>
          </div>

          <Link
            href="/api-docs"
            className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl px-3.5 py-3 text-xs font-mono transition"
          >
            Swagger / OpenAPI
          </Link>

          {isUnlocked ? (
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-xs font-mono transition cursor-pointer"
            >
              Bloquear Dashboard
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl px-4 py-3 text-xs font-mono transition cursor-pointer flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Login Infraestructura
            </button>
          )}
        </div>
      </header>

      {isModalOpen && !isUnlocked && (
        <Gatekeeper onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}


