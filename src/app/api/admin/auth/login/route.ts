import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAllowlistedEmail, adminAllowlistConfigured } from "@/lib/admin/allowlist";

export const runtime = "nodejs";

/**
 * POST /api/admin/auth/login
 * Body: { email: string, next?: string }
 *
 * Privacy: always returns { ok: true } regardless of whether the email is
 * allowlisted, so non-admins cannot probe which mailboxes have access. The
 * magic link is only sent when the address is allowlisted.
 */
export async function POST(req: NextRequest) {
  if (!adminAllowlistConfigured()) {
    // Misconfiguration — fail loudly to ourselves so deployments don't
    // silently accept everyone. Still don't leak details to the caller.
    console.error(
      "[admin/login] ADMIN_ALLOWLIST_EMAILS is empty — refusing to send magic links.",
    );
    return NextResponse.json(
      { ok: false, error: "Configuración no disponible." },
      { status: 503 },
    );
  }

  let body: { email?: unknown; next?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Payload inválido." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const next = typeof body.next === "string" && body.next.startsWith("/admin")
    ? body.next
    : "/admin/complaints";

  // Cheap shape sanity — Supabase will reject obvious garbage too, but we
  // want to fail fast on empty / non-email values without making a network
  // call.
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!looksLikeEmail) {
    return NextResponse.json({ ok: false, error: "Correo inválido." }, { status: 400 });
  }

  if (!isAllowlistedEmail(email)) {
    // Constant-time-ish response: log the rejection server-side, return
    // the same success shape externally.
    console.warn(
      `[admin/login] Rejected non-allowlisted email at ${new Date().toISOString()}`,
    );
    return NextResponse.json({ ok: true });
  }

  const supabase = await getSupabaseServerClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const redirectTo = `${siteUrl}/admin/callback?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      // We do NOT want signups: only existing email + magic link auth.
      // Supabase auto-creates a row in auth.users on first OTP though,
      // which is acceptable since the allowlist is the real gate.
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[admin/login] signInWithOtp failed", error.message);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el enlace. Intenta de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
