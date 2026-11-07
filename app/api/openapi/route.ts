// app/api/openapi/route.ts
import { NextResponse } from "next/server";
import { openApiSpec } from "../../../core/openapi/spec";

export async function GET() {
  return NextResponse.json(openApiSpec);
}

