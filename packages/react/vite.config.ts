import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.lib.json" })],
    build: {
        emptyOutDir: true,
        lib: {
            entry: {
                index: "src/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "wagmi", "@tanstack/react-query"],
        },
    },
});
