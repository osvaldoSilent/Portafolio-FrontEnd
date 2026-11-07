import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Fallback seguro en tiempo de compilación (Docker / CI build) para que neon() no falle al evaluar el módulo.
// En producción (Cloud Run) y desarrollo local (.env.local) usa DATABASE_URL real.
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://build_user:build_pass@ep-build-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);
export const db = drizzle(sql);
