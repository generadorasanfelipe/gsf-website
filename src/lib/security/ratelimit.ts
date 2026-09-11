import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const HOURLY_LIMIT = 5;
const DAILY_LIMIT = 20;

type Limiters = {
  hourly: Ratelimit;
  daily: Ratelimit;
};

let cached: Limiters | null = null;
let warnedMissing = false;

function buildLimiters(): Limiters | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warnedMissing) {
      console.warn(
        "[security] Upstash env vars not set — rate limiting disabled. " +
          "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable."
      );
      warnedMissing = true;
    }
    return null;
  }

  const redis = new Redis({ url, token });

  return {
    hourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(HOURLY_LIMIT, "1 h"),
      prefix: "gsf:complaints:hourly",
      analytics: false,
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_LIMIT, "1 d"),
      prefix: "gsf:complaints:daily",
      analytics: false,
    }),
  };
}

function getLimiters(): Limiters | null {
  if (cached === null) cached = buildLimiters();
  return cached;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; window: "hour" | "day"; resetSeconds: number };

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const limiters = getLimiters();
  if (!limiters) return { allowed: true };

  // Fail OPEN on any Upstash error. The rate limiter is a secondary defense;
  // Cloudflare Turnstile is the primary bot gate. If Upstash is unreachable
  // (e.g. the free-tier DB was evicted after inactivity, or credentials are
  // stale) the request must still be allowed to proceed — a rate-limiter
  // outage must never take down the complaints channel.
  try {
    const hourly = await limiters.hourly.limit(ip);
    if (!hourly.success) {
      return {
        allowed: false,
        window: "hour",
        resetSeconds: Math.max(1, Math.ceil((hourly.reset - Date.now()) / 1000)),
      };
    }

    const daily = await limiters.daily.limit(ip);
    if (!daily.success) {
      return {
        allowed: false,
        window: "day",
        resetSeconds: Math.max(1, Math.ceil((daily.reset - Date.now()) / 1000)),
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error(
      "[security] Rate limit check failed — failing open:",
      err instanceof Error ? err.message : String(err)
    );
    return { allowed: true };
  }
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}
