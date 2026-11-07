// components/AgentChat.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processAgentChatUseCase } from "../core/use-cases/process-agent-chat.use-case";
import { DummyTelemetryAdapter } from "../infrastructure/adapters/dummy-telemetry.adapter";

type Message = { role: "user" | "bot"; content: string };

interface AgentChatProps {
  isUnlocked?: boolean;
}

export default function AgentChat({ isUnlocked = false }: AgentChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hola. Estoy entrenado con el contexto de esta arquitectura. Selecciona un tópico o haz una pregunta puntual.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queriesLeft, setQueriesLeft] = useState(5);

  const SUGGESTED_PROMPTS = [
    "¿Cómo funciona el login-service?",
    "Explica la estrategia FinOps $0",
    "Arquitectura de collectAR",
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || queriesLeft <= 0 || isLoading) return;

    const userText = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);
    setQueriesLeft((prev) => prev - 1);

    if (!isUnlocked) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const dummyResult = await processAgentChatUseCase(
        userText,
        new DummyTelemetryAdapter()
      );
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: dummyResult.botResponse },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh();
        setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Error en el servidor." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error de red." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 uppercase">
              Asistente Técnico
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isUnlocked
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              {isUnlocked ? "● Neon DB Live" : "Modo Local"}
            </span>
          </div>
          <h2 className="text-xl font-semibold">AI Architecture Agent</h2>
        </div>
        <span
          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            queriesLeft > 0
              ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          ⚡ {queriesLeft}/5 consultas
        </span>
      </div>

      {/* Ventana de mensajes */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 h-56 overflow-y-auto space-y-3 text-sm flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[85%] ${
              msg.role === "bot"
                ? "bg-zinc-900 border border-zinc-800 text-zinc-300 self-start"
                : "bg-purple-900/40 border border-purple-500/30 text-purple-100 self-end"
            }`}
          >
            <span
              className={`text-[10px] uppercase tracking-wider font-mono block mb-1 ${
                msg.role === "bot"
                  ? "text-purple-400"
                  : "text-purple-300 opacity-70"
              }`}
            >
              {msg.role === "bot" ? "System Agent" : "User"}
            </span>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300 self-start w-24 animate-pulse">
            <span className="text-[10px] uppercase font-mono text-purple-400 block mb-1">
              System
            </span>
            ...
          </div>
        )}
      </div>

      <div className="space-y-2 mt-auto">
        <span className="text-[11px] font-mono text-zinc-500 uppercase">
          Prompts sugeridos:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              disabled={queriesLeft <= 0 || isLoading}
              className="text-xs bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <input
          type="text"
          maxLength={120}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          disabled={queriesLeft <= 0 || isLoading}
          placeholder={
            queriesLeft > 0
              ? "Pregunta sobre el backend..."
              : "Límite de sesión alcanzado"
          }
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={queriesLeft <= 0 || isLoading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
