// core/ports/telemetry.repository.ts
import { TelemetryStats } from "../domain/models";

export interface TelemetryRepository {
  getStats(): Promise<TelemetryStats>;
  saveInteraction(userMessage: string, botResponse: string): Promise<boolean>;
}

