import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@shared": path.resolve(__dirname, "../shared"),
        },
    },
    server: {
        port: 5173,
    },
    build: {
        outDir: path.resolve(__dirname, "../dist/client"),
        emptyOutDir: false,
    },
    cacheDir: path.resolve(__dirname, "..", "node_modules/.vite-client"),
});
