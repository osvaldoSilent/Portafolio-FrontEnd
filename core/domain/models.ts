// core/domain/models.ts

export interface TelemetryStats {
  interactionsCount: number;
  latencyMs: number;
  databaseRegion: string;
  poolerStatus: "ACTIVE_POOLER" | "DEMO_OFFLINE";
  driverName: string;
  isLive: boolean;
}

export interface ChatInteractionResult {
  botResponse: string;
  persistedInDb: boolean;
  mode: "LIVE_NEON" | "DEMO_DUMMY";
}

export interface OtpRequestResult {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface OtpVerifyResult {
  success?: boolean;
  error?: string;
}

