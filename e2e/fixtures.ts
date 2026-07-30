import { test as base, expect } from '@playwright/test'

type PageIssue = {
  type: 'console-error' | 'page-error' | 'request-failed' | 'csp-violation'
  detail: string
}

/**
 * Extends Playwright's `test` with automatic tracking of:
 * - console errors
 * - uncaught page errors
 * - failed network requests
 * - CSP violations (via the `securitypolicyviolation` event, registered
 *   before any navigation so it also catches violations during initial
 *   page load/hydration)
 *
 * Use `expectNoPageIssues(page)` at the end of a test (or rely on the
 * automatic afterEach assertion) to fail loudly if the page did anything
 * unexpected -- this is the generalized version of the checks we kept
 * re-running manually while debugging dependency upgrades.
 */
export const test = base.extend<{ pageIssues: PageIssue[] }>({
  pageIssues: async ({ page }, use) => {
    const issues: PageIssue[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        issues.push({ type: 'console-error', detail: msg.text() })
      }
    })
    page.on('pageerror', (err) => {
      issues.push({ type: 'page-error', detail: err.message })
    })
    page.on('requestfailed', (req) => {
      issues.push({
        type: 'request-failed',
        detail: `${req.url()} ${req.failure()?.errorText ?? ''}`,
      })
    })

    await page.addInitScript(() => {
      window.__cspViolations = []
      document.addEventListener('securitypolicyviolation', (e) => {
        window.__cspViolations.push(
          `directive=${e.violatedDirective} blockedURI=${e.blockedURI} at ${e.sourceFile}:${e.lineNumber}`,
        )
      })
    })

    await use(issues)

    const cspViolations = await page
      .evaluate(() => window.__cspViolations ?? [])
      .catch(() => [] as string[])
    for (const detail of cspViolations) {
      issues.push({ type: 'csp-violation', detail })
    }
  },
})

export { expect }

export function expectNoPageIssues(issues: PageIssue[]) {
  expect(issues, 'Page produced unexpected console/CSP issues').toEqual([])
}

declare global {
  interface Window {
    __cspViolations: string[]
  }
}
