import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    setupFiles: "./setupTests.js",
    exclude: [
      "./_tests_/container.test.js",
      "./_tests_/api.test.js",
      "node_modules/",
    ],
  },
});
