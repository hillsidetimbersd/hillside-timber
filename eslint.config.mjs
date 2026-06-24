import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Flat config (ESLint 9 / Next.js 16). `next lint` was removed in Next 16, so the
// ESLint CLI is invoked directly via the `lint` script in package.json.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The scroll-demo worktree lives inside this repo but is a separate experiment.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'scroll-demo/**']),
])
