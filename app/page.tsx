import { Suspense } from "react";
import AgentChat from "../components/AgentChat";
import LoginSimulator from "../components/LoginSimulator";
import MicroserviceMonitor from "../components/MicroserviceMonitor";
import HeaderApp from "../components/Header";
import Telematry from "../components/Telematry";
import { getSessionGateway } from "../infrastructure/container";

async function MissionControlContent() {
  const sessionGateway = getSessionGateway();
  const isUnlocked = await sessionGateway.isUnlocked();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER / MISSION CONTROL BAR (con botón de Login que abre el pop-up Gatekeeper) */}
        <HeaderApp isUnlocked={isUnlocked} />

        {/* BENTO GRID PRINCIPAL (12 COLUMNAS) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MÓDULO A: INSPECTOR VISUAL DEL LOGIN-SERVICE (7 cols) */}
          <section className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <LoginSimulator isUnlocked={isUnlocked} />
          </section>

          {/* MÓDULO B: AGENTE IA ACOTADO (5 cols) */}
          <section className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <AgentChat isUnlocked={isUnlocked} />
          </section>

          {/* MÓDULO C: MONITOR DE MICROSERVICIOS DEL WORKSPACE (8 cols) */}
          <section className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <MicroserviceMonitor isUnlocked={isUnlocked} />
          </section>

          {/* MÓDULO D: TELEMETRÍA EN VIVO NEON POSTGRES (4 cols) */}
          <section className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <Telematry isUnlocked={isUnlocked} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-mono text-sm">
          Inicializando Architecture Mission Control...
        </div>
      }
    >
      <MissionControlContent />
    </Suspense>
  );
}
