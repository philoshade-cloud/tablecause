import { createClient } from "@supabase/supabase-js";

// Public, read-only client. Row Level Security limits what it can see.
export function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// Server-only secret for the server_* database functions.
export function serverSecret() {
  const s = process.env.SERVER_DB_SECRET;
  if (!s) throw new Error("SERVER_DB_SECRET is not set");
  return s;
}
