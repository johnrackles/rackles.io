import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * Type-safe, validated access to server-side environment variables.
 *
 * Only relevant for the Node-based preview server (`npm run preview`,
 * `src/entry.preview.tsx`) -- Cloudflare Pages production doesn't read
 * from `process.env` here, since the platform always provides an
 * absolute `request.url` to derive the origin from.
 *
 * See `.env.example` for how to configure these locally.
 */
export const env = createEnv({
  server: {
    ORIGIN: z.string().url().optional(),
    JOB_SEARCH: z.enum(['true', 'false']).default('false'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
