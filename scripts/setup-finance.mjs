/**
 * Finance DB setup — run supabase/finance-simple-upgrade.sql in Supabase SQL Editor,
 * or: npm run setup:finance (prints SQL if DATABASE_URL is not set)
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "..", "supabase", "finance-simple-upgrade.sql");
const sql = readFileSync(sqlPath, "utf8");

const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.log(`
Paste this into Supabase → SQL Editor and click Run:

${sql}
`);
  process.exit(0);
}

let pg;
try {
  pg = await import("pg");
} catch {
  console.error("Install pg or paste supabase/finance-simple-upgrade.sql in Supabase SQL Editor.");
  process.exit(1);
}

const client = new pg.default.Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query(sql);
  console.log("Finance upgrade applied.");
} catch (error) {
  console.error("Upgrade failed:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
