import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { BACKEND_PORT, API_URL, FRONTEND_PORT } from "../shared/src/constants";

export default ({ mode }: { mode: string }) => {
  return defineConfig({
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            BACKEND_URL:
              mode === "production"
                ? API_URL
                : `http://localhost:${BACKEND_PORT}`,
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
    server: {
      port: FRONTEND_PORT,
    },
  });
};
