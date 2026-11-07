// infrastructure/adapters/dummy-telemetry.adapter.ts
import { TelemetryStats } from "../../core/domain/models";
import { TelemetryRepository } from "../../core/ports/telemetry.repository";

let localDemoInteractionsCount = 0;
export const DUMMY_TELEMETRY_EVENT = "dummy-telemetry-updated";

export class DummyTelemetryAdapter implements TelemetryRepository {
  async getStats(): Promise<TelemetryStats> {
    return {
      interactionsCount: localDemoInteractionsCount,
      latencyMs: 0,
      databaseRegion: "aws-us-east-1 (Pooler)",
      poolerStatus: "DEMO_OFFLINE",
      driverName: "Mock Local (Inicia sesión para consultar Neon)",
      isLive: false,
    };
  }

  async saveInteraction(): Promise<boolean> {
    // En Modo Demo (sin sesión), incrementamos el contador en memoria sin tocar Neon Postgres
    localDemoInteractionsCount += 1;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<number>(DUMMY_TELEMETRY_EVENT, {
          detail: localDemoInteractionsCount,
        })
      );
    }

    return false;
  }
}
