/**
 * Dumps every public Supabase table (and storage files) to a folder.
 *
 *   npm run backup
 *
 * GitHub Actions sets SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the
 * environment instead of using .env.local.
 *
 * Output: backups/<timestamp>/manifest.json, tables/*.json, storage/...
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const url =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const PAGE_SIZE = 1000;

/** Known tables — used if OpenAPI discovery fails. */
const KNOWN_TABLES = [
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

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function isMissingTable(error) {
  const message = error?.message ?? "";
  return (
    error?.code === "PGRST205" ||
    /could not find the table/i.test(message) ||
    /schema cache/i.test(message)
  );
}

async function discoverTables() {
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/openapi+json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAPI HTTP ${response.status}`);
    }

    const spec = await response.json();
    const names = Object.keys(spec.paths ?? {})
      .map((path) => path.replace(/^\//, ""))
      .filter((name) => name && !name.includes("/") && !name.startsWith("rpc"));

    return [...new Set(names)].sort();
  } catch (error) {
    console.warn(
      `Could not discover tables from OpenAPI (${error.message}). Using known list.`,
    );
    return [...KNOWN_TABLES];
  }
}

async function fetchAllRows(table) {
  const rows = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, to);

    if (error) {
      if (isMissingTable(error)) return { missing: true, rows: [] };
      throw new Error(`${table}: ${error.message}`);
    }

    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return { missing: false, rows };
}

async function listStorageFiles(bucket, prefix = "") {
  const files = [];
  const folders = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });

    if (error) throw new Error(`${bucket}/${prefix}: ${error.message}`);
    if (!data?.length) break;

    for (const item of data) {
      if (!item.name || item.name.startsWith(".")) continue;
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) folders.push(path);
      else files.push(path);
    }

    if (data.length < limit) break;
    offset += limit;
  }

  for (const folder of folders) {
    files.push(...(await listStorageFiles(bucket, folder)));
  }

  return files;
}

async function downloadStorageFile(bucket, path, dest) {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error) throw new Error(`${bucket}/${path}: ${error.message}`);

  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await data.arrayBuffer()));
}

const backupDir =
  process.env.BACKUP_DIR || join(root, "backups", stamp());

await mkdir(join(backupDir, "tables"), { recursive: true });

const tables = await discoverTables();
const tableCounts = {};
const skipped = [];

for (const table of tables) {
  const { missing, rows } = await fetchAllRows(table);
  if (missing) {
    skipped.push(table);
    console.log(`skip  ${table} (table not found)`);
    continue;
  }

  await writeFile(
    join(backupDir, "tables", `${table}.json`),
    `${JSON.stringify(rows, null, 2)}\n`,
  );
  tableCounts[table] = rows.length;
  console.log(`table ${table.padEnd(32)} ${rows.length} row(s)`);
}

const storageCounts = {};

const { data: buckets, error: bucketsError } =
  await supabase.storage.listBuckets();

if (bucketsError) {
  console.warn(`Storage list failed: ${bucketsError.message}`);
} else {
  for (const bucket of buckets ?? []) {
    const files = await listStorageFiles(bucket.name);
    storageCounts[bucket.name] = files.length;

    for (const path of files) {
      const dest = join(backupDir, "storage", bucket.name, path);
      await downloadStorageFile(bucket.name, path, dest);
    }

    console.log(
      `store ${bucket.name.padEnd(32)} ${files.length} file(s)`,
    );
  }
}

const manifest = {
  created_at: new Date().toISOString(),
  supabase_url: url,
  tables: tableCounts,
  skipped_tables: skipped,
  storage: storageCounts,
};

await writeFile(
  join(backupDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const tableTotal = Object.values(tableCounts).reduce((sum, n) => sum + n, 0);
const fileTotal = Object.values(storageCounts).reduce((sum, n) => sum + n, 0);

console.log(`\nBackup written to ${backupDir}`);
console.log(`${tableTotal} row(s), ${fileTotal} storage file(s).`);
