import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.json" })],
    build: {
        emptyOutDir: true,
        lib: {
            entry: { index: "src/index.tsx" },
            cssFileName: "style",
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                /^@metrom-xyz\/ui($|\/)/,
                /^@tanstack\/react-query($|\/)/,
                /^react($|\/)/,
                /^react-dom($|\/)/,
                /^viem($|\/)/,
                /^wagmi($|\/)/,
            ],
        },
    },
});
