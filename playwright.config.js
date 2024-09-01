// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000', // Замените на URL вашего приложения
    browserName: 'chromium', // Выберите нужный браузер: 'chromium', 'firefox' или 'webkit'
    headless: true, // Запуск в безголовом режиме
    screenshot: 'only-on-failure', // Делать скриншоты только при сбоях
  },
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
