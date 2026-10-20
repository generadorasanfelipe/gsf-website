import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "@/lib/admin/allowlist";

export const runtime = "nodejs";

/**
 * GET /admin/callback?code=...&next=/admin/complaints
 *
 * Lands here after the user clicks the magic link in their email.
 * Exchanges the one-time code for a Supabase session (sets HTTP-only auth
 * cookies via the server client), then double-checks the email is still
 * allowlisted before redirecting into the admin panel.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const safeNext =
    next && next.startsWith("/admin") ? next : "/admin/complaints";

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=missing_code", req.url));
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/admin/login?error=exchange_failed", req.url));
  }

  // Re-check allowlist immediately — the user could have been removed
  // between requesting the link and clicking it.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAllowlistedEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
  }

  return NextResponse.redirect(new URL(safeNext, req.url));
}
