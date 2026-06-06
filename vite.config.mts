import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     external: ["pkgname"],
  //   },
  // },
  // ssr: {
  //   noExternal: ["date-fns"],
  // },
  css: {
    preprocessorOptions: {
      scss: {
        //@ts-expect-error
        api: "modern-compiler",
        silenceDeprecations: ["import"],
      },
    },
  },
  plugins: [!process.env.VITEST && reactRouter(), tsconfigPaths()],
  server: { port: 3000 },
  test: {
    globals: true,
    setupFiles: "./test/setup.ts",
    environment: "jsdom",
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
  },
  preview: { port: 5000 },
});
