import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Private bucket holding uploaded application documents. */
export const SUBMISSIONS_BUCKET = "submissions";

let client: SupabaseClient | null = null;

/**
 * Lazily create the anonymous browser client.
 *
 * The client is NOT created (and we do NOT throw) at module load — so a missing
 * env never breaks the build/prerender. The "not configured" error surfaces
 * only if a submission is actually attempted without the env set.
 *
 * No auth session is persisted; submissions are inserted under the anon role,
 * which RLS restricts to INSERT-only.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
