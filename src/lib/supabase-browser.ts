import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Client-side Supabase instance — uses the anon key, safe for the browser.
// RLS policies protect data access.

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(url, key);