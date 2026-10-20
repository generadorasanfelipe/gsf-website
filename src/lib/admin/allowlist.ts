/**
 * Admin email allowlist — sole gate for the /admin/* surface.
 *
 * `ADMIN_ALLOWLIST_EMAILS` is a comma-separated list of email addresses set
 * in Vercel (Production + Preview) and in .env.local for local dev. Anything
 * not in this list is rejected before a magic link is even sent.
 *
 * Comparison is case-insensitive and whitespace-trimmed. We intentionally
 * do NOT match by domain — the allowlist is per-user, not per-domain, so
 * we never accidentally grant access by adding a new mailbox under
 * gsf.com.do.
 */

const RAW = process.env.ADMIN_ALLOWLIST_EMAILS ?? "";

const ALLOWLIST = new Set(
  RAW.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export function isAllowlistedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWLIST.has(email.trim().toLowerCase());
}

/**
 * Diagnostic: surface whether the env var is configured at all, so we can
 * fail fast on misconfigured deployments. Never log the allowlist itself.
 */
export function adminAllowlistConfigured(): boolean {
  return ALLOWLIST.size > 0;
}
