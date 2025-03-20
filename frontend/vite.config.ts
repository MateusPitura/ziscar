import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";

export default ({ mode }: { mode: string }) => {
  return defineConfig({
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            BACKEND_URL:
              mode === "production"
                ? "https://api.ziscar.me"
                : "http://localhost:3000",
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "../shared/src"),
      },
    },
    base: "/",
  });
};
