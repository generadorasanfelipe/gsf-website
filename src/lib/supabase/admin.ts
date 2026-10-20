import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for the admin panel's server-side reads and
 * writes.
 *
 * The complaints table runs RLS with NO policies, so neither the anon key nor
 * an authenticated-user session can read it. The admin surface therefore talks
 * to the DB with the SERVICE_ROLE key, exactly like the public complaints
 * route — but every caller MUST first pass requireAdmin() (session cookie +
 * allowlist) before using this client. The service role bypasses RLS, so it is
 * the authorization boundary.
 *
 * This key must never reach the browser. Only import this from server
 * components, route handlers, and server actions.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "[admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — admin DB access unavailable.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
