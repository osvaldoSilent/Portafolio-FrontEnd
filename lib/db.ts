import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Asegúrate de tener tu DATABASE_URL real en .env.local
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);