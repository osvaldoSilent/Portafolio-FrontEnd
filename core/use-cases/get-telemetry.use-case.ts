// core/use-cases/get-telemetry.use-case.ts
import { TelemetryStats } from "../domain/models";
import { TelemetryRepository } from "../ports/telemetry.repository";

export async function getTelemetryUseCase(
  repository: TelemetryRepository
): Promise<TelemetryStats> {
  return repository.getStats();
}

