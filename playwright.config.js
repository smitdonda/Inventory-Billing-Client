const { defineConfig, devices } = require("@playwright/test");

/*
 * Two projects, because half of what these tests check only exists on one side
 * of the pointer: a phone has a coarse pointer and no hover, and the toasts
 * change shape accordingly.
 *
 * By default the suite runs against a dev server started here. Point
 * E2E_BASE_URL at a deployment to run the same tests against it:
 *
 *   E2E_BASE_URL=https://billbox-client.vercel.app npm run test:e2e
 */
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
const isLocal = !process.env.E2E_BASE_URL;

module.exports = defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "phone",
      // Pixel 7 brings what the desktop browser cannot fake: real touch
      // events, pointer: coarse, and hover: none.
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isLocal
    ? {
        command: "npm start",
        url: baseURL,
        // create-react-app takes its time on a cold start.
        timeout: 180000,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
