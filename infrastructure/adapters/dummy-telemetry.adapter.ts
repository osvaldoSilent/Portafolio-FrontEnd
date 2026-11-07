// infrastructure/adapters/dummy-telemetry.adapter.ts
import { TelemetryStats } from "../../core/domain/models";
import { TelemetryRepository } from "../../core/ports/telemetry.repository";

export class DummyTelemetryAdapter implements TelemetryRepository {
  async getStats(): Promise<TelemetryStats> {
    return {
      interactionsCount: 42,
      latencyMs: 15,
      databaseRegion: "neondb (us-east-1)",
      poolerStatus: "DEMO_OFFLINE",
      driverName: "Mock Local (Inicia sesión para consultar Neon)",
      isLive: false,
    };
  }

  async saveInteraction(): Promise<boolean> {
    // En Modo Demo (sin sesión), no despertamos ni escribimos en Neon Postgres
    return false;
  }
}

