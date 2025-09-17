import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";

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
            external: [
                /^@tanstack\/react-query($|\/)/,
                /^react($|\/)/,
                /^react-dom($|\/)/,
                /^viem($|\/)/,
                /^wagmi($|\/)/,
            ],
        },
    },
});
