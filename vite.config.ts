import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

function getLatestCommitTimestamp() {
  try {
    const timestamp = execFileSync('git', ['log', '-1', '--format=%cI'], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()

    return timestamp || new Date().toISOString()
  } catch {
    // Keep local archive builds working even when Git metadata is unavailable.
    return new Date().toISOString()
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __GIT_LAST_UPDATED__: JSON.stringify(getLatestCommitTimestamp()),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
