import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for App Router server components and route
 * handlers. Reads/writes auth cookies via Next.js cookies() so the session
 * survives across server-rendered admin pages.
 *
 * Uses the public anon key — authorization is enforced by
 * (1) signed Supabase Auth session cookies and (2) our server-side allowlist
 * check in src/lib/admin/allowlist.ts. Never replace this with the
 * service_role key — that key must remain server-side-only and is used by
 * the public complaints route, not by admin auth.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — Next.js disallows mutation here.
            // Middleware (src/middleware.ts) is responsible for refreshing
            // cookies on subsequent requests.
          }
        },
      },
    },
  );
}
