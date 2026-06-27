/**
 * Lightweight in-memory sliding-window rate limiter.
 * Suitable for a single-region serverless deployment / dev.
 * For multi-region scale, swap the store for Upstash Redis (same interface).
 */

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

// Periodically purge expired buckets to avoid unbounded growth.
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of store) if (b.resetAt < now) store.delete(key);
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * @param key      Unique identifier (e.g. `${ip}:${route}`)
 * @param limit    Max requests per window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): RateLimitResult {
  sweep();
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  bucket.count += 1;
  const success = bucket.count <= limit;
  return { success, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
}

/** Extract the best-effort client IP from a Next.js request. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? '0.0.0.0';
}
