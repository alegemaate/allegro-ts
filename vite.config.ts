import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        global: "src/global.ts",
      },
      formats: ["es"],
    },
  },
  plugins: [
    dts({
      outDir: "dist",
    }),
  ],
});
