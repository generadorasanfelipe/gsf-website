# Admin Panel — Setup Guide

This doc covers the one-time configuration required to bring up the `/admin/complaints` panel. Phase 1 ships the auth foundation only — phase 2 adds the complaints list, detail view, status workflow, and audit log.

## What ships in Phase 1

- `/admin/login` — magic-link request form
- `/api/admin/auth/login` — server-side allowlist check + Supabase OTP dispatch
- `/admin/callback` — exchanges magic-link code for a session, double-checks allowlist
- `/admin/unauthorized` — denial page for removed accounts
- `/admin/complaints` — placeholder shell (phase 2 fills this in)
- `src/middleware.ts` — gates every `/admin/*` request on session + allowlist
- `/api/admin/auth/logout` — clears the session
- CSP `connect-src` automatically extended with `NEXT_PUBLIC_SUPABASE_URL`

## Environment variables

Set these in **Vercel → Project Settings → Environment Variables** for both **Production** and **Preview**, and mirror them in `.env.local` for dev:

| Variable | Where to find it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Same value as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` key | Safe to expose, **NOT** the `service_role` key |
| `ADMIN_ALLOWLIST_EMAILS` | Manual | Comma-separated list, e.g. `andres.pichardo@gsf.com.do,maria@gsf.com.do` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` already exist from the public complaints route — leave them in place.

## Supabase dashboard configuration

### 1. Configure Resend as SMTP

Supabase's built-in email service is rate-limited and not branded. We send magic links through Resend so they originate from `noresponder@gsf.com.do`.

- Supabase → **Authentication → Settings → SMTP Provider** → toggle "Use custom SMTP"
- Sender email: `noresponder@gsf.com.do`
- Sender name: `Generadora San Felipe`
- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: the `RESEND_API_KEY` (the same key the public complaints route uses)
- Minimum interval between emails: `60` seconds

Save and **send a test email to yourself** from the Supabase dashboard before relying on the flow.

### 2. Configure redirect URLs

Supabase blocks any magic-link redirect that isn't in its allowlist.

- Supabase → **Authentication → URL Configuration**
- **Site URL**: `https://gsf-website-sable.vercel.app` (current preview prod) or `https://gsf.com.do` once live
- **Redirect URLs**: add at minimum
  - `https://gsf-website-sable.vercel.app/admin/callback`
  - `https://gsf.com.do/admin/callback` (forward-compatible)
  - `http://localhost:3000/admin/callback` (local dev)
  - Wildcard for branch previews if you use them: `https://gsf-website-git-*-*.vercel.app/admin/callback`

### 3. Enable email provider

- Supabase → **Authentication → Providers → Email**
- Enable provider
- Disable "Confirm email" (we use magic link OTP, not email/password signups)
- Disable "Secure password change" toggles (not used)

## Local development

```
cp .env.local.example .env.local
# Fill in the new vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# ADMIN_ALLOWLIST_EMAILS, plus the existing SUPABASE_*, RESEND_API_KEY, etc.

npm run dev
# Visit http://localhost:3000/admin/login
# Enter your allowlisted email
# Check inbox for the magic link
# Click → lands on /admin/complaints
```

If Supabase SMTP is configured globally on the project, magic links work in local dev too. The redirect URL must include `http://localhost:3000/admin/callback`.

## Adding / removing admins

`ADMIN_ALLOWLIST_EMAILS` is a Vercel env var — change it via the dashboard and redeploy. Removed users lose access on their next navigation (middleware re-checks allowlist every request).

Do **NOT** rely on Supabase's own user table for access control. Supabase will happily create an `auth.users` row for any email that gets a magic-link request, but the allowlist gate happens before the email is sent and again at session validation.

## Security posture

- Magic-link OTP only — no passwords stored
- Server-side allowlist check **before** dispatching the link (non-admins never receive an email)
- Server-side allowlist re-check on every authenticated request (defense against post-auth removal)
- Session cookies are HTTP-only, secure, SameSite=Lax via `@supabase/ssr`
- `/admin/*` excluded from `robots.txt` (Next.js default behavior; we also set `robots: { index: false, follow: false }` on every admin page)
- CSP `connect-src` restricted to `'self'`, Cloudflare Turnstile, and the configured Supabase project

## Verification checklist

After deploying Phase 1:

- [ ] `https://<your-deploy>/admin/login` renders the form
- [ ] Submitting an allowlisted email returns the "check your inbox" message
- [ ] Submitting a non-allowlisted email returns the same message (privacy-preserving)
- [ ] Magic-link arrives from `noresponder@gsf.com.do`
- [ ] Clicking the link lands on `/admin/complaints` (placeholder)
- [ ] Refreshing the page keeps the session
- [ ] Removing the email from `ADMIN_ALLOWLIST_EMAILS` and redeploying causes the next navigation to redirect to `/admin/unauthorized`
- [ ] Clicking "Cerrar sesión" logs out and returns to `/admin/login`

## Phase 2 — what comes next

Phase 2 will deliver:

- Complaints list with filters (type, status, date range) + pagination
- Complaint detail view
- Status workflow (`open` → `in_progress` → `resolved` → `closed`)
- Internal notes (text-only)
- Audit log auto-recording status changes and notes (new tables: `complaint_notes`, `complaint_history`)
- Manual QA + edge case testing
