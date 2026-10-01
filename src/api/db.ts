import { neon } from '@neondatabase/serverless';

// Neon connection — DATABASE_URL must be set in environment
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const sql = neon(connectionString);

// Helper: run a query and return rows
export async function query<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  const rows = await sql(strings, ...values);
  return rows as T[];
}
