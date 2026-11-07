// infrastructure/container.ts
import { SessionGateway } from "../core/ports/session.gateway";
import { TelemetryRepository } from "../core/ports/telemetry.repository";
import { DummyTelemetryAdapter } from "./adapters/dummy-telemetry.adapter";
import { NeonTelemetryAdapter } from "./adapters/neon-telemetry.adapter";
import { NextCookieSessionAdapter } from "./adapters/next-cookie-session.adapter";

/**
 * Inyección de Dependencias (Factory Hexagonal):
 * Conmuta entre el adaptador real (Neon Postgres) y el adaptador Dummy ($0 costo)
 * dependiendo del estado de autenticación de la sesión.
 */
export function getTelemetryRepository(isUnlocked: boolean): TelemetryRepository {
  return isUnlocked ? new NeonTelemetryAdapter() : new DummyTelemetryAdapter();
}

export function getSessionGateway(): SessionGateway {
  return new NextCookieSessionAdapter();
}

