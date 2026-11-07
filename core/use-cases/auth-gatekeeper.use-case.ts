// core/use-cases/auth-gatekeeper.use-case.ts
import { OtpRequestResult, OtpVerifyResult } from "../domain/models";
import { SessionGateway } from "../ports/session.gateway";

const DEMO_MASTER_OTP = "123456";

export async function requestOtpUseCase(email: string): Promise<OtpRequestResult> {
  const cleanEmail = email?.trim() ?? "";
  if (!cleanEmail.includes("@") || cleanEmail.length < 5) {
    return { error: "Correo corporativo inválido" };
  }

  return {
    success: true,
    message: "OTP generado. Revisa tu correo.",
  };
}

export async function verifyOtpUseCase(
  email: string,
  otp: string,
  sessionGateway: SessionGateway
): Promise<OtpVerifyResult> {
  if (!email?.includes("@")) {
    return { error: "Correo corporativo inválido" };
  }

  if (otp?.trim() === DEMO_MASTER_OTP) {
    await sessionGateway.createSession();
    return { success: true };
  }

  return { error: "Código OTP inválido o expirado" };
}

export async function logoutUseCase(
  sessionGateway: SessionGateway
): Promise<void> {
  await sessionGateway.destroySession();
}

