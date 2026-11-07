// core/ports/session.gateway.ts

export interface SessionGateway {
  isUnlocked(): Promise<boolean>;
  createSession(): Promise<void>;
  destroySession(): Promise<void>;
}

