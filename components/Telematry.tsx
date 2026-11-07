// components/Telematry.tsx
import { Suspense } from "react";
import { getTelemetryUseCase } from "../core/use-cases/get-telemetry.use-case";
import { getTelemetryRepository } from "../infrastructure/container";
import DummyInteractionCounter from "./DummyInteractionCounter";

interface TelematryProps {
  isUnlocked?: boolean;
}

async function TelemetryMetricsView({ isUnlocked }: { isUnlocked: boolean }) {
  const repository = getTelemetryRepository(isUnlocked);
  const stats = await getTelemetryUseCase(repository);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-zinc-800 pb-3">
        <span className="text-sm text-zinc-400">
          {stats.isLive ? "Interacciones registradas" : "Interacciones en sesión (Demo)"}
        </span>
        {stats.isLive ? (
          <span className="text-3xl font-mono font-bold text-emerald-400">
            {stats.interactionsCount}
          </span>
        ) : (
          <DummyInteractionCounter initialCount={stats.interactionsCount} />
        )}
      </div>
      <div className="flex items-baseline justify-between border-b border-zinc-800 pb-3">
        <span className="text-sm text-zinc-400">Latencia Query HTTP</span>
        <span
          className={`text-sm font-mono ${
            stats.isLive ? "text-cyan-400" : "text-zinc-400"
          }`}
        >
          {stats.isLive ? `${stats.latencyMs} ms` : `${stats.latencyMs} ms (Local)`}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>DB: {stats.databaseRegion}</span>
        {stats.poolerStatus === "ACTIVE_POOLER" ? (
          <span className="text-emerald-500">● Pooler Activo</span>
        ) : (
          <span className="text-amber-400">○ Modo Demo (Sin conexión)</span>
        )}
      </div>
    </div>
  );
}

export default function Telematry({ isUnlocked = false }: TelematryProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-emerald-400 uppercase">
            Persistencia Serverless
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isUnlocked
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400"
            }`}
          >
            {isUnlocked ? "● Live Query" : "Dummy Data"}
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-4">Telemetría Neon DB</h2>

        <Suspense
          fallback={
            <div className="space-y-3 py-4 animate-pulse">
              <div className="h-8 bg-zinc-800 rounded w-full" />
              <div className="h-6 bg-zinc-800 rounded w-2/3" />
            </div>
          }
        >
          <TelemetryMetricsView isUnlocked={isUnlocked} />
        </Suspense>
      </div>

      <p className="text-[11px] text-zinc-500 font-mono mt-4 pt-3 border-t border-zinc-800/80">
        {isUnlocked
          ? "Driver: @neondatabase/serverless (HTTP Live)"
          : "Driver: Mock Local (Inicia sesión para consultar Neon)"}
      </p>
    </div>
  );
}


