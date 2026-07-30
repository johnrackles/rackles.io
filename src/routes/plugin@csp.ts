import { isDev } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import type { PlatformCloudflarePages } from '@builder.io/qwik-city/middleware/cloudflare-pages'

export const onRequest: RequestHandler<PlatformCloudflarePages> = (event) => {
  if (isDev) return // Will not return CSP headers in dev mode
  const nonce = Date.now().toString(36) // Your custom nonce logic here
  event.sharedMap.set('@nonce', nonce)
  const csp = [
    `default-src 'self' 'unsafe-inline'`,
    `font-src 'self' data:`,
    `img-src 'self' 'unsafe-inline' data:`,
    `script-src 'self' 'unsafe-inline' https: 'nonce-${nonce}' ajax.cloudflare.com`,
    `style-src 'self' 'unsafe-inline'`,
    `frame-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `frame-ancestors 'none'`,
  ]

  event.headers.set('Content-Security-Policy', csp.join('; '))
  event.headers.set('X-Frame-Options', 'DENY')
  event.headers.set('X-Content-Type-Options', 'nosniff')
  event.headers.set('Referrer-Policy', 'same-origin')
  // This site has no cross-origin API surface (no fetch()/XHR calls to or
  // from other origins, no CORS-enabled endpoints) -- it's a static,
  // same-origin-only site, so we deliberately do NOT set any
  // Access-Control-Allow-Origin headers anywhere. These three headers
  // instead harden against OTHER origins embedding/reading/framing this
  // site's own resources, none of which this site itself relies on:
  //  - Cross-Origin-Resource-Policy: blocks other origins from embedding
  //    this site's own resources (JS/CSS/fonts/images/PDF) via <img>,
  //    <script>, fetch(), etc.
  //  - Cross-Origin-Opener-Policy: isolates this site's browsing context
  //    from cross-origin popups/tabs (this site never opens or relies on
  //    window.opener with another origin).
  //  - frame-ancestors 'none' (CSP) + X-Frame-Options: DENY: blocks other
  //    origins from framing this site (clickjacking protection).
  event.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  event.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
}
