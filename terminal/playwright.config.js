import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'line',
  timeout: 90_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    channel: 'chrome',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run preview:h5',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 30_000
  }
})
