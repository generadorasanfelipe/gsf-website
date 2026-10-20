/** @type {import('next').NextConfig} */

// Cloudflare Turnstile widget loads scripts from and iframes
// challenges.cloudflare.com — see src/components/TurnstileWidget.tsx.
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";
// Google Maps embed iframes in src/components/Locations.tsx.
const GOOGLE_MAPS_ORIGIN = "https://www.google.com";
// Supabase project for admin auth (magic link) — client SDK calls go here
// from /admin/* pages. Derived from NEXT_PUBLIC_SUPABASE_URL so a Supabase
// project move doesn't require editing CSP.
const SUPABASE_ORIGIN = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
})();

// Next.js dev mode uses eval-source-map, which requires 'unsafe-eval' in CSP.
// Production bundles do not eval, so the production CSP stays strict.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev && "'unsafe-eval'",
  TURNSTILE_ORIGIN,
]
  .filter(Boolean)
  .join(" ");

// CSP violation reports POST to this endpoint. Path is the route handler at
// src/app/api/csp-report/route.ts.
const CSP_REPORT_URI = "/api/csp-report";

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${TURNSTILE_ORIGIN}${SUPABASE_ORIGIN ? " " + SUPABASE_ORIGIN : ""}`,
  "media-src 'self'",
  `frame-src ${TURNSTILE_ORIGIN} ${GOOGLE_MAPS_ORIGIN}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
  `report-uri ${CSP_REPORT_URI}`,
  `report-to csp-endpoint`,
].join("; ");

// Reporting-Endpoints header pairs with the report-to directive in CSP.
const reportingEndpoints = `csp-endpoint="${CSP_REPORT_URI}"`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Reporting-Endpoints", value: reportingEndpoints },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
