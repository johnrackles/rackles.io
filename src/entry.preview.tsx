/*
 * WHAT IS THIS FILE?
 *
 * It's the bundle entry point for `npm run preview`.
 * That is, serving your app built in production mode.
 *
 * Feel free to modify this file, but don't remove it!
 *
 * Learn more about Vite's preview command:
 * - https://vitejs.dev/config/preview-options.html#preview-options
 *
 */
import { createQwikCity } from '@builder.io/qwik-city/middleware/node'
import qwikCityPlan from '@qwik-city-plan'
import render from './entry.ssr'
import { env } from './lib/env'

/**
 * The default export is the QwikCity adapter used by Vite preview.
 *
 * `origin` is used to resolve relative URLs and to validate the request
 * origin when performing CSRF checks. See:
 * https://qwik.dev/docs/deployments/#origin
 *
 * Only relevant for this Node-based preview server -- the Cloudflare Pages
 * production deployment (src/entry.cloudflare-pages.tsx) doesn't need this,
 * since Cloudflare's platform always provides a `Request` with a correct,
 * absolute `request.url` (scheme + host) to derive the origin from.
 */
export default createQwikCity({
  render,
  qwikCityPlan,
  getOrigin: () => env.ORIGIN ?? null,
})
