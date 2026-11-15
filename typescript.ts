import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function ensureSchema() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, provider TEXT, provider_task_id TEXT, key_id TEXT,
      model TEXT NOT NULL, type TEXT NOT NULL, prompt TEXT DEFAULT '',
      params_json TEXT DEFAULT '{}', status TEXT NOT NULL, progress INTEGER DEFAULT 0,
      result_urls_json TEXT, error_message TEXT, attempts_json TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY, provider TEXT NOT NULL, label TEXT DEFAULT '',
      api_key TEXT NOT NULL, status TEXT DEFAULT 'active', usage_count INTEGER DEFAULT 0,
      success_count INTEGER DEFAULT 0, fail_count INTEGER DEFAULT 0,
      last_used_at TEXT, last_checked_at TEXT, last_error TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export async function dbHealthy() {
  try {
    const res = await client.execute("SELECT 1");
    return res.rows.length > 0;
  } catch { return false; }
}

// دوال CRUD الأساسية للمهام والمفاتيح
export async function insertTask(task: any) { /* ... */ }
export async function getTask(id: string) { /* ... */ }
export async function updateTask(id: string, updates: any) { /* ... */ }
export async function listRecentTasks(limit: number, filters?: any) { /* ... */ }
export async function taskStats() { /* ... */ }
export async function insertApiKey(key: any) { /* ... */ }
export async function listApiKeys() { /* ... */ }
export async function updateApiKey(id: string, updates: any) { /* ... */ }
export async function deleteApiKey(id: string) { /* ... */ }
export async function getKeyPool(providers: string[]) { /* ... */ }

export default client;