// components/MicroserviceMonitor.tsx
"use client";

import { useState } from "react";

type ServiceState = "Scale-to-Zero" | "Cold Start..." | "Active (200 OK)";

const SERVICES = [
  {
    name: "login-service",
    tech: "Java • Spring Security • JWT",
  },
  {
    name: "notifications-service",
    tech: "Spring Boot • Event Driven",
  },
  {
    name: "aGeminiAgentJobSeeker",
    tech: "AI Pipeline • Automation",
  },
];

interface MicroserviceMonitorProps {
  isUnlocked?: boolean;
}

export default function MicroserviceMonitor({
  isUnlocked = false,
}: MicroserviceMonitorProps) {
  const [statuses, setStatuses] = useState<Record<string, ServiceState>>({
    "login-service": "Scale-to-Zero",
    "notifications-service": "Scale-to-Zero",
    "aGeminiAgentJobSeeker": "Scale-to-Zero",
  });

  const handleWakeUp = async (serviceName: string) => {
    if (statuses[serviceName] === "Cold Start...") return;

    if (statuses[serviceName] === "Active (200 OK)") {
      setStatuses((prev) => ({ ...prev, [serviceName]: "Scale-to-Zero" }));
      return;
    }

    setStatuses((prev) => ({ ...prev, [serviceName]: "Cold Start..." }));
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatuses((prev) => ({ ...prev, [serviceName]: "Active (200 OK)" }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-amber-400 uppercase">
            Estado de Contenedores
          </span>
          <h2 className="text-xl font-semibold">Ecosistema de Microservicios</h2>
        </div>
        <span
          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            isUnlocked
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-zinc-900 border-zinc-800 text-zinc-500"
          }`}
        >
          {isUnlocked ? "● Cloud Run API Live" : "Workspace Services (Demo)"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {SERVICES.map((srv) => {
          const currentState = statuses[srv.name] ?? "Scale-to-Zero";
          const isWaking = currentState === "Cold Start...";
          const isActive = currentState === "Active (200 OK)";

          return (
            <div
              key={srv.name}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-zinc-200">
                    {srv.name}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        : isWaking
                        ? "bg-cyan-400 animate-ping"
                        : "bg-amber-400"
                    }`}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{srv.tech}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                <span
                  className={`text-[11px] font-mono ${
                    isActive
                      ? "text-emerald-400"
                      : isWaking
                      ? "text-cyan-400 animate-pulse"
                      : "text-amber-400/90"
                  }`}
                >
                  {currentState}
                </span>
                <button
                  onClick={() => handleWakeUp(srv.name)}
                  disabled={isWaking}
                  className="text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-800 transition cursor-pointer disabled:opacity-50"
                >
                  {isActive ? "Sleep" : isWaking ? "..." : "Wake Up"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



