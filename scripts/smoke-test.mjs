#!/usr/bin/env node
/**
 * Smoke test that verifies the built site actually boots and serves working
 * pages. Meant to be run after `npm run build` (and again after upgrading
 * dependencies) to catch runtime breakage that a successful build wouldn't
 * reveal on its own.
 *
 * Usage: node ./scripts/smoke-test.mjs
 */
import { preview } from 'vite';

const checks = [
  {
    path: '/',
    expect: ['Frontend Developer', 'Send me an E-Mail'],
  },
  {
    path: '/imprint/',
    expect: ['Impressum', 'Johannes Rackles'],
  },
];

async function main() {
  const server = await preview({
    preview: {
      port: 0,
      host: '127.0.0.1',
      open: false,
    },
  });

  const address = server.resolvedUrls?.local?.[0];
  if (!address) {
    throw new Error('Could not determine preview server URL');
  }
  const baseUrl = address.replace(/\/$/, '');
  console.log(`Preview server started at ${baseUrl}`);

  const failures = [];

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        failures.push(`${url} -> HTTP ${res.status}`);
        continue;
      }
      const body = await res.text();
      for (const needle of check.expect) {
        if (!body.includes(needle)) {
          failures.push(`${url} -> missing expected content: "${needle}"`);
        }
      }
    } catch (err) {
      failures.push(`${url} -> request failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  await new Promise((resolve, reject) => {
    server.httpServer.close((err) => (err ? reject(err) : resolve()));
  });

  if (failures.length > 0) {
    console.error('Smoke test FAILED:');
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Smoke test passed: all pages served successfully.');
}

main().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exitCode = 1;
});
