// components/LoginSimulator.tsx
"use client";

import { useState } from "react";

const PIPELINE_STEPS = [
  { step: "01", name: "Controller", desc: "DTO Validation" },
  { step: "02", name: "Domain", desc: "BCrypt & Rules" },
  { step: "03", name: "JWT Engine", desc: "HMAC-SHA256" },
  { step: "04", name: "Async Event", desc: "Notify Service" },
];

interface LoginSimulatorProps {
  isUnlocked?: boolean;
}

export default function LoginSimulator({ isUnlocked = false }: LoginSimulatorProps) {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [jwtGenerated, setJwtGenerated] = useState(false);

  const simulateLogin = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setJwtGenerated(false);
    setActiveStep(-1);

    // Simulamos el tiempo de procesamiento de cada capa (400ms por capa)
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setActiveStep(i);
    }

    // Retraso final antes de mostrar el JWT
    await new Promise((resolve) => setTimeout(resolve, 500));
    setJwtGenerated(true);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase">
                Trazabilidad de Seguridad
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isUnlocked
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                }`}
              >
                {isUnlocked ? "● API Real Activa" : "Modo Demo"}
              </span>
            </div>
            <h2 className="text-xl font-semibold">Laboratorio Interactivo: login-service</h2>
          </div>
          <button 
            onClick={simulateLogin}
            disabled={isRunning}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono px-3 py-2 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunning ? (
              <span className="animate-spin h-3 w-3 border-2 border-cyan-300 border-t-transparent rounded-full" />
            ) : "▶"} 
            {isRunning
              ? "Procesando..."
              : isUnlocked
              ? "Ejecutar Auth Request"
              : "Simular Auth Request"}
          </button>
        </div>

        {/* Pipeline de Arquitectura */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6">
          {PIPELINE_STEPS.map((node, idx) => {
            const isActive = activeStep === idx;
            const isPassed = activeStep > idx;
            
            return (
              <div
                key={node.step}
                className={`border rounded-xl p-3 transition-all duration-300 ${
                  isActive ? "bg-cyan-900/40 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                  : isPassed ? "bg-zinc-900 border-zinc-700 opacity-80"
                  : "bg-zinc-950 border-zinc-800/80"
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive || isPassed ? "text-cyan-400" : "text-zinc-500"}`}>
                  {node.step}
                </span>
                <p className={`text-sm font-semibold mt-0.5 ${isActive ? "text-white" : "text-zinc-200"}`}>
                  {node.name}
                </p>
                <p className="text-xs text-zinc-500">{node.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspector de Payload JWT */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2">
          <span>JWT DECODED PAYLOAD INSPECTOR</span>
          {jwtGenerated ? (
            <span className="text-emerald-400 animate-pulse">
              {isUnlocked ? "200 OK (Signed by Backend)" : "200 OK (Simulated)"}
            </span>
          ) : (
            <span className="text-zinc-600">Waiting for request...</span>
          )}
        </div>
        
        <pre className={`text-zinc-300 overflow-x-auto leading-relaxed transition-opacity duration-500 ${jwtGenerated ? "opacity-100" : "opacity-30 blur-[2px]"}`}>
{`{
  "sub": "principal_cloud_architect",
  "iss": "${isUnlocked ? "login-service.cloudrun.internal" : "login-service.simulator"}",
  "roles": ["ROLE_ARCHITECT", "ROLE_ADMIN"],
  "mode": "${isUnlocked ? "PRODUCTION_API" : "DEMO_SANDBOX"}",
  "iat": ${jwtGenerated ? Math.floor(Date.now() / 1000) : "1793990000"},
  "exp": ${jwtGenerated ? Math.floor(Date.now() / 1000) + 3600 : "1793993600"}
}`}
        </pre>

        {/* Efecto de escaneo cuando está corriendo */}
        {isRunning && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent w-full h-full animate-[scan_1.5s_ease-in-out_infinite]" />
        )}
      </div>
    </div>
  );
}