import { defineConfig } from "cypress";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1920,
    viewportHeight: 1080,
    experimentalRunAllSpecs: true,
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      on("task", {
        "downloads:folder"() {
          return path.join(__dirname, "cypress", "downloads");
        },
        "list:files"(folderPath) {
          return fs.readdirSync(folderPath);
        },
      });

      return config;
    },
  },
});
