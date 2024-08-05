import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/index.css"],
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: ["react", "msw"],
  ...options,
}));
