/**
 * Restores a folder produced by scripts/backup-data.mjs.
 *
 *   npm run restore -- backups/<timestamp> --confirm
 *
 * Upserts rows by id and re-uploads storage files. Does not delete rows that
 * were created after the backup was taken.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const RESTORE_ORDER = [
  "clients",
  "posts",
  "testimonials",
  "consultation_requests",
  "contact_submissions",
  "newsletter_subscribers",
  "finance_projects",
  "finance_transactions",
  "finance_director_entries",
  "finance_company_expenses",
];

const url =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const confirm = args.includes("--confirm");
const backupArg = args.find((arg) => !arg.startsWith("--"));

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

if (!backupArg) {
  console.error("Usage: npm run restore -- <backup-folder> --confirm");
  process.exit(1);
}

const backupDir = resolve(root, backupArg);
const tablesDir = join(backupDir, "tables");
const storageDir = join(backupDir, "storage");

if (!confirm) {
  console.error(
    `This will upsert data from ${backupDir} into ${url}.\nRe-run with --confirm to proceed.`,
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CHUNK = 100;

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function upsertTable(table, rows) {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase.from(table).upsert(chunk, {
      onConflict: "id",
    });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

async function walkFiles(dir, prefix = "") {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await walkFiles(abs, rel)));
    else files.push({ abs, rel });
  }
  return files;
}

let manifest;
try {
  manifest = await readJson(join(backupDir, "manifest.json"));
} catch {
  console.error(`No manifest.json in ${backupDir}. Is this a backup folder?`);
  process.exit(1);
}

console.log(`Restoring backup from ${manifest.created_at}`);

const tableFiles = (await readdir(tablesDir))
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.replace(/\.json$/, ""));

const ordered = [
  ...RESTORE_ORDER.filter((name) => tableFiles.includes(name)),
  ...tableFiles.filter((name) => !RESTORE_ORDER.includes(name)).sort(),
];

const pending = new Map();
for (const table of ordered) {
  pending.set(table, await readJson(join(tablesDir, `${table}.json`)));
}

const maxPasses = 5;
for (let pass = 1; pass <= maxPasses && pending.size; pass++) {
  for (const [table, rows] of [...pending]) {
    try {
      await upsertTable(table, rows);
      console.log(`table ${table.padEnd(32)} ${rows.length} row(s)`);
      pending.delete(table);
    } catch (error) {
      if (pass === maxPasses) throw error;
      console.warn(`retry ${table} (${error.message})`);
    }
  }
}

const storageRoot = storageDir;
let buckets;
try {
  buckets = await readdir(storageRoot, { withFileTypes: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  buckets = [];
}

for (const bucket of buckets.filter((entry) => entry.isDirectory())) {
  const files = await walkFiles(join(storageRoot, bucket.name));
  for (const file of files) {
    const bytes = await readFile(file.abs);
    const { error } = await supabase.storage
      .from(bucket.name)
      .upload(file.rel, bytes, { upsert: true });
    if (error) throw new Error(`${bucket.name}/${file.rel}: ${error.message}`);
  }
  console.log(
    `store ${bucket.name.padEnd(32)} ${files.length} file(s)`,
  );
}

console.log(`\nRestore complete from ${relative(root, backupDir) || backupDir}.`);
