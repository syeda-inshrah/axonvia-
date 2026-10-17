/**
 * Best-effort client IP for rate limiting. Trusts x-forwarded-for, which the hosting proxy (e.g. Vercel) sets;
 * requests without it share one "unknown" bucket.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || 'unknown'
}
