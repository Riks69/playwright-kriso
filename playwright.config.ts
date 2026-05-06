import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,  // Suurenda 60 sekundini
  expect: {
    timeout: 15000  // Suurenda ootamist 15 sekundini
  },
  retries: 2,
  reporter: 'html',

  use: {
    baseURL: 'https://www.kriso.ee',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000,  // Iga actioni jaoks 15 sekundit
    navigationTimeout: 30000,  // Navigatsiooni jaoks 30 sekundit
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});