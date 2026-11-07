// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { processAgentChatUseCase } from "../../../core/use-cases/process-agent-chat.use-case";
import {
  getSessionGateway,
  getTelemetryRepository,
} from "../../../infrastructure/container";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    // 1. Consultamos el puerto de sesión
    const sessionGateway = getSessionGateway();
    const isUnlocked = await sessionGateway.isUnlocked();

    // 2. Inyectamos el adaptador correspondiente (Neon Live vs Dummy Mock)
    const telemetryRepo = getTelemetryRepository(isUnlocked);

    // 3. Ejecutamos el Caso de Uso puro
    const result = await processAgentChatUseCase(message, telemetryRepo);

    return NextResponse.json({
      response: result.botResponse,
      persistedInDb: result.persistedInDb,
      mode: result.mode,
    });
  } catch (error) {
    console.error("Error en API Chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
