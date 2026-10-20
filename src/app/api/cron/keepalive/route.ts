import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Keep-alive cron. Free-tier Upstash Redis and Supabase projects can be paused
 * or evicted after a stretch of inactivity (Supabase pauses after ~7 days with
 * no requests), which would break the complaints channel. A daily touch on
 * each keeps them warm.
 *
 * Scheduled from vercel.json. Protected with CRON_SECRET: Vercel injects
 * `Authorization: Bearer <CRON_SECRET>` into cron invocations when that env var
 * is set, so a missing/incorrect header is rejected and the endpoint cannot be
 * abused by the public.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron] CRON_SECRET not set — refusing to run keep-alive.");
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const result: { upstash: string; supabase: string } = {
    upstash: "skipped",
    supabase: "skipped",
  };

  // Touch Upstash with a short-lived key.
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const redis = new Redis({ url, token });
      await redis.set("gsf:keepalive", new Date().toISOString(), { ex: 172800 });
      result.upstash = "ok";
    } catch (err) {
      result.upstash = "error";
      console.error(
        "[cron] Upstash keep-alive failed:",
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  // Touch Supabase with a trivial head count (no rows returned).
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("complaints")
      .select("id", { count: "exact", head: true });
    result.supabase = error ? "error" : "ok";
    if (error) console.error("[cron] Supabase keep-alive failed:", error.message);
  } catch (err) {
    result.supabase = "error";
    console.error(
      "[cron] Supabase keep-alive failed:",
      err instanceof Error ? err.message : String(err),
    );
  }

  return NextResponse.json({ ok: true, ...result });
}
