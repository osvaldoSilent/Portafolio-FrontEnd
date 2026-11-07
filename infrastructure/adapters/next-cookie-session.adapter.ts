// infrastructure/adapters/next-cookie-session.adapter.ts
import { cookies } from "next/headers";
import { SessionGateway } from "../../core/ports/session.gateway";

const SESSION_COOKIE_NAME = "recruiter_session";
const SESSION_COOKIE_VALUE = "active_session";

export class NextCookieSessionAdapter implements SessionGateway {
  async isUnlocked(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value === SESSION_COOKIE_VALUE;
  }

  async createSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
      maxAge: 300, // 5 minutos
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  async destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

