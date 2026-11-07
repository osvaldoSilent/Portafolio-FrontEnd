// infrastructure/adapters/neon-telemetry.adapter.ts
import { connection } from "next/server";
import { db } from "../../lib/db";
import { agentInteractions } from "../../lib/schema";
import { TelemetryStats } from "../../core/domain/models";
import { TelemetryRepository } from "../../core/ports/telemetry.repository";

export class NeonTelemetryAdapter implements TelemetryRepository {
  async getStats(): Promise<TelemetryStats> {
    await connection();
    const start = performance.now();
    const interacciones = await db.select().from(agentInteractions);
    const latencyMs = Math.round(performance.now() - start);

    return {
      interactionsCount: interacciones.length,
      latencyMs,
      databaseRegion: "neondb (us-east-1)",
      poolerStatus: "ACTIVE_POOLER",
      driverName: "@neondatabase/serverless (HTTP Live)",
      isLive: true,
    };
  }

  async saveInteraction(userMessage: string, botResponse: string): Promise<boolean> {
    await db.insert(agentInteractions).values({
      userMessage,
      botResponse,
    });
    return true;
  }
}

