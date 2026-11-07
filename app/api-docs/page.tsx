// app/api-docs/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { openApiSpec } from "../../core/openapi/spec";

export default function ApiDocsPage() {
  const [testMessage, setTestMessage] = useState(
    "¿Cómo funciona el login-service?"
  );
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTryChatEndpoint = async () => {
    setIsTesting(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testMessage }),
      });
      const data = await res.json();
      setTestStatus(res.status);
      setTestLatency(Math.round(performance.now() - start));
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setTestStatus(500);
      setTestResponse(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* TOP BAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                OAS {openApiSpec.openapi}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                v{openApiSpec.info.version} • Hexagonal Architecture Contracts
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {openApiSpec.info.title}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {openApiSpec.info.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/openapi"
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-xl px-4 py-2.5 text-xs font-mono transition"
            >
              {`{ } Raw openapi.json`}
            </a>
            <Link
              href="/"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl px-4 py-2.5 text-xs font-mono transition"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </header>

        {/* ENDPOINTS LIST + INTERACTIVE PLAYGROUND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: ENDPOINTS SPECIFICATION (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-400">
              Endpoints & Driving Adapters
            </h2>

            {/* POST /api/chat */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold px-2.5 py-1 rounded">
                    POST
                  </span>
                  <code className="text-sm font-mono text-zinc-100 font-semibold">
                    /api/chat
                  </code>
                </div>
                <span className="text-[11px] font-mono text-purple-400">
                  Route Handler • AI Agent
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {openApiSpec.paths["/api/chat"].post.description}
              </p>
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 text-xs font-mono space-y-1">
                <span className="text-zinc-500 block">
                  Puerto de Salida Inyectado:
                </span>
                <span className="text-cyan-400">
                  TelemetryRepository → NeonTelemetryAdapter | DummyTelemetryAdapter
                </span>
              </div>
            </div>

            {/* GET /api/openapi */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold px-2.5 py-1 rounded">
                    GET
                  </span>
                  <code className="text-sm font-mono text-zinc-100 font-semibold">
                    /api/openapi
                  </code>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  OpenAPI 3.1 Spec
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {openApiSpec.paths["/api/openapi"].get.description}
              </p>
            </div>

            {/* Server Actions: Gatekeeper Auth */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold px-2.5 py-1 rounded">
                    RPC
                  </span>
                  <code className="text-sm font-mono text-zinc-100 font-semibold">
                    app/actions/auth.ts
                  </code>
                </div>
                <span className="text-[11px] font-mono text-amber-400">
                  Next.js Server Actions
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Adaptadores primarios RPC (`requestOtpRequest`, `verifyOtpRequest`, `logout`) que invocan `auth-gatekeeper.use-case.ts` e interactúan con el puerto `SessionGateway` para emitir o destruir la cookie `httpOnly` `recruiter_session`.
              </p>
            </div>
          </div>

          {/* RIGHT: SWAGGER "TRY IT OUT" INTERACTIVE CONSOLE (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-400">
              Interactive Console (Try it out)
            </h2>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  POST /api/chat
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  application/json
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 block">
                  Request Body (`message`):
                </label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleTryChatEndpoint}
                disabled={isTesting}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {isTesting ? "Ejecutando Request..." : "▶ Execute POST /api/chat"}
              </button>

              {testResponse && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Response Body:</span>
                    <span
                      className={
                        testStatus === 200 ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      HTTP {testStatus} • {testLatency} ms
                    </span>
                  </div>
                  <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
                    {testResponse}
                  </pre>
                </div>
              )}
            </div>

            {/* SCHEMAS BOX */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase block">
                Domain Schemas (`core/domain/models.ts`)
              </span>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-64">
                {JSON.stringify(openApiSpec.components.schemas, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

