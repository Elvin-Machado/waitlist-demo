import { defineConfig, devices } from "@playwright/test";

const apps = ["user-app", "admin-app", "waitlist-app"];

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.e2e.mjs",
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: apps.map((app, index) => ({
    command: `bun --bun next start ${app} --hostname 127.0.0.1 --port ${3410 + index}`,
    url: `http://127.0.0.1:${3410 + index}`,
    reuseExistingServer: false,
    timeout: 45_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  })),
});
