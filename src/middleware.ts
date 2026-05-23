import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAllowlistedEmail } from "@/lib/admin/allowlist";

/**
 * Gate the /admin/* surface.
 *
 * Two enforcement points:
 *   1. There must be a valid Supabase Auth session cookie.
 *   2. The session's email must appear in ADMIN_ALLOWLIST_EMAILS.
 *
 * Both checks happen on every request. Even if a user authenticates once,
 * removing them from the allowlist immediately revokes access on the next
 * navigation — no re-login required by the user being removed.
 *
 * Public routes (/admin/login, /admin/callback, /admin/unauthorized) are
 * excluded so unauthenticated users can complete the login flow.
 */

const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/callback",
  "/admin/unauthorized",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Build a response we can mutate with refreshed cookies.
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAllowlistedEmail(user.email)) {
    const url = new URL("/admin/unauthorized", req.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
