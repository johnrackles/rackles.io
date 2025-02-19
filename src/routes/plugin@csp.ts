import { isDev } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import type { PlatformCloudflarePages } from "@builder.io/qwik-city/middleware/cloudflare-pages";

export const onRequest: RequestHandler<PlatformCloudflarePages> = (event) => {
  if (isDev) return; // Will not return CSP headers in dev mode
  const nonce = Date.now().toString(36); // Your custom nonce logic here
  event.sharedMap.set("@nonce", nonce);
  const csp = [
    `default-src 'self' 'unsafe-inline'`,
    `font-src 'self' data:`,
    `img-src 'self' 'unsafe-inline' data:`,
    `script-src 'self' 'unsafe-inline' https: 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `frame-src 'self' 'nonce-${nonce}'`,
    `object-src 'none'`,
    `base-uri 'self'`,
  ];

  event.headers.set("Content-Security-Policy", csp.join("; "));
  event.headers.set("X-Frame-Options", "DENY");
  event.headers.set("X-Content-Type-Options", "nosniff");
};
