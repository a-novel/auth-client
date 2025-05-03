import { peerDependencies } from "./package.json";
import yamlLoader from "./plugins/yaml";

import { defineConfig } from "vite";

import svgr from "@svgr/rollup";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // SVGO is disabled because it messes up with some icons by removing intermediate tags.
    svgr({ icon: true, svgo: false }),
    yamlLoader,
    tsconfigPaths(),
  ],

  build: {
    sourcemap: true,
    lib: {
      entry: "src/index.tsx",
      name: "@a-novel/auth-client",
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
    },
  },
});
