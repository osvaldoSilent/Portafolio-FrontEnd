// components/Gatekeeper.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtpRequest, verifyOtpRequest } from "../app/actions/auth";

interface GatekeeperProps {
  onClose?: () => void;
}

export default function Gatekeeper({ onClose }: GatekeeperProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async () => {
    if (!email || loading) return;
    setLoading(true);
    setError("");
    const res = await requestOtpRequest(email);
    if (res.error) setError(res.error);
    else setStep(2);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (otp.length < 6 || loading) return;
    setLoading(true);
    setError("");
    const res = await verifyOtpRequest(email, otp);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose?.();
      router.refresh();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />

        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-white">Acceso a Infraestructura</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-200 text-sm font-mono px-1.5 py-0.5 rounded hover:bg-zinc-900 transition cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          {step === 1
            ? "Ingresa tu correo para habilitar la conexión real a las APIs y microservicios."
            : `Enviamos un OTP temporal a ${email}`}
        </p>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 text-xs p-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="correo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRequestOtp()}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleRequestOtp}
              disabled={loading || !email}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Generando..." : "Solicitar Acceso (OTP)"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ingresa el OTP (Usa 123456 para demo)"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white tracking-widest text-center focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleVerify}
              disabled={loading || otp.length < 6}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Desbloquear Mission Control"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
