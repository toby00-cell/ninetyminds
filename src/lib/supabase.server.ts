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

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.",
    );
  }

  _client = createClient<Database>(url, key, {
    auth: {
      // Service-role client; no user sessions needed server-side.
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}