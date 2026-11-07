// app/actions/auth.ts
"use server";

import {
  logoutUseCase,
  requestOtpUseCase,
  verifyOtpUseCase,
} from "../../core/use-cases/auth-gatekeeper.use-case";
import { getSessionGateway } from "../../infrastructure/container";

export async function requestOtpRequest(email: string) {
  return requestOtpUseCase(email);
}

export async function verifyOtpRequest(email: string, otp: string) {
  const sessionGateway = getSessionGateway();
  return verifyOtpUseCase(email, otp, sessionGateway);
}

export async function logout() {
  const sessionGateway = getSessionGateway();
  await logoutUseCase(sessionGateway);
}
