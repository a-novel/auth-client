import yamlLoader from "./plugins/yaml";

import svgr from "@svgr/rollup";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svgr({ icon: true, svgo: false }), yamlLoader, tsconfigPaths()],
  build: {
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      enabled: true,
      clean: true,
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
