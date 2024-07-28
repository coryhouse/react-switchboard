import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/useDevToolsState.ts", "src/useSwitchboard.ts"],
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: ["react", "msw"],
  ...options,
}));
