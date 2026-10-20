import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "@/lib/admin/allowlist";

export type AdminUser = { id: string; email: string };

/**
 * Server-side authorization guard for every admin data operation.
 *
 * Middleware (src/middleware.ts) already gates the /admin/* page surface, but
 * its matcher is "/admin/:path*" — it does NOT cover /api/admin/* nor the POST
 * endpoints that back server actions. Those can be invoked directly, so each
 * one re-verifies here: a valid Supabase session cookie AND an allowlisted
 * email. Defense in depth: pages call this too, so a middleware misconfig can
 * never leak data.
 *
 * Returns the authenticated admin, or null when the caller is not authorized.
 * Callers decide how to respond (redirect for pages, 401/403 for actions).
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowlistedEmail(user.email)) {
    return null;
  }
  return { id: user.id, email: user.email! };
}

/**
 * Like getAdminUser() but throws when unauthorized — for server actions where
 * the only correct outcome is to refuse. The thrown error is caught by the
 * action and surfaced as a generic failure; it never carries detail to the
 * client.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
