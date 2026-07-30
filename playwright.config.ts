import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end test config.
 *
 * Boots the site via the same production SSR build used by `npm run preview`
 * (client build + Node middleware), so tests exercise real rendered HTML,
 * real security headers (CSP, X-Frame-Options, etc. -- see
 * src/routes/plugin@csp.ts), and real CSS -- not a dev-mode approximation.
 *
 * Run `npm run test.e2e` to build and run the whole suite in one go, or
 * `npx playwright test` directly if dist/ is already built (e.g. during
 * local iteration with --ui or --headed).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
