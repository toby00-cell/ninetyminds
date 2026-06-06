import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

// Server-only Supabase client. The .server.ts suffix prevents Vite from
// bundling this into the client — the service-role key never reaches the browser.
//
// On Cloudflare Workers, process.env is only populated at request time,
// so we create the client lazily inside a function rather than at module scope.

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL 
    ?? (globalThis as any).SUPABASE_URL
    ?? "https://nwtkgnxrpolwgkyijcta.supabase.co";
    
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY 
    ?? (globalThis as any).SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars.");
  }

  _client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return _client;
}