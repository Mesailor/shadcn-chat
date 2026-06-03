import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["tests/**", "node_modules/**"],
  },
});
