// core/use-cases/process-agent-chat.use-case.ts
import { ChatInteractionResult } from "../domain/models";
import { TelemetryRepository } from "../ports/telemetry.repository";

export function resolveArchitectureAnswer(message: string): string {
  if (message.includes("login-service")) {
    return "El login-service está construido en Java con Spring Boot. Valida credenciales, aplica reglas de negocio y emite un JWT firmado usando arquitectura hexagonal.";
  }
  if (message.includes("FinOps") || message.includes("$0")) {
    return "La estrategia FinOps $0 (Scale-to-Zero) usa Google Cloud Run y Neon Postgres Serverless para apagar los recursos automáticamente cuando no hay tráfico, reduciendo la factura a cero.";
  }
  if (message.includes("collectAR")) {
    return "collectAR es una aplicación Full-Stack usando React Native, Spring Boot, Kafka, Redis y PostgreSQL, con integraciones de Realidad Aumentada para coleccionables físicos.";
  }
  return "Interesante. Como Agente IA acotado, mi función principal es demostrar la persistencia en Neon Postgres bajo demanda.";
}

export async function processAgentChatUseCase(
  rawMessage: string,
  repository: TelemetryRepository
): Promise<ChatInteractionResult> {
  const message = rawMessage?.trim();
  if (!message) {
    throw new Error("Mensaje vacío");
  }

  const baseAnswer = resolveArchitectureAnswer(message);
  const persistedInDb = await repository.saveInteraction(message, baseAnswer);

  const botResponse = persistedInDb
    ? baseAnswer
    : `${baseAnswer} Esta es una respuesta predeterminada, inicia sesión para hablar con un agente AI real.`;

  return {
    botResponse,
    persistedInDb,
    mode: persistedInDb ? "LIVE_NEON" : "DEMO_DUMMY",
  };
}

