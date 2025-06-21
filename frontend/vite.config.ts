import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { BACKEND_PROD_URL } from "../shared/src/constants";

export default ({ mode }: { mode: string }) => {
  return defineConfig({
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            BACKEND_URL:
              mode === "production"
                ? BACKEND_PROD_URL
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
