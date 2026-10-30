import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth";
import pool from "../lib/db";

const router = Router();
const backupUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/json" || file.mimetype === "application/octet-stream" || file.mimetype === "") {
      cb(null, true);
    } else {
      cb(new Error("File backup harus berformat JSON"));
    }
  },
});

const BYTEA_MARKER = "__nempo_backup_bytea";

type TableMeta = {
  name: string;
  columns: string[];
  generatedColumns: Set<string>;
  identityAlwaysColumns: Set<string>;
  primaryKey: string[];
};

type BackupTable = {
  name: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

type BackupFile = {
  format: string;
  version: number;
  exported_at: string;
  tables: BackupTable[];
};

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

function encodeValue(value: unknown): unknown {
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return { [BYTEA_MARKER]: true, data: Buffer.from(value).toString("base64") };
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(encodeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, encodeValue(item)])
    );
  }
  return value;
}

function decodeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(decodeValue);
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (object[BYTEA_MARKER] === true && typeof object.data === "string") {
      return Buffer.from(object.data, "base64");
    }
    return Object.fromEntries(
      Object.entries(object).map(([key, item]) => [key, decodeValue(item)])
    );
  }
  return value;
}

async function getTableMetadata(): Promise<TableMeta[]> {
  const [tablesResult, columnsResult, primaryKeysResult] = await Promise.all([
    pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'pg_%'
      ORDER BY table_name
    `),
    pool.query(`
      SELECT table_name, column_name, ordinal_position, is_generated, is_identity,
             identity_generation
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `),
    pool.query(`
      SELECT tc.table_name, kcu.column_name, kcu.ordinal_position
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
       AND tc.table_name = kcu.table_name
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'PRIMARY KEY'
      ORDER BY tc.table_name, kcu.ordinal_position
    `),
  ]);

  const tableNames = tablesResult.rows.map(row => String(row.table_name));
  return tableNames.map(name => {
    const columns = columnsResult.rows.filter(row => row.table_name === name);
    const primaryKey = primaryKeysResult.rows
      .filter(row => row.table_name === name)
      .sort((a, b) => Number(a.ordinal_position) - Number(b.ordinal_position))
      .map(row => String(row.column_name));

    return {
      name,
      columns: columns.map(row => String(row.column_name)),
      generatedColumns: new Set(
        columns
          .filter(row => row.is_generated === "ALWAYS")
          .map(row => String(row.column_name))
      ),
      identityAlwaysColumns: new Set(
        columns
          .filter(row => row.is_identity === "YES" && row.identity_generation === "ALWAYS")
          .map(row => String(row.column_name))
      ),
      primaryKey,
    };
  });
}

function validateBackup(value: unknown): BackupFile {
  if (!value || typeof value !== "object") throw new Error("Format backup tidak valid");
  const backup = value as Partial<BackupFile>;
  if (backup.format !== "nempo-garut-database-backup" || backup.version !== 1 || !Array.isArray(backup.tables)) {
    throw new Error("Backup bukan file database Nempo.id yang valid");
  }
  if (backup.tables.some(table => !table || typeof table.name !== "string" || !Array.isArray(table.columns) || !Array.isArray(table.rows))) {
    throw new Error("Struktur tabel di file backup tidak valid");
  }
  return backup as BackupFile;
}

const restorePriority = [
  "site_settings",
  "file_uploads",
  "users",
  "admin_users",
  "mitra",
  "wisata",
  "kuliner",
  "penginapan",
  "events",
  "berita",
  "banners",
  "promo_banners",
  "partners",
  "vouchers",
  "kamus_sunda",
  "transportasi",
  "price_list",
  "digital_services",
  "partnership_page",
];

function sortForRestore(a: BackupTable, b: BackupTable): number {
  const aPriority = restorePriority.indexOf(a.name);
  const bPriority = restorePriority.indexOf(b.name);
  if (aPriority >= 0 || bPriority >= 0) {
    return (aPriority < 0 ? Number.MAX_SAFE_INTEGER : aPriority) -
      (bPriority < 0 ? Number.MAX_SAFE_INTEGER : bPriority);
  }
  return a.name.localeCompare(b.name);
}

async function restoreTable(client: { query: (text: string, values?: unknown[]) => Promise<unknown> }, table: BackupTable, meta: TableMeta): Promise<number> {
  const allowedColumns = new Set(meta.columns);
  const columns = table.columns.filter(column => allowedColumns.has(column) && !meta.generatedColumns.has(column));
  if (columns.length === 0 || table.rows.length === 0) return 0;

  const quotedTable = quoteIdentifier(meta.name);
  const quotedColumns = columns.map(quoteIdentifier).join(", ");
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  const identityOverride = columns.some(column => meta.identityAlwaysColumns.has(column))
    ? " OVERRIDING SYSTEM VALUE"
    : "";

  let conflictClause = " ON CONFLICT DO NOTHING";
  if (meta.primaryKey.length > 0 && meta.primaryKey.every(column => columns.includes(column))) {
    const primaryKeyColumns = meta.primaryKey.map(quoteIdentifier).join(", ");
    const updateColumns = columns.filter(column => !meta.primaryKey.includes(column));
    conflictClause = updateColumns.length > 0
      ? ` ON CONFLICT (${primaryKeyColumns}) DO UPDATE SET ${updateColumns.map(column => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`).join(", ")}`
      : " ON CONFLICT DO NOTHING";
  }

  let imported = 0;
  for (const row of table.rows) {
    const values = columns.map(column => decodeValue(row[column] ?? null));
    await client.query(
      `INSERT INTO ${quotedTable} (${quotedColumns})${identityOverride} VALUES (${placeholders})${conflictClause}`,
      values
    );
    imported += 1;
  }
  return imported;
}

router.get("/admin/backup/export", requireAuth, async (_req, res) => {
  try {
    const metadata = await getTableMetadata();
    const tables: BackupTable[] = [];
    for (const meta of metadata) {
      const result = await pool.query(`SELECT * FROM ${quoteIdentifier(meta.name)}`);
      tables.push({
        name: meta.name,
        columns: meta.columns,
        rows: result.rows.map(row => encodeValue(row) as Record<string, unknown>),
      });
    }

    const backup: BackupFile = {
      format: "nempo-garut-database-backup",
      version: 1,
      exported_at: new Date().toISOString(),
      tables,
    };
    const filename = `nempo-garut-backup-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(JSON.stringify(backup));
  } catch (error) {
    console.error("Database backup export failed:", error);
    res.status(500).json({ error: "Gagal membuat backup database" });
  }
});

router.post("/admin/backup/import", requireAuth, backupUpload.single("backup"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Pilih file backup JSON terlebih dahulu" });

  let backup: BackupFile;
  try {
    backup = validateBackup(JSON.parse(req.file.buffer.toString("utf8")));
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "File backup tidak valid" });
  }

  const metadata = await getTableMetadata();
  const metadataByName = new Map(metadata.map(meta => [meta.name, meta]));
  const client = await pool.connect();
  let importedRows = 0;
  let skippedTables = 0;
  const failedTables: string[] = [];

  try {
    await client.query("BEGIN");
    for (const table of [...backup.tables].sort(sortForRestore)) {
      const meta = metadataByName.get(table.name);
      if (!meta) {
        skippedTables += 1;
        continue;
      }
      try {
        await client.query("SAVEPOINT nempo_restore_table");
        importedRows += await restoreTable(client, table, meta);
        await client.query("RELEASE SAVEPOINT nempo_restore_table");
      } catch (error) {
        await client.query("ROLLBACK TO SAVEPOINT nempo_restore_table");
        failedTables.push(table.name);
        console.error(`Database restore skipped table ${table.name}:`, error);
      }
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database backup import failed:", error);
    return res.status(500).json({ error: "Restore gagal dan tidak ada perubahan yang disimpan" });
  } finally {
    client.release();
  }

  return res.json({
    ok: true,
    importedRows,
    skippedTables,
    failedTables,
    message: failedTables.length > 0
      ? "Backup dipulihkan sebagian. Beberapa tabel dilewati karena struktur database berbeda."
      : "Backup berhasil dipulihkan tanpa menghapus data lain.",
  });
});

export default router;