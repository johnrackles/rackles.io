import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const homePageSource = readFileSync(
  fileURLToPath(new URL('../../src/routes/index.tsx', import.meta.url)),
  'utf-8',
)

describe('home page content', () => {
  // Regression check: the Hackernews clone demo is offline, so it should be
  // listed as plain text, not a dead link. This only inspects the source, so
  // it doesn't need a browser/SSR render to catch a regression.
  test('Hackernews clone demo is listed as plain text, not a link', () => {
    expect(homePageSource).toContain(
      '<li>Hackernews clone built with qwik</li>',
    )
    expect(homePageSource).not.toMatch(/<a[^>]*>[^<]*Hackernews[^<]*<\/a>/i)
  })
})
