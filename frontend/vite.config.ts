import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }: { mode: string }) => {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: mode === "production" ? "/projeto-de-software" : "/",
  });
};
