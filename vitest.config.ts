import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      exclude: [
        "graphiql-app/app/entry.client.tsx",
        "graphiql-app/app/entry.server.tsx",
        "graphiql-app/app/root.tsx",
        ".eslintrc.cjs",
        "vite.config.ts",
        "vitest.config.ts",
        "postcss.config.js",
        "tailwind.config.ts",
        "vitest.setup.ts",
      ],
    },
  },
});
