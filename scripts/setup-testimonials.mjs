/**
 * Creates the testimonials table (if needed) and imports the six legacy reviews.
 *
 *   npm run setup:testimonials
 *
 * Uses, in order:
 *   1. DATABASE_URL  — runs supabase/testimonials.sql via psql / supabase CLI
 *   2. Service role  — upserts rows when the table already exists
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = join(root, "supabase/testimonials.sql");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function tableExists() {
  const { error } = await supabase.from("testimonials").select("id").limit(1);
  return !error;
}

function runSqlFile() {
  const sql = readFileSync(sqlPath, "utf8");

  if (databaseUrl) {
    const psql = spawnSync("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", sqlPath], {
      encoding: "utf8",
    });
    if (psql.status === 0) return true;

    const supabaseCli = spawnSync(
      "npx",
      ["--yes", "supabase", "db", "query", "-f", sqlPath, "--db-url", databaseUrl],
      { encoding: "utf8", cwd: root },
    );
    if (supabaseCli.status === 0) return true;

    console.error(psql.stderr || psql.stdout || supabaseCli.stderr || supabaseCli.stdout);
    return false;
  }

  // No direct Postgres URL — fall back to seed upserts once the table exists.
  void sql;
  return false;
}

const TESTIMONIALS = [
  {
    client_name: "Indian Spices and Groceries",
    rating: 4.9,
    quote:
      "Altveen feels like an extension of our team. They handle our e-commerce, website, and marketing under one roof, so we never worry about coordination.",
    detail: "San Francisco, USA · E-commerce store & marketing",
    sort_order: 1,
  },
  {
    client_name: "Lotus Cuisine of India",
    rating: 5.0,
    quote:
      "From menu updates to online campaigns, they move fast and keep us informed. Our online orders and reservations have grown steadily.",
    detail: "San Rafael, USA · Restaurant & digital growth",
    sort_order: 2,
  },
  {
    client_name: "Lotus Markets",
    rating: 4.8,
    quote:
      "They rebuilt our Shopify presence and now manage performance ads. We see clear reports every week and know exactly what is working.",
    detail: "San Rafael, USA · Shopify store & ads",
    sort_order: 3,
  },
  {
    client_name: "Lotus Corner Market",
    rating: 5.0,
    quote:
      "A dependable partner for both tech and marketing. They keep our storefront fast, stable, and always aligned with our campaigns.",
    detail: "San Francisco, USA · Store management & marketing",
    sort_order: 4,
  },
  {
    client_name: "Hotel Sea View",
    rating: 5.0,
    quote:
      "For our hotel, Altveen delivered a clean, fast website and ongoing digital marketing that keeps us visible in a competitive market.",
    detail: "Srinagar, J&K · Website & digital marketing",
    sort_order: 5,
  },
  {
    client_name: "Atfaal Innovations",
    rating: 4.9,
    quote:
      "They understand startups. From branding to web to campaigns, everything is data-driven and focused on helping us grow.",
    detail: "Srinagar, J&K · Product site & growth support",
    sort_order: 6,
  },
].map((item) => ({
  ...item,
  published: true,
  show_on_homepage: true,
  show_on_services: true,
}));

let exists = await tableExists();

if (!exists) {
  console.log("Testimonials table not found — applying supabase/testimonials.sql …");
  const applied = runSqlFile();
  exists = applied ? await tableExists() : false;
}

if (!exists) {
  console.error(`
Could not create the testimonials table automatically.

Quick fix — paste and run the contents of:
  supabase/testimonials.sql

in Supabase → SQL Editor, then run:
  npm run setup:testimonials

Optional: add DATABASE_URL to .env.local (Project Settings → Database → URI)
so this script can apply the SQL for you next time.
`);
  process.exit(1);
}

const { data, error } = await supabase
  .from("testimonials")
  .upsert(TESTIMONIALS, { onConflict: "client_name" })
  .select("client_name");

if (error) {
  console.error("Import failed:", error.message);
  process.exit(1);
}

console.log(`✓ ${data.length} reviews in database:`);
for (const row of data) console.log(`  - ${row.client_name}`);
