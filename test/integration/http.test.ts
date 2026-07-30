import { type PreviewServer, preview } from 'vite'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

/**
 * Integration tests against a built preview server. These only need plain
 * HTTP requests (no DOM/browser), so they run in vitest instead of
 * Playwright to keep the suite fast. Requires the site to be built first
 * (`npm run prebuild && npm run build.client && npm run build.preview`).
 */

let server: PreviewServer
let baseUrl: string

beforeAll(async () => {
  server = await preview({
    preview: { port: 0, host: '127.0.0.1', open: false },
  })

  const address = server.resolvedUrls?.local?.[0]
  if (!address) {
    throw new Error('Could not determine preview server URL')
  }
  baseUrl = address.replace(/\/$/, '')
})

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.httpServer.close((err) => (err ? reject(err) : resolve()))
  })
})

describe('pages', () => {
  test('home page serves expected content', async () => {
    const res = await fetch(`${baseUrl}/`)
    expect(res.ok).toBe(true)
    const body = await res.text()
    expect(body).toContain('Frontend Developer')
    expect(body).toContain('Send me an E-Mail')
  })

  test('imprint page serves expected content', async () => {
    const res = await fetch(`${baseUrl}/imprint/`)
    expect(res.ok).toBe(true)
    const body = await res.text()
    expect(body).toContain('Impressum')
    expect(body).toContain('Johannes Rackles')
  })

  test('404 page for unknown routes', async () => {
    const res = await fetch(`${baseUrl}/this-route-does-not-exist`)
    expect(res.status).toBe(404)
  })
})

describe('CV PDF', () => {
  test('is downloadable and a valid PDF', async () => {
    const res = await fetch(`${baseUrl}/CV_Johannes-Rackles.pdf`)
    expect(res.ok).toBe(true)

    const buffer = Buffer.from(await res.arrayBuffer())
    expect(buffer.length).toBeGreaterThan(0)
    expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })
})

describe('security headers', () => {
  test('CSP is present and does not use unsafe directives', async () => {
    const res = await fetch(`${baseUrl}/`)
    const csp = res.headers.get('content-security-policy')
    expect(csp).toBeTruthy()

    const directives = Object.fromEntries(
      csp!.split(';').map((d) => {
        const [name, ...values] = d.trim().split(/\s+/)
        return [name, values]
      }),
    )

    // https://developer.mozilla.org/en-US/observatory -- "CSP implemented
    // unsafely": no 'unsafe-inline'/data: in script-src, no overly broad
    // sources such as https: in object-src/script-src, and object-src (or
    // default-src as its fallback) must be restricted.
    expect(directives['script-src']).toBeDefined()
    expect(directives['script-src']).not.toContain("'unsafe-inline'")
    expect(directives['script-src']).not.toContain('data:')
    expect(directives['script-src']).not.toContain('https:')

    expect(directives['object-src']).toEqual(["'none'"])

    // Every directive value must be well-formed -- e.g. a quoted keyword
    // like 'none' must have a matching closing quote. Catches the
    // `frame-ancestors 'none` (missing quote) bug found via Mozilla
    // Observatory / manual curl inspection.
    for (const [name, values] of Object.entries(directives)) {
      for (const value of values) {
        const quotes = value.match(/'/g)?.length ?? 0
        expect(quotes % 2, `${name} has an unmatched quote in "${value}"`).toBe(
          0,
        )
      }
    }
  })

  test('clickjacking and cross-origin protections are present', async () => {
    const res = await fetch(`${baseUrl}/`)
    const headers = res.headers

    expect(headers.get('x-frame-options')).toBe('DENY')
    expect(headers.get('x-content-type-options')).toBe('nosniff')
    expect(headers.get('referrer-policy')).toBe('same-origin')
    expect(headers.get('cross-origin-resource-policy')).toBe('same-origin')
    expect(headers.get('cross-origin-opener-policy')).toBe('same-origin')

    // This site has no cross-origin API surface, so it must never send a
    // permissive Access-Control-Allow-Origin header.
    expect(headers.get('access-control-allow-origin')).toBeNull()
  })
})
